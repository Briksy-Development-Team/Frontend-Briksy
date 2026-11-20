import { useEffect } from "react";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";

type Col = { accessor: string; Header: string; alwaysVisible?: boolean };

type Props = {
  columns: Col[];
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
};

const ColumnSelector = ({
  columns,
  visibleColumns,
  setVisibleColumns,
}: Props) => {
  useEffect(() => {
    setTimeout(() => MenuComponent.reinitialization(), 0);
  }, [columns, visibleColumns]);

  const toggle = (accessor: string) =>
    setVisibleColumns((prev) => {
      if (prev.includes(accessor))
        return prev.length === 1 ? prev : prev.filter((c) => c !== accessor);
      return [...prev, accessor];
    });

  return (
    <div className="position-relative">
      <button
        type="button"
        className="briksy-pill-btn"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v18" />
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M3 15h18" />
        </svg>
        <span>Columns</span>
      </button>

      <div
        className="menu menu-sub menu-sub-dropdown w-275px briksy-dropdown-menu"
        data-kt-menu="true"
      >
        <div className="px-5 py-3 fw-bold" style={{ color: "var(--briksy-dark-brown)" }}>
          Select Columns
        </div>
        <div className="separator mx-3" />
        <div className="px-3 py-3 mh-250px overflow-auto">
          {columns.map((col) => (
            <label
              key={col.accessor}
              className="d-flex align-items-center gap-2 px-3 py-2 rounded cursor-pointer"
              style={{ fontSize: 13, color: "var(--briksy-dark-brown)" }}
            >
              <input
                type="checkbox"
                className="form-check-input"
                checked={visibleColumns.includes(col.accessor)}
                onChange={() => toggle(col.accessor)}
                disabled={col.alwaysVisible}
              />
              <span>{col.Header}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ColumnSelector };
