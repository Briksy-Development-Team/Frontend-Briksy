import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";

type ExportColumn = {
  accessor: string;
  Header: string;
};

export const exportToExcel = async (
  data: Record<string, unknown>[],
  columns: ExportColumn[],
): Promise<void> => {
  if (!data.length) return;

  // 1. Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // 2. Define columns
  worksheet.columns = columns.map((col) => ({
    header: col.Header,
    key: col.accessor,
    width: 20, // Set a default width
  }));

  // 3. Add rows
  worksheet.addRows(data);

  // 4. Style the header row
  worksheet.getRow(1).font = { bold: true };

  // 5. Generate buffer and save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "table_data.xlsx");
};
