import { useEffect, useState } from "react";
import { getPublicPlans, type PublicPlan } from "../../../api/subscription/plan.api";

const Pricing = () => {
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicPlans().then(setPlans).finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen pt-20 px-[3%] lg:px-[5%] text-[#342511]"><section className="px-5 pb-8 pt-8 text-center"><h1 className="text-[30px] font-medium leading-9 md:text-5xl">Plans for your business</h1><p className="mt-2 text-base text-[#7c5f42]">Pricing and features are loaded from the current plans.</p></section>{loading ? <p className="px-5 text-center text-[#7c5f42]">Loading plans...</p> : <section className="mx-auto grid grid-cols-1 gap-4 px-5 md:grid-cols-2 lg:grid-cols-4 md:gap-5">{plans.map((plan) => <article key={plan.id} className={`w-full rounded-2xl bg-white p-5 ${plan.popular ? "border-2 border-[#342511]" : "border border-[#ede8e4]"}`}><h2 className="text-2xl font-medium">{plan.name}</h2><p className="mt-2 min-h-[36px] text-xs text-[#7c5f42]">{plan.description || ""}</p><div className="mt-2 text-[30px] font-semibold">{plan.monthly_price != null ? `$${plan.monthly_price}` : "Contact"}<span className="text-xs font-normal text-[#7c5f42]">{plan.monthly_price != null ? " /month" : ""}</span></div><ul className="mt-5 space-y-2 text-sm">{plan.features.filter((feature) => feature.enabled).map((feature) => <li key={feature.name}>{feature.name}{feature.value != null ? `: ${feature.value}` : ""}</li>)}</ul></article>)}</section>}</main>;
};

export default Pricing;
