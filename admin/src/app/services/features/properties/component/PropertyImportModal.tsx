import { useEffect, useMemo, useState } from "react";
import { saveAs } from "file-saver";

import { useToast } from "../../../ui/toast/useToast";
import { buildUniqueAutoMapping, getSelectedFields } from "../../imports/import.mapping";
import {
  analyzePropertyImportApi,
  downloadPropertyImportErrorReportApi,
  downloadPropertyImportTemplateApi,
  fetchPropertyImportApi,
  previewPropertyImportApi,
  startPropertyImportApi,
} from "../property.import.api";
import type {
  PropertyImportAnalysisResponse,
  PropertyImportPreview,
  PropertyImportRecord,
} from "../property.import.types";

type Props = {
  onClose: () => void;
  onCompleted: () => void;
};

type Step = "upload" | "mapping" | "preview" | "running" | "complete";

const PropertyImportModal = ({ onClose, onCompleted }: Props) => {
  const toast = useToast();
  const [step, setStep] = useState<Step>("upload");
  const [analysis, setAnalysis] = useState<PropertyImportAnalysisResponse | null>(null);
  const [importRecord, setImportRecord] = useState<PropertyImportRecord | null>(null);
  const [preview, setPreview] = useState<PropertyImportPreview | null>(null);
  const [mapping, setMapping] = useState<Record<string, string | null>>({});
  const [fileName, setFileName] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const systemFields = analysis?.system_fields ?? [];
  const requiredFields = analysis?.required_fields ?? [];

  const requiredMapped = useMemo(() => {
    if (!analysis) {
      return false;
    }

    const selectedFields = Object.values(mapping).filter((value): value is string => !!value);
    return requiredFields.every((field) => selectedFields.includes(field));
  }, [analysis, mapping, requiredFields]);

  const selectedFields = useMemo(() => getSelectedFields(mapping), [mapping]);
  const selectedValues = useMemo(() => Array.from(selectedFields), [selectedFields]);

  const unmappedRequiredFields = useMemo(() => {
    if (!analysis) {
      return [];
    }

    return requiredFields.filter((field) => !selectedValues.includes(field));
  }, [analysis, requiredFields, selectedValues]);

  useEffect(() => {
    if (step !== "running" || !importRecord?.id) {
      return undefined;
    }

    let active = true;

    const poll = async () => {
      try {
        const next = await fetchPropertyImportApi(importRecord.id);

        if (!active) {
          return;
        }

        setImportRecord(next);

        if (next.status === "completed" || next.status === "failed") {
          setStep("complete");
          if (next.status === "completed") {
            toast.success("Property import completed.");
            onCompleted();
          } else {
            toast.danger(next.last_error ?? "Property import failed.");
          }
        }
      } catch (pollError) {
        if (!active) {
          return;
        }

        setError(pollError instanceof Error ? pollError.message : "Failed to fetch import progress.");
      }
    };

    void poll();
    const timer = window.setInterval(() => {
      void poll();
    }, 2500);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [importRecord?.id, onCompleted, step, toast]);

  const resetAndClose = () => {
    onClose();
  };

  const handleFileChange = async (file?: File) => {
    if (!file) {
      return;
    }

    setBusy(true);
    setError(null);
    setFileName(file.name);

    try {
      const response = await analyzePropertyImportApi(file);
      setAnalysis(response);
      setImportRecord(response.import);

      setMapping(buildUniqueAutoMapping(response));
      setPreview(null);
      setStep("mapping");
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : "Failed to analyze the file.");
      toast.danger("Failed to analyze the import file.");
    } finally {
      setBusy(false);
    }
  };

  const handleMappingChange = (column: string, field: string) => {
    setMapping((current) => {
      const next = { ...current };
      const selectedField = field || null;

      if (selectedField) {
        Object.keys(next).forEach((key) => {
          if (key !== column && next[key] === selectedField) {
            next[key] = null;
          }
        });
      }

      next[column] = selectedField;
      return next;
    });

    if (step === "preview") {
      setStep("mapping");
      setPreview(null);
    }
  };

  const handlePreview = async () => {
    if (!importRecord?.id || !requiredMapped) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await previewPropertyImportApi(importRecord.id, mapping);
      setPreview(response);
      setImportRecord((current) => (current ? { ...current, ...response.import } : current));
      setStep("preview");
      toast.success("Preview generated.");
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : "Failed to generate preview.");
      toast.danger("Failed to generate preview.");
    } finally {
      setBusy(false);
    }
  };

  const handleStart = async () => {
    if (!importRecord?.id) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await startPropertyImportApi(importRecord.id);
      setImportRecord(response.import);
      if (response.import.status === "completed") {
        setStep("complete");
        toast.success("Property import completed.");
        onCompleted();
      } else {
        setStep("running");
        toast.info("Import started. Progress will update automatically.");
      }
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "Failed to start import.");
      toast.danger("Failed to start import.");
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadErrors = async () => {
    if (!importRecord?.id) {
      return;
    }

    try {
      const blob = await downloadPropertyImportErrorReportApi(importRecord.id);
      saveAs(blob, "property-import-errors.csv");
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Failed to download the error report.");
    }
  };

  const handleDownloadTemplate = async (format: "csv" | "xlsx" = "xlsx") => {
    try {
      const blob = await downloadPropertyImportTemplateApi(format);
      saveAs(blob, `property-import-template.${format}`);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Failed to download the template.");
    }
  };

  const renderStatusChip = (label: string, value: number | string) => (
    <div className="col-md-3">
      <div className="border rounded-3 p-4 bg-light">
        <div className="text-muted fs-8 text-uppercase fw-semibold">{label}</div>
        <div className="fs-3 fw-bolder mt-1">{value}</div>
      </div>
    </div>
  );

  const displayMetric = (value: unknown) => {
    if (typeof value === "number" || typeof value === "string") {
      return value;
    }

    return 0;
  };

  const previewSummary = preview?.summary ?? importRecord?.summary;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(15,23,42,0.72)" }} onClick={resetAndClose}>
      <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(event) => event.stopPropagation()}>
        <div className="modal-content shadow-lg" style={{ minHeight: 640 }}>
          <div className="modal-header border-0 pb-0">
            <div>
              <h2 className="fw-bolder mb-1">Import Properties</h2>
              <div className="text-muted fs-7">
                Upload a spreadsheet, map its columns, preview validation, then start the queued import.
              </div>
            </div>
            <button type="button" className="btn btn-icon btn-sm btn-active-light-primary" onClick={resetAndClose}>
              <i className="bi bi-x-lg fs-3" />
            </button>
          </div>

          <div className="modal-body pt-3">
            <div className="d-flex flex-wrap gap-2 mb-4">
              {["upload", "mapping", "preview", "running", "complete"].map((item) => (
                <span
                  key={item}
                  className={`badge ${step === item ? "badge-light-primary" : "badge-light"} text-capitalize px-4 py-3`}
                >
                  {item}
                </span>
              ))}
            </div>

            {error ? <div className="alert alert-danger py-3">{error}</div> : null}

            <div className="d-flex flex-wrap gap-2 mb-4">
              <button type="button" className="btn btn-light-primary" onClick={() => void handleDownloadTemplate("xlsx")}>
                Download Sample Template
              </button>
              <button type="button" className="btn btn-light" onClick={() => void handleDownloadTemplate("csv")}>
                Download CSV Template
              </button>
            </div>

            {step === "upload" ? (
              <div className="border border-dashed border-2 rounded-4 p-8 text-center bg-light">
                <div className="fs-2 fw-bold mb-2">Choose a .xlsx or .csv file</div>
                <div className="text-muted mb-5">The first row should contain column names. Mapping can be adjusted after analysis.</div>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  className="form-control form-control-solid mx-auto"
                  style={{ maxWidth: 480 }}
                  onChange={(event) => void handleFileChange(event.target.files?.[0] ?? undefined)}
                  disabled={busy}
                />
                {fileName ? <div className="text-muted fs-7 mt-3">Selected file: {fileName}</div> : null}
              </div>
            ) : null}

            {analysis ? (
              <div className="d-flex flex-column gap-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="text-muted fs-7">Uploaded file</div>
                        <div className="fw-semibold">{analysis.import?.original_filename ?? fileName}</div>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <div className="text-muted fs-7">Required fields</div>
                        <div className="fw-semibold">{requiredFields.join(", ") || "None"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {step !== "upload" ? (
                  <div className="row g-3">
                    {renderStatusChip("Columns", analysis.source_columns.length)}
                    {renderStatusChip("Rows", displayMetric(previewSummary?.total_rows ?? importRecord?.total_rows ?? 0))}
                    {renderStatusChip("Valid", displayMetric(previewSummary?.valid_rows ?? importRecord?.valid_rows ?? 0))}
                    {renderStatusChip("Invalid", displayMetric(previewSummary?.invalid_rows ?? importRecord?.invalid_rows ?? 0))}
                  </div>
                ) : null}

                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0 pt-6">
                    <div>
                      <h3 className="mb-1">Column Mapping</h3>
                      <div className="text-muted fs-7">
                        Auto-matching is applied first. Finish mapping all required system fields before previewing.
                      </div>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <div className="table-responsive">
                      <table className="table align-middle table-row-dashed gy-4">
                        <thead>
                          <tr className="text-muted fw-semibold fs-7 text-uppercase">
                            <th>Uploaded Column</th>
                            <th>Auto Match</th>
                            <th>Map To</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysis.source_columns.map((column) => {
                            const suggestion = analysis.suggested_mapping[column];

                            return (
                              <tr key={column}>
                                <td className="fw-semibold">{column}</td>
                                <td>
                                  {suggestion?.field ? (
                                    <span className={`badge ${suggestion.confidence >= 0.9 ? "badge-light-success" : "badge-light-warning"}`}>
                                      {suggestion.label ?? suggestion.field}
                                    </span>
                                  ) : (
                                    <span className="badge badge-light">Unmapped</span>
                                  )}
                                </td>
                                <td style={{ minWidth: 280 }}>
                                  <select
                                    className="form-select form-select-solid"
                                    value={mapping[column] ?? ""}
                                    onChange={(event) => handleMappingChange(column, event.target.value)}
                                  >
                                    <option value="">Select a system field</option>
                                    {systemFields.map((field) => (
                                      <option
                                        key={field.key}
                                        value={field.key}
                                        disabled={mapping[column] !== field.key && selectedFields.has(field.key)}
                                      >
                                        {field.label}
                                        {field.required ? " *" : ""}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {unmappedRequiredFields.length > 0 ? (
                      <div className="alert alert-warning py-3 mb-0">
                        Required fields still need mapping: {unmappedRequiredFields.join(", ")}
                      </div>
                    ) : null}
                  </div>
                </div>

                {analysis.sample_rows.length > 0 ? (
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 pt-6">
                      <h3 className="mb-0">Sample Rows</h3>
                    </div>
                    <div className="card-body pt-0">
                      <div className="table-responsive">
                        <table className="table table-sm align-middle">
                          <thead>
                            <tr>
                              {analysis.source_columns.map((column) => (
                                <th key={column}>{column}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {analysis.sample_rows.map((row, index) => (
                              <tr key={index}>
                                {analysis.source_columns.map((column) => (
                                  <td key={column}>{row[column] ?? "—"}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : null}

                {preview ? (
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 pt-6">
                      <h3 className="mb-0">Validation Preview</h3>
                    </div>
                    <div className="card-body pt-0">
                      <div className="row g-3 mb-4">
                        {renderStatusChip("Total rows", displayMetric(preview.summary.total_rows))}
                        {renderStatusChip("Valid rows", displayMetric(preview.summary.valid_rows))}
                        {renderStatusChip("Invalid rows", displayMetric(preview.summary.invalid_rows))}
                        {renderStatusChip("Duplicate rows", displayMetric(preview.summary.duplicate_rows))}
                      </div>

                      {preview.summary.missing_required_fields.length > 0 ? (
                        <div className="alert alert-warning py-3">
                          Missing required fields: {preview.summary.missing_required_fields.join(", ")}
                        </div>
                      ) : null}

                      {preview.invalid_rows.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-row-dashed align-middle">
                            <thead>
                              <tr className="text-muted fs-7 text-uppercase">
                                <th style={{ width: 110 }}>Row</th>
                                <th>Errors</th>
                              </tr>
                            </thead>
                            <tbody>
                              {preview.invalid_rows.map((row) => (
                                <tr key={row.row_number}>
                                  <td className="fw-semibold">Row {row.row_number}</td>
                                  <td>
                                    <ul className="mb-0 ps-3">
                                      {row.errors.map((message) => (
                                        <li key={message}>{message}</li>
                                      ))}
                                    </ul>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="alert alert-success py-3 mb-0">No validation errors found.</div>
                      )}
                    </div>
                  </div>
                ) : null}

                {step === "running" && importRecord ? (
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div className="fw-semibold">Import in progress</div>
                          <div className="text-muted fs-7">
                            {importRecord.imported_rows} imported, {importRecord.failed_rows} failed, {importRecord.skipped_rows} skipped
                          </div>
                        </div>
                        <div className="fw-bold fs-3">{importRecord.progress}%</div>
                      </div>
                      <div className="progress" style={{ height: 10 }}>
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          style={{ width: `${importRecord.progress}%` }}
                          aria-valuenow={importRecord.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === "complete" && importRecord ? (
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="row g-3">
                        {renderStatusChip("Successfully Imported", displayMetric(importRecord.imported_rows))}
                        {renderStatusChip("Failed", displayMetric(importRecord.failed_rows))}
                        {renderStatusChip("Skipped", displayMetric(importRecord.skipped_rows))}
                        {renderStatusChip("Progress", `${importRecord.progress}%`)}
                      </div>

                      {importRecord.last_error ? (
                        <div className="alert alert-danger py-3 mt-4 mb-0">{importRecord.last_error}</div>
                      ) : null}

                      {importRecord.error_report_available ? (
                        <button type="button" className="btn btn-light-danger mt-4" onClick={() => void handleDownloadErrors()}>
                          Download Error Report
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="modal-footer border-0 pt-0">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="text-muted fs-7">
                {step === "upload" ? "Upload a spreadsheet to begin." : fileName}
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light" onClick={resetAndClose} disabled={busy && step === "running"}>
                  Cancel
                </button>

                {step === "mapping" ? (
                  <button type="button" className="btn btn-light" onClick={() => setStep("upload")} disabled={busy}>
                    Back
                  </button>
                ) : null}

                {step === "mapping" ? (
                  <button type="button" className="btn btn-primary" onClick={() => void handlePreview()} disabled={busy || !requiredMapped}>
                    {busy ? "Previewing..." : "Preview Results"}
                  </button>
                ) : null}

                {step === "preview" ? (
                  <>
                    <button type="button" className="btn btn-light" onClick={() => setStep("mapping")} disabled={busy}>
                      Back to Mapping
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => void handleStart()} disabled={busy}>
                      {busy ? "Starting..." : "Start Import"}
                    </button>
                  </>
                ) : null}

                {step === "running" ? (
                  <button type="button" className="btn btn-light" disabled>
                    Import Running...
                  </button>
                ) : null}

                {step === "complete" ? (
                  <button type="button" className="btn btn-primary" onClick={resetAndClose}>
                    Done
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyImportModal;
