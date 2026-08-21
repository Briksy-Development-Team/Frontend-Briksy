import type {
  ImportAnalysis,
  ImportField,
  ImportMeta,
  ImportPreview,
  ImportRecord,
  ImportSuggestion,
} from "../imports/bulk.import.types";

export type PropertyImportField = ImportField;
export type PropertyImportSuggestion = ImportSuggestion;

export type PropertyTypeOption = {
  id: string;
  name: string;
  slug?: string | null;
};

export type PropertyImportRecord = ImportRecord;

export type PropertyImportMeta = ImportMeta & {
  property_types: PropertyTypeOption[];
};

export type PropertyImportAnalysis = ImportAnalysis & PropertyImportMeta;

export type PropertyImportAnalysisResponse = PropertyImportAnalysis & {
  import: PropertyImportRecord;
};

export type PropertyImportPreview = ImportPreview;
