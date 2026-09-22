import { useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import {
  createBillingCheckoutApi,
  fetchBillingAddonsApi,
  fetchBillingCurrentSubscriptionApi,
  fetchBillingPlansApi,
} from "../../services/features/billing/billing.api";
import type {
  Addon,
  BillingCheckoutAddonSelection,
  BillingCycle,
  CompanySubscription,
  SubscriptionPlanBilling,
} from "../../services/features/billing/billing.types";
import { SubscriptionList } from "../../modules/SubscriptionList/SubscriptionList";
import type { Plan } from "../../services/features/subscriptions/plan.types";

export default function AdminBillingPage() {
  const [current, setCurrent] = useState<CompanySubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlanBilling[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Side Panel Drawer States
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"details" | "addons">("details");

  useEffect(() => {
    void Promise.all([
      fetchBillingCurrentSubscriptionApi(),
      fetchBillingPlansApi(),
      fetchBillingAddonsApi(),
    ]).then(([subscription, planList, addonList]) => {
      setCurrent(subscription);
      setPlans(planList);
      setAddons(addonList);
      setSelectedPlanId(planList[0]?.id ?? "");
      setSelectedAddonIds([]);
      setAddonQuantities({});
      setLoading(false);
    });
  }, []);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    setIsPanelOpen(true);
  };

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null;
  const catalogPlans = useMemo<Plan[]>(
    () => plans.map((plan) => ({
      ...plan,
      price: plan.price ?? plan.monthly_price ?? 0,
      popular: Boolean(plan.popular),
      features: plan.features ?? [],
      is_current: current?.status === "active" && current.plan?.id === plan.id,
    })),
    [current, plans],
  );
  const selectedAddons = addons.filter((addon) => selectedAddonIds.includes(addon.id));
  const basePrice = billingCycle === "yearly"
    ? (selectedPlan?.yearly_price ?? 0)
    : (selectedPlan?.monthly_price ?? 0);
  const addonTotal = selectedAddons.reduce((total, addon) => {
    const quantity = Math.max(1, addonQuantities[addon.id] ?? 1);
    const price =
      billingCycle === "yearly"
        ? (addon.yearly_price ?? addon.monthly_price ?? addon.one_time_price ?? 0)
        : (addon.monthly_price ?? addon.one_time_price ?? 0);
    return total + price * quantity;
  }, 0);
  const total = useMemo(() => Math.round(basePrice + addonTotal), [addonTotal, basePrice]);
  const displayCurrency = (currency?: string | null) =>
    currency?.toUpperCase() === "AUD" || !currency ? "$" : currency;
  const selectedAddonSelections: BillingCheckoutAddonSelection[] = selectedAddons.map((addon) => ({
    addon_id: addon.id,
    quantity: Math.max(1, addonQuantities[addon.id] ?? 1),
  }));

  const toggleAddon = (addonId: string) => {
    const isSelected = selectedAddonIds.includes(addonId);

    setSelectedAddonIds((current) =>
      current.includes(addonId)
        ? current.filter((id) => id !== addonId)
        : [...current, addonId],
    );

    setAddonQuantities((current) => {
      if (isSelected) {
        const next = { ...current };
        delete next[addonId];
        return next;
      }

      return {
        ...current,
        [addonId]: current[addonId] ?? 1,
      };
    });
  };

  const checkout = async () => {
    if (!selectedPlan) return;
    const response = await createBillingCheckoutApi({
      plan_id: selectedPlan.id,
      billing_cycle: billingCycle,
      addons: selectedAddonSelections,
    });

    if (response.checkout_url) {
      window.location.href = response.checkout_url;
    }
  };

  if (loading) {
    return <Content><div className="p-10">Loading billing...</div></Content>;
  }

  return (
    <Content>
      <PageHeader title="Billing" subtitle="Choose a plan and optional add-ons" />
      {current ? (
        <div
          className="card mb-6 overflow-hidden border-0 shadow-sm"
          style={{
            background: "linear-gradient(135deg, rgba(245, 85, 26, 0.08) 0%, rgba(52, 37, 17, 0.03) 100%)",
            border: "1.5px solid rgba(245, 85, 26, 0.2)",
            borderRadius: "16px",
          }}
        >
          <div className="card-body p-6 d-flex align-items-center justify-content-between flex-wrap gap-4">
            <div className="d-flex align-items-center gap-4">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle text-white shadow-sm"
                style={{ width: 44, height: 44, background: "#f5551a", fontSize: 20 }}
              >
                ⚡
              </div>
              <div>
                <span className="text-muted fs-8 fw-bold text-uppercase" style={{ letterSpacing: "0.05em" }}>
                  Active Subscription
                </span>
                <h3 className="mb-0 fw-bolder text-gray-900 fs-4">
                  {current.plan?.name ?? "No Active Plan"}
                  <span
                    className={`badge ms-3 fs-8 py-2 px-3 text-capitalize ${
                      current.status === "active" ? "bg-success text-white" : "bg-warning text-dark"
                    }`}
                    style={{ borderRadius: 12 }}
                  >
                    ✓ {current.status}
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="row g-5">
        {/* Plans Catalog Full Width Column (4 per row desktop, 2 tablet, 1 mobile) */}
        <div className="col-12">
          <div className="card mb-6 border-0 shadow-sm" style={{ borderRadius: 18, background: "#fff" }}>
            <div className="card-body py-4 px-6 d-flex align-items-center justify-content-between flex-wrap gap-4">
              <div>
                <h4 className="fw-bolder text-gray-900 mb-1">Billing Cycle</h4>
                <p className="text-muted fs-7 mb-0">Choose annual billing to receive a 20% discount on all plans</p>
              </div>
              <div
                className="d-inline-flex align-items-center p-1"
                style={{ background: "#f5f2ed", borderRadius: 30, border: "1px solid #ede8e4" }}
              >
                <button
                  type="button"
                  className="btn btn-sm px-6 py-2 fw-bold"
                  style={{
                    borderRadius: 24,
                    background: billingCycle === "monthly" ? "#f5551a" : "transparent",
                    color: billingCycle === "monthly" ? "#fff" : "#6b5846",
                    border: "none",
                    boxShadow: billingCycle === "monthly" ? "0 4px 12px rgba(245,85,26,0.3)" : "none",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setBillingCycle("monthly")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className="btn btn-sm px-6 py-2 fw-bold d-flex align-items-center gap-2"
                  style={{
                    borderRadius: 24,
                    background: billingCycle === "yearly" ? "#f5551a" : "transparent",
                    color: billingCycle === "yearly" ? "#fff" : "#6b5846",
                    border: "none",
                    boxShadow: billingCycle === "yearly" ? "0 4px 12px rgba(245,85,26,0.3)" : "none",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setBillingCycle("yearly")}
                >
                  Annual
                  <span
                    className="badge py-1 px-2 fs-9 fw-bolder"
                    style={{
                      background: billingCycle === "yearly" ? "#fff" : "#10b981",
                      color: billingCycle === "yearly" ? "#f5551a" : "#fff",
                      borderRadius: 10,
                    }}
                  >
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          <SubscriptionList
            plans={catalogPlans}
            canManage={false}
            billingCycle={billingCycle}
            onSelectPlan={(plan) => handleSelectPlan(plan)}
          />
        </div>
      </div>

      <style>{`
        @keyframes briksyFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes briksySlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .briksy-drawer-backdrop {
          animation: briksyFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .briksy-drawer-panel {
          animation: briksySlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Side Drawer Floating Overlay (Appears on top of cards) */}
      {isPanelOpen && selectedPlan ? (
        <>
          {/* Backdrop */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100 briksy-drawer-backdrop"
            style={{
              zIndex: 1040,
              background: "rgba(30, 20, 10, 0.35)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
            onClick={() => setIsPanelOpen(false)}
          />

          {/* Floating Drawer Card */}
          <div
            className="position-fixed top-0 end-0 h-100 bg-white d-flex flex-column briksy-drawer-panel"
            style={{
              width: "100%",
              maxWidth: 480,
              zIndex: 1050,
              boxShadow: "-16px 0 48px rgba(52, 37, 17, 0.2)",
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
            }}
          >
            <div className="p-6 d-flex flex-column h-100">
              {/* Drawer Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                  <span className="badge badge-light-primary fw-bold text-uppercase fs-8 mb-1">
                    Selected Plan
                  </span>
                  <h3 className="fw-bolder mb-0 text-gray-900">{selectedPlan.name}</h3>
                </div>
                <button
                  type="button"
                  className="btn btn-icon btn-sm btn-active-light-primary rounded-circle"
                  onClick={() => setIsPanelOpen(false)}
                  title="Close Panel"
                >
                  <span className="fs-3 fw-bolder">✕</span>
                </button>
              </div>

              {/* Navigation Tabs */}
              <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6 fw-bold">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link py-2 px-4 ${activeTab === "details" ? "active text-primary border-primary" : "text-muted"}`}
                    onClick={() => setActiveTab("details")}
                  >
                    Plan Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link py-2 px-4 ${activeTab === "addons" ? "active text-primary border-primary" : "text-muted"}`}
                    onClick={() => setActiveTab("addons")}
                  >
                    Add-ons ({selectedAddonIds.length})
                  </button>
                </li>
              </ul>

              {/* Tab 1: Plan Details */}
              {activeTab === "details" && (
                <div className="flex-grow-1 overflow-auto pe-2">
                  <div className="mb-4">
                    <div className="fs-7 text-muted fw-semibold mb-1">Description</div>
                    <p className="text-gray-800 fs-6">{selectedPlan.description || "Full access to features included in this plan."}</p>
                  </div>

                  <div className="fs-7 text-muted fw-semibold mb-3">Included Features</div>
                  <div className="d-flex flex-column gap-3">
                    {selectedPlan.features && selectedPlan.features.filter((f) => f.enabled).length > 0 ? (
                      selectedPlan.features.filter((f) => f.enabled).map((feature, idx) => (
                        <div key={idx} className="d-flex align-items-center gap-3 p-2 rounded-2 hover-bg-light">
                          <span
                            className="d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: "rgba(245,85,26,0.12)",
                              color: "#f5551a",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            ✓
                          </span>
                          <span className="fs-6 text-gray-800 fw-semibold">
                            {feature.name}
                            {feature.value !== undefined && feature.value !== null && String(feature.value) !== "" && (
                              <strong className="ms-1 text-dark">: {String(feature.value)}</strong>
                            )}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted fs-7">No specific feature list attached.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Add-ons */}
              {activeTab === "addons" && (
                <div className="flex-grow-1 overflow-auto pe-2">
                  <h5 className="fw-bold mb-3 text-gray-800">Select Optional Add-ons</h5>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {addons.map((addon) => (
                      <div key={addon.id} className="p-3 border rounded-3 bg-light-subtle">
                        <div className="d-flex gap-3 align-items-start">
                          <input
                            className="form-check-input mt-1"
                            type="checkbox"
                            checked={selectedAddonIds.includes(addon.id)}
                            onChange={() => toggleAddon(addon.id)}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center gap-2">
                              <div>
                                <span className="fw-bold d-block text-gray-900">{addon.name}</span>
                                <span className="text-muted fs-7">
                                  {billingCycle === "yearly"
                                    ? addon.yearly_price ?? addon.monthly_price ?? addon.one_time_price ?? 0
                                    : addon.monthly_price ?? addon.one_time_price ?? 0}{" "}
                                  {displayCurrency(addon.currency)}
                                </span>
                              </div>
                              {selectedAddonIds.includes(addon.id) ? (
                                <input
                                  type="number"
                                  min={1}
                                  className="form-control form-control-sm form-control-solid w-75px"
                                  value={addonQuantities[addon.id] ?? 1}
                                  onChange={(event) =>
                                    setAddonQuantities((current) => ({
                                      ...current,
                                      [addon.id]: Math.max(1, Number(event.target.value) || 1),
                                    }))
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Summary & Checkout */}
              <div className="border-top pt-4 mt-auto">
                <div className="d-flex justify-content-between mb-2 fs-6 text-gray-700">
                  <span>Base Plan ({selectedPlan.name})</span>
                  <strong>{basePrice} {displayCurrency(selectedPlan?.currency)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2 fs-6 text-gray-700">
                  <span>Add-ons Total</span>
                  <strong>{addonTotal} {displayCurrency(selectedPlan?.currency)}</strong>
                </div>
                <div className="d-flex justify-content-between fs-3 fw-bolder text-gray-900 border-top pt-3 mt-2">
                  <span>Total</span>
                  <span className="text-primary">{total} {displayCurrency(selectedPlan?.currency)}</span>
                </div>
                <button
                  className="btn btn-primary w-100 mt-4 py-3 fw-bold fs-6 shadow-sm"
                  onClick={checkout}
                  disabled={!selectedPlan}
                >
                  Subscribe / Upgrade
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </Content>
  );
}
