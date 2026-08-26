import { Grid, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { ResultType } from "../../types/search";

const MOCK_CATEGORIES = {
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
      id: "trades-and-repairs",
      label: "Trades and repairs",
      groups: [
         { title: "REPAIRS", items: ["Handyman", "Restoration", "Maintenance"] }
      ],
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"
    }
  ],
  trader: [
    {
      id: "trades-and-repairs",
      label: "Trades and repairs",
      groups: [
        { title: "ELECTRICAL", items: ["Electricians", "Solar Installers", "Data Cabling"] },
        { title: "PLUMBING", items: ["Plumbers", "Gasfitters", "Drainers"] },
        { title: "PAINTING", items: ["Painters", "Decorators"] },
        { title: "OTHER TRADES", items: ["Locksmiths", "Glaziers", "Pest Control"] }
      ],
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"
    },
    {
      id: "outdoor",
      label: "Outdoor and landscaping",
      groups: [
        { title: "LANDSCAPING", items: ["Landscapers", "Gardeners", "Tree Surgeons"] },
        { title: "FENCING", items: ["Fencers", "Gate Installers"] },
      ],
      image: "https://images.unsplash.com/photo-1558904541-efa843a96f09?w=800&q=80"
    },
    {
       id: "interiors",
       label: "Interiors and finishing",
       groups: [
          { title: "FINISHES", items: ["Tilers", "Plasterers", "Flooring"] }
       ],
       image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
    },
    {
       id: "property-services",
       label: "Property services",
       groups: [
          { title: "CLEANING", items: ["Cleaners", "Window Cleaners", "Carpet Cleaners"] }
       ],
       image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
    },
    {
       id: "professional-services",
       label: "Professional services",
       groups: [
          { title: "CONSULTING", items: ["Architects", "Draftspeople", "Surveyors"] }
       ],
       image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    }
  ],
  property: [
    {
      id: "residential",
      label: "Residential Properties",
      groups: [
        { title: "HOUSES", items: ["Detached House", "Townhouse", "Villa"] },
        { title: "APARTMENTS", items: ["Unit", "Studio", "Penthouse"] },
        { title: "LAND", items: ["Vacant Land", "Acreage"] }
      ],
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
    },
    {
       id: "commercial",
       label: "Commercial Properties",
       groups: [
          { title: "OFFICE", items: ["Office Space", "Coworking"] },
          { title: "RETAIL", items: ["Shop", "Showroom", "Warehouse"] }
       ],
       image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
    }
  ]
};

export default function SearchMegaMenu({ 
  resultType, 
  onSelect 
}: { 
  resultType: ResultType; 
  onSelect: (category: string, subcategory: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const cats = MOCK_CATEGORIES[resultType];
  if (!cats || cats.length === 0) return null;

  return (
    <div className="mb-6 relative">
       <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
         <button 
           onClick={() => { setIsOpen(!isOpen); if (!activeTab) setActiveTab(cats[0].id); }} 
           className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 border ${isOpen ? 'bg-[#3E2E21] border-[#3E2E21] text-white' : 'bg-[#4B3B2B] border-[#4B3B2B] text-white hover:bg-[#3E2E21] hover:border-[#3E2E21]'}`}
         >
            <Grid className="w-4 h-4" /> Categories
         </button>
         {cats.map(c => (
           <button 
             key={c.id} 
             onClick={() => { setIsOpen(true); setActiveTab(c.id); }}
             className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors border ${activeTab === c.id && isOpen ? 'bg-white border-[#E0D8D0] shadow-sm' : 'bg-[#FAF8F5] border-[#E0D8D0]/40 text-[#5C4D40] hover:bg-white hover:border-[#E0D8D0]'}`}
           >
             {c.label}
           </button>
         ))}
       </div>
       
       {isOpen && activeTab && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#E0D8D0] z-50 flex flex-col overflow-hidden">
             <div className="p-6 flex gap-8">
               {/* Left Sidebar Menu */}
               <div className="w-64 flex flex-col gap-1 border-r border-[#E0D8D0] pr-6 shrink-0">
                 {cats.map(c => (
                   <button 
                     key={c.id}
                     onClick={() => setActiveTab(c.id)}
                     className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${activeTab === c.id ? 'bg-[#EBDDD3] text-[#4B3B2B]' : 'text-[#5C4D40] hover:bg-[#F5F0EB]'}`}
                   >
                     {c.label}
                     {activeTab === c.id && <ArrowRight className="w-4 h-4" />}
                   </button>
                 ))}
               </div>
               
               {/* Main Content */}
               <div className="flex-1 flex justify-between gap-8 pb-4">
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                     {cats.find(c => c.id === activeTab)?.groups.map((g, i) => (
                        <div key={i}>
                           <h4 className="text-[0.75rem] font-semibold text-[#8C7A6B] tracking-wider mb-4 uppercase">{g.title}</h4>
                           <ul className="flex flex-col gap-3 text-[0.875rem] text-[#4B3B2B]">
                              {g.items.map(item => (
                                 <li key={item}>
                                   <button 
                                      onClick={() => { 
                                         setIsOpen(false); 
                                         onSelect(cats.find(c=>c.id===activeTab)!.label, item); 
                                      }} 
                                      className="hover:text-primary-brown hover:underline transition-colors text-left font-medium"
                                   >
                                     {item}
                                   </button>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     ))}
                  </div>
                  
                  {/* Optional Image */}
                  <div className="w-64 shrink-0 hidden xl:block">
                     <img src={cats.find(c => c.id === activeTab)?.image} className="w-full h-40 object-cover rounded-xl shadow-sm" alt="" />
                     <div className="mt-4">
                       <p className="text-[0.75rem] text-[#8C7A6B] mb-1">Guide</p>
                       <button className="text-[0.875rem] font-medium text-primary-brown flex items-center gap-1 hover:underline">
                          Choosing a professional <ArrowRight className="w-3 h-3" />
                       </button>
                     </div>
                  </div>
               </div>
             </div>
             
             {/* Bottom Bar */}
             <div className="h-14 bg-[#F5F0EB] border-t border-[#E0D8D0] flex items-center justify-between px-6">
                <span className="text-[#8C7A6B] text-[0.75rem] flex items-center gap-2">
                   <span className="text-primary-brown font-bold">✓</span> 412 verified professionals in {cats.find(c=>c.id===activeTab)?.label}
                </span>
                <button className="font-medium text-primary-brown flex items-center gap-1 hover:underline text-[0.875rem]">
                   View all 1,240 professionals <ArrowRight className="w-3 h-3" />
                </button>
             </div>
          </div>
       )}
    </div>
  );
}
