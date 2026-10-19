export interface AgentPerformanceSnapshot {
  medianSoldPrice: string;
  medianDaysAdvertised: string | number;
  propertiesSoldLead: string | number;
  propertiesSoldSecondary: string | number;
}

export interface AgentPerformanceProps {
  agentName: string;
  snapshot: AgentPerformanceSnapshot;
}

/**
 * Agent performance snapshot component.
 * Pure presentation: receives snapshot data directly from AgentDetail.
 */
export function AgentPerformance({ agentName, snapshot }: AgentPerformanceProps) {
  const metrics = [
    {
      value: snapshot.medianSoldPrice,
      label: "Median sold price",
    },
    {
      value: String(snapshot.medianDaysAdvertised),
      label: "Median days advertised",
    },
    {
      value: String(snapshot.propertiesSoldLead),
      label: "Properties sold\n(as lead agent)",
    },
    {
      value: String(snapshot.propertiesSoldSecondary),
      label: "Properties sold\n(as secondary agent)",
    },
  ];

  return (
    <section className="flex flex-col gap-6 w-full" aria-labelledby="agent-performance-title">
      <h2
        id="agent-performance-title"
        className="text-[1.25rem] md:text-[1.375rem] font-medium text-[#222222]"
      >
        {agentName} performance snapshot
      </h2>

      <div className="w-full bg-white rounded-xl p-4 md:p-6 shadow-[0px_0px_13px_0px_rgba(0,0,0,0.12)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#EDE8E4]">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center text-center ${
                idx > 0 ? "pt-3 md:pt-0" : ""
              }`}
            >
              <div className="text-[1.5rem] md:text-[1.75rem] font-medium text-[#342511] tracking-[-0.006em]">
                {metric.value}
              </div>
              <div className="text-[0.75rem] text-[#342511] leading-snug whitespace-pre-line mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AgentPerformance;
