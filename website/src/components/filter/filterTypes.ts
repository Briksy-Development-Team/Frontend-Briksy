export type FilterTab =
  | "All"
  | "Buy"
  | "Rent"
  | "Sold"
  | "Real Estate Agents"
  | "Buyer Agents"
  | "Landscapers"
  | "Concreter"
  | "Fencing"
  | "Mortgage Brokers"
  | "Conveyancers"
  | "Building & Pest";

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
