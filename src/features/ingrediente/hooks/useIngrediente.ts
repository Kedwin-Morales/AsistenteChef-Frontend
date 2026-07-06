import { useState, useEffect, useCallback } from "react";
import { getAll, getTipo, getUnidad } from "../services/ingrediente.service";
import type { ModelDTO, TipoIngredienteDTO, UnidadMedidaDTO } from "../types/ingrediente.types";

export function useIngrediente() {
  const [ingredientes, setModels] = useState<ModelDTO[]>([]);
  const [tipos, setTipos] = useState<TipoIngredienteDTO[]>([]);
  const [unidades, setUnidades] = useState<UnidadMedidaDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [m, t, u] = await Promise.all([getAll(), getTipo(), getUnidad()]);
      setModels(m);
      setTipos(t);
      setUnidades(u);
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

  return { ingredientes, tipos : tipos.filter(t => t.activo), unidades : unidades.filter(t => t.activo), loading, refetch };
}
