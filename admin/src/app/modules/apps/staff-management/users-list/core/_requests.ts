import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL ?? "http://127.0.0.1:8000/api/admin";
const USER_URL = `${API_URL}/staff`;

type StaffListApiResponse = {
  data: Array<User>;
  payload?: {
    pagination?: NonNullable<UsersQueryResponse['payload']>['pagination'];
  };
};

const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios.get(`${USER_URL}?${query}`).then((response: AxiosResponse<StaffListApiResponse>) => ({
    data: response.data.data,
    payload: {
      pagination: response.data.payload?.pagination,
    },
  }));
};

const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const createUser = (user: Pick<User, 'id' | 'name' | 'email'>): Promise<User | undefined> => {
  return axios
    .post(USER_URL, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const updateUser = (user: Pick<User, 'id' | 'name' | 'email'>): Promise<User | undefined> => {
  return axios
    .put(`${USER_URL}/${user.id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};
