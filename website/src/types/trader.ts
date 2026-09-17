export interface Trader {
  id: string | number;
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
  favoriteId?: string;
  category?: string;
}
