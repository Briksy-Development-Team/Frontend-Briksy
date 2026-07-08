import axios from "axios";
import type { Blog, BlogFormValues } from "./blog.types";

const base = (scope: string) => `/api/${scope}/blogs`;

export const fetchBlogsApi = async (scope: string): Promise<Blog[]> => {
  const { data } = await axios.get(base(scope));
  return data?.data ?? data;
};

export const createBlogApi = async (
  scope: string,
  payload: BlogFormValues
): Promise<Blog> => {
  const { data } = await axios.post(base(scope), payload);
  return data?.data ?? data;
};

export const updateBlogApi = async (
  scope: string,
  id: number,
  payload: BlogFormValues
): Promise<Blog> => {
  const { data } = await axios.put(`${base(scope)}/${id}`, payload);
  return data?.data ?? data;
};

export const deleteBlogApi = async (
  scope: string,
  id: number
): Promise<void> => {
  await axios.delete(`${base(scope)}/${id}`);
};
