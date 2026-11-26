import React from "react";
import { useSelector } from "react-redux";
import type { TableSectionConfig } from "../../core/DetailTypes";
import { EntityList, type QueryParams } from "../../../shared_table/entity-list/EntityList";
import { useEntityTable } from "../../../shared_table/hooks/useEntityTable";

type Props<T> = {
  config: TableSectionConfig<T>;
  data: T;
};

export default function RelatedTable<T>({ config, data: entityData }: Props<T>) {
  const scope = config.scopeFilters?.(entityData);
  const summary = config.listingSummary?.(entityData);
  const withScope = (params: QueryParams) => scope
    ? { ...params, filters: { ...params.filters, ...scope } }
    : params;
  const { params, handleParamsChange } = useEntityTable(
    (params) => config.fetchFn(withScope(params), entityData),
    undefined,
    JSON.stringify([summary?.endpoint, scope]),
  );

  const rows = useSelector((state) => config.dataSelector(state, entityData)) || [];
  const total = useSelector((state) => config.totalSelector(state, entityData)) || 0;

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header border-0 pt-5 mb-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold text-gray-900">{config.title}</span>
        </h3>
      </div>
      <div className="card-body p-0">
        <EntityList
          entityName={config.title.toLowerCase()}
          listingSummary={summary}
          data={rows}
          total={total}
          params={withScope(params)}
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
