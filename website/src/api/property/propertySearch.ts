import type { BuyFilters } from "../../components/filter/filterTypes";

export type PropertySearchParams = {
  purpose?: "sell" | "rent";
  category?: "residential" | "commercial";
  search?: string;
  suburb?: string;
  postcode?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  car_spaces?: number;
  min_land_size?: number;
  max_land_size?: number;
  features?: string[];
  page?: number;
};

const positive = (value: number | undefined) => value && value > 0 ? value : undefined;
const queryNumber = (query: URLSearchParams, key: string) => {
  if (!query.has(key)) return undefined;
  const value = Number(query.get(key));
  return Number.isFinite(value) ? value : undefined;
};

export const filtersToPropertyParams = (filters: BuyFilters): PropertySearchParams => ({
  search: filters.keyword.trim() || undefined,
  min_price: positive(filters.priceMin),
  max_price: positive(filters.priceMax),
  bedrooms: positive(filters.bedrooms),
  bathrooms: positive(filters.bathrooms),
  car_spaces: positive(filters.carSpaces),
  min_land_size: positive(filters.landSizeMin),
  max_land_size: positive(filters.landSizeMax),
  features: filters.features.map((feature) => ({
    Pool: "swimming_pool",
    "Air conditioning": "air_conditioning",
    "Solar panels": "solar_panels",
    Study: "study",
    "Pet-friendly": "pet_friendly",
  } as Record<string, string>)[feature]).filter(Boolean),
  category: filters.propertyTypes.includes("Commercial") ? "commercial" : filters.propertyTypes.length ? "residential" : undefined,
});

export const propertyParamsToQuery = (params: PropertySearchParams) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => query.append(`${key}[]`, String(item)));
    else if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return query;
};

export const propertyQueryToParams = (query: URLSearchParams): PropertySearchParams => ({
  purpose: query.get("purpose") === "rent" ? "rent" : query.get("purpose") === "sell" ? "sell" : undefined,
  category: query.get("category") === "commercial" ? "commercial" : query.get("category") === "residential" ? "residential" : undefined,
  search: query.get("q") || query.get("search") || undefined,
  suburb: query.get("suburb") || undefined,
  postcode: query.get("postcode") || undefined,
  min_price: queryNumber(query, "min_price"),
  max_price: queryNumber(query, "max_price"),
  bedrooms: queryNumber(query, "bedrooms"),
  bathrooms: queryNumber(query, "bathrooms"),
  car_spaces: queryNumber(query, "car_spaces"),
  min_land_size: queryNumber(query, "min_land_size"),
  max_land_size: queryNumber(query, "max_land_size"),
  features: query.getAll("features[]").length ? query.getAll("features[]") : query.getAll("features"),
  page: query.has("page") ? Math.max(1, Number(query.get("page")) || 1) : 1,
});
