import { saveAs } from "file-saver";

type ExportColumn = {
  accessor: string;
  Header: string;
};

export const exportToExcel = async (
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  fileName = "table_data.xlsx",
): Promise<void> => {
  if (!data.length) return;

  // Lazy-load exceljs only when export is actually triggered
  const ExcelJS = await import("exceljs");

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  worksheet.columns = columns.map((col) => ({
    header: col.Header,
    key: col.accessor,
    width: 20,
  }));

  worksheet.addRows(data);

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);
};
