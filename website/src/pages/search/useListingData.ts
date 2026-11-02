import { useEffect, useState } from "react";
import type { ResultType } from "../../types/search";
import type { FilterTab } from "../../components/filter/filterTypes";
import { getOrganizations } from "../../api/seeker/organization.api";
import { getProperties } from "../../api/property/property.api";
import {
  organizationToBuilder,
  organizationToTrader,
  propertyToCard,
} from "../../api/public.mappers";
import { useResultSearchParams } from "./useResultSearchParams";
import { serviceSlugForLabel } from "../../constants/categories";

const isPropertyType = (resultType: ResultType) =>
  resultType === "property" || resultType === "commercial" || resultType === "auction";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "");

const organizationTypeFor = (
  resultType: ResultType,
  tab?: FilterTab | null,
) => {
  if (resultType === "builder" && tab === "Agents") return "buyers-agent";
  if (resultType === "builder" && tab === "real-estate") return "real-estate-agent";
  if (resultType === "builder" && tab) return tab;
  if (resultType === "builder") return "builders";
  return "trades-professionals";
};

const purposeFor = (tab?: FilterTab | null) => {
  if (tab === "Buy") return "sell";
  if (tab === "Rent") return "rent";
  return undefined;
};

const transactionStatusFor = (tab?: FilterTab | null) =>
  tab && ["Buy", "Lease", "Sold", "Leased"].includes(tab)
    ? tab.toUpperCase() as "BUY" | "LEASE" | "SOLD" | "LEASED"
    : undefined;

export function useListingDataWithLoading(
  resultType: ResultType,
  filter = "",
  tab: FilterTab | null = null,
  section: "popular" | "newly" = "popular",
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams] = useResultSearchParams();
  const organizationSlug = searchParams.get("organization_slug") || undefined;
  const serviceSlugParam = searchParams.get("service_slug") || undefined;

  useEffect(() => {
    setItems([]);
    setIsLoading(true);
    if (isPropertyType(resultType)) {
      getProperties({
        verified_only: 1,
        category: resultType === "commercial" ? "commercial" : undefined,
        purpose: resultType === "commercial" ? undefined : purposeFor(tab),
        transaction_status: resultType === "commercial" || resultType === "property" ? transactionStatusFor(tab) : undefined,
        auction_only: resultType === "auction" ? 1 : undefined,
        search: filter || undefined,
        organization_slug: organizationSlug,
        ...(section === "newly" ? { sort: "created_at", direction: "desc" } : {}),
      })
        .then((res) => setItems(res.data.map(propertyToCard)))
        .catch(console.error)
        .finally(() => setIsLoading(false));
      return;
    }

    getOrganizations({
      type: searchParams.get("agent_type") || organizationTypeFor(resultType, tab),
      service_slug:
        resultType === "trader"
          ? serviceSlugParam || serviceSlugForLabel(tab || "") || (filter ? slugify(filter) : undefined)
          : undefined,
      verified_only: 1,
      ...(section === "newly" ? { sort: "created_at", direction: "desc" } : {}),
    })
      .then((res) => {
        if (resultType === "builder") {
          setItems(res.data.map(organizationToBuilder));
          return;
        }

        setItems(res.data.map(organizationToTrader));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [resultType, filter, tab, section, organizationSlug, serviceSlugParam, searchParams.toString()]);

  return { items, isLoading };
}

export function useListingData(
  resultType: ResultType,
  filter = "",
  tab: FilterTab | null = null,
  section: "popular" | "newly" = "popular",
) {
  const { items } = useListingDataWithLoading(resultType, filter, tab, section);
  return items;
}
