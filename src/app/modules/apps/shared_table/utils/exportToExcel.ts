import { saveAs } from "file-saver";

type ExportColumn = {
  accessor: string;
  Header: string;
};

export const exportToExcel = async (
  data: Record<string, unknown>[],
  columns: ExportColumn[],
): Promise<void> => {
  if (!data.length) return;

  const XLSX = await import("xlsx");

  const formatted = data.map((row) => {
    const obj: Record<string, unknown> = {};

    columns.forEach((col) => {
      obj[col.Header] = row[col.accessor] ?? "";
    });

    return obj;
  });

  const ws = XLSX.utils.json_to_sheet(formatted);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Data");

  const buffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, "table_data.xlsx");
};
