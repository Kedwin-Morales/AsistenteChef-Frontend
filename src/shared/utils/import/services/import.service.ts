import api from "@/shared/services/api.instance";
import type { ImportResult } from "../types/import.types";

export const importEntities = async (
  entityType: string,
  rows: Record<string, string>[]
): Promise<ImportResult> => {
  const { data } = await api.post("Import", {
    entityType,
    rows,
  });
  return data;
};
