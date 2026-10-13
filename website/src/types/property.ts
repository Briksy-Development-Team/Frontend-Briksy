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
  sqm?: number;
  
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
