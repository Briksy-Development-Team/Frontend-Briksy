import axiosInstance from "../../api/axiosInstance";
import type { EmailTemplate, EmailTemplateFormValues, EmailTemplatePreviewValues } from "./email-template.types";

type EmailTemplateEnvelope = {
  success: boolean;
  message: string;
  data: EmailTemplate | EmailTemplate[] | {
    subject?: string;
    body?: string;
  };
};

const basePath = (scope: "admin" | "super-admin") =>
  `/${scope}/email-templates`;

export const fetchEmailTemplatesApi = async (
  scope: "admin" | "super-admin",
): Promise<EmailTemplate[]> => {
  const response = await axiosInstance.get<EmailTemplateEnvelope>(basePath(scope));
  return Array.isArray(response.data.data) ? response.data.data as EmailTemplate[] : [];
};

export const createEmailTemplateApi = async (
  scope: "admin" | "super-admin",
  payload: EmailTemplateFormValues,
): Promise<EmailTemplate> => {
  const response = await axiosInstance.post<EmailTemplateEnvelope>(basePath(scope), payload);
  return response.data.data as EmailTemplate;
};

export const updateEmailTemplateApi = async (
  scope: "admin" | "super-admin",
  id: string,
  payload: EmailTemplateFormValues,
): Promise<EmailTemplate> => {
  const response = await axiosInstance.patch<EmailTemplateEnvelope>(`${basePath(scope)}/${id}`, payload);
  return response.data.data as EmailTemplate;
};

export const deleteEmailTemplateApi = async (
  scope: "admin" | "super-admin",
  id: string,
): Promise<void> => {
  await axiosInstance.delete(`${basePath(scope)}/${id}`);
};

export const previewEmailTemplateApi = async (
  scope: "admin" | "super-admin",
  id: string,
  payload: EmailTemplatePreviewValues,
): Promise<{ subject?: string; body?: string }> => {
  const response = await axiosInstance.post<EmailTemplateEnvelope>(`${basePath(scope)}/${id}/preview`, payload);
  return response.data.data as { subject?: string; body?: string };
};
