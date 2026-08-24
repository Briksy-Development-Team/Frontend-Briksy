import { useState } from "react";
import { useSearchParams } from "react-router-dom";

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

  const resultType: ResultType =
    (searchParams.get("type") as ResultType | null) ?? "property";

  const total =
    resultType === "property" ? mockProperties.length
    : resultType === "builder" ? mockBuilders.length
    : mockTraders.length;

  const header = getSearchHeader(resultType);

  return (
    <div className="min-h-screen bg-white-50 py-24 font-helvetica">
      <div className="mx-auto px-[5%]">
        <Breadcrumb items={header.breadcrumb} />
        <h1 className="text-[2.5rem] font-bold text-primary-brown mb-8">{header.title}</h1>
        
        <Toolbar
          view={view}
          setView={setView}
          sort={sort}
          setSort={setSort}
          total={total}
        />
        <div className="mt-8">{renderResults(view, resultType)}</div>
      </div>
    </div>
  );
};

export default SearchPage;
