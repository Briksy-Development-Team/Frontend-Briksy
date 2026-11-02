// ponytail: unified category & sub-category taxonomy — single source of truth for frontend & future backend API swap
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

export const CATEGORIES: Category[] = [
  {
    id: "real-estate",
    label: "Real Estate",
    title: "REAL ESTATE",
    desc: "Find real estate to buy or rent",
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
    id: "auction",
    label: "Auction",
    title: "AUCTION",
    desc: "Find properties going under the hammer",
    icon: Prop,
    resultType: "auction",
    placeholder: "Search auctions by suburb or property type...",
    propTypes: [],
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
    desc: "Find commercial properties to buy or rent",
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

// Alias for backward compatibility
export const SEARCH_CATEGORIES = CATEGORIES;

export const SERVICE_CATEGORIES = [
  { slug: "landscapers", label: "Landscapers" },
  { slug: "concreter", label: "Concreter" },
  { slug: "fencing", label: "Fencing" },
  { slug: "mortgage-brokers", label: "Mortgage Brokers" },
  { slug: "conveyancers", label: "Conveyancers" },
  { slug: "building-and-pest", label: "Building & Pest" },
] as const;

export type ServiceCategory = { slug: string; label: string; name?: string };
export type ProfessionalCategoryLabel = (typeof SERVICE_CATEGORIES)[number]["label"];

export const serviceSlugForLabel = (
  label: string,
  categories: readonly ServiceCategory[] = SERVICE_CATEGORIES
) => categories.find((category) => category.label.toLowerCase() === label.toLowerCase())?.slug;

export const CRUMBS: Record<string, string> = {
  all: "Search",
  "real-estate": "Find real estate",
  agents: "Find an agent",
  traders: "Find a professional",
  builders: "Find a builder",
  address: "Address",
  commercial: "Commercial",
  auction: "Auctions",
};

export const TAB_MAP: Record<string, string> = {
  all: "All",
  buy: "Buy",
  rent: "Rent",
  sold: "Sold",
  lease: "Lease",
  leased: "Leased",
  "real-estate": "Real Estate Agents",
  buyer: "Buyer Agents",
  landscaper: "Landscapers",
  landscapers: "Landscapers",
  concreter: "Concreter",
  fencing: "Fencing",
  mortgage: "Mortgage Brokers",
  "mortgage-brokers": "Mortgage Brokers",
  conveyancer: "Conveyancers",
  conveyancers: "Conveyancers",
  "building-pest": "Building & Pest",
  "building-and-pest": "Building & Pest",
};

export const getCategoryById = (id?: string) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

export const getCategoryByResultType = (resultType?: string) =>
  CATEGORIES.find((c) => c.resultType === resultType);
