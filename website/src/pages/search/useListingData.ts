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
import { serviceSlugForLabel } from "../../constants/serviceCategories";

const isPropertyType = (resultType: ResultType) =>
  resultType === "property" || resultType === "comercial";

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

export function useListingData(
  resultType: ResultType,
  filter = "",
  tab: FilterTab | null = null,
  section: "popular" | "newly" = "popular",
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [searchParams] = useResultSearchParams();
  const organizationSlug = searchParams.get("organization_slug") || undefined;

  useEffect(() => {
    if (isPropertyType(resultType)) {
      getProperties({
        verified_only: 1,
        purpose: resultType === "comercial" ? undefined : purposeFor(tab),
        transaction_status: resultType === "comercial" ? transactionStatusFor(tab) : undefined,
        search: filter || undefined,
        organization_slug: organizationSlug,
        ...(section === "newly" ? { sort: "created_at", direction: "desc" } : {}),
      })
        .then((res) => setItems(res.data.map(propertyToCard)))
        .catch(console.error);
      return;
    }

    getOrganizations({
      type: organizationTypeFor(resultType, tab),
      service_slug:
        resultType === "trader"
          ? serviceSlugForLabel(tab || "") || (filter ? slugify(filter) : undefined)
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
      .catch(console.error);
  }, [resultType, filter, tab, section, organizationSlug]);

  return items;
}
