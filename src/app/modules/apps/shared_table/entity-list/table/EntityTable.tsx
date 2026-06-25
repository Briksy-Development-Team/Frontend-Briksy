import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import type { Column as CustomColumn } from "../EntityList";
import { getAuth } from "../../../../auth/core/AuthHelpers";
export type RowAction<T> = {
  label: string;
  className?: string;
  permission?: string;
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
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];
  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;
  const visibleActions =
    rowActions?.filter(
      (action) => !action.permission || abilities.includes(action.permission),
    ) ?? [];
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

  return (
    <KTCardBody>
      <div className="table-responsive border rounded">
        <table
          className="table align-middle table-bordered fs-4 g-6 table-row-gray-300"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((hg: any) => {
              const { key, ...rest } = hg.getHeaderGroupProps();
              return (
                <tr key={key} {...rest}>
                  {onRowSelect && (
                    <th style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected;
                        }}
                        onChange={(e) => onSelectAll?.(e.target.checked)}
                      />
                    </th>
                  )}
                  {hg.headers.map((col: any) => {
                    const { key, ...rest } = col.getHeaderProps();
                    return (
                      <th
                        key={key}
                        {...rest}
                        style={{
                          whiteSpace: "nowrap",
                          fontWeight: 800,
                          fontSize: "16px",
                        }}
                      >
                        {col.render("Header")}
                      </th>
                    );
                  })}
                  {hasActions && (
                    <th style={{ width: 120, textAlign: "center" }}>Action</th>
                  )}
                </tr>
              );
            })}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (onRowSelect ? 1 : 0) +
                    (hasActions ? 1 : 0)
                  }
                  className="text-center py-10 text-muted"
                >
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((row: any) => {
                prepareRow(row);
                const { key, ...rest } = row.getRowProps();
                const isSelected = selectedRows.has(row.original.id);

                return (
                  <tr
                    key={key}
                    {...rest}
                    onClick={() => handleRowClick(row.original)}
                    style={{
                      whiteSpace: "nowrap",
                      cursor:
                        enableRowClick && getRowLink ? "pointer" : "default",
                      backgroundColor: isSelected
                        ? "rgba(var(--bs-primary-rgb), 0.05)"
                        : undefined,
                    }}
                  >
                    {onRowSelect && (
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onRowSelect(row.original.id)}
                        />
                      </td>
                    )}
                    {row.cells.map((cell: any) => {
                      const { key, ...rest } = cell.getCellProps();
                      return (
                        <td key={key} {...rest}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                    {hasActions && (
                      <td
                        onClick={(e) => e.stopPropagation()}
                        style={{ textAlign: "center" }}
                      >
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-light btn-active-light-primary"
                            data-bs-toggle="dropdown"
                          >
                            Actions
                          </button>
                          <ul className="dropdown-menu">
                            {visibleActions!.map((action) => (
                              <li key={action.label}>
                                <button
                                  className={`dropdown-item ${action.className ?? ""}`}
                                  onClick={() => action.onClick(row.original)}
                                >
                                  {action.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
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
