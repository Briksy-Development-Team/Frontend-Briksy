import type { PriceRangeTab } from "./primitives/PriceRange";
import { SEARCH_CATEGORIES } from "../../constants/searchCategories";

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

const WEEKLY_PRICE_RANGE_TABS: PriceRangeTab[] = [
  { id: "all", label: "All", prices: Array.from({ length: 100 }, () => Math.round(200 + Math.random() * 1800)), min: 0, max: 2000 },
];


export type FilterMode = string;

export const getFieldsForMode = (mode: FilterMode, subCategory: string = "all"): FilterField[] => {
  const category = SEARCH_CATEGORIES.find(c => c.id === mode);
  const typeOptions = category?.propTypes.map(p => ({ id: p.id, label: p.label })) || [];

  const typeLabel = mode === "real-estate" ? "Real Estate For" :
                    mode === "commercial" ? "Commercial For" :
                    mode === "builders" ? "Builder Type" :
                    mode === "traders" ? "Trade Type" : "Professional Type";

  const typeField: PillSelectField = { 
    key: "propertyFor", 
    label: typeLabel, 
    type: "pillSelect", 
    options: typeOptions, 
    column: "right" 
  };

  switch (mode) {
    case "real-estate": {
      const isRent = subCategory === "rent";
      const isSold = subCategory === "sold";
      const priceLabel = isSold ? "Sold Price" : isRent ? "Weekly Rent" : "Price";
      const priceTabs = isRent ? WEEKLY_PRICE_RANGE_TABS : PRICE_RANGE_TABS;
      const priceStep = isRent ? 10 : 50;

      const fields: FilterField[] = [
        { key: "propertyTypes", label: "Real Estate Type", type: "gridSelect", options: PROPERTY_TYPES_GRID, multiSelect: true, column: "left" },
        typeField,
        { key: "price", label: priceLabel, type: "range", minKey: "priceMin", maxKey: "priceMax", tabs: priceTabs, step: priceStep, bucketCount: 42, column: "right" },
        { key: "showPriceOnly", label: "Only show real estate with price", type: "singleCheckbox", column: "right" },
        { key: "bedrooms", label: "Bedroom", type: "pillSelect", options: BEDROOM_OPTIONS, column: "right" },
        { key: "bathrooms", label: "Bathrooms", type: "pillSelect", options: BATHROOM_OPTIONS, column: "right" },
        { key: "carSpaces", label: "Car spaces", type: "pillSelect", options: CAR_SPACE_OPTIONS, column: "right" },
        { key: "landSize", label: "Land Size *(m²)*", type: "minMax", minKey: "landSizeMin", maxKey: "landSizeMax", column: "right" },
        { key: "keyword", label: "Keywords", type: "input", placeholder: "Air con, pool, solar, etc.", column: "right" },
      ];
      
      if (isSold) {
        fields.splice(3, 0, { key: "soldWithin", label: "Sold within", type: "pillSelect", options: SOLD_WITHIN_OPTIONS, column: "right" });
      }
      return fields;
    }
    
    case "commercial": {
      const isLease = subCategory === "lease" || subCategory === "leased";
      const isSold = subCategory === "sold" || subCategory === "leased";
      const priceLabel = isSold ? "Sold/Leased Price" : isLease ? "Lease Price" : "Price";
      const priceTabs = isLease ? WEEKLY_PRICE_RANGE_TABS : PRICE_RANGE_TABS;
      const priceStep = isLease ? 10 : 50;

      const fields: FilterField[] = [
        { key: "propertyTypes", label: "Commercial Type", type: "gridSelect", options: PROPERTY_TYPES_GRID.filter(t => ["office", "warehouse", "industrial", "land", "studio"].includes(t.id)), multiSelect: true, column: "left" },
        typeField,
        { key: "price", label: priceLabel, type: "range", minKey: "priceMin", maxKey: "priceMax", tabs: priceTabs, step: priceStep, bucketCount: 42, column: "right" },
        { key: "showPriceOnly", label: "Only show commercial with price", type: "singleCheckbox", column: "right" },
        { key: "carSpaces", label: "Car spaces", type: "pillSelect", options: CAR_SPACE_OPTIONS, column: "right" },
        { key: "landSize", label: "Land Size *(m²)*", type: "minMax", minKey: "landSizeMin", maxKey: "landSizeMax", column: "right" },
        { key: "keyword", label: "Keywords", type: "input", placeholder: "Retail, high clearance, etc.", column: "right" },
      ];

      if (isSold) {
        fields.splice(3, 0, { key: "soldWithin", label: "Sold/Leased within", type: "pillSelect", options: SOLD_WITHIN_OPTIONS, column: "right" });
      }
      return fields;
    }

    case "builders":
      return [
        { key: "propertyTypes", label: "Specializes In", type: "gridSelect", options: PROPERTY_TYPES_GRID.filter(t => ["apartment", "villa", "duplex", "townhouse", "penthouse", "studio"].includes(t.id)), multiSelect: true, column: "left" },
        typeField,
        { key: "price", label: "Project Budget", type: "range", minKey: "priceMin", maxKey: "priceMax", tabs: PRICE_RANGE_TABS, step: 50, bucketCount: 42, column: "right" },
        { key: "keyword", label: "Keywords", type: "input", placeholder: "Search by builder name or location", column: "right" },
        { key: "languages", label: "Languages spoken", type: "input", placeholder: "e.g. Mandarin, Vietnamese, Greek", column: "right" },
        { key: "verified", label: "Verified Builder", type: "toggle", column: "right" },
        { key: "accepting", label: "Currently accepting new projects", type: "toggle", column: "right" },
      ];

    case "traders":
      return [
        { key: "propertyTypes", label: "Works On", type: "gridSelect", options: PROPERTY_TYPES_GRID, multiSelect: true, column: "left" },
        typeField,
        { key: "keyword", label: "Keywords", type: "input", placeholder: "Search by trade name, service, or location", column: "right" },
        { key: "languages", label: "Languages spoken", type: "input", placeholder: "e.g. Mandarin, Vietnamese, Greek", column: "right" },
        { key: "emergency", label: "24/7 Emergency Service", type: "toggle", column: "right" },
        { key: "freeQuote", label: "Offers Free Quotes", type: "toggle", column: "right" },
        { key: "verified", label: "Verified Professional", type: "toggle", column: "right" },
      ];

    case "agents":
      return [
        { key: "propertyTypes", label: "Specializes In", type: "gridSelect", options: PROPERTY_TYPES_GRID, multiSelect: true, column: "left" },
        typeField,
        { key: "keyword", label: "Keywords", type: "input", placeholder: "Search by agent name, agency, or location", column: "right" },
        { key: "languages", label: "Languages spoken", type: "input", placeholder: "e.g. Mandarin, Vietnamese, Greek", column: "right" },
        { key: "verified", label: "Verified Agent", type: "toggle", column: "right" },
        { key: "accepting", label: "Currently taking new listings", type: "toggle", column: "right" },
      ];

    default:
      return [];
  }
};
