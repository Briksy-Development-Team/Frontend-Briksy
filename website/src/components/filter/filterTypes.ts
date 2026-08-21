
export const PRICE_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 250000, label: "$250k" },
  { value: 500000, label: "$500k" },
  { value: 750000, label: "$750k" },
  { value: 1000000, label: "$1M" },
  { value: 1250000, label: "$1.25M" },
  { value: 1500000, label: "$1.5M" },
  { value: 2000000, label: "$2M" },
  { value: 2500000, label: "$2.5M" },
  { value: 3000000, label: "$3M" },
  { value: 4000000, label: "$4M" },
  { value: 5000000, label: "$5M" },
  { value: 7500000, label: "$7.5M" },
  { value: 10000000, label: "$10M" },
  { value: 15000000, label: "$15M" },
  { value: 20000000, label: "$20M" },
  { value: 25000000, label: "$25M+" },
];

export const LAND_SIZE_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 200, label: "200 m²" },
  { value: 400, label: "400 m²" },
  { value: 600, label: "600 m²" },
  { value: 800, label: "800 m²" },
  { value: 1000, label: "1,000 m²" },
  { value: 1500, label: "1,500 m²" },
  { value: 2000, label: "2,000 m²" },
  { value: 3000, label: "3,000 m²" },
  { value: 5000, label: "5,000 m²" },
  { value: 10000, label: "1 ha" },
  { value: 20000, label: "2 ha" },
  { value: 50000, label: "5 ha" },
  { value: 100000, label: "10 ha+" },
];

export const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Townhouse",
  "Land",
  "Acreage",
  "Villa",
  "Duplex",
  "Rural",
  "Block of Units",
  "Commercial",
];

export type BuyFilters = {
  propertyTypes: string[];
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  landSizeMin: number;
  landSizeMax: number;
  listingStatus: string[];
  hasInspection: boolean;
  features: string[];
  keyword: string;
};

export const DEFAULT_BUY_FILTERS: BuyFilters = {
  propertyTypes: [],
  priceMin: 0,
  priceMax: 0,
  bedrooms: 0,
  bathrooms: 0,
  carSpaces: 0,
  landSizeMin: 0,
  landSizeMax: 0,
  listingStatus: [],
  hasInspection: false,
  features: [],
  keyword: "",
};

export type SoldFilters = {
  propertyTypes: string[];
  soldPriceMin: number;
  soldPriceMax: number;
  soldDateRange: "3m" | "6m" | "12m" | "";
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  landSizeMin: number;
  landSizeMax: number;
  daysOnMarketMin: number;
  daysOnMarketMax: number;
};

export const DEFAULT_SOLD_FILTERS: SoldFilters = {
  propertyTypes: [],
  soldPriceMin: 0,
  soldPriceMax: 0,
  soldDateRange: "",
  bedrooms: 0,
  bathrooms: 0,
  carSpaces: 0,
  landSizeMin: 0,
  landSizeMax: 0,
  daysOnMarketMin: 0,
  daysOnMarketMax: 180,
};

export type BuilderProfileFilters = {
  builderTypes: string[];
  serviceArea: string;
  projectTypes: string[];
  buildCostMin: number;
  buildCostMax: number;
  displayHome: boolean;
  verified: boolean;
  rating: number;
  houseStyles: string[];
};

export const DEFAULT_BUILDER_PROFILE_FILTERS: BuilderProfileFilters = {
  builderTypes: [],
  serviceArea: "",
  projectTypes: [],
  buildCostMin: 0,
  buildCostMax: 0,
  displayHome: false,
  verified: false,
  rating: 0,
  houseStyles: [],
};

export type AgentType = "real-estate" | "buyers";

export type AgentFiltersType = {
  location: string;
  rating: number;
  experienceMin: number;
  languages: string[];
  specializations: string[];
  
  agency: string;
  suburbSpecialist: boolean;
  
  feeStructure: string[];
  buyerTypes: string[];
  areasOfExpertise: string[];
};

export const DEFAULT_AGENT_FILTERS: AgentFiltersType = {
  location: "",
  rating: 0,
  experienceMin: 0,
  languages: [],
  specializations: [],
  agency: "",
  suburbSpecialist: false,
  feeStructure: [],
  buyerTypes: [],
  areasOfExpertise: [],
};

export type TradeFiltersType = {
  categories: string[];
  serviceArea: string;
  rating: number;
  verified: boolean;
  availableThisWeek: boolean;
  priceGuide: string[];
  responseTime: string[];
};

export const DEFAULT_TRADE_FILTERS: TradeFiltersType = {
  categories: [],
  serviceArea: "",
  rating: 0,
  verified: false,
  availableThisWeek: false,
  priceGuide: [],
  responseTime: [],
};

export type FilterTab = "Buy" | "Sold" | "Builders" | "Agents" | "Traders";
export type BuilderMode = "profiles" | "listings";
