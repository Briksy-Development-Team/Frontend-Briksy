import { useState } from "react";

export interface AgentAboutProps {
  agentName: string;
  description: string;
}

/**
 * About section for Agent Detail view with expandable text.
 * Pure presentation: receives description text directly from AgentDetail.
 */
export function AgentAbout({ agentName, description }: AgentAboutProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="flex flex-col gap-4 w-full" aria-labelledby="agent-about-title">
      <h2
        id="agent-about-title"
        className="text-[1.25rem] md:text-[1.375rem] font-medium text-[#222222]"
      >
        About {agentName}
      </h2>

      <div
        className={`text-[0.875rem] md:text-[0.9375rem] text-black leading-relaxed transition-all ${
          !isExpanded ? "line-clamp-4" : ""
        }`}
      >
        {description}
      </div>

      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-[#EDE8E4] text-[0.875rem] font-medium text-[#222222] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </section>
  );
}

export default AgentAbout;
