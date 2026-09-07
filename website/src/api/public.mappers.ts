import type { Builder } from "../types/builder";
import type { Property } from "../types/property";
import type { Trader } from "../types/trader";
import type { PublicOrganization, PublicProperty } from "./public.api";
import BusinessPlaceholder from "../assets/place holder/bussinessholder.svg";
import ServicePlaceholder from "../assets/place holder/serviceholder.svg";
import BuilderBackground from "../assets/place holder/builderbg.svg";
import PropertyPlaceholder from "../assets/place holder/propertyimages.svg";

const locationOf = (o: PublicOrganization) => [o.address, o.state, o.postcode].filter(Boolean).join(", ") || "Australia";
const tagsOf = (o: PublicOrganization) => (o.services ?? []).slice(0, 5).map((s) => s.name);

export const organizationToBuilder = (o: PublicOrganization): Builder => ({
  id: o.id, name: o.name, location: locationOf(o), avatar: BusinessPlaceholder, bannerImage: BuilderBackground,
  rating: o.rating || 0, reviews: 0, tags: tagsOf(o), establishedYear: 0, isFavourite: false,
});

export const organizationToTrader = (o: PublicOrganization): Trader => ({
  id: o.id, name: o.name, tagLine: o.services?.[0]?.name || "Trusted property professional",
  role: o.type?.name || "Professional", category: o.services?.[0]?.name, location: locationOf(o),
  avatar: ServicePlaceholder, bannerImage: BuilderBackground, rating: o.rating || 0, reviews: 0,
  tags: tagsOf(o), isFavourite: false,
});

export const propertyToCard = (p: PublicProperty): Property => ({
  id: p.id, title: p.title, address: p.full_address || p.address || "Australia",
  location: [p.location.suburb, p.location.postcode].filter(Boolean).join(", "),
  image: p.media?.find((m) => m.is_primary)?.url || p.media?.[0]?.url || PropertyPlaceholder,
  price: 0, beds: p.bedroom_option === "studio" ? 0 : Number(p.bedroom_option?.replace("_plus", "+") || 0),
  baths: p.bathroom_option === "3_plus" ? 3 : Number(p.bathroom_option || 0), sqm: p.floor_area_sqm || 0, posterName: p.organization?.name || "Briksy member",
  posterAvatar: BusinessPlaceholder, badge: p.status || "Verified listing", lat: p.location.latitude || 0,
  lng: p.location.longitude || 0, isFavourite: false,
});
