import { ID } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";

// 🔴 MOCK getUsers (replaces API call)
const getUsers = async (query: string): Promise<UsersQueryResponse> => {
  console.log("Mock getUsers called with query:", query);

  return {
    data: [
      {
        id: 1,
        name: "Aryan Singh",
        role: "Admin",
        last_login: "Today",
        two_steps: true,
        joined: "2024-01-01",
      },
      {
        id: 2,
        name: "Rahul Sharma",
        role: "User",
        last_login: "Yesterday",
        two_steps: false,
        joined: "2023-12-10",
      },
      {
        id: 3,
        name: "Priya Patel",
        role: "Vendor",
        last_login: "2 days ago",
        two_steps: true,
        joined: "2023-11-20",
      },
      {
        id: 4,
        name: "Neha Verma",
        role: "User",
        last_login: "1 week ago",
        two_steps: false,
        joined: "2023-10-15",
      },
      {
        id: 5,
        name: "Amit Patel",
        role: "Admin",
        last_login: "Today",
        two_steps: true,
        joined: "2024-02-01",
      },
    ],

    payload: {
      pagination: {
        page: 1,
        items_per_page: 10,
        total: 5,
        links: [],
      },
    },
  };
};

// 🔽 Keep these as dummy (or leave as-is if not used)
const getUserById = async (id: ID): Promise<User | undefined> => {
  return {
    id,
    name: "Dummy User",
    role: "User",
    last_login: "Now",
    two_steps: false,
    joined: "2024-01-01",
  } as User;
};

const createUser = async (user: User): Promise<User | undefined> => {
  return user;
};

const updateUser = async (user: User): Promise<User | undefined> => {
  return user;
};

const deleteUser = async (userId: ID): Promise<void> => {
  return;
};

const deleteSelectedUsers = async (userIds: Array<ID>): Promise<void> => {
  return;
};

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};
