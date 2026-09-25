export type FilterTab =
  | "Buy"
  | "Rent"
  | "Lease"
  | "Sold"
  | "Leased"
  | "Builders"
  | "Agents"
  | "Traders"
  | "Landscappers"
  | "Concreter"
  | "Fencing"
  | "Mortgage Brokers"
  | "Conveyancers"
  | "Building and Pest";

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
