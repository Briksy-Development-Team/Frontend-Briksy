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

type Props = {
  filters: FilterConfig[];
  onFilterChange: (filters: Record<string, FilterValue>) => void;
  onReset?: () => void;
};

const SideFilter = ({ filters, onFilterChange, onReset }: Props) => {
  const [values, setValues] = useState<Record<string, FilterValue>>({});
  const [open, setOpen] = useState<string | null>(null);

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
  ) =>
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

  const getCount = (key: string) => {
    const val = values[key];
    if (!val) return 0;
    if (Array.isArray(val)) return val.length;
    if ("min" in val || "max" in val) return val.min || val.max ? 1 : 0;
    if ("from" in val || "to" in val) return val.from || val.to ? 1 : 0;
    return 0;
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
                      type="number"
                      placeholder="Min"
                      className="form-control"
                      value={(values[f.key] as Range)?.min ?? ""}
                      onChange={(e) => setRange(f.key, "min", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="form-control"
                      value={(values[f.key] as Range)?.max ?? ""}
                      onChange={(e) => setRange(f.key, "max", e.target.value)}
                    />
                  </div>
                )}

                {f.type === "dateRange" && (
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
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card-footer d-flex gap-2">
        <button
          className="btn btn-light w-100"
          onClick={() => {
            setValues({});
            if (onReset) {
              onReset();
            } else {
              onFilterChange({});
            }
          }}
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
