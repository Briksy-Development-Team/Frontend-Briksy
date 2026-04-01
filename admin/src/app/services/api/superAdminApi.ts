import axiosInstance from "./axiosInstance";

type ApiRange = {
  min?: number;
  max?: number;
}

type ApiDateRange = {
  from?: string;
  to?: string;
}

export type ApiFilterValue =
  | string
  | number
  | boolean
  | Array<string | number>
  | ApiRange
  | ApiDateRange;

type ApiFilter = Record<string, ApiFilterValue>;

type ApiPagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number;
  to?: number;
  has_more_pages: boolean;
};

export type SuperAdminListResponse<T> = {
  data: T[];
  pagination: ApiPagination;
};

const isRange = (value: any): value is ApiRange =>
  value && typeof value === "object" && ("min" in value || "max" in value);

const isDateRange = (value: any): value is ApiDateRange =>
  value && typeof value === "object" && ("from" in value || "to" in value);

const formatFilterParams = (filters: ApiFilter | undefined): Record<string, unknown> => {
  if (!filters) return {};

  return Object.entries(filters).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (value === undefined || value === null || value === "") {
      return acc;
    }

    if (Array.isArray(value)) {
      acc[`filter[${key}][]`] = value;
      return acc;
    }

    if (isRange(value)) {
      if (value.min !== undefined) acc[`filter[${key}][min]`] = value.min;
      if (value.max !== undefined) acc[`filter[${key}][max]`] = value.max;
      return acc;
    }

    if (isDateRange(value)) {
      if (value.from) acc[`filter[${key}][from]`] = value.from;
      if (value.to) acc[`filter[${key}][to]`] = value.to;
      return acc;
    }

    acc[`filter[${key}]`] = value;
    return acc;
  }, {});
};

const formatListParams = (options: {
  search?: string;
  sort?: string;
  direction?: string;
  page?: number;
  per_page?: number;
  filter?: ApiFilter;
}) => {
  const params: Record<string, unknown> = {
    ...(options.search ? { search: options.search } : {}),
    ...(options.sort ? { sort: options.sort } : {}),
    ...(options.direction ? { direction: options.direction } : {}),
    ...(options.page ? { page: options.page } : {}),
    ...(options.per_page ? { per_page: options.per_page } : {}),
    ...formatFilterParams(options.filter),
  };

  return params;
};

type ListOptions = {
  search?: string;
  sort?: string;
  direction?: string;
  page?: number;
  per_page?: number;
  filter?: ApiFilter;
};

export const fetchSeekers = async <T = unknown>(options: ListOptions = {}) => {
  const response = await axiosInstance.get("/super-admin/seekers", {
    params: formatListParams(options),
  });

  return {
    data: response.data.data ?? [],
    pagination: response.data.meta?.pagination,
  } as SuperAdminListResponse<T>;
};

export const fetchStaff = async <T = unknown>(options: ListOptions = {}) => {
  const response = await axiosInstance.get("/super-admin/staff", {
    params: formatListParams(options),
  });

  return {
    data: response.data.data ?? [],
    pagination: response.data.meta?.pagination,
  } as SuperAdminListResponse<T>;
};

export const fetchOrganizations = async <T = unknown>(options: ListOptions = {}) => {
  const response = await axiosInstance.get("/super-admin/organizations", {
    params: formatListParams(options),
  });

  return {
    data: response.data.data ?? [],
    pagination: response.data.meta?.pagination,
  } as SuperAdminListResponse<T>;
};
