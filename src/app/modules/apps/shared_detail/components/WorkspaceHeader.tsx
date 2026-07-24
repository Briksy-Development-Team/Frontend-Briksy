import React from "react";
import type { DetailConfig } from "../core/DetailTypes";
import { KTIcon } from "../../../../../_metronic/helpers";
import type { RowAction } from "../../shared_table/entity-list/table/EntityTable";
import { usePermissionAccess } from "../../../auth";

type Props<T> = {
  config: DetailConfig<T>["header"];
  data: T;
  rowActions?: RowAction<T>[];
};

export default function WorkspaceHeader<T>({
  config,
  data,
  rowActions,
}: Props<T>) {
  const { hasPermission } = usePermissionAccess();

  const visibleActions =
    rowActions?.filter(
      (action) => (!action.permission || hasPermission(action.permission)) && (!action.showIf || action.showIf(data))
    ) ?? [];

  const resolveValue = (
    accessor: keyof T | ((data: T) => React.ReactNode)
  ) => {
    if (typeof accessor === "function") return accessor(data);
    return data[accessor] as React.ReactNode;
  };

  const resolveString = (accessor: keyof T | ((data: T) => string)) => {
    if (typeof accessor === "function") return accessor(data);
    return String(data[accessor] || "");
  };

  const resolveMetricLabel = (
    label: string | ((data: T) => React.ReactNode)
  ) => {
    if (typeof label === "function") return label(data);
    return label;
  };

  const title = resolveValue(config.titleAccessor);
  const subtitle = config.subtitleAccessor
    ? resolveValue(config.subtitleAccessor)
    : null;

  const avatarUrl = config.avatarAccessor
    ? resolveString(config.avatarAccessor as any)
    : null;

  return (
    <div className="card shadow-sm mb-5 mb-xl-10">
      <div className="card-body pt-9 pb-8">
        <div className="d-flex flex-wrap flex-sm-nowrap">
          {/* Avatar */}
          {config.avatarAccessor && (
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="symbol-label fs-1 fw-bold bg-light-primary text-primary">
                    {typeof title === "string"
                      ? title.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-grow-1">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start flex-wrap mb-5">
              <div>
                <div className="d-flex align-items-center flex-wrap mb-2">
                  <h1 className="text-gray-900 fs-2hx fw-bold me-3 mb-0">
                    {title}
                  </h1>

                  {config.badges?.map((badge, idx) => {
                    if (badge.showIf && !badge.showIf(data)) return null;

                    const label = resolveString(badge.label);
                    const color =
                      typeof badge.color === "function"
                        ? badge.color(data)
                        : badge.color;

                    return (
                      <span
                        key={idx}
                        className={`badge badge-light-${color} fw-semibold ms-2`}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>

                {subtitle && (
                  <div className="text-gray-600 fw-semibold fs-6">
                    {subtitle}
                  </div>
                )}
              </div>

              {/* Actions */}
              {visibleActions.length > 0 && (
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-light-primary"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Actions
                    <KTIcon iconName="down" className="fs-6 ms-2" />
                  </button>

                  <div className="dropdown-menu dropdown-menu-end w-225px py-2">
                    {visibleActions.map((action, idx) => {
                      const isDelete = action.label
                        .toLowerCase()
                        .includes("delete");

                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`dropdown-item d-flex align-items-center py-3 ${isDelete ? "text-danger" : ""
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            action.onClick(data);
                          }}
                        >
                          {action.icon && (
                            <KTIcon
                              iconName={action.icon}
                              className={`fs-3 me-3 ${isDelete ? "text-danger" : ""
                                }`}
                            />
                          )}

                          <span>{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics */}
            {config.metrics &&
              config.metrics.some(
                (metric) => !metric.showIf || metric.showIf(data)
              ) && (
                <div className="d-flex flex-wrap">
                  {config.metrics.map((metric, idx) => {
                    if (metric.showIf && !metric.showIf(data)) return null;

                    return (
                      <div
                        key={idx}
                        className="border border-gray-300 border-dashed rounded min-w-150px py-4 px-5 me-5 mb-4"
                      >
                        <div className="fs-2 fw-bold text-gray-900">
                          {resolveValue(metric.valueAccessor)}
                        </div>

                        <div className="fw-semibold fs-7 text-gray-500 mt-1">
                          {resolveMetricLabel(metric.label)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
