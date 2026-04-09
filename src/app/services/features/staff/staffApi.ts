import type { GetStaffParams } from "./staff.types";
export type { GetStaffParams };

const baseData = [
  {
    id: 1,
    name: "ABC Realty",
    email: "abc@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 2,
    name: "Skyline Estates",
    email: "skyline@realty.com",
    status: "Blocked",
    type: "Agency",
  },
  {
    id: 3,
    name: "Prime Properties",
    email: "prime@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 4,
    name: "Urban Nest",
    email: "urban@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 5,
    name: "Golden Key Realty",
    email: "golden@realty.com",
    status: "Blocked",
    type: "Agency",
  },
  {
    id: 6,
    name: "Blue Brick Homes",
    email: "bluebrick@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 7,
    name: "Elite Spaces",
    email: "elite@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 8,
    name: "Dream Dwellings",
    email: "dream@realty.com",
    status: "Blocked",
    type: "Agency",
  },
  {
    id: 9,
    name: "Metro Living",
    email: "metro@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 10,
    name: "NextGen Realty",
    email: "nextgen@realty.com",
    status: "Active",
    type: "Agency",
  },

  {
    id: 11,
    name: "HomeScape Realty",
    email: "homescape@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 12,
    name: "Nest Finders",
    email: "nest@realty.com",
    status: "Blocked",
    type: "Agency",
  },
  {
    id: 13,
    name: "CityRoots Realty",
    email: "cityroots@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 14,
    name: "KeyStone Properties",
    email: "keystone@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 15,
    name: "GreenField Realty",
    email: "greenfield@realty.com",
    status: "Blocked",
    type: "Agency",
  },
  {
    id: 16,
    name: "UrbanEdge Homes",
    email: "urbanedge@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 17,
    name: "Vista Realty",
    email: "vista@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 18,
    name: "Horizon Estates",
    email: "horizon@realty.com",
    status: "Blocked",
    type: "Agency",
  },
  {
    id: 19,
    name: "BrickLane Realty",
    email: "bricklane@realty.com",
    status: "Active",
    type: "Agency",
  },
  {
    id: 20,
    name: "Royal Keys",
    email: "royalkeys@realty.com",
    status: "Active",
    type: "Agency",
  },
];

export const fetchStaffApi = async (params: Staff) => {
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
