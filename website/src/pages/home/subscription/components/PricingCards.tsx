// PricingCards.tsx
import { Star } from "lucide-react";
import type { Plan, Stat } from "../data/subscription.data";
import PlanCard from "./PlanCard";

interface PricingCardsProps {
  plans: Plan[];
  stats: Stat[];
}

export default function PricingCards({ plans, stats }: PricingCardsProps) {
  return (
    <div className="space-y-8">
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {plans.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} planIndex={i} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-8 pt-4 pb-2 border-t border-gray-50">
        {stats.map((stat, i) => {
          const isRating = stat.value.includes("★");
          const value = stat.value.replace("★", "").trim();

          return (
            <div key={i} className="flex sm:flex-row flex-col sm:items-center sm:gap-x-2 sm:justify-center gap-0.5">
              <div className="flex items-center gap-1 text-[1.5rem] sm:text-[1.875rem] font-medium text-primary-brown">
                {value}
                {isRating && <Star size={18} className="fill-primary-brown text-primary-brown" />}
              </div>

              <span className="text-[0.875rem] text-primary-light-brown sm:text-center">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
