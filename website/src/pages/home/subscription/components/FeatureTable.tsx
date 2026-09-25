// FeatureTable.tsx — "Compare every feature" table
// Desktop: full multi-column table | Mobile: tab per plan, single-column list
import { useState } from 'react';
import { CheckCircle, Minus } from 'lucide-react';
import type { CellValue, FeatureSection, Plan } from '../data/subscription.data';

function Cell({ value, align = 'center' }: { value: CellValue; align?: 'center' | 'right' }) {
  const alignClass = align === 'right' ? 'justify-end' : 'justify-center';

  if (value === true) {
    return (
      <span className={`flex ${alignClass}`}>
        <CheckCircle size={18} className="text-primary-brown" strokeWidth={1.8} />
      </span>
    );
  }

  if (value === '—' || value === false) {
    return (
      <span className={`flex ${alignClass}`}>
        <Minus size={16} className="text-gray-50" />
      </span>
    );
  }

  if (typeof value === 'object' && 'label' in value) {
    return (
      <span className={`flex ${alignClass} items-center gap-1 text-[0.8125rem] text-primary-brown font-medium`}>
        {value.label}
        {value.badge && (
          <span className="bg-white-100 text-primary-brown text-[0.65rem] font-semibold px-1.5 rounded-full">
            {value.badge}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`block text-[0.8125rem] text-primary-brown text-${align}`}>{String(value)}</span>
  );
}

interface FeatureTableProps {
  plans: Plan[];
  sections: FeatureSection[];
}

export default function FeatureTable({ plans, sections }: FeatureTableProps) {
  const [activePlanIndex, setActivePlanIndex] = useState(0);

  return (
    <div className="w-full">
      <h2 className="text-center text-[1.75rem] md:text-[2.25rem] font-normal text-primary-brown mb-8 tracking-tight">
        Compare every feature
      </h2>

      {/* ── Mobile: tab per plan + single-column list ── */}
      <div className="md:hidden">
        {/* Plan tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setActivePlanIndex(i)}
              className={`px-4 py-1.5 rounded-full text-[0.8125rem] font-medium transition-all cursor-pointer ${activePlanIndex === i
                  ? 'bg-primary-brown text-white'
                  : 'border border-gray-50 text-primary-brown bg-white'
                }`}
            >
              {plan.name}
            </button>
          ))}
        </div>

        {/* Sections + rows for selected plan */}
        <div className="space-y-2">
          {sections.map((section) => (
            <div key={section.title}>
              {/* Section label */}
              <p className="text-[0.875rem] font-medium text-primary-light-brown  tracking-wider px-1 py-2">
                {section.title}
              </p>

              {/* Feature rows */}
              <div className="rounded-xl overflow-hidden border border-white-100">
                {section.rows.map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-4 py-3 bg-white text-[0.875rem] ${i < section.rows.length - 1 ? 'border-b border-white-100' : ''
                      }`}
                  >
                    <span className="text-primary-brown">{row.label}</span>
                    <Cell value={row.values[activePlanIndex] ?? '—'} align="right" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop: full multi-column table ── */}
      <div className="hidden md:block w-full overflow-x-auto border-2 rounded-2xl py-4 border-white-100">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="w-[36%] pb-4 text-left" />
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  className="pb-4 text-[0.875rem] font-medium text-center text-primary-brown"
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sections.map((section) => (
              <>
                <tr key={`section-${section.title}`}>
                  <td
                    colSpan={plans.length + 1}
                    className="px-4 py-4 text-[1.25rem] font-medium text-primary-brown"
                  >
                    {section.title}
                  </td>
                </tr>

                {section.rows.map((row, rowIndex) => (
                  <tr
                    key={`${section.title}-${rowIndex}`}
                    className="border-b border-white-100 hover:bg-white-50 bg-white transition-colors"
                  >
                    <td className="py-5 px-4 text-[0.875rem] font-medium text-primary-brown">{row.label}</td>
                    {plans.map((plan, planIndex) => (
                      <td
                        key={plan.id}
                        className={`py-5 px-2 text-center `}
                      >
                        <Cell value={row.values[planIndex] ?? '—'} />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
