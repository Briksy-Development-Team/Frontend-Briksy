import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportToExcel = (data: any[], columns: any[]) => {
  if (!data.length) return

  const formatted = data.map((row) => {
    const obj: any = {}

    columns.forEach((col) => {
      const key = col.accessor
      obj[col.Header] = row[key] ?? ''
    })

    return obj
  })

  const ws = XLSX.utils.json_to_sheet(formatted)
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, 'Data')

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

  const blob = new Blob([buffer], {
    type:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  })

  saveAs(blob, 'table_data.xlsx')
}