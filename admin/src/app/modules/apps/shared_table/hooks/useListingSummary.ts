import { useEffect, useState } from "react";
import axiosInstance from "../../../../services/api/axiosInstance";
import { buildApiParams } from "../../../../services/utils/buildApiParams";
import type { QueryParams } from "../entity-list/types";
import type { SummaryCardItem } from "../entity-list/components/header/SummaryFilters";

export type ListingSummary = {
  endpoint: string;
  filterKey?: string;
  options?: readonly (string | { label: string; value: string })[];
  resetKeys?: readonly string[];
};

export function getSummaryFilters(filters: QueryParams["filters"], config: ListingSummary) {
  const remaining = { ...filters };
  for (const key of config.filterKey ? [config.filterKey] : config.resetKeys ?? []) {
    delete remaining[key];
  }
  return remaining;
}

export async function fetchListingPage<T>(endpoint: string, params: QueryParams, signal?: AbortSignal) {
  const { data } = await axiosInstance.get<{ data: T[] | { data: T[] }; meta: { pagination: { total: number } } }>(
    endpoint, { params: buildApiParams(params), signal },
  );
  const rows = Array.isArray(data.data) ? data.data : data.data.data;
  return { rows, total: data.meta.pagination.total };
}

export async function fetchListingCounts(
  endpoint: string,
  base: Pick<QueryParams, "search" | "filters">,
  filterKey?: string,
  options?: ListingSummary["options"],
  signal?: AbortSignal,
) {
  // Reuse the listing endpoint for every count, including its permission and relationship scopes.
  const filters = [base.filters, ...(options ?? []).map((option) => ({
    ...base.filters,
    [filterKey!]: typeof option === "string" ? option : option.value,
  }))];
  const pages = await Promise.all(filters.map((filter) => fetchListingPage(endpoint, {
    ...base, filters: filter, page: 1, per_page: 1, direction: "desc",
  }, signal)));
  return pages.map((page) => page.total);
}

export function useListingSummary(
  config: ListingSummary | undefined,
  params: QueryParams,
  rows: unknown[],
  entityName = "records",
): SummaryCardItem[] | undefined {
  const endpoint = config?.endpoint;
  const filterKey = config?.filterKey;
  const options = config?.options;
  const baseFilters = config ? getSummaryFilters(params.filters, config) : {};
  const baseRequest = JSON.stringify({ filters: baseFilters, search: params.search });
  const [counts, setCounts] = useState<{ key: string; values: number[] }>();
  const requestKey = JSON.stringify([endpoint, filterKey, options, baseRequest]);

  useEffect(() => {
    if (!endpoint) return;
    const controller = new AbortController();
    fetchListingCounts(endpoint, JSON.parse(baseRequest), filterKey, options, controller.signal)
      .then((values) => {
        if (!controller.signal.aborted) setCounts({ key: requestKey, values });
      })
      .catch(() => {
        if (!controller.signal.aborted) setCounts(undefined);
      });
    return () => controller.abort();
  }, [endpoint, filterKey, options, baseRequest, requestKey, rows]);

  if (!config) return undefined;
  const values = counts?.key === requestKey ? counts.values : [];
  const current = filterKey ? params.filters?.[filterKey] : undefined;
  const colors = ["#1F7A4D", "#8A5A00", "#B42318"];
  return [
    {
      id: "all",
      label: `All ${entityName}`,
      count: values[0] ?? "—",
      active: filterKey ? current == null || current === "" : JSON.stringify(baseFilters) === JSON.stringify(params.filters ?? {}),
      filterKey,
    },
    ...(options ?? []).map((option, index) => {
      const value = typeof option === "string" ? option : option.value;
      return {
        id: value,
        label: typeof option === "string" ? option[0].toUpperCase() + option.slice(1).replace(/_/g, " ") : option.label,
        count: values[index + 1] ?? "—",
        dotColor: colors[index % colors.length],
        active: String(current) === value,
        filterKey,
        filterValue: value,
      };
    }),
  ];
}
