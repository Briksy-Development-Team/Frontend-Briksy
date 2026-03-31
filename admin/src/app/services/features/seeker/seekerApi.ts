type GetSeekersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
};

const baseData = [
  {
    id: 1,
    full_name: "Aryan Singh",
    email_address: "aryan.singh@test.com",
    status: "Active",
    last_login: "2026-03-10",
    age: 24,
    gender: "Male",
    location: "Ahmedabad",
  },
  {
    id: 2,
    full_name: "Rahul Patel",
    email_address: "rahul.patel@test.com",
    status: "Inactive",
    last_login: null,
    age: 29,
    gender: "Male",
    location: "Surat",
  },
  {
    id: 3,
    full_name: "Neha Sharma",
    email_address: "neha.sharma@test.com",
    status: "Active",
    last_login: "2026-03-05",
    age: 26,
    gender: "Female",
    location: "Vadodara",
  },
  {
    id: 4,
    full_name: "Amit Verma",
    email_address: "amit.verma@test.com",
    status: "Blocked",
    last_login: "2026-02-28",
    age: 31,
    gender: "Male",
    location: "Delhi",
  },
  {
    id: 5,
    full_name: "Priya Joshi",
    email_address: "priya.joshi@test.com",
    status: "Active",
    last_login: "2026-03-12",
    age: 23,
    gender: "Female",
    location: "Mumbai",
  },
  {
    id: 6,
    full_name: "Rohit Mehta",
    email_address: "rohit.mehta@test.com",
    status: "Inactive",
    last_login: null,
    age: 35,
    gender: "Male",
    location: "Rajkot",
  },
  {
    id: 7,
    full_name: "Kavya Shah",
    email_address: "kavya.shah@test.com",
    status: "Active",
    last_login: "2026-03-01",
    age: 27,
    gender: "Female",
    location: "Pune",
  },
  {
    id: 8,
    full_name: "Vikas Yadav",
    email_address: "vikas.yadav@test.com",
    status: "Blocked",
    last_login: "2026-02-20",
    age: 33,
    gender: "Male",
    location: "Jaipur",
  },
  {
    id: 9,
    full_name: "Sneha Kapoor",
    email_address: "sneha.kapoor@test.com",
    status: "Active",
    last_login: "2026-03-15",
    age: 28,
    gender: "Female",
    location: "Indore",
  },
  {
    id: 10,
    full_name: "Arjun Nair",
    email_address: "arjun.nair@test.com",
    status: "Inactive",
    last_login: null,
    age: 30,
    gender: "Male",
    location: "Bangalore",
  },
];

export const fetchSeekersApi = async (params: GetSeekersParams) => {
  return new Promise<{ data: any[]; total: number }>((resolve) => {
    setTimeout(() => {
      let data = [...baseData];

      if (params.search) {
        const s = params.search.toLowerCase();
        data = data.filter(
          (d) =>
            d.full_name.toLowerCase().includes(s) ||
            d.email_address.toLowerCase().includes(s),
        );
      }

      if (params.filters) {
        Object.entries(params.filters).forEach(([key, val]) => {
          if (!val) return;

          data = data.filter((item) => {
            const field = item[key];

            if (Array.isArray(val)) return val.includes(field);

            if ("min" in val || "max" in val) {
              if (val.min && field < val.min) return false;
              if (val.max && field > val.max) return false;
            }

            return true;
          });
        });
      }

      if (params.sortBy) {
        data.sort((a, b) => {
          const A = a[params.sortBy!];
          const B = b[params.sortBy!];

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
