export interface Property {
  id: string | number;
  title: string;
  address: string;
  location: string;
  image: string;
  price?: number;
  beds?: number;
  baths?: number;
  sqm?: number;
  
  posterName: string;
  posterAvatar: string;
  badge: string;
  purpose?: "SELL" | "RENT" | "BOTH" | null;
  propertyType?: string | null;
  lat: number;
  lng: number;
  isFavourite: boolean;
}
