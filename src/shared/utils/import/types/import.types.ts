export interface ImportColumn {
  header: string;
  field: string;
  required?: boolean;
  description?: string;
  aliases?: string[];
}

export interface ImportConfig {
  entityType: string;
  title: string;
  description: string;
  columns: ImportColumn[];
}

export interface ImportRowResult {
  rowIndex: number;
  success: boolean;
  error?: string;
  entityId?: string;
}

export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  rows: ImportRowResult[];
}
