import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { Column as CustomColumn } from "../EntityList";

type Props<T extends { id: string | number }> = {
  data: T[];
  columns: CustomColumn<T>[];
  enableRowClick?: boolean;
  getRowLink?: (row: T) => string;
  onEdit?: (row: T) => void;
  selectedRows?: Set<T["id"]>;
  onRowSelect?: (id: T["id"]) => void;
  onSelectAll?: (checked: boolean) => void;
};

const EntityTable = <T extends { id: string | number }>({
  data,
  columns,
  enableRowClick = false,
  getRowLink,
  onEdit,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
}: Props<T>) => {
  const navigate = useNavigate();

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<T>({
      columns: columns as any,
      data,
    });

  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const someSelected =
    selectedRows.size > 0 && selectedRows.size < data.length;

  const handleRowClick = (row: T) => {
    if (!enableRowClick || !getRowLink) return;

    navigate(getRowLink(row), {
      state: {
        data: row,
        columns: columns.map((c) => ({
          key: c.accessor,
          label: c.Header,
        })),
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
            {headerGroups.map((hg) => {
              const { key, ...hgRest } = hg.getHeaderGroupProps();

              return (
                <tr key={key} {...hgRest}>
                  {onRowSelect && (
                    <th style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected;
                        }}
                        onChange={(e) =>
                          onSelectAll?.(e.target.checked)
                        }
                      />
                    </th>
                  )}

                  {hg.headers.map((col) => {
                    const { key, ...colRest } = col.getHeaderProps();

                    return (
                      <th
                        key={key}
                        {...colRest}
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

                  <th style={{ width: 120, textAlign: "center" }}>
                    Action
                  </th>
                </tr>
              );
            })}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onRowSelect ? 2 : 1)}
                  className="text-center"
                >
                  No data found
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);

                const { key, ...rowRest } = row.getRowProps();
                const rowId = row.original.id;
                const isSelected = selectedRows.has(rowId);

                return (
                  <tr
                    key={key}
                    {...rowRest}
                    onClick={() => handleRowClick(row.original)}
                    style={{
                      whiteSpace: "nowrap",
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
                          onChange={() => onRowSelect(rowId)}
                        />
                      </td>
                    )}

                    {row.cells.map((cell) => {
                      const { key, ...cellRest } = cell.getCellProps();

                      return (
                        <td key={key} {...cellRest}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}

                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-light btn-active-light-primary"
                          data-bs-toggle="dropdown"
                        >
                          Actions
                        </button>

                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => onEdit?.(row.original)}
                            >
                              Edit
                            </button>
                          </li>

                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() =>
                                console.log("Block", row.original)
                              }
                            >
                              Block
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
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