import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import { fetchBillingPlansApi, createBillingCheckoutApi } from "../../services/features/billing/billing.api";

const SubscriptionGate = () => {
  const { auth, currentUser, entitlements } = useAuth();
  const [required, setRequired] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const roles = currentUser?.roles ?? [];
  const isSuperAdmin = roles.includes("super_admin") || roles.includes("super_admin_employee");
  const subscription = currentUser?.subscription ?? auth?.user?.subscription;
  const expired = entitlements
    ? !entitlements.active
    : subscription?.status === "expired" || subscription?.status === "inactive";
  const shouldShow = !isSuperAdmin && (required || expired) && !window.location.pathname.startsWith("/admin/billing/");

  useEffect(() => {
    if (entitlements?.active || subscription?.status === "active" || subscription?.status === "trialing" || subscription?.is_trial_active) {
      setRequired(false);
    }
  }, [entitlements?.active, subscription?.status, subscription?.is_trial_active]);

  useEffect(() => {
    const onSubscriptionRequired = () => setRequired(true);
    window.addEventListener("briksy:subscription-required", onSubscriptionRequired);
    return () => window.removeEventListener("briksy:subscription-required", onSubscriptionRequired);
  }, []);

  useEffect(() => {
    if (!shouldShow || plans.length > 0 || loading) return;
    setLoading(true); setError(null);
    void fetchBillingPlansApi().then((items) => {
      setPlans(items);
      setSelectedPlanId(items.find((plan) => plan.popular)?.id ?? items[0]?.id ?? "");
    }).catch((reason: any) => setError(reason?.response?.data?.message ?? "Unable to load payment plans.")).finally(() => setLoading(false));
  }, [shouldShow, plans.length, loading]);

  if (!shouldShow) return null;

  const checkout = async () => {
    if (!selectedPlanId) return;
    setError(null);
    try {
      const response = await createBillingCheckoutApi({ plan_id: selectedPlanId, billing_cycle: "monthly" });
      if (response.checkout_url) window.location.assign(response.checkout_url);
      else setError("Payment checkout could not be started.");
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to start payment checkout.");
    }
  };

  return <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 9999, background: "rgba(10, 15, 30, 0.72)", backdropFilter: "blur(14px)" }}>
    <div className="card shadow-lg border-0 w-100" style={{ maxWidth: 1000, maxHeight: "92vh" }}>
      <div className="card-header bg-transparent border-0 pt-6 pb-0"><div className="badge badge-light-warning mb-3">Subscription required</div><h2 className="fw-bolder mb-2">Choose a plan to continue</h2><p className="text-muted mb-0">Your subscription has ended. Select a plan to restore access to the admin portal.</p></div>
      <div className="card-body overflow-auto" style={{ maxHeight: "72vh" }}>
        {loading && <div className="alert alert-light">Loading payment plans...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && plans.length === 0 && !error && <div className="alert alert-warning">No active payment plans are available right now.</div>}
        <div className="row g-4">{plans.map((plan) => <div className="col-12 col-md-6 col-xl-4" key={plan.id}><button type="button" className={`card h-100 w-100 text-start ${selectedPlanId === plan.id ? "border-primary" : "border-0 shadow-sm"}`} onClick={() => setSelectedPlanId(plan.id)}><div className="card-body"><div className="d-flex justify-content-between gap-2"><h3 className="fw-bold mb-1">{plan.name}</h3>{plan.popular && <span className="badge badge-light-primary">Popular</span>}</div><div className="text-muted">{plan.currency} {plan.monthly_price ?? plan.yearly_price ?? 0} / month</div>{plan.description && <p className="text-muted mt-3 mb-0">{plan.description}</p>}</div></button></div>)}</div>
        <button type="button" className="btn btn-primary w-100 mt-5" onClick={() => void checkout()} disabled={!selectedPlanId || loading}>Continue to payment</button>
      </div>
    </div>
  </div>;
};

export { SubscriptionGate };
