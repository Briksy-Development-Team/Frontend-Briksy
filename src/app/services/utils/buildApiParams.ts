export const buildApiParams = (params: {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: string;
  filters?: Record<string, any>;
}) => ({
  page: params.page ?? 1,
  per_page: params.per_page ?? 10,
  search: params.search?.trim() || undefined,
  sort: params.sort || undefined,
  direction: params.direction || undefined,
  filter: params.filters
    ? Object.fromEntries(
        Object.entries(params.filters)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(([k, v]) => [k, Array.isArray(v) && v.length === 1 ? v[0] : v])
      )
    : undefined,
});