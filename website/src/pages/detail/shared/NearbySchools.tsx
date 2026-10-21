import { useState } from "react";

export type SchoolType = "Primary" | "Secondary" | "Child Care";

export interface SchoolItem {
  id: string;
  name: string;
  level: string; // e.g. "Combined", "Primary", "Secondary", "Child Care"
  sector: string; // e.g. "Government", "Independent", "Community", "Private"
  distance: string; // e.g. "0.52km"
  category: SchoolType;
}

export const DEFAULT_NEARBY_SCHOOLS: SchoolItem[] = [
  // Primary / Combined
  {
    id: "sch-1",
    name: "Observatory Hill Environmental Education Centre",
    level: "Combined",
    sector: "Government",
    distance: "0.52km",
    category: "Primary",
  },
  {
    id: "sch-2",
    name: "Fort Street Public School",
    level: "Primary",
    sector: "Government",
    distance: "0.59km",
    category: "Primary",
  },
  {
    id: "sch-3",
    name: "St Mary's Cathedral College",
    level: "Combined",
    sector: "Independent",
    distance: "0.97km",
    category: "Primary",
  },
  {
    id: "sch-4",
    name: "Plunkett Street Public School",
    level: "Primary",
    sector: "Government",
    distance: "1.23km",
    category: "Primary",
  },
  {
    id: "sch-5",
    name: "St Andrew's Cathedral School",
    level: "Combined",
    sector: "Independent",
    distance: "1.27km",
    category: "Primary",
  },

  // Secondary
  {
    id: "sch-6",
    name: "Fort Street High School",
    level: "Secondary",
    sector: "Government",
    distance: "1.10km",
    category: "Secondary",
  },
  {
    id: "sch-7",
    name: "Sydney Girls High School",
    level: "Secondary",
    sector: "Government",
    distance: "1.85km",
    category: "Secondary",
  },
  {
    id: "sch-8",
    name: "Sydney Boys High School",
    level: "Secondary",
    sector: "Government",
    distance: "1.90km",
    category: "Secondary",
  },
  {
    id: "sch-9",
    name: "St Andrew's Cathedral School",
    level: "Combined",
    sector: "Independent",
    distance: "1.27km",
    category: "Secondary",
  },
  {
    id: "sch-10",
    name: "St Aloysius' College",
    level: "Secondary",
    sector: "Independent",
    distance: "2.15km",
    category: "Secondary",
  },

  // Child Care
  {
    id: "sch-11",
    name: "KU Maybanke Early Learning Centre",
    level: "Child Care",
    sector: "Community",
    distance: "0.45km",
    category: "Child Care",
  },
  {
    id: "sch-12",
    name: "Guardian Childcare & Education",
    level: "Child Care",
    sector: "Private",
    distance: "0.60km",
    category: "Child Care",
  },
  {
    id: "sch-13",
    name: "Active Kids Early Learning Centre",
    level: "Child Care",
    sector: "Private",
    distance: "0.75km",
    category: "Child Care",
  },
  {
    id: "sch-14",
    name: "Goodstart Early Learning Sydney",
    level: "Child Care",
    sector: "Not-for-Profit",
    distance: "0.95km",
    category: "Child Care",
  },
];

export interface NearbySchoolsProps {
  title?: string;
  schools?: SchoolItem[];
  className?: string;
}

export default function NearbySchools({
  title = "Nearby schools & child care",
  schools = DEFAULT_NEARBY_SCHOOLS,
  className = "",
}: NearbySchoolsProps) {
  const [activeTab, setActiveTab] = useState<SchoolType>("Primary");

  const filteredSchools = schools.filter((item) => item.category === activeTab);

  return (
    <section className={`flex flex-col gap-4 w-full font-helvetica ${className}`} aria-label={title}>
      <h3 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#222222]">
        {title}
      </h3>

      {/* Tabs matching Figma Node 4539:3911 */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["Primary", "Secondary", "Child Care"] as SchoolType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-[14px] font-normal transition-all cursor-pointer ${
                isActive
                  ? "bg-primary-brown text-white shadow-xs"
                  : "bg-white text-primary-brown hover:bg-[#F8F4EE] border border-[#EDE8E4]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="w-full flex flex-col divide-y divide-[#EDE8E4] mt-1">
        {filteredSchools.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-1 gap-1.5 sm:gap-4 transition-colors hover:bg-white/40"
          >
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-[12px] md:text-sm font-medium text-primary-brown truncate">{item.name}</p>
            </div>

            <div className="flex items-center gap-6 sm:gap-12 shrink-0 text-[12px] text-[#8B6F54]">
              <span className="w-24 text-left">{item.level}</span>
              <span className="w-24 text-left">{item.sector}</span>
              <span className="w-16 text-right font-medium">{item.distance}</span>
            </div>
          </div>
        ))}

        {filteredSchools.length === 0 && (
          <p className="py-6 text-sm text-[#8B6F54]">No {activeTab.toLowerCase()} options recorded nearby.</p>
        )}
      </div>
    </section>
  );
}
