import { useEffect } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";
import { SideFilter } from "./SideFilter";

type Props = {
  filters: any[];
  onFilterChange: (filters: Record<string, any>) => void;
  activeCount?: number;
};

const FilterDropdown = ({ filters, onFilterChange, activeCount = 0 }: Props) => {
  useEffect(() => {
    setTimeout(() => MenuComponent.reinitialization(), 0);
  }, [filters]);

  const handleApply = (values: Record<string, any>) => {
    onFilterChange(values);
    MenuComponent.hideDropdowns(undefined);
  };

  const handleReset = () => {
    onFilterChange({});
    MenuComponent.hideDropdowns(undefined); 
  };

  return (
    <div className="position-relative">
    
      <button
        type="button"
        className={`btn d-flex align-items-center gap-2 ${
          activeCount > 0 ? "btn-primary" : "btn-light-primary"
        }`}
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon iconName="filter" className="fs-3" />
        Filter
        {activeCount > 0 && (
          <span
            className="badge badge-circle badge-white ms-1 fw-bold"
            style={{ fontSize: 11, minWidth: 18, height: 18, color: "var(--kt-primary)" }}
          >
            {activeCount}
          </span>
        )}
      </button>

      <div
        className="menu menu-sub menu-sub-dropdown"
        data-kt-menu="true"
        data-kt-menu-permanent="true"
        style={{ width: 360, maxHeight: "70vh", overflowY: "auto" }}
      >
        <SideFilter
          filters={filters}
          onFilterChange={handleApply}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};

export { FilterDropdown };
