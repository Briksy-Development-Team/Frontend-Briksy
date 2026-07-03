export type EmailTemplateStatus = "active" | "inactive";

export type EmailTemplate = {
  id: string;
  key: string;
  slug?: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  status: EmailTemplateStatus;
  is_active?: boolean;
  module?: string | null;
  event_key?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type EmailTemplateFormValues = {
  key: string;
  slug?: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  status: EmailTemplateStatus;
  is_active?: boolean;
  module?: string;
  event_key?: string;
};

export type EmailTemplatePreviewValues = {
  variables?: Record<string, string | number | boolean>;
};

export type EmailTemplateSendTestValues = {
  email: string;
  variables?: Record<string, string | number | boolean>;
};

export const TEMPLATE_VARIABLES = [
  "name",
  "order_number",
  "total_amount",
  "currency",
] as const;
