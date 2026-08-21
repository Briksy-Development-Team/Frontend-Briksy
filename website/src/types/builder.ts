export interface Builder {
  id: number;
  name: string;
  location: string;
  avatar: string;
  bannerImage: string;
  rating: number;
  reviews: number;
  tags: string[];
  establishedYear: number;
  isFavourite: boolean;
}
