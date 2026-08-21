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
}
