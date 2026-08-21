export type ImportField = {
  key: string;
  label: string;
  required: boolean;
  aliases: string[];
};

export type ImportSuggestion = {
  field: string | null;
  confidence: number;
  label: string | null;
};

export type ImportRecord = {
  id: string;
  status: string;
  original_filename: string;
  source_columns: string[];
  mapping: Record<string, string | null>;
  preview: Record<string, unknown>;
  summary: Record<string, unknown>;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  duplicate_rows: number;
  missing_required_rows: number;
  imported_rows: number;
  failed_rows: number;
  skipped_rows: number;
  progress: number;
  error_report_available: boolean;
  last_error?: string | null;
  started_at?: string | null;
  finished_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ImportMeta = {
  system_fields: ImportField[];
  required_fields: string[];
};

export type ImportAnalysis = ImportMeta & {
  source_columns: string[];
  suggested_mapping: Record<string, ImportSuggestion>;
  sample_rows: Array<Record<string, string | number | null>>;
  import: ImportRecord;
};

export type ImportPreview = {
  summary: {
    total_rows: number;
    valid_rows: number;
    invalid_rows: number;
    duplicate_rows: number;
    missing_required_rows: number;
    missing_required_fields: string[];
  };
  invalid_rows: Array<{
    row_number: number;
    status: string;
    errors: string[];
    values: Record<string, unknown>;
  }>;
  duplicate_rows: Array<{
    row_number: number;
    status: string;
    values: Record<string, unknown>;
  }>;
};
