export type FilterTab = string;

export type BuyFilters = {
  keyword: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  carSpaces?: number;
  landSizeMin?: number;
  landSizeMax?: number;
  features: string[];
  propertyTypes: string[];
};
