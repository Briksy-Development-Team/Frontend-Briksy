import type { GetSoloParams } from "./solo.types";
export type { GetSoloParams };

  const baseData = [
  {
    id: 1,
    name: "TechNova Pvt Ltd",
    email: "contact@technova.com",
    status: "Active",
    industry: "IT Services",
    location: "Ahmedabad",
    employees_count: 120,
    founded_year: 2015,
    last_login: "2026-03-10",
    current_login: "2026-04-08",
    created_at: "2025-01-01",
    updated_at: "2026-03-10",
  },
  {
    id: 2,
    name: "GreenCore Solutions",
    email: "info@greencore.com",
    status: "Inactive",
    industry: "Renewable Energy",
    location: "Surat",
    employees_count: 45,
    founded_year: 2018,
    last_login: null,
    current_login: null,
    created_at: "2025-02-15",
    updated_at: "2026-02-01",
  },
  {
    id: 3,
    name: "FinEdge Analytics",
    email: "hello@finedge.com",
    status: "Active",
    industry: "Finance",
    location: "Mumbai",
    employees_count: 200,
    founded_year: 2012,
    last_login: "2026-03-20",
    current_login: "2026-04-07",
    created_at: "2024-11-20",
    updated_at: "2026-03-20",
  },
  {
    id: 4,
    name: "HealthBridge Corp",
    email: "support@healthbridge.com",
    status: "Blocked",
    industry: "Healthcare",
    location: "Delhi",
    employees_count: 80,
    founded_year: 2016,
    last_login: "2026-02-28",
    current_login: null,
    created_at: "2025-03-10",
    updated_at: "2026-02-28",
  },
  {
    id: 5,
    name: "EduSmart Systems",
    email: "contact@edusmart.com",
    status: "Active",
    industry: "Education",
    location: "Pune",
    employees_count: 60,
    founded_year: 2019,
    last_login: "2026-03-15",
    current_login: "2026-04-06",
    created_at: "2025-05-05",
    updated_at: "2026-03-15",
  },
  {
    id: 6,
    name: "LogiChain Pvt Ltd",
    email: "info@logichain.com",
    status: "Inactive",
    industry: "Logistics",
    location: "Bangalore",
    employees_count: 150,
    founded_year: 2014,
    last_login: null,
    current_login: null,
    created_at: "2024-09-01",
    updated_at: "2026-01-10",
  },
  {
    id: 7,
    name: "RetailHub India",
    email: "sales@retailhub.com",
    status: "Active",
    industry: "E-commerce",
    location: "Jaipur",
    employees_count: 95,
    founded_year: 2017,
    last_login: "2026-03-01",
    current_login: "2026-04-05",
    created_at: "2025-06-12",
    updated_at: "2026-03-01",
  },
  {
    id: 8,
    name: "AutoMech Industries",
    email: "contact@automech.com",
    status: "Blocked",
    industry: "Manufacturing",
    location: "Chennai",
    employees_count: 300,
    founded_year: 2010,
    last_login: "2026-02-20",
    current_login: null,
    created_at: "2024-07-25",
    updated_at: "2026-02-20",
  },
];


export const fetchSoloApi = async (params: GetSoloParams) => {
  return new Promise<{ data: any[]; total: number }>((resolve) => {
    setTimeout(() => {
      let data = [...baseData];

      if (params.search) {
        const s = params.search.toLowerCase();
        data = data.filter(
          (d) =>
            d.name.toLowerCase().includes(s) ||
            d.email.toLowerCase().includes(s),
        );
      }

      if (params.filters) {
        Object.entries(params.filters).forEach(([key, val]) => {
          if (!val) return;

          data = data.filter((item) => {
            const field = (item as Record<string, any>)[key];

            if (Array.isArray(val)) return val.includes(field);

            if (
              typeof val === "object" &&
              val !== null &&
              ("min" in val || "max" in val)
            ) {
              const range = val as { min?: number; max?: number };
              if (range.min && field < range.min) return false;
              if (range.max && field > range.max) return false;
            }

            return true;
          });
        });
      }

      if (params.sortBy) {
        data.sort((a, b) => {
          const A = (a as Record<string, any>)[params.sortBy!];
          const B = (b as Record<string, any>)[params.sortBy!];

          if (A > B) return params.sortOrder === "desc" ? -1 : 1;
          if (A < B) return params.sortOrder === "desc" ? 1 : -1;
          return 0;
        });
      }

      const total = data.length;

      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const start = (page - 1) * pageSize;

      data = data.slice(start, start + pageSize);

      resolve({ data, total });
    }, 500);
  });
};
