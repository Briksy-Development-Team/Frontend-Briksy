type GetSeekersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
};

export const fetchSeekersApi = async (params: GetSeekersParams) => {
  return new Promise<{ data: any[]; total: number }>((resolve) => {
    setTimeout(() => {
      const mock = [
        {
          id: 1,
          full_name: "Aryan Singh",
          email_address: "aryan@test.com",
          status: "Active",
          last_login: "2026-03-10",
          age: 24,
          gender: "Male",
          location: "Ahmedabad",
        },
        {
          id: 2,
          full_name: "Rahul Patel",
          email_address: "rahul@test.com",
          status: "Inactive",
          last_login: null,
          age: 29,
          gender: "Male",
          location: "Surat",
        },
      ];

      resolve({
        data: mock,
        total: mock.length,
      });
    }, 600);
  });
};