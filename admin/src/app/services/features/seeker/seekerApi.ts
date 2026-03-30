export const fetchSeekersApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Aryan Singh",
          email: "aryan@test.com",
          status: "Active",
          last_login: "2026-03-10",
          current_login: "2026-03-10",
          age: 24,
          gender: "Male",
          location: "Ahmedabad",
          created_at: "2025-12-01",
          updated_at: "2026-03-10",
        },
        {
          id: 2,
          name: "Rahul Patel",
          email: "rahul@test.com",
          status: "Inactive",
          last_login: null,
          current_login: "2026-03-10",
          age: 29,
          gender: "Male",
          location: "Surat",

          created_at: "2025-10-15",
          updated_at: "2026-02-01",
        },
        {
          id: 3,
          name: "Sneha Shah",
          email: "sneha@test.com",
          status: "Blocked",
          last_login: "2026-03-13",
          current_login: "2026-03-10",
          age: 26,
          gender: "Female",
          location: "Mumbai",

          created_at: "2024-08-20",
          updated_at: "2026-03-13",
        },
        {
          id: 4,
          name: "Amit Kumar",
          email: "amit@test.com",
          status: "Active",
          last_login: "2026-03-14",
          current_login: "2026-03-10",
          age: 31,
          gender: "Male",
          location: "Delhi",

          created_at: "2025-01-01",
          updated_at: "2026-03-14",
        },
        {
          id: 5,
          name: "Neha Jain",
          email: "neha@test.com",
          status: "Inactive",
          last_login: "2026-03-15",
          current_login: "2026-03-10",
          age: 23,
          gender: "Female",
          location: "Pune",

          created_at: "2025-06-10",
          updated_at: "2026-03-15",
        },
      ]);
    }, 600);
  });
};
