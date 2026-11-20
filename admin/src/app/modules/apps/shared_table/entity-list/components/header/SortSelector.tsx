type Col = { accessor: string; Header: string };
type SortConfig = { key: string; direction: "asc" | "desc" };

type Props = {
  columns: Col[];
  onSortChange: (config: SortConfig) => void;
};

const SortSelector = ({ columns, onSortChange }: Props) => (
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
        <path d="m3 16 4 4 4-4" />
        <path d="M7 20V4" />
        <path d="m21 8-4-4-4 4" />
        <path d="M17 4v16" />
      </svg>
      <span>Sort</span>
    </button>

    <div
      className="menu menu-sub menu-sub-dropdown w-275px py-3 briksy-dropdown-menu"
      data-kt-menu="true"
      style={{ maxHeight: 280, overflowY: "auto" }}
    >
      <div className="px-5 pb-2 fw-bold" style={{ color: "var(--briksy-dark-brown)" }}>
        Sort Options
      </div>
      <div className="separator my-2" />

      {columns.map((col, i) => (
        <div key={col.accessor}>
          <div className="px-5 pt-2 pb-1 fw-semibold" style={{ color: "var(--briksy-text-secondary)", fontSize: 12 }}>
            {col.Header}
          </div>

          {(["asc", "desc"] as const).map((dir) => (
            <div key={dir} className="menu-item px-3">
              <div
                className="menu-link d-flex justify-content-between align-items-center briksy-dropdown-item"
                onClick={() =>
                  onSortChange({ key: col.accessor, direction: dir })
                }
              >
                <span>{dir === "asc" ? "Ascending" : "Descending"}</span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  {dir === "asc" ? "↑" : "↓"}
                </span>
              </div>
            </div>
          ))}

          {i < columns.length - 1 && <div className="separator my-2" />}
        </div>
      ))}
    </div>
  </div>
);

export default SortSelector;
