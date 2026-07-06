import { useState, useEffect, useCallback } from "react";
import { getAll } from "../services/categoriaPlatos.service";
import type { ModelDTO } from "../types/categoria.types";

export function useCategoriaPlato() {
  const [categorias, setModels] = useState<ModelDTO[]>([]);
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
    let alive = true;

    const load = async () => {
      if (!alive) return;
      await refetch();
    };

    load();

    return () => {
      alive = false;
    };
  }, [refetch]);

  return { categorias, loading, refetch };
}
