import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import type { Column as CustomColumn } from "../EntityList";
import { usePermissionAccess } from "../../../../auth";

export type RowAction<T> = {
  label: string;
  className?: string;
  permission?: string;
  icon?: string;
  showIf?: (row: T) => boolean;
  onClick: (row: T) => void;
};

type Props<T extends { id: string | number }> = {
  data: T[];
  columns: CustomColumn<T>[];
  enableRowClick?: boolean;
  getRowLink?: (row: T) => string;
  selectedRows?: Set<T["id"]>;
  onRowSelect?: (id: T["id"]) => void;
  onSelectAll?: (checked: boolean) => void;
  rowActions?: RowAction<T>[];
};

const BORDER = "1px solid #e4e6ef";
const HEADER_BG = "#f5f8fa";
const STICKY_BORDER = "2px solid #d1d5e0";

const EntityTable = <T extends { id: string | number }>({
  data,
  columns,
  enableRowClick = false,
  getRowLink,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
  rowActions,
}: Props<T>) => {
  const navigate = useNavigate();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<T>({ columns: columns as any, data });
  const { hasPermission } = usePermissionAccess();
  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;
  const visibleActions =
    rowActions?.filter((a) => !a.permission || hasPermission(a.permission)) ?? [];
  const hasActions = visibleActions.length > 0;

  const handleRowClick = (row: T) => {
    if (!enableRowClick || !getRowLink) return;
    navigate(getRowLink(row), {
      state: {
        data: row,
        columns: columns.map((c) => ({ key: c.accessor, label: c.Header })),
      },
    });
  };

  // border-collapse: separate lets sticky cells keep their own borders
  const thBase: React.CSSProperties = {
    padding: "11px 14px",
    fontSize: "11.5px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#5e6278",
    background: HEADER_BG,
    border: BORDER,
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 2,
  };

  const tdBase = (isSelected: boolean, isClickable: boolean): React.CSSProperties => ({
    padding: "11px 14px",
    fontSize: "13.5px",
    color: "#3f4254",
    border: BORDER,
    whiteSpace: "nowrap",
    cursor: isClickable ? "pointer" : "default",
    background: isSelected ? "rgba(245,85,26,0.06)" : "#fff",
  });

  return (
    <KTCardBody className="p-0">
      <div
        className="table-responsive"
        style={{
          border: BORDER,
          borderRadius: 8,
          overflowX: "auto",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        <table
          {...getTableProps()}
          style={{
            width: "100%",
            borderCollapse: "separate", // key: each cell owns its border → sticky works
            borderSpacing: 0,
            margin: "0 0 16px 0",
          }}
        >
          <thead>
            {headerGroups.map((hg: any) => {
              const { key, ...rest } = hg.getHeaderGroupProps();
              return (
                <tr key={key} {...rest}>
                  {/* Sticky checkbox header */}
                  {onRowSelect && (
                    <th
                      style={{
                        ...thBase,
                        width: 50,
                        textAlign: "center",
                        position: "sticky",
                        left: 0,
                        zIndex: 3,
                        borderRight: STICKY_BORDER,
                      }}
                    >
                      <div className="form-check form-check-sm form-check-custom form-check-solid d-flex justify-content-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => { if (el) el.indeterminate = someSelected; }}
                          onChange={(e) => onSelectAll?.(e.target.checked)}
                        />
                      </div>
                    </th>
                  )}

                  {hg.headers.map((col: any) => {
                    const { key, ...rest } = col.getHeaderProps();
                    return (
                      <th key={key} {...rest} style={thBase}>
                        {col.render("Header")}
                      </th>
                    );
                  })}

                  {hasActions && (
                    <th style={{ ...thBase, width: 110, textAlign: "center" }}>Actions</th>
                  )}
                </tr>
              );
            })}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onRowSelect ? 1 : 0) + (hasActions ? 1 : 0)}
                  style={{ textAlign: "center", padding: "60px 16px", color: "#a1a5b7", fontSize: 14, border: BORDER }}
                >
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((row: any) => {
                prepareRow(row);
                const { key, ...rest } = row.getRowProps();
                const isSelected = selectedRows.has(row.original.id);
                const isClickable = !!(enableRowClick && getRowLink);
                const rowActionsForItem = visibleActions.filter(
                  (a) => !a.showIf || a.showIf(row.original)
                );
                return (
                  <tr
                    key={key}
                    {...rest}
                    onClick={() => handleRowClick(row.original)}
                    style={{ background: isSelected ? "rgba(245,85,26,0.06)" : "#fff" }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        (e.currentTarget as HTMLElement).style.background = "#f9f9f9";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        (e.currentTarget as HTMLElement).style.background = "#fff";
                    }}
                  >
                    {/* Sticky checkbox cell */}
                    {onRowSelect && (
                      <td
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          ...tdBase(isSelected, false),
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          textAlign: "center",
                          padding: "11px 0",
                          borderRight: STICKY_BORDER,
                          background: isSelected ? "rgba(245,85,26,0.06)" : "#fff",
                        }}
                      >
                        <div className="form-check form-check-sm form-check-custom form-check-solid d-flex justify-content-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onRowSelect(row.original.id)}
                          />
                        </div>
                      </td>
                    )}

                    {row.cells.map((cell: any) => {
                      const { key, ...rest } = cell.getCellProps();
                      return (
                        <td key={key} {...rest} style={tdBase(isSelected, isClickable)}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}

                    {hasActions && (
                      <td
                        onClick={(e) => e.stopPropagation()}
                        style={{ ...tdBase(isSelected, false), textAlign: "center" }}
                      >
                        {rowActionsForItem.length > 0 ? (
                          <div className="dropdown">
                            <button
                              type="button"
                              data-bs-toggle="dropdown"
                              className="btn btn-sm fw-semibold"
                              style={{
                                background: "#fff",
                                color: "#3f4254",
                                border: "1px solid #e4e6ef",
                                borderRadius: 6,
                                padding: "5px 14px",
                                fontSize: 13,
                              }}
                            >
                              Actions ▾
                            </button>
                            <ul
                              className="dropdown-menu dropdown-menu-end"
                              style={{
                                borderRadius: 10,
                                marginTop: 6,
                                border: "1px solid #ececec",
                                boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
                                minWidth: 175,
                                padding: "6px",
                              }}
                            >
                              {rowActionsForItem.map((action) => (
                                <li key={action.label}>
                                  <button
                                    type="button"
                                    className={`dropdown-item fw-medium rounded ${action.className ?? ""}`}
                                    style={{ fontSize: 13, padding: "9px 12px", borderRadius: 6 }}
                                    onClick={() => action.onClick(row.original)}
                                  >
                                    {action.label}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <span style={{ color: "#c5c7cd" }}>—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </KTCardBody>
  );
};

export { EntityTable };
