import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";

import type {
  ServiceImportAnalysisResponse,
  ServiceImportMeta,
  ServiceImportPreview,
  ServiceImportRecord,
} from "./service.import.types";

const getBasePath = () => {
  const auth = getAuth();

  return auth?.abilities?.includes("super_admin")
    ? "/super-admin/services"
    : "/admin/services";
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const fetchServiceImportMetaApi = async () => {
  const res = await axiosInstance.get<ApiResponse<ServiceImportMeta>>(`${getBasePath()}/import/meta`);
  return res.data.data;
};

export const downloadServiceImportTemplateApi = async (format: "csv" | "xlsx" = "xlsx") => {
  const res = await axiosInstance.get<Blob>(`${getBasePath()}/import/template`, {
    params: { format },
    responseType: "blob",
  } as any);

  return res.data;
};

export const analyzeServiceImportApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post<ApiResponse<ServiceImportAnalysisResponse>>(
    `${getBasePath()}/import`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data.data;
};

export const previewServiceImportApi = async (importId: string, mapping: Record<string, string | null>) => {
  const res = await axiosInstance.post<ApiResponse<ServiceImportPreview & { import: ServiceImportRecord }>>(
    `${getBasePath()}/imports/${importId}/preview`,
    { mapping },
  );

  return res.data.data;
};

export const startServiceImportApi = async (importId: string) => {
  const res = await axiosInstance.post<ApiResponse<{ import: ServiceImportRecord }>>(
    `${getBasePath()}/imports/${importId}/start`,
  );

  return res.data.data;
};

export const fetchServiceImportApi = async (importId: string) => {
  const res = await axiosInstance.get<ApiResponse<{ import: ServiceImportRecord }>>(
    `${getBasePath()}/imports/${importId}`,
  );

  return res.data.data.import;
};

export const downloadServiceImportErrorReportApi = async (importId: string) => {
  const res = await axiosInstance.get<Blob>(
    `${getBasePath()}/imports/${importId}/error-report`,
    {
      responseType: "blob",
    } as any,
  );

  return res.data;
};
