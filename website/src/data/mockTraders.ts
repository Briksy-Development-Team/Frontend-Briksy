import type { Trader } from "../types/trader";
import Ava from "../assets/place holder/serviceholder.svg";
import Bg from "../assets/place holder/builderbg.svg";

export const mockTraders: Trader[] = [
  { id: 1, name: "James Wilson", tagLine: "Trusted Local Expert", role: "Electrician", category: "Electricians", location: "Richmond, VIC", avatar: Ava, bannerImage: Bg, rating: 4.8, reviews: 156, tags: ["Residential", "Commercial", "Solar"] },
  { id: 2, name: "Olivia Taylor", tagLine: "Premium Design Solutions", role: "Architect", category: "Architects", location: "Bondi, NSW", avatar: Ava, bannerImage: Bg, rating: 4.9, reviews: 203, tags: ["New Builds", "Extensions", "Permits"] },
  { id: 3, name: "Liam Anderson", tagLine: "Fast & Reliable", role: "Electrician", category: "Electricians", location: "South Brisbane, QLD", avatar: Ava, bannerImage: Bg, rating: 4.7, reviews: 97, tags: ["EV Chargers", "Switchboards", "LED"] },
  { id: 4, name: "Charlotte Brown", tagLine: "Building Better Spaces", role: "Plumber", category: "Plumbers", location: "Parramatta, NSW", avatar: Ava, bannerImage: Bg, rating: 4.8, reviews: 141, tags: ["Hot Water", "Drainage", "Gas"] },
  { id: 5, name: "Noah Harris", tagLine: "Quality Work Guaranteed", role: "Plumber", category: "Plumbers", location: "Fremantle, WA", avatar: Ava, bannerImage: Bg, rating: 4.6, reviews: 112, tags: ["Emergency", "Renovations", "Leaks"] },
  { id: 6, name: "Amelia White", tagLine: "Creative Outdoor Living", role: "Landscaper", category: "Landscapers", location: "Glenelg, SA", avatar: Ava, bannerImage: Bg, rating: 4.9, reviews: 184, tags: ["Gardens", "Decking", "Irrigation"] },
  { id: 7, name: "Ethan Martin", tagLine: "Property Maintenance Specialists", role: "Handyman", category: "Locksmiths", location: "St Kilda, VIC", avatar: Ava, bannerImage: Bg, rating: 4.5, reviews: 76, tags: ["Repairs", "Painting", "Assembly"] },
  { id: 8, name: "Sophie Walker", tagLine: "Professional Painting Services", role: "Painter", category: "Painters", location: "Canberra, ACT", avatar: Ava, bannerImage: Bg, rating: 4.8, reviews: 129, tags: ["Interior", "Exterior", "Rendering"] },
  { id: 9, name: "Jack Thompson", tagLine: "Flooring Specialists", role: "Flooring Contractor", category: "Flooring", location: "Docklands, VIC", avatar: Ava, bannerImage: Bg, rating: 4.7, reviews: 88, tags: ["Timber", "Tiles", "Carpet"] },
  { id: 10, name: "Grace Evans", tagLine: "Modern Kitchen Experts", role: "Tiler", category: "Tilers", location: "New Farm, QLD", avatar: Ava, bannerImage: Bg, rating: 4.9, reviews: 167, tags: ["Kitchen", "Bathroom", "Outdoor"] },
  { id: 11, name: "Ryan Clark", tagLine: "Solar Energy Specialists", role: "Solar Installer", category: "Solar Installers", location: "Gold Coast, QLD", avatar: Ava, bannerImage: Bg, rating: 4.8, reviews: 210, tags: ["Panels", "Battery", "EV Charging"] },
  { id: 12, name: "Zoe Mitchell", tagLine: "Clean & Green Solutions", role: "Cleaner", category: "Cleaners", location: "Northbridge, WA", avatar: Ava, bannerImage: Bg, rating: 4.6, reviews: 95, tags: ["End of Lease", "Deep Clean", "Office"] },
];
