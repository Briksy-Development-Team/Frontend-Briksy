import type { PriceRangeTab } from "./primitives/PriceRange";

/* ─── field type definitions ─── */

type FieldBase = {
  key: string;
  label: string;
};

export type CheckboxField = FieldBase & {
  type: "checkbox";
  options: string[];
};

export type RangeField = FieldBase & {
  type: "range";
  minKey: string;
  maxKey: string;
  tabs: PriceRangeTab[];
  step?: number;
  bucketCount?: number;
};

export type MinMaxField = FieldBase & {
  type: "minMax";
  minKey: string;
  maxKey?: string;
};

export type InputField = FieldBase & {
  type: "input";
  placeholder?: string;
  hint?: string;
};

export type FilterField = CheckboxField | RangeField | MinMaxField | InputField;


const PROPERTY_TYPES = [
  "House", "Apartment", "Townhouse", "Land",
  "Acreage", "Villa", "Duplex", "Rural",
  "Block of Units", "Retirement Living", "Commercial",
];



const MOCK_PRICES = Array.from({ length: 200 }, () =>
  Math.round(50_000 + Math.random() * 2_450_000),
);

const PRICE_RANGE_TABS: PriceRangeTab[] = [
  { id: "all", label: "All", prices: MOCK_PRICES, min: 0, max: 2_500_000 },
];


const PROPERTY_FIELDS: FilterField[] = [
  { key: "propertyTypes", label: "Property Type", type: "checkbox", options: PROPERTY_TYPES },
  { key: "price", label: "Price", type: "range", minKey: "priceMin", maxKey: "priceMax", tabs: PRICE_RANGE_TABS, step: 50, bucketCount: 42 },
  { key: "bathrooms", label: "Bathrooms", type: "minMax", minKey: "bathMin", maxKey: "bathMax" },
  { key: "carSpaces", label: "Car spaces", type: "minMax", minKey: "carMin",maxKey: "carMax" },
  { key: "keyword", label: "Keywords", type: "input", placeholder: "Air con, pool, solar, etc.", hint: "Add specific property features to your search" },
];

const SOLD_FIELDS: FilterField[] = [
  { key: "propertyTypes", label: "Property Type", type: "checkbox", options: PROPERTY_TYPES },
  { key: "price", label: "Sold Price", type: "range", minKey: "soldPriceMin", maxKey: "soldPriceMax", tabs: PRICE_RANGE_TABS, step: 50, bucketCount: 42 },
  { key: "bathrooms", label: "Bathrooms", type: "minMax", minKey: "bathMin", maxKey: "bathMax" },
  { key: "carSpaces", label: "Car spaces", type: "minMax", minKey: "carMin" },
  { key: "keyword", label: "Keywords", type: "input", placeholder: "Air con, pool, solar, etc.", hint: "Add specific property features to your search" },
];

const ORG_FIELDS: FilterField[] = [
  { key: "price", label: "Price", type: "range", minKey: "priceMin", maxKey: "priceMax", tabs: PRICE_RANGE_TABS, step: 50, bucketCount: 42 },
  { key: "bathrooms", label: "Bathrooms", type: "minMax", minKey: "bathMin", maxKey: "bathMax" },
  { key: "carSpaces", label: "Car spaces", type: "minMax", minKey: "carMin" },
  { key: "keyword", label: "Keywords", type: "input", placeholder: "Search builders, agents, traders...", hint: "Search by name, service, or location" },
];


export type FilterMode = "Buy" | "Rent" | "Lease" | "Sold" | "Leased" | "Builders" | "Agents" | "Traders" | "Landscappers" | "Concreter" | "Fencing" | "Mortgage Brokers" | "Conveyancers" | "Building and Pest";

export const getFieldsForMode = (mode: FilterMode): FilterField[] => {
  switch (mode) {
    case "Buy":
    case "Rent":
    case "Lease":
    case "Leased":
      return PROPERTY_FIELDS;
    case "Sold":
      return SOLD_FIELDS;
    case "Builders":
    case "Agents":
    case "Traders":
    case "Landscappers":
    case "Concreter":
    case "Fencing":
    case "Mortgage Brokers":
    case "Conveyancers":
    case "Building and Pest":
      return ORG_FIELDS;
  }
};
