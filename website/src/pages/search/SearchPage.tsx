import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ResultType, SortType } from "../../types/search";
import type { BreadcrumbItem } from "../../components/nav/Breadcrumb";
import Breadcrumb from "../../components/nav/Breadcrumb";
import SearchMegaMenu from "../../components/nav/SearchMegaMenu";
import BrowseView from "./BrowseView";
import ResultsView from "./ResultsView";

const HEADERS: Record<ResultType, { title: string; crumb: string }> = {
  builder:  { title: "Find a builder",       crumb: "Find a builder" },
  trader:   { title: "Find a professional",  crumb: "Find a professional" },
  property: { title: "Find a property",      crumb: "Find a property" },
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState<SortType>("featured");
  const [showMap, setShowMap] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const resultType: ResultType = (searchParams.get("type") as ResultType | null) ?? "property";
  const { title, crumb } = HEADERS[resultType];

  const breadcrumbs: BreadcrumbItem[] = selectedSub
    ? [
        { label: "Home", href: "/" },
        { label: crumb, onClick: () => { setSelectedCategory(null); setSelectedSub(null); setShowMap(false); } },
        { label: selectedCategory! },
        { label: selectedSub },
      ]
    : [{ label: "Home", href: "/" }, { label: crumb }];

  return (
    <div className="min-h-screen bg-[#F8F4EE] pt-24 pb-16 font-helvetica">
      <div className="mx-auto px-[5%]">
        <Breadcrumb items={breadcrumbs} />
        {!selectedSub && <h1 className="text-[2.5rem] font-bold text-[primary-brown] mb-6">{title}</h1>}

        <SearchMegaMenu
          resultType={resultType}
          onSelect={(cat, sub) => { setSelectedCategory(cat); setSelectedSub(sub); setShowMap(false); }}
        />

        <div className="mt-4 flex flex-col gap-6">
          {selectedSub ? (
            <ResultsView
              resultType={resultType}
              selectedSub={selectedSub}
              sort={sort}
              setSort={setSort}
              onClearSub={() => { setSelectedCategory(null); setSelectedSub(null); setShowMap(false); }}
              showMap={showMap}
              onToggleMap={() => setShowMap(v => !v)}
            />
          ) : (
            <BrowseView resultType={resultType} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
