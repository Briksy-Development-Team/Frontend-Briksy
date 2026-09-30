import axiosInstance from "../../api/axiosInstance";

export const updateInquiryStatusApi = async (id: string, status: string) => {
  const response = await axiosInstance.patch(`/super-admin/inquiries/${id}/status`, { status });
  return response.data;
};
