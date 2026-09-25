import type { ResultType } from "../../types/search";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LISTING_DISPLAY: Record<
  ResultType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { popularTitle: string; newlyTitle: string; Card: React.ComponentType<{ item: any }> }
> = {
  all: {
    popularTitle: "Popular Listings",
    newlyTitle: "Newly Listed Listings",
    Card: PropertyGridCard,
  },
  trader: {
    popularTitle: "Popular Professionals",
    newlyTitle: "Newly Listed Professionals",
    Card: TraderGridCard,
  },
  builder: {
    popularTitle: "Popular Builders",
    newlyTitle: "Newly Listed Builders",
    Card: BuilderGridCard,
  },
  comercial: {
    popularTitle: "Popular Commercial Properties",
    newlyTitle: "Newly Listed Commercial Properties",
    Card: PropertyGridCard,
  },
  property: {
    popularTitle: "Popular Properties",
    newlyTitle: "Newly Listed Properties",
    Card: PropertyGridCard,
  },
};
