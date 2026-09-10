import { useState } from "react";

import PlanFeatures from "./PlanFeatures";
import FeatureComparison from "./FeatureComparison";

import {
  featureSections,
  pricingData,
  pricingTabs,
  type PricingTab,
} from "../../../data/pricingData";

const Pricing = () => {
  const [activeTab, setActiveTab] =
    useState<PricingTab>("Real Estate");

  const data = pricingData[activeTab];

  return (
    <main className="min-h-screen pt-20 px-[3%] lg:px-[5%] text-[#342511]">

      {/* HERO */}
      <section className="px-5 pb-5 pt-8 text-center md:pb-8">

        <h1 className="text-[30px] font-medium leading-9 tracking-[-0.9px] md:text-5xl">
          {data.title}
        </h1>

        <p className="mt-2 text-base text-[#7c5f42] md:hidden">
          Every plan includes verification and a location map.
        </p>

        {/* CATEGORY TABS */}
        <div className="mx-auto mt-10 flex  flex-wrap  gap-2">
          {pricingTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-2.5 text-sm font-medium ${activeTab === tab
                  ? "bg-primary-brown text-white"
                  : "text-[#342511] hover:bg-[#ede8e4]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </section>

      {/* PRICING CARDS */}
      <section className="mx-auto grid  grid-cols-1 gap-4 px-5 md:grid-cols-2 lg:grid-cols-4 md:gap-5">

        {data.plans.map((plan) => (
          <div
            key={plan.id}
            className={`w-full rounded-2xl bg-white p-5 ${plan.badge
                ? "border-2 border-[#342511]"
                : "border border-[#ede8e4]"
              }`}
          >

            {/* PLAN NAME */}
            <div className="flex min-h-[32px] items-center gap-2">
              <h2 className="text-2xl font-medium leading-8">
                {plan.name}
              </h2>

              {plan.badge && (
                <span className="rounded-full bg-[#e2cbb3] px-2.5 py-1 text-[10px]">
                  {plan.badge}
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="mt-2 min-h-[36px] text-xs leading-[18px] text-[#7c5f42]">
              {plan.description}
            </p>

            {/* PRICE */}
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-[30px] font-medium leading-9">
                {plan.price}
              </span>

              <span className="text-xs text-[#7c5f42]">
                /month
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="button"
              className={`mt-4 h-[50px] w-full rounded-full text-sm font-medium ${plan.badge
                  ? "bg-[#342511] text-white"
                  : "border border-[#ede8e4] bg-white text-[#342511]"
                }`}
            >
              {plan.name === "Enterprise" ||
                plan.name === "Business" ||
                plan.name === "Agency"
                ? "Contact Sales"
                : `Get ${plan.name}`}
            </button>

            {/* CARD FEATURES */}
            <PlanFeatures
              features={plan.cardFeatures}
            />
          </div>
        ))}

      </section>

      {/* STATS */}
      <section className="mx-auto  px-5 py-8">
        <div className="flex justify-center gap-6 md:gap-10">

          {data.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-1 flex-col items-center text-center md:flex-none"
            >
              <div className="flex items-center">
                <span className="text-2xl font-medium">
                  {stat.value}
                </span>

                {stat.star && (
                  <span className="ml-0.5">
                    ★
                  </span>
                )}
              </div>

              <span className="text-sm text-[#7c5f42]">
                {stat.label}
              </span>
            </div>
          ))}

        </div>
      </section>

      {/* COMPARISON */}
      <section className="mx-auto px-5 pb-12">

        <h2 className="mb-5 text-2xl font-medium md:text-3xl">
          Compare every feature
        </h2>

        {/* PASS DATA FROM PRICING */}
        <FeatureComparison
          sections={featureSections}
          plans={data.plans}
        />

      </section>

    </main>
  );
};

export default Pricing;