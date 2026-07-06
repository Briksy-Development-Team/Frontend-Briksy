import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { KTIcon } from "../../../_metronic/helpers";
import { useAuth } from "../auth";
import { changePlan, fetchPlans } from "../../services/features/subscriptions/plan.slice";
import type { AppDispatch, RootState } from "../../services/store";
import { getPermissionsByToken } from "../auth/core/_requests";
import { setBusinessProfile, setEnabledModules, setPermissions } from "../auth/core/auth.store";

const SubscriptionGate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, setCurrentUser } = useAuth();
  const { data: plans, loading } = useSelector((state: RootState) => state.plans);

  const subscription = currentUser?.subscription;
  const isExpired = subscription?.status === "expired" || subscription?.status === "inactive";

  useEffect(() => {
    if (isExpired && plans.length === 0 && !loading) {
      void dispatch(fetchPlans());
    }
  }, [dispatch, isExpired, plans.length, loading]);

  if (!isExpired) {
    return null;
  }

  const handleSelectPlan = async (planId: string) => {
    const response = await dispatch(changePlan(planId)).unwrap();

    const permissions = await getPermissionsByToken();
    dispatch(setPermissions(permissions.data.effective_permission_names ?? []));
    dispatch(setEnabledModules(permissions.data.enabled_modules ?? []));
    dispatch(
      setBusinessProfile({
        businessType: permissions.data.user?.business_type ?? null,
        businessVerificationStatus:
          permissions.data.user?.business_verification_status ?? null,
      }),
    );

    setCurrentUser(
      currentUser
        ? {
            ...currentUser,
            subscription: {
              ...(currentUser.subscription ?? {}),
              status: "active",
              is_trial_active: false,
              plan: response.subscription?.plan ?? response.plan ?? currentUser.subscription?.plan ?? null,
            },
          }
        : currentUser,
    );
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ zIndex: 9999, background: "rgba(10, 15, 30, 0.72)", backdropFilter: "blur(14px)" }}
    >
      <div className="card shadow-lg border-0 mx-3 mx-md-0" style={{ width: "min(1100px, 96vw)", maxHeight: "92vh" }}>
        <div className="card-header bg-transparent border-0 pt-6 pb-0">
          <div className="d-flex align-items-start justify-content-between w-100 gap-4">
            <div>
              <div className="badge badge-light-warning mb-3">Trial ended</div>
              <h2 className="fw-bolder mb-2">Choose a subscription plan</h2>
              <div className="text-muted fs-6">
                Your 15-day trial has ended. Select a plan to keep using the admin portal.
              </div>
            </div>
            <div className="text-end">
              <div className="text-muted fs-7">Current status</div>
              <div className="fw-bold text-capitalize">{subscription?.status ?? "expired"}</div>
            </div>
          </div>
        </div>

        <div className="card-body overflow-auto" style={{ maxHeight: "72vh" }}>
          <div className="row g-4">
            {loading && plans.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-light">Loading subscription plans...</div>
              </div>
            ) : null}

            {plans.map((plan) => (
              <div className="col-12 col-md-6 col-xl-4" key={plan.id}>
                <div
                  className={`card h-100 border-0 shadow-sm ${plan.popular ? "border border-primary" : ""}`}
                  style={plan.popular ? { transform: "translateY(-4px)" } : {}}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-start justify-content-between mb-4">
                      <div>
                        <h3 className="fw-bold mb-1">{plan.name}</h3>
                        <div className="text-muted fs-7">
                          ${plan.price} / month
                        </div>
                      </div>
                      {plan.popular ? <span className="badge badge-light-primary">Popular</span> : null}
                    </div>

                    <div className="fw-bold fs-2 mb-4">
                      {plan.propertyLimit ?? 0} properties
                    </div>

                    <ul className="list-unstyled flex-grow-1 mb-4">
                      {plan.features.slice(0, 6).map((feature) => (
                        <li className="d-flex align-items-center mb-2" key={feature.name}>
                          <span className={`me-3 d-flex align-items-center justify-content-center rounded-circle ${feature.enabled ? "bg-light-primary text-primary" : "bg-light text-muted"}`} style={{ width: 22, height: 22 }}>
                            <KTIcon iconName={feature.enabled ? "check" : "cross"} className="fs-8" />
                          </span>
                          <span className={feature.enabled ? "text-dark" : "text-muted"}>
                            {feature.name}
                            {feature.value !== undefined ? <span className="ms-1 fw-semibold">: {feature.value}</span> : null}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className={`btn w-100 ${plan.popular ? "btn-primary" : "btn-light-primary"}`}
                      disabled={plan.is_current}
                      onClick={() => void handleSelectPlan(plan.id)}
                    >
                      {plan.is_current ? "Current Plan" : "Select Plan"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && plans.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-warning">No active plans are available right now.</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export { SubscriptionGate };
