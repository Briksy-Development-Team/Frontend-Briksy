import { ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import type { ResultType } from "../../types/search";

import Category from "../../assets/hero/category.svg"
const MOCK_CATEGORIES: Record<ResultType, { id: string; label: string; groups: { title: string; items: string[] }[]; image: string }[]> = {
  builder: [
    {
      id: "building-and-construction",
      label: "Building and construction",
      groups: [
        { title: "STRUCTURE", items: ["Builders", "Carpenters", "Concreters", "Bricklayers", "Steel fabricators"] },
        { title: "ROOFING & EXTERIOR", items: ["Roofers", "Waterproofers", "Guttering", "Cladding", "Insulation specialists"] },
        { title: "SITE WORKS", items: ["Excavation", "Demolition experts", "Scaffolders", "Underpinning", "Retaining walls"] },
        { title: "NEW BUILDS", items: ["Custom home builders", "Knockdown rebuild", "Granny flats", "Extensions", "Owner-builder support"] },
      ],
      image: "https://images.unsplash.com/photo-1541888086925-0c13d339d67a?w=800&q=80"
    },
    {
      id: "renovations",
      label: "Renovations",
      groups: [
        { title: "INTERIOR", items: ["Kitchen renovations", "Bathroom renovations", "Bedroom fit-outs", "Laundry renovations"] },
        { title: "EXTERIOR", items: ["Facade renovations", "Deck & pergola", "Pool surrounds", "Alfresco areas"] },
        { title: "STRUCTURAL", items: ["House lifting", "Underpinning", "Restumping", "Wall removal"] },
      ],
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
    },
    {
      id: "project-management",
      label: "Project management",
      groups: [
        { title: "PLANNING", items: ["Architect", "Draftsperson", "Building designer", "Interior designer"] },
        { title: "OVERSIGHT", items: ["Project manager", "Site supervisor", "Building inspector", "Contract administrator"] },
      ],
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
    },
    {
      id: "trades-and-repairs",
      label: "Trades and repairs",
      groups: [
        { title: "REPAIRS", items: ["Handyman", "Restoration specialists", "Maintenance contractors", "Emergency repairs"] },
        { title: "SPECIALTY", items: ["Heritage restorers", "Asbestos removal", "Waterproofing", "Crack repair"] },
      ],
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"
    }
  ],
  trader: [
    {
      id: "trades-and-repairs",
      label: "Trades and repairs",
      groups: [
        { title: "ELECTRICAL", items: ["Electricians", "Solar Installers", "Data Cabling", "Security Systems", "EV Charger Installers"] },
        { title: "PLUMBING", items: ["Plumbers", "Gasfitters", "Drainers", "Hot Water Systems", "Stormwater drainage"] },
        { title: "PAINTING", items: ["Painters", "Decorators", "Spray painters", "Epoxy coating"] },
        { title: "OTHER TRADES", items: ["Locksmiths", "Glaziers", "Pest Control", "Roof plumbers", "Tilers"] },
      ],
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"
    },
    {
      id: "outdoor",
      label: "Outdoor and landscaping",
      groups: [
        { title: "LANDSCAPING", items: ["Landscapers", "Gardeners", "Tree Surgeons", "Lawn Mowing", "Irrigation specialists"] },
        { title: "OUTDOOR BUILDS", items: ["Decking", "Pergolas", "Fencers", "Gate Installers", "Retaining walls"] },
        { title: "POOLS", items: ["Pool builders", "Pool cleaners", "Pool inspectors", "Spa installers"] },
      ],
      image: "https://images.unsplash.com/photo-1558904541-efa843a96f09?w=800&q=80"
    },
    {
      id: "interiors",
      label: "Interiors and finishing",
      groups: [
        { title: "FINISHES", items: ["Tilers", "Plasterers", "Flooring", "Concreters", "Rendering"] },
        { title: "CABINETRY", items: ["Cabinet makers", "Joinery", "Wardrobe installers", "Kitchen fitters"] },
        { title: "DESIGN", items: ["Interior designers", "Stylists", "Space planners", "Colour consultants"] },
      ],
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
    },
    {
      id: "professional-services",
      label: "Professional services",
      groups: [
        { title: "DESIGN & PLANNING", items: ["Architects", "Draftspeople", "Surveyors", "Engineers"] },
        { title: "LEGAL & FINANCE", items: ["Conveyancers", "Property lawyers", "Mortgage brokers", "Financial advisors"] },
        { title: "INSPECTION", items: ["Building inspectors", "Pest inspectors", "Property valuers", "Quantity surveyors"] },
      ],
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    }
  ],
  property: [
    {
      id: "residential",
      label: "Residential Properties",
      groups: [
        { title: "HOUSES", items: ["Detached House", "Townhouse", "Villa", "Semi-detached"] },
        { title: "APARTMENTS", items: ["Unit", "Studio", "Penthouse", "Serviced apartment"] },
        { title: "LAND", items: ["Vacant Land", "Acreage", "Rural block", "Subdivisions"] },
      ],
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
    },
    {
      id: "commercial",
      label: "Commercial Properties",
      groups: [
        { title: "OFFICE", items: ["Office Space", "Coworking", "Medical suites", "Virtual office"] },
        { title: "RETAIL", items: ["Shop", "Showroom", "Warehouse", "Industrial unit"] },
        { title: "HOSPITALITY", items: ["Restaurant space", "Cafe premises", "Hotel rooms", "Function venues"] },
      ],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
    },
    {
      id: "investment",
      label: "Investment Properties",
      groups: [
        { title: "RENTAL YIELD", items: ["High yield properties", "Positive cashflow", "Student accommodation", "Holiday rentals"] },
        { title: "DEVELOPMENT", items: ["Development sites", "DA approved", "Subdividable land", "Duplex sites"] },
      ],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
    },
    {
      id: "new-builds",
      label: "New builds & off-plan",
      groups: [
        { title: "OFF-PLAN", items: ["House & land packages", "Townhouse projects", "Apartment off-plan", "Retirement villages"] },
        { title: "DISPLAY HOMES", items: ["Display home opens", "Spec homes", "Volume builders", "Custom builders"] },
      ],
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
    }
  ]
};

export { MOCK_CATEGORIES };

export default function SearchMegaMenu({
  resultType,
  onSelect
}: {
  resultType: ResultType;
  onSelect: (category: string, subcategory: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  // ponytail: simple timer ref for hover-close delay | upgrade: @floating-ui if positioning complexity grows
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMenu = (tabId?: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
    if (tabId) setActiveTab(tabId);
    else if (!activeTab) setActiveTab(cats[0]?.id);
  };
  const closeMenu = () => { closeTimer.current = setTimeout(() => setIsOpen(false), 150); };

  const cats = MOCK_CATEGORIES[resultType];
  if (!cats || cats.length === 0) return null;

  return (
    <div className="mb-6 relative font-helvetica" onMouseLeave={closeMenu}>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onMouseEnter={() => openMenu()}
          className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 bg-primary-brown border-[primary-brown] text-white border shrink-0`}
        >
          <img src={Category} alt="" />
          Categories
        </button>
        {cats.map(c => (
          <button
            key={c.id}
            onMouseEnter={() => openMenu(c.id)}
            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors border shrink-0 ${activeTab === c.id && isOpen ? 'bg-[#8B6F54] border-[#8B6F54] text-white' : 'bg-transparent border-[#E0D8D0] text-[#5C4D40] hover:bg-white hover:border-[#E0D8D0]'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isOpen && activeTab && (
        <>
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_16px_40px_rgba(52,37,17,0.16)] border border-[#EDE8E4] z-50 flex flex-col overflow-hidden"
            onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
            onMouseLeave={closeMenu}
          >
            <div className="flex">
              {/* Left sidebar */}
              <div className="w-[240px] shrink-0 border-r border-[#EDE8E4] py-4 px-3">
                {cats.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setActiveTab(c.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[0.875rem] font-medium transition-colors flex justify-between items-center ${activeTab === c.id ? 'bg-[#EBDDD3] text-[primary-brown]' : 'text-[#5C4D40] hover:bg-[#F5F0EB]'}`}
                  >
                    {c.label}
                    {activeTab === c.id && <ArrowRight className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </div>

              {/* Main grid */}
              <div className="flex-1 flex gap-8 p-8">
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                  {cats.find(c => c.id === activeTab)?.groups.map((g, i) => (
                    <div key={i}>
                      <h4 className="text-[0.7rem] font-semibold text-[#8C7A6B] tracking-widest mb-4 uppercase">{g.title}</h4>
                      <ul className="flex flex-col gap-2.5">
                        {g.items.map(item => (
                          <li key={item}>
                            <button
                              onClick={() => { setIsOpen(false); onSelect(cats.find(c => c.id === activeTab)!.label, item); }}
                              className="text-[0.875rem] text-[primary-brown] hover:text-[#8B6F54] hover:underline transition-colors text-left"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Featured image */}
                <div className="w-[220px] shrink-0 hidden xl:flex flex-col gap-3">
                  <img
                    src={cats.find(c => c.id === activeTab)?.image}
                    className="w-full h-[180px] object-cover rounded-xl"
                    alt=""
                  />
                  <div>
                    <p className="text-[0.7rem] text-[#8C7A6B] uppercase tracking-wider mb-1">Guide</p>
                    <button className="text-[0.875rem] font-medium text-[primary-brown] flex items-center gap-1 hover:underline">
                      Choosing a professional <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#EDE8E4] bg-[#F8F4EE] flex items-center justify-between px-8 py-4">
              <span className="text-[0.75rem] text-[primary-light-brown]">
                <span className="text-[primary-brown] font-semibold">✓</span> 412 verified professionals in {cats.find(c => c.id === activeTab)?.label}
              </span>
              <button className="text-[0.875rem] font-medium text-[primary-brown] flex items-center gap-1 hover:underline">
                View all in {cats.find(c => c.id === activeTab)?.label} <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
