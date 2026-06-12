export type EmailTemplateStatus = "active" | "inactive";

export type EmailTemplate = {
  id: string;
  key: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  status: EmailTemplateStatus;
  created_at?: string;
  updated_at?: string;
};

export type EmailTemplateFormValues = {
  key: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  status: EmailTemplateStatus;
};

export type EmailTemplatePreviewValues = {
  variables?: Record<string, string | number | boolean>;
};

export const TEMPLATE_VARIABLES = [
  "name",
  "order_number",
  "total_amount",
  "currency",
] as const;
