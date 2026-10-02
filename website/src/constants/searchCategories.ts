import type { ResultType } from "../types/search";

import Build from "../assets/icons/search/build.svg";
import Prop from "../assets/icons/search/property.svg";
import Trader from "../assets/icons/search/trades.svg";

export type PropType = { id: string; label: string };

export type Category = {
  id: string;
  label: string;
  title: string;
  desc: string;
  icon: string;
  resultType: ResultType;
  placeholder: string;
  propTypes: PropType[];
};

export const SEARCH_CATEGORIES: Category[] = [
  {
    id: "properties",
    label: "Properties",
    title: "PROPERTIES",
    desc: "Find properties to buy or rent",
    icon: Prop,
    resultType: "property",
    placeholder: "Try '3-bedroom house in Richmond...",
    propTypes: [
      { id: "all", label: "All" },
      { id: "buy", label: "Buy" },
      { id: "rent", label: "Rent" },
      { id: "sold", label: "Sold" },
    ],
  },
  {
    id: "agents",
    label: "Agents",
    title: "AGENTS",
    desc: "Find a buyer, seller or leasing agent",
    icon: Trader,
    resultType: "trader",
    placeholder: "Search your Agent...",
    propTypes: [
      { id: "all", label: "All" },
      { id: "real-estate", label: "Real Estate Agents" },
      { id: "buyer", label: "Buyer Agents" },
    ],
  },
  {
    id: "address",
    label: "Address",
    title: "ADDRESS",
    desc: "Search by exact address or suburb",
    icon: Prop,
    resultType: "all",
    placeholder: "Search with Address, Suburs, Postcode...",
    propTypes: [],
  },
  {
    id: "traders",
    label: "Traders",
    title: "TRADERS",
    desc: "Connect with skilled trades professionals",
    icon: Trader,
    resultType: "trader",
    placeholder: "Search with Where ...",
    propTypes: [
      { id: "all", label: "All" },
      { id: "landscaper", label: "Landscapers" },
      { id: "concreter", label: "Concreter" },
      { id: "fencing", label: "Fencing" },
      { id: "mortgage", label: "Mortgage Brokers" },
      { id: "conveyancer", label: "Conveyancers" },
      { id: "building-pest", label: "Building & Pest" },
    ],
  },
  {
    id: "builders",
    label: "Builders",
    title: "BUILDERS",
    desc: "Discover trusted builders and developers",
    icon: Build,
    resultType: "builder",
    placeholder: "Search your Builder...",
    propTypes: [],
  },
  {
    id: "commercial",
    label: "Commercial",
    title: "Commercial",
    desc: "Find properties to buy or rent",
    icon: Prop,
    resultType: "commercial",
    placeholder: "Try '3-bedroom house in Richmond...",
    propTypes: [
      { id: "all", label: "All" },
      { id: "buy", label: "Buy" },
      { id: "lease", label: "Lease" },
      { id: "sold", label: "Sold" },
      { id: "leased", label: "Leased" },
    ],
  },
];
