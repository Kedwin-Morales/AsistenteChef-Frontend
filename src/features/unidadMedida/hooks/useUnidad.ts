import { useState, useEffect, useCallback } from "react";
import { getAll } from "../services/unidad.service";
import type { ModelDTO } from "../types/unidad.types";

export function useModels() {
  const [models, setModels] = useState<ModelDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [m] = await Promise.all([getAll()]);
      setModels(m);
    } catch {
      // handled in page
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { models, loading, refetch };
}
