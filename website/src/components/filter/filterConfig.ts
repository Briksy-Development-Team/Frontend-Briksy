import type { PriceRangeTab } from "./primitives/PriceRange";

import { Building2, Home, Landmark, Factory, Warehouse, Trees, Castle, Tent } from "lucide-react";

/* ─── field type definitions ─── */

type FieldBase = {
  key: string;
  label: string;
  column?: "left" | "right";
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

export type GridSelectField = FieldBase & {
  type: "gridSelect";
  options: { id: string; label: string; icon: any }[];
  multiSelect?: boolean;
};

export type PillSelectField = FieldBase & {
  type: "pillSelect";
  options: { id: string; label: string }[];
  multiSelect?: boolean;
};

export type SingleCheckboxField = FieldBase & {
  type: "singleCheckbox";
};

export type ToggleField = FieldBase & {
  type: "toggle";
};

export type FilterField = CheckboxField | RangeField | MinMaxField | InputField | GridSelectField | PillSelectField | SingleCheckboxField | ToggleField;


const PROPERTY_TYPES_GRID = [
  { id: "apartment", label: "Apartment", icon: Building2 },
  { id: "villa", label: "Villa", icon: Home },
  { id: "duplex", label: "Duplex", icon: Castle },
  { id: "townhouse", label: "Townhouse", icon: Home },
  { id: "penthouse", label: "Penthouse", icon: Landmark },
  { id: "studio", label: "Studio", icon: Tent },
  { id: "land", label: "Land / Plot", icon: Trees },
  { id: "office", label: "Office", icon: Building2 },
  { id: "warehouse", label: "Warehouse", icon: Warehouse },
  { id: "industrial", label: "Industrial", icon: Factory },
];

const BEDROOM_OPTIONS = [
  { id: "any", label: "Any" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5+", label: "5+" },
];

const BATHROOM_OPTIONS = [
  { id: "any", label: "Any" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3+", label: "3+" },
];

const CAR_SPACE_OPTIONS = [
  { id: "any", label: "Any" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3+", label: "3+" },
];

const SOLD_WITHIN_OPTIONS = [
  { id: "30", label: "30 days" },
  { id: "90", label: "90 days" },
  { id: "180", label: "6 months" },
  { id: "365", label: "12 months" },
  { id: "730", label: "2 years" },
];

const MOCK_PRICES = Array.from({ length: 200 }, () =>
  Math.round(50_000 + Math.random() * 2_450_000),
);

const PRICE_RANGE_TABS: PriceRangeTab[] = [
  { id: "all", label: "All", prices: MOCK_PRICES, min: 0, max: 2_500_000 },
];

const PROPERTY_FIELDS: FilterField[] = [
  { key: "propertyTypes", label: "Property Type", type: "gridSelect", options: PROPERTY_TYPES_GRID, multiSelect: true, column: "left" },
  { key: "price", label: "Price", type: "range", minKey: "priceMin", maxKey: "priceMax", tabs: PRICE_RANGE_TABS, step: 50, bucketCount: 42, column: "right" },
  { key: "showPriceOnly", label: "Only show properties with price", type: "singleCheckbox", column: "right" },
  { key: "bedrooms", label: "Bedroom", type: "pillSelect", options: BEDROOM_OPTIONS, column: "right" },
  { key: "bathrooms", label: "Bathrooms", type: "pillSelect", options: BATHROOM_OPTIONS, column: "right" },
  { key: "carSpaces", label: "Car spaces", type: "pillSelect", options: CAR_SPACE_OPTIONS, column: "right" },
  { key: "landSize", label: "Land Size *(m²)*", type: "minMax", minKey: "landSizeMin", maxKey: "landSizeMax", column: "right" },
  { key: "keyword", label: "Keywords", type: "input", placeholder: "Air con, pool, solar, etc.", hint: "Add specific property features to your search", column: "right" },
];

const SOLD_FIELDS: FilterField[] = [
  { key: "propertyTypes", label: "Property Type", type: "gridSelect", options: PROPERTY_TYPES_GRID, multiSelect: true, column: "left" },
  { key: "price", label: "Sold Price", type: "range", minKey: "soldPriceMin", maxKey: "soldPriceMax", tabs: PRICE_RANGE_TABS, step: 50, bucketCount: 42, column: "right" },
  { key: "soldWithin", label: "Sold within", type: "pillSelect", options: SOLD_WITHIN_OPTIONS, column: "right" },
  { key: "bedrooms", label: "Bedroom", type: "pillSelect", options: BEDROOM_OPTIONS, column: "right" },
  { key: "bathrooms", label: "Bathrooms", type: "pillSelect", options: BATHROOM_OPTIONS, column: "right" },
  { key: "carSpaces", label: "Car spaces", type: "pillSelect", options: CAR_SPACE_OPTIONS, column: "right" },
  { key: "landSize", label: "Land Size *(m²)*", type: "minMax", minKey: "landSizeMin", maxKey: "landSizeMax", column: "right" },
  { key: "keyword", label: "Keywords", type: "input", placeholder: "Air con, pool, solar, etc.", hint: "Add specific property features to your search", column: "right" },
];

const ORG_FIELDS: FilterField[] = [
  { key: "propertyTypes", label: "Property Type", type: "gridSelect", options: PROPERTY_TYPES_GRID, multiSelect: true, column: "left" },
  { key: "keyword", label: "Keywords", type: "input", placeholder: "Search builders, agents, traders...", hint: "Search by name, service, or location", column: "right" },
  { key: "languages", label: "Languages spoken", type: "input", placeholder: "e.g. Mandarin, Vietnamese, Greek", column: "right" },
  { key: "verified", label: "Verified only", type: "toggle", column: "right" },
  { key: "accepting", label: "Currently accepting new listings", type: "toggle", column: "right" },
];


export type FilterMode = string;

export const getFieldsForMode = (mode: FilterMode): FilterField[] => {
  switch (mode) {
    case "All":
    case "Buy":
    case "Rent":
      return PROPERTY_FIELDS;
    case "Sold":
      return SOLD_FIELDS;
    case "Real Estate Agents":
    case "Buyer Agents":
    case "Landscapers":
    case "Concreter":
    case "Fencing":
    case "Mortgage Brokers":
    case "Conveyancers":
    case "Building & Pest":
      return ORG_FIELDS;
    default:
      return ORG_FIELDS;
  }
};
