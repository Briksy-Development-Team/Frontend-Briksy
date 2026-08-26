import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Map, X } from "lucide-react";

import type { ResultType, SortType, ViewType } from "../../types/search";
import { mockProperties } from "../../data/mockProperties";
import { mockBuilders } from "../../data/mockBuilders";
import { mockTraders } from "../../data/mockTraders";

import Breadcrumb from "../../components/nav/Breadcrumb";
import Toolbar from "../../components/cards/Toolbar";
import MapView from "../../components/cards/MapView";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";
import PropertyListCard from "../../components/cards/property/PropertyListCard";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import BuilderListCard from "../../components/cards/builder/BuilderListCard";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import TraderListCard from "../../components/cards/trader/TraderListCard";
import SearchMegaMenu from "../../components/nav/SearchMegaMenu";

const GRID = "grid grid-cols-1 gap-[12px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const LIST = "grid grid-cols-1 gap-[12px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  " ;

const renderResults = (view: ViewType, resultType: ResultType) => {
  if (view === "map") return <MapView />;

  if (resultType === "property") {
    return view === "list" ? (
      <div className={LIST}>
        {mockProperties.map((item) => <PropertyListCard key={item.id} item={item} />)}
      </div>
    ) : (
      <div className={GRID}>
        {mockProperties.map((item) => <PropertyGridCard key={item.id} item={item} />)}
      </div>
    );
  }

  if (resultType === "builder") {
    return view === "list" ? (
      <div className={LIST}>
        {mockBuilders.map((item) => <BuilderListCard key={item.id} item={item} />)}
      </div>
    ) : (
      <div className={GRID}>
        {mockBuilders.map((item) => <BuilderGridCard key={item.id} item={item} />)}
      </div>
    );
  }

  
  return view === "list" ? (
    <div className={LIST}>
      {mockTraders.map((item) => <TraderListCard key={item.id} item={item} />)}
    </div>
  ) : (
    <div className={GRID}>
      {mockTraders.map((item) => <TraderGridCard key={item.id} item={item} />)}
    </div>
  );
};

const getSearchHeader = (type: ResultType) => {
  if (type === "builder") {
    return {
      title: "Find a builder",
      breadcrumb: [{ label: "Home", href: "/" }, { label: "Find a builder" }]
    };
  }
  if (type === "trader") {
    return {
      title: "Find a professional",
      breadcrumb: [{ label: "Home", href: "/" }, { label: "Find a professional" }]
    };
  }
  return {
    title: "Find a property",
    breadcrumb: [{ label: "Home", href: "/" }, { label: "Find a property" }]
  };
};

const SearchPage = () => {
  const [view, setView] = useState<ViewType>("list");
  const [sort, setSort] = useState<SortType>("featured");
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const resultType: ResultType =
    (searchParams.get("type") as ResultType | null) ?? "property";

  const total =
    resultType === "property" ? mockProperties.length
    : resultType === "builder" ? mockBuilders.length
    : mockTraders.length;

  const header = getSearchHeader(resultType);
  
  const breadcrumbs = [...header.breadcrumb] as import("../../components/nav/Breadcrumb").BreadcrumbItem[];
  if (selectedSub) {
     breadcrumbs[breadcrumbs.length - 1].onClick = () => {
        setSelectedCategory(null);
        setSelectedSub(null);
     };
     breadcrumbs.push({ label: selectedCategory! });
     breadcrumbs.push({ label: selectedSub });
  }

  return (
    <div className="min-h-screen bg-white-50 py-24 font-helvetica">
      <div className="mx-auto px-[5%]">
        <Breadcrumb items={breadcrumbs} />
        {!selectedSub && (
           <h1 className="text-[2.5rem] font-bold text-primary-brown mb-8">{header.title}</h1>
        )}
        
        {!selectedSub ? (
           <SearchMegaMenu 
              resultType={resultType} 
              onSelect={(cat, sub) => {
                 setSelectedCategory(cat);
                 setSelectedSub(sub);
              }}
           />
        ) : (
           <div className="flex items-center gap-3 mb-8 flex-wrap">
              <button 
                 onClick={() => { setSelectedCategory(null); setSelectedSub(null); }}
                 className="px-4 py-2 bg-[#EBDDD3] rounded-full text-[0.875rem] font-medium text-[#4B3B2B] flex items-center gap-2 hover:bg-[#E5D7CC] transition-colors"
              >
                 {selectedSub} <X className="w-3.5 h-3.5" />
              </button>
              <button className="px-4 py-2 bg-[#EBDDD3] rounded-full text-[0.875rem] font-medium text-[#4B3B2B] flex items-center gap-2 hover:bg-[#E5D7CC] transition-colors">
                 Within 10 km <X className="w-3.5 h-3.5" />
              </button>
              <button className="px-4 py-2 bg-[#EBDDD3] rounded-full text-[0.875rem] font-medium text-[#4B3B2B] flex items-center gap-2 hover:bg-[#E5D7CC] transition-colors">
                 Licence verified <X className="w-3.5 h-3.5" />
              </button>
              <button className="px-4 py-2 bg-[#EBDDD3] rounded-full text-[0.875rem] font-medium text-[#4B3B2B] flex items-center gap-2 hover:bg-[#E5D7CC] transition-colors">
                 4.5 and above <X className="w-3.5 h-3.5" />
              </button>
              
              <div className="ml-auto flex items-center gap-3">
                 <button className="px-4 py-2 bg-white border border-[#E0D8D0] rounded-full text-[0.875rem] font-medium text-[#4B3B2B] flex items-center gap-2 hover:bg-[#F5F0EB] transition-colors shadow-sm">
                    <Map className="w-4 h-4" /> Show map
                 </button>
                 <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortType)}
                    className="px-4 py-2 bg-white border border-[#E0D8D0] rounded-full text-[0.875rem] font-medium text-[#4B3B2B] outline-none hover:bg-[#F5F0EB] transition-colors shadow-sm cursor-pointer appearance-none pr-8"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%234B3B2B\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'calc(100% - 10px) center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
                 >
                    <option value="featured">Sort by: Recommended</option>
                    <option value="newest">Sort by: Newest</option>
                    <option value="price-asc">Sort by: Price (Low to High)</option>
                    <option value="price-desc">Sort by: Price (High to Low)</option>
                 </select>
              </div>
           </div>
        )}

        <div className="mb-4 text-[#8C7A6B] text-[0.875rem]">
           {total} verified professionals · Showing 1–12
        </div>

        {!selectedSub && (
           <Toolbar
             view={view}
             setView={setView}
             sort={sort}
             setSort={setSort}
             total={total}
           />
        )}
        <div className="mt-8">{renderResults(view, resultType)}</div>
      </div>
    </div>
  );
};

export default SearchPage;
