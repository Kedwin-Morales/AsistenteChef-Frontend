/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { ModelSubDTO } from "../types/subReceta.types";
import { getAll } from "../services/subReceta.service";

export function useSubReceta() {
  const [subRecetas, setReceta] = useState<ModelSubDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);

    try {
      const data = await getAll();
      const mapped: ModelSubDTO[] = data.map((t: any) => ({
        subRecetaId: t.subRecetaId,
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
    subRecetas,
    loading,
    refetch,
  };
}
