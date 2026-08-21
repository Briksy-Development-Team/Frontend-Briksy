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
          .map(([k, v]) => {
            if (Array.isArray(v)) return [k, v.join(",")];
            if (v && typeof v === "object") {
              if ("from" in v || "to" in v) return [k, `${v.from || ""}~${v.to || ""}`];
              if ("min" in v || "max" in v) return [k, `${v.min ?? ""}~${v.max ?? ""}`];
            }
            return [k, v];
          })
      )
    : undefined,
});