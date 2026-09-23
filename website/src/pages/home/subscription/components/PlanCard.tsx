// PlanCard.tsx
import { CheckCircle } from 'lucide-react';
import type { Plan } from '../data/subscription.data';

interface PlanCardProps {
  plan: Plan;
  planIndex: number;
}

export default function PlanCard({ plan, planIndex }: PlanCardProps) {
  const isPopular = plan.popular;

  return (
    <article
      className={`relative flex flex-col space-y-[1rem] rounded-2xl p-6 transition-shadow ${
        isPopular
          ? 'bg-white border-2 border-primary-brown shadow-xl'
          : 'bg-white border border-gray-50 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <span className="absolute -top-3 left-6 bg-white-100 text-primary-brown text-[0.7rem] font-semibold px-3 py-0.5 rounded-full border border-gray-50">
          {plan.badge}
        </span>
      )}

      {/* Name & description */}
      <h2 className="text-[1.25rem] font-medium text-primary-brown">{plan.name}</h2>
      <p className="mt-1 text-xs text-primary-light-brown min-h-[32px] leading-relaxed">{plan.description}</p>

      <div className="mt-4 flex items-end gap-1">
        {plan.price !== null ? (
          <>
            <span className="text-[1.875rem] font-semibold text-primary-brown leading-none">${plan.price}</span>
            <span className="text-xs text-primary-light-brown mb-0.5">/month</span>
          </>
        ) : (
          <span className="text-[1.5rem] font-semibold text-primary-brown">Contact us</span>
        )}
      </div>

      <button
        type="button"
        className={`mt-4 w-full py-2.5 rounded-[62.4375rem] text-[0.875rem] font-medium transition-all duration-200 cursor-pointer ${
          isPopular
            ? 'bg-primary-brown text-white hover:opacity-90'
            : 'border border-[#EDE8E4] text-primary-brown hover:bg-primary-brown hover:text-white'
        }`}
      >
        {plan.ctaLabel}
      </button>

      <ul className="mt-5 space-y-2">
        {plan.highlights.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[0.75rem] text-primary-brown">
            <CheckCircle size={15} className="mt-0.5 shrink-0 text-primary-brown" strokeWidth={1.8} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
