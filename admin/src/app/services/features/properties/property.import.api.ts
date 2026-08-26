import axiosInstance from "../../api/axiosInstance";
import { getAuth } from "../../../modules/auth/core/AuthHelpers";

import type {
  PropertyImportAnalysis,
  PropertyImportAnalysisResponse,
  PropertyImportMeta,
  PropertyImportPreview,
  PropertyImportRecord,
} from "./property.import.types";

const getBasePath = () => {
  const auth = getAuth();

  return auth?.abilities?.includes("super_admin")
    ? "/super-admin/properties"
    : "/admin/properties";
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const fetchPropertyImportMetaApi = async () => {
  const res = await axiosInstance.get<ApiResponse<PropertyImportMeta>>(`${getBasePath()}/import/meta`);
  return res.data.data;
};

export const downloadPropertyImportTemplateApi = async (format: "csv" | "xlsx" = "xlsx") => {
  const res = await axiosInstance.get<Blob>(`${getBasePath()}/import/template`, {
    params: { format },
    responseType: "blob",
  } as any);

  return res.data;
};

export const analyzePropertyImportApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post<ApiResponse<PropertyImportAnalysisResponse>>(
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

export const previewPropertyImportApi = async (importId: string, mapping: Record<string, string | null>) => {
  const res = await axiosInstance.post<ApiResponse<PropertyImportPreview & { import: PropertyImportRecord }>>(
    `${getBasePath()}/imports/${importId}/preview`,
    { mapping },
  );

  return res.data.data;
};

export const startPropertyImportApi = async (importId: string) => {
  const res = await axiosInstance.post<ApiResponse<{ import: PropertyImportRecord }>>(
    `${getBasePath()}/imports/${importId}/start`,
  );

  return res.data.data;
};

export const fetchPropertyImportApi = async (importId: string) => {
  const res = await axiosInstance.get<ApiResponse<{ import: PropertyImportRecord }>>(
    `${getBasePath()}/imports/${importId}`,
  );

  return res.data.data.import;
};

export const downloadPropertyImportErrorReportApi = async (importId: string) => {
  const res = await axiosInstance.get<Blob>(
    `${getBasePath()}/imports/${importId}/error-report`,
    {
      responseType: "blob",
    } as any,
  );

  return res.data;
};
