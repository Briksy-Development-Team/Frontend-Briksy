export interface Trader {
  id: number;
  name: string;
  tagLine: string;
  bannerImage: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  reviews: number;
  tags: string[];
  isFavourite?: boolean;
  category?: string; // matches subcategory items in MegaMenu e.g. "Electricians"
}
