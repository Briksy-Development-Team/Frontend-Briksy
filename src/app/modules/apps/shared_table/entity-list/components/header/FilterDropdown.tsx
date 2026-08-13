import { useEffect, useState, useRef } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";

type Range = { min?: number; max?: number };
type DateRange = { from?: string; to?: string };
type FilterValue = (string | number)[] | Range | DateRange | string | boolean;

type FilterConfig =
  | {
      key: string;
      label: string;
      type: "select";
      options: string[] | { label: string; value: string | number }[];
    }
  | { key: string; label: string; type: "range" }
  | { key: string; label: string; type: "dateRange" }
  | { key: string; label: string; type: "text" }
  | { key: string; label: string; type: "boolean" };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

// ── Date preset helpers ──────────────────────────────────────────────────
const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

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

const FilterDropdown = ({ filters, onFilterChange, onReset }: Props) => {
  const [values, setValues] = useState<Record<string, FilterValue>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<Record<string, string>>({});
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTimeout(() => MenuComponent.reinitialization(), 0);
  }, [filters]);

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
    if (isRecord(val) && ("min" in val || "max" in val)) {
      const range = val as Partial<Range>;
      return range.min || range.max ? 1 : 0;
    }
    if (isRecord(val) && ("from" in val || "to" in val)) {
      const range = val as Partial<DateRange>;
      return range.from || range.to ? 1 : 0;
    }
    if (typeof val === "string") return val.trim().length > 0 ? 1 : 0;
    if (typeof val === "boolean") return val ? 1 : 0;
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

  const activeFiltersCount = Object.keys(values).filter(key => getCount(key) > 0).length;

  return (
    <div className="position-relative">
      <button
        ref={triggerRef}
        type="button"
        className={`btn d-flex align-items-center gap-2 ${activeFiltersCount > 0 ? "btn-primary" : "btn-light-primary"}`}
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon iconName="filter" className="fs-2" />
        Filter
        {activeFiltersCount > 0 && <span className="ms-1">{activeFiltersCount}</span>}
      </button>

      <div
        className="menu menu-sub menu-sub-dropdown w-300px w-md-350px"
        data-kt-menu="true"
      >
        <div className="px-5 py-4 fw-bold text-gray-800 fs-6 d-flex justify-content-between align-items-center">
          Filters
        </div>
        <div className="separator mx-3" />

        <div className="px-0 mh-350px overflow-auto">
          {filters.map((f) => (
            <div key={f.key} className="border-bottom">
              <div
                className="d-flex justify-content-between px-5 py-5 cursor-pointer"
                onClick={() => setOpen((prev) => (prev === f.key ? null : f.key))}
              >
                <div className="fw-bold fs-6">
                  {f.label}
                  {getCount(f.key) > 0 && (
                    <span className="badge badge-light-primary ms-2">
                      {getCount(f.key)}
                    </span>
                  )}
                </div>
                <KTIcon
                  iconName={open === f.key ? "minus" : "plus"}
                  className="fs-2 text-muted"
                />
              </div>

              {open === f.key && (
                <div className="pb-6 px-5">
                  {f.type === "select" && (
                    <div className="mh-200px overflow-auto pe-2">
                      {f.options.map((opt) => {
                        const label = typeof opt === "object" ? opt.label : opt;
                        const value = typeof opt === "object" ? opt.value : opt;
                        return (
                          <label key={String(value)} className="form-check form-check-custom form-check-solid mb-4 mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={(
                                (values[f.key] as (string | number)[]) || []
                              ).includes(value)}
                              onChange={() => toggleValue(f.key, value)}
                            />
                            <span className="mx-3 form-check-label text-gray-800">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {f.type === "range" && (
                    <div className="d-flex flex-column gap-4 mt-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="form-control"
                        min="0"
                        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                        value={(values[f.key] as Range)?.min ?? ""}
                        onChange={(e) => setRange(f.key, "min", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="form-control"
                        min="0"
                        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                        value={(values[f.key] as Range)?.max ?? ""}
                        onChange={(e) => setRange(f.key, "max", e.target.value)}
                      />
                    </div>
                  )}

                  {f.type === "dateRange" && (
                    <div className="d-flex flex-column gap-4 mt-2">
                      <div className="d-flex flex-wrap gap-3">
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
                      <div className="separator my-1" />
                      <div className="d-flex flex-column gap-3">
                        <div>
                          <label className="text-muted fs-7 mb-2 d-block">From</label>
                          <input
                            type="date"
                            className="form-control"
                            value={(values[f.key] as DateRange)?.from ?? ""}
                            onChange={(e) => setRange(f.key, "from", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-muted fs-7 mb-2 d-block">To</label>
                          <input
                            type="date"
                            className="form-control"
                            value={(values[f.key] as DateRange)?.to ?? ""}
                            onChange={(e) => setRange(f.key, "to", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {f.type === "text" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Filter by ${f.label.toLowerCase()}`}
                        value={(values[f.key] as string) ?? ""}
                        onChange={(e) => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                      />
                    </div>
                  )}

                  {f.type === "boolean" && (
                    <div className="mt-2">
                      <label className="form-check form-check-custom form-check-solid mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={(values[f.key] as boolean) ?? false}
                          onChange={(e) => setValues(prev => {
                            const next = { ...prev };
                            if (e.target.checked) {
                              next[f.key] = true;
                            } else {
                              delete next[f.key];
                            }
                            return next;
                          })}
                        />
                        <span className="mx-3 form-check-label text-gray-800">Yes / Enabled</span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-5 py-4 d-flex gap-2 border-top">
          <button className="btn btn-light btn-sm w-100" onClick={() => {
            handleReset();
            triggerRef.current?.click();
          }}>
            Reset
          </button>
          <button
            className="btn btn-primary btn-sm w-100"
            onClick={() => {
              onFilterChange(values);
              triggerRef.current?.click();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export { FilterDropdown };
