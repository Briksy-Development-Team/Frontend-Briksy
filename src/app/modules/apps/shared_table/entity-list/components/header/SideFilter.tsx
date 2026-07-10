import { useState } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";

type Range = { min?: number; max?: number };
type DateRange = { from?: string; to?: string };
type FilterValue = (string | number)[] | Range | DateRange;

type FilterConfig =
  | {
      key: string;
      label: string;
      type: "select";
      options: string[] | { label: string; value: string | number }[];
    }
  | { key: string; label: string; type: "range" }
  | { key: string; label: string; type: "dateRange" };

// ── Date preset helpers ──────────────────────────────────────────────────
const fmt = (d: Date) => d.toISOString().slice(0, 10);

const getPresetRange = (preset: string): DateRange => {
  const now = new Date();
  switch (preset) {
    case "today": {
      const d = fmt(now);
      return { from: d, to: d };
    }
    case "week": {
      const day = now.getDay();
      const mon = new Date(now);
      mon.setDate(now.getDate() - ((day + 6) % 7));
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      return { from: fmt(mon), to: fmt(sun) };
    }
    case "month": {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { from: fmt(first), to: fmt(last) };
    }
    case "year": {
      return {
        from: `${now.getFullYear()}-01-01`,
        to: `${now.getFullYear()}-12-31`,
      };
    }
    default:
      return {};
  }
};

const PRESETS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
] as const;

type Props = {
  filters: FilterConfig[];
  onFilterChange: (filters: Record<string, FilterValue>) => void;
  onReset?: () => void;
};

const SideFilter = ({ filters, onFilterChange, onReset }: Props) => {
  const [values, setValues] = useState<Record<string, FilterValue>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<Record<string, string>>({});

  const toggleValue = (key: string, value: string | number) =>
    setValues((prev) => {
      const current = (prev[key] as (string | number)[]) || [];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });

  const setRange = (
    key: string,
    field: "min" | "max" | "from" | "to",
    val: string,
  ) => {
    // Clear preset when user manually edits dates
    if (field === "from" || field === "to") {
      setActivePreset((p) => {
        const next = { ...p };
        delete next[key];
        return next;
      });
    }
    setValues((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] as any),
        [field]:
          val === ""
            ? undefined
            : field === "min" || field === "max"
              ? Number(val)
              : val,
      },
    }));
  };

  const applyPreset = (key: string, preset: string) => {
    if (activePreset[key] === preset) {
      // Deselect
      setActivePreset((p) => {
        const next = { ...p };
        delete next[key];
        return next;
      });
      setValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else {
      setActivePreset((p) => ({ ...p, [key]: preset }));
      setValues((prev) => ({ ...prev, [key]: getPresetRange(preset) }));
    }
  };

  const getCount = (key: string) => {
    const val = values[key];
    if (!val) return 0;
    if (Array.isArray(val)) return val.length;
    if ("min" in val || "max" in val) return val.min || val.max ? 1 : 0;
    if ("from" in val || "to" in val) return val.from || val.to ? 1 : 0;
    return 0;
  };

  const handleReset = () => {
    setValues({});
    setActivePreset({});
    if (onReset) {
      onReset();
    } else {
      onFilterChange({});
    }
  };

  return (
    <div className="card shadow-sm px-4">
      <div className="card-header">
        <h5 className="card-title m-0">Filters</h5>
      </div>

      <div className="card-body p-0">
        {filters.map((f) => (
          <div key={f.key} className="border-bottom">
            <div
              className="d-flex justify-content-between px-5 py-4 cursor-pointer"
              onClick={() => setOpen((prev) => (prev === f.key ? null : f.key))}
            >
              <div className="fw-bold">
                {f.label}
                {getCount(f.key) > 0 && (
                  <span className="badge badge-light-primary ms-2">
                    {getCount(f.key)}
                  </span>
                )}
              </div>
              <KTIcon
                iconName={open === f.key ? "minus" : "plus"}
                className="fs-2"
              />
            </div>

            {open === f.key && (
              <div className="pb-4 px-2">
                {f.type === "select" && (
                  <div className="mh-200px overflow-auto">
                    {f.options.map((opt) => {
                      const label = typeof opt === "object" ? opt.label : opt;
                      const value = typeof opt === "object" ? opt.value : opt;
                      return (
                        <label key={String(value)} className="form-check mb-2">
                          <input
                            type="checkbox"
                            checked={(
                              (values[f.key] as (string | number)[]) || []
                            ).includes(value)}
                            onChange={() => toggleValue(f.key, value)}
                          />
                          <span className="mx-3">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {f.type === "range" && (
                  <div className="d-flex gap-2">
                    <input
                      type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                      placeholder="Min"
                      className="form-control"
                      value={(values[f.key] as Range)?.min ?? ""}
                      onChange={(e) => setRange(f.key, "min", e.target.value)}
                    />
                    <input
                      type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                      placeholder="Max"
                      className="form-control"
                      value={(values[f.key] as Range)?.max ?? ""}
                      onChange={(e) => setRange(f.key, "max", e.target.value)}
                    />
                  </div>
                )}

                {f.type === "dateRange" && (
                  <div className="d-flex flex-column gap-3">
                    {/* Preset buttons */}
                    <div className="d-flex flex-wrap gap-2">
                      {PRESETS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          className={`btn btn-sm ${
                            activePreset[f.key] === p.value
                              ? "btn-primary"
                              : "btn-light-primary"
                          }`}
                          onClick={() => applyPreset(f.key, p.value)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <div className="separator" />

                    {/* Manual date pickers */}
                    <div className="d-flex flex-column gap-2">
                      <input
                        type="date"
                        className="form-control"
                        value={(values[f.key] as DateRange)?.from ?? ""}
                        onChange={(e) => setRange(f.key, "from", e.target.value)}
                      />
                      <input
                        type="date"
                        className="form-control"
                        value={(values[f.key] as DateRange)?.to ?? ""}
                        onChange={(e) => setRange(f.key, "to", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card-footer d-flex gap-2">
        <button
          className="btn btn-light w-100"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="btn btn-primary w-100"
          onClick={() => onFilterChange(values)}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export { SideFilter };
