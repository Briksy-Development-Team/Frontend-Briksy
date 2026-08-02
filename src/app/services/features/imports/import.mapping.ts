import type { ImportAnalysis } from "./bulk.import.types";

export const buildUniqueAutoMapping = (
  analysis: ImportAnalysis | null,
  threshold = 0.72,
): Record<string, string | null> => {
  if (!analysis) {
    return {};
  }

  const nextMapping: Record<string, string | null> = {};
  const usedFields = new Set<string>();

  analysis.source_columns.forEach((column) => {
    const suggestion = analysis.suggested_mapping[column];
    const field = suggestion?.field && suggestion.confidence >= threshold && !usedFields.has(suggestion.field)
      ? suggestion.field
      : null;

    nextMapping[column] = field;

    if (field) {
      usedFields.add(field);
    }
  });

  return nextMapping;
};

export const getSelectedFields = (mapping: Record<string, string | null>): Set<string> =>
  new Set(Object.values(mapping).filter((value): value is string => !!value));
