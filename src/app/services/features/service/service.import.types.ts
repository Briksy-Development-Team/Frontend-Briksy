import type {
  ImportAnalysis,
  ImportField,
  ImportMeta,
  ImportPreview,
  ImportRecord,
  ImportSuggestion,
} from "../imports/bulk.import.types";

export type ServiceImportField = ImportField;
export type ServiceImportSuggestion = ImportSuggestion;
export type ServiceImportRecord = ImportRecord;

export type ServiceCategoryOption = {
  id: string;
  label: string;
};

export type OrganizationOption = {
  id: string;
  name: string;
  slug?: string | null;
};

export type OrganizationTypeOption = {
  id: string;
  name: string;
  slug?: string | null;
};

export type ServiceImportMeta = ImportMeta & {
  categories: string[];
  organizations: OrganizationOption[];
  organization_types: OrganizationTypeOption[];
};

export type ServiceImportAnalysis = ImportAnalysis & ServiceImportMeta;

export type ServiceImportAnalysisResponse = ServiceImportAnalysis & {
  import: ServiceImportRecord;
};

export type ServiceImportPreview = ImportPreview;
