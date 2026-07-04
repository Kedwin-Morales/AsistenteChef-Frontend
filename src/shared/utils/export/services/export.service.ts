import * as XLSX from "xlsx";
import type { ExportConfig, ExportOptions } from "../types/export.types";

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function formatValue(value: any, formatter?: (value: any) => string): string {
  if (formatter) return formatter(value);
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function exportToExcel(
  data: any[],
  config: ExportConfig,
  options: ExportOptions = { format: "xlsx", includeHeaders: true }
): void {
  const workbook = XLSX.utils.book_new();

  const headers = config.columns.map((col) => col.header);
  const rows = data.map((item) =>
    config.columns.map((col) => formatValue(getNestedValue(item, col.field), col.formatter))
  );

  const sheetData = options.includeHeaders ? [headers, ...rows] : rows;
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  const colWidths = config.columns.map((col) => ({
    wch: Math.max(col.header.length, 15),
  }));
  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, config.entityType);

  const fileName = options.fileName || `${config.fileName}_${new Date().toISOString().split("T")[0]}`;
  const extension = options.format === "xls" ? "xls" : "xlsx";
  
  XLSX.writeFile(workbook, `${fileName}.${extension}`);
}

export async function exportEntities(
  entityType: string,
  data: any[],
  config: ExportConfig,
  options: ExportOptions = { format: "xlsx", includeHeaders: true }
): Promise<void> {
  exportToExcel(data, config, options);
}