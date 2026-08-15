/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { ModelDTO } from "../types/receta.types";
import { getAll } from "../services/receta.service";

export function useReceta() {
  const [recetas, setReceta] = useState<ModelDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);

    try {
      const data = await getAll();
      const mapped: ModelDTO[] = data.map((t: any) => ({
        recetaId: t.recetaId,
        nombre: t.nombre,
        descripcion: t.descripcion,
        porciones: t.porciones,
        rendimiento: t.rendimiento,
        activo: t.activo,
        detalle: t.detalle,
        detPreparacion: t.detPreparacion,
      }));
      setReceta(mapped);
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  return {
    recetas,
    loading,
    refetch,
  };
}
