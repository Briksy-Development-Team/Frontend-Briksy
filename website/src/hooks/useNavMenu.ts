import Randomone from "../assets/navbar/randomone.svg";
import Randomtwo from "../assets/navbar/Randomtwo.svg";
import { useAgentTypes, useServiceCategories } from "./useTaxonomy";
import { SEARCH_CATEGORIES } from "../constants/searchCategories";

export type NavLink = { label: string; to: string };
export type NavCard = NavLink & { bg: string };
export type NavItem = NavLink & { children: NavLink[]; cards: NavCard[] };

const realEstateLinks: NavLink[] = (SEARCH_CATEGORIES.find((c) => c.id === "real-estate")?.propTypes ?? []).map((p) => ({
  label: p.label,
  to: p.id === "all" ? "/result?type=all" : `/${encodeURIComponent(p.id)}`,
}));

const commercialLinks: NavLink[] = (SEARCH_CATEGORIES.find((c) => c.id === "commercial")?.propTypes ?? []).map((p) => ({
  label: p.label,
  to: p.id === "all" ? "/commercials" : `/commercials?tab=${encodeURIComponent(p.id)}`,
}));

const item = (label: string, to: string, children: NavLink[] = [], cards: NavCard[] = []): NavItem => ({
  label,
  to,
  children,
  cards,
});

export const useNavMenu = (): NavItem[] => {
  const { data: agentTypes = [] } = useAgentTypes();
  const { data: categories = [] } = useServiceCategories();

  return [
    item("Real Estate", "/result?type=all", realEstateLinks, [
      { label: "Find Real Estate", to: "/result?type=all", bg: Randomone },
      { label: "List Your Property", to: "/subs", bg: Randomtwo },
    ]),
    item("Auctions", "/auctions"),
    item(
      "Agents",
      "/agents",
      agentTypes.map((t) => ({ label: t.label, to: `/agents?tab=${encodeURIComponent(t.slug)}` })),
      [
        { label: "Find an Agent", to: "/agents", bg: Randomone },
        { label: "List Your Business", to: "/subs", bg: Randomtwo },
      ],
    ),
    item("Builders", "/builders"),
    item(
      "Trades & Professionals",
      "/professionals",
      categories.map((c) => ({
        label: c.label,
        to: `/professionals?tab=${encodeURIComponent(c.slug)}&service_slug=${encodeURIComponent(c.slug)}`,
      })),
      [
        { label: "Find a Professional", to: "/professionals", bg: Randomone },
        { label: "List Your Business", to: "/subs", bg: Randomtwo },
      ],
    ),
    item("Commercials", "/commercials", commercialLinks, [
      { label: "Find Commercial Property", to: "/commercials", bg: Randomone },
      { label: "List Your Property", to: "/subs", bg: Randomtwo },
    ]),
  ];
};
