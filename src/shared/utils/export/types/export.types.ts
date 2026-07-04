export interface ExportColumn {
  header: string;
  field: string;
  formatter?: (value: any) => string;
}

export interface ExportConfig {
  entityType: string;
  title: string;
  fileName: string;
  columns: ExportColumn[];
}

export interface ExportOptions {
  format: "xlsx" | "xls";
  includeHeaders: boolean;
  fileName?: string;
}