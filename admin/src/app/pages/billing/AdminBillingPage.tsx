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
        <div className="alert alert-info mb-6">
          Current subscription: <strong>{current.plan?.name ?? "None"}</strong> · {current.status}
        </div>
      ) : null}
      <div className="row g-5">
        <div className="col-12 col-xl-8">
          <div className="card mb-5">
            <div className="card-body d-flex gap-3 align-items-center">
              <button className={`btn ${billingCycle === "monthly" ? "btn-primary" : "btn-light"}`} onClick={() => setBillingCycle("monthly")}>Monthly</button>
              <button className={`btn ${billingCycle === "yearly" ? "btn-primary" : "btn-light"}`} onClick={() => setBillingCycle("yearly")}>Annual <span className="badge bg-success ms-2">Save 20%</span></button>
            </div>
          </div>
          <SubscriptionList
            plans={catalogPlans}
            canManage={false}
            billingCycle={billingCycle}
            onSelectPlan={(plan) => setSelectedPlanId(plan.id)}
          />
        </div>
        <div className="col-12 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h4 className="fw-bold mb-4">Add-ons</h4>
              <div className="d-flex flex-column gap-3 mb-5">
                {addons.map((addon) => (
                  <div key={addon.id} className="d-flex gap-3 align-items-start">
                    <input
                      className="form-check-input mt-1"
                      type="checkbox"
                      checked={selectedAddonIds.includes(addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between gap-3">
                        <div>
                          <span className="fw-semibold d-block">{addon.name}</span>
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
                            className="form-control form-control-solid w-75px"
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
                ))}
              </div>
              <div className="border-top pt-4">
                <div className="d-flex justify-content-between mb-2"><span>Base</span><strong>{basePrice} {displayCurrency(selectedPlan?.currency)}</strong></div>
                <div className="d-flex justify-content-between mb-2"><span>Add-ons</span><strong>{addonTotal} {displayCurrency(selectedPlan?.currency)}</strong></div>
                <div className="d-flex justify-content-between fs-4"><span>Total</span><strong>{total} {displayCurrency(selectedPlan?.currency)}</strong></div>
              </div>
              <button className="btn btn-primary w-100 mt-5" onClick={checkout} disabled={!selectedPlan}>Subscribe / Upgrade</button>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
}
