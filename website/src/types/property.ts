export interface Property {
  id: string | number;
  title: string;
  address: string;
  location: string;
  image: string;
  price?: number;
  pricingType?: "fixed" | "estimated" | null;
  priceMin?: number | null;
  priceMax?: number | null;
  beds?: number;
  baths?: number;
  cars?: number;
  sqm?: number;
  areaUnit?: "sqm" | "sqft" | null;
  carpetArea?: number | null;
  carpetAreaUnit?: "sqm" | "sqft" | null;
  landArea?: number | null;
  landAreaUnit?: "sqm" | "sqft" | null;
  floorAreaUnit?: "sqm" | "sqft" | null;
  amenities?: Array<{ name: string; slug?: string; quantity?: number | null; value_type?: "boolean" | "number" }>;
  
  posterName: string;
  posterAvatar: string;
  badge: string;
  purpose?: "SELL" | "RENT" | "BOTH" | null;
  transactionStatus?: "BUY" | "LEASE" | "SOLD" | "LEASED" | null;
  isAuction?: boolean;
  propertyCategory?: string | null;
  propertyType?: string | null;
  lat: number;
  lng: number;
  isFavourite: boolean;
}
