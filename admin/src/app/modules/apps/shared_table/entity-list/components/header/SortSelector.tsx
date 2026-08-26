import { KTIcon } from "../../../../../../../_metronic/helpers";

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
      className="btn btn-light-primary d-flex align-items-center gap-2"
      data-kt-menu-trigger="click"
      data-kt-menu-placement="bottom-end"
    >
      <KTIcon iconName="sort" className="fs-3" />
      Sort
    </button>

    <div
      className="menu menu-sub menu-sub-dropdown w-275px py-3"
      data-kt-menu="true"
      style={{ maxHeight: 260, overflowY: "auto" }}
    >
      <div className="px-5 pb-2 fw-bold text-gray-700">Sort Options</div>
      <div className="separator my-2" />

      {columns.map((col, i) => (
        <div key={col.accessor}>
          <div className="px-5 pt-2 pb-1 fw-semibold text-gray-600">
            {col.Header}
          </div>

          {(["asc", "desc"] as const).map((dir) => (
            <div key={dir} className="menu-item px-3">
              <div
                className="menu-link d-flex justify-content-between align-items-center"
                onClick={() =>
                  onSortChange({ key: col.accessor, direction: dir })
                }
              >
                <span>{dir === "asc" ? "Low → High" : "High → Low"}</span>
                <KTIcon
                  iconName={dir === "asc" ? "arrow-up" : "arrow-down"}
                  className="fs-4 text-gray-600"
                />
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
