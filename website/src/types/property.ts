export interface Property {
  id: number;
  title: string;
  address: string;
  location: string;
  image: string;
  price: number;
  beds: number;
  baths: number;
  sqm: number;
  
  posterName: string;
  posterAvatar: string;
  badge: string;
  lat: number;
  lng: number;
  isFavourite: boolean;
}
