import { useEffect, useState } from "react";
import type { ResultType } from "../../types/search";
import { getOrganizations } from "../../api/seeker/organization.api";
import { getProperties } from "../../api/property/property.api";
import { organizationToBuilder, organizationToTrader, propertyToCard } from "../../api/public.mappers";

const isPropertyType = (resultType: ResultType) =>
  resultType === "property" || resultType === "comercial";

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");


export function useListingData(resultType: ResultType, filter = "") {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {    if (isPropertyType(resultType)) {
      getProperties({
        verified_only: 1,
        search: filter || (resultType === "comercial" ? "rent" : undefined),
      })
        .then((res) => setItems(res.data.map(propertyToCard)))
        .catch(console.error);
      return;
    }

    getOrganizations({
      type: resultType === "builder" ? "builders" : "trades-professionals",
      service_slug: resultType === "trader" && filter ? slugify(filter) : undefined,
      verified_only: 1,
    })
      .then((res) => {
        setItems(resultType === "builder"
          ? res.data.map(organizationToBuilder)
          : res.data.map(organizationToTrader));
      })
      .catch(console.error);
  }, [resultType, filter]);

  return items;
}