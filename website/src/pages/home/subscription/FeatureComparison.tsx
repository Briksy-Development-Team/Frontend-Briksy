import { useState } from "react";
import Trick from "../../../assets/icons/ticks.svg"

import type {
    FeatureSection,
    Plan,
} from "../../../data/pricingData";

type Props = {
    sections: FeatureSection[];
    plans: Plan[];
};

const FeatureComparison = ({
    sections,
    plans,
}: Props) => {
    const [selectedPlan, setSelectedPlan] = useState(0);

    const renderValue = (
        value: boolean | string | undefined
    ) => {
        if (value === undefined || value === false) {
            return (
                <span className="text-[#7c5f42]">
                    —
                </span>
            );
        }

        if (value === true) {
            return <img src={Trick} alt="" className="mt-[1px] " />
                ;
        }

        return <span>{value}</span>;
    };

    const activePlan = plans[selectedPlan];

    return (
        <>
            {/* DESKTOP */}
            <div className="hidden overflow-hidden rounded-2xl border border-[#ede8e4] bg-white md:block">

                {/* PLAN NAMES */}
                <div
                    className="grid border-b border-[#ede8e4]"
                    style={{
                        gridTemplateColumns: `2fr repeat(${plans.length}, 1fr)`,
                    }}
                >
                    <div className="p-4" />

                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="border-l border-[#ede8e4] p-4 text-center font-medium"
                        >
                            {plan.name}
                        </div>
                    ))}
                </div>

                {/* FEATURE SECTIONS */}
                {sections.map((section) => (
                    <div key={section.title}>

                        {/* SECTION */}
                        <div className="bg-[#f8f4ee] px-4 py-3 font-medium">
                            {section.title}
                        </div>

                        {/* FEATURES */}
                        {section.features.map((feature) => (
                            <div
                                key={feature.key}
                                className="grid border-t border-[#ede8e4]"
                                style={{
                                    gridTemplateColumns: `2fr repeat(${plans.length}, 1fr)`,
                                }}
                            >

                                {/* FEATURE NAME */}
                                <div className="p-4 text-sm">
                                    {feature.label}
                                </div>

                                {/* PLAN VALUES */}
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="border-l border-[#ede8e4] p-4 text-center flex items-center justify-center text-sm"
                                    >
                                        {renderValue(
                                            plan.features[feature.key]
                                        )}
                                    </div>
                                ))}

                            </div>
                        ))}

                    </div>
                ))}

            </div>

            {/* MOBILE */}
            <div className="md:hidden">

                {/* PLAN SELECTOR */}
                <div className="mb-4 flex gap-2 overflow-x-auto">

                    {plans.map((plan, index) => (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(index)}
                            className={`shrink-0 rounded-full px-4 py-2 text-sm ${selectedPlan === index
                                ? "bg-[#342511] text-white"
                                : "border border-[#ede8e4] bg-white text-[#342511]"
                                }`}
                        >
                            {plan.name}
                        </button>
                    ))}

                </div>

                {/* SELECTED PLAN */}
                {activePlan && (
                    <div className="overflow-hidden rounded-2xl border border-[#ede8e4] bg-white">

                        {sections.map((section) => (
                            <div key={section.title}>

                                {/* SECTION */}
                                <div className="bg-[#f8f4ee] px-4 py-3 text-sm font-medium">
                                    {section.title}
                                </div>

                                {/* FEATURES */}
                                {section.features.map((feature) => (
                                    <div
                                        key={feature.key}
                                        className="flex items-center justify-between gap-4 border-t border-[#ede8e4] px-4 py-3"
                                    >

                                        <span className="text-sm">
                                            {feature.label}
                                        </span>

                                        <span className="shrink-0 text-sm">
                                            {renderValue(
                                                activePlan.features[
                                                feature.key
                                                ]
                                            )}
                                        </span>

                                    </div>
                                ))}

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </>
    );
};

export default FeatureComparison;