import React from "react";
import { useSelector } from "react-redux";
import type { TableSectionConfig } from "../../core/DetailTypes";
import { EntityList } from "../../../shared_table/entity-list/EntityList";
import { useEntityTable } from "../../../shared_table/hooks/useEntityTable";

type Props<T> = {
  config: TableSectionConfig<T>;
};

export default function RelatedTable<T>({ config }: Props<T>) {
  const { params, handleParamsChange } = useEntityTable(config.fetchFn);

  const data = useSelector(config.dataSelector) || [];
  const total = useSelector(config.totalSelector) || 0;

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header border-0 pt-5 mb-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold text-gray-900">{config.title}</span>
        </h3>
      </div>
      <div className="card-body p-0">
        <EntityList
          data={data}
          total={total}
          params={params}
          onParamsChange={handleParamsChange}
          columns={config.columns}
          filtersConfig={config.filtersConfig}
          enableRowClick={config.enableRowClick}
          getRowLink={config.getRowLink}
          rowActions={config.rowActions}
          storageKey={`related_table_${config.id}`}
        />
      </div>
    </div>
  );
}