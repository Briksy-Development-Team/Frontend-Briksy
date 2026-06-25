import React from "react";
import type { DetailConfig } from "../core/DetailTypes";
import { KTIcon } from "../../../../../_metronic/helpers";
import type { RowAction } from "../../shared_table/entity-list/table/EntityTable";
import { getAuth } from "../../../auth/core/AuthHelpers";

type Props<T> = {
  config: DetailConfig<T>["header"];
  data: T;
  rowActions?: RowAction<T>[];
};

export default function WorkspaceHeader<T>({ config, data, rowActions }: Props<T>) {
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];
  const visibleActions = rowActions?.filter(
    (action) => !action.permission || abilities.includes(action.permission)
  ) ?? [];
  // Helpers to resolve accessors safely
  const resolveValue = (accessor: keyof T | ((data: T) => React.ReactNode)) => {
    if (typeof accessor === "function") {
      return accessor(data);
    }
    return data[accessor] as React.ReactNode;
  };

  const resolveString = (accessor: keyof T | ((data: T) => string)) => {
    if (typeof accessor === "function") {
      return accessor(data);
    }
    return String(data[accessor] || "");
  };

  const title = resolveValue(config.titleAccessor);
  const subtitle = config.subtitleAccessor ? resolveValue(config.subtitleAccessor) : null;
  const avatarUrl = config.avatarAccessor ? resolveString(config.avatarAccessor as any) : null;

  return (
    <div className="card shadow-sm mb-5 mb-xl-10">
      <div className="card-body pt-9 pb-0">
        <div className="d-flex flex-wrap flex-sm-nowrap">
          {/* Avatar Area */}
          {config.avatarAccessor && (
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" style={{ objectFit: "cover" }} />
                ) : (
                  <div className="symbol-label fs-1 fw-bold bg-light-primary text-primary">
                    {typeof title === "string" ? title.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                {/* Could add online status dot here if needed later */}
              </div>
            </div>
          )}

          {/* Info Area */}
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <h1 className="text-gray-900 fs-2 fw-bolder me-1 mb-0">{title}</h1>
                  
                  {/* Badges */}
                  {config.badges?.map((badge, idx) => {
                    if (badge.showIf && !badge.showIf(data)) return null;
                    const label = resolveString(badge.label);
                    const color = typeof badge.color === "function" ? badge.color(data) : badge.color;
                    return (
                      <span key={idx} className={`badge badge-light-${color} fw-bold ms-2 fs-8`}>
                        {label}
                      </span>
                    );
                  })}
                </div>

                {subtitle && (
                  <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                    <span className="d-flex align-items-center text-gray-500 me-5 mb-2">
                      {subtitle}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics */}
            {config.metrics && config.metrics.length > 0 && (
              <div className="d-flex flex-wrap flex-stack">
                <div className="d-flex flex-column flex-grow-1 pe-8">
                  <div className="d-flex flex-wrap">
                    {config.metrics.map((metric, idx) => (
                      <div key={idx} className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="fs-2 fw-bolder text-gray-800">
                            {resolveValue(metric.valueAccessor)}
                          </div>
                        </div>
                        <div className="fw-bold fs-6 text-gray-500">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {visibleActions.length > 0 && (
              <div className="d-flex flex-wrap mt-4">
                {visibleActions.map((action, idx) => (
                  <button
                    key={idx}
                    className={`btn btn-sm btn-light-primary me-3 mb-2 ${action.className ?? ""}`}
                    onClick={() => action.onClick(data)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}