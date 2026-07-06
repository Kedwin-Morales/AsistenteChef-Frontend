/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { ModelDTO } from "../types/areaPreparacion.types";
import { getAll } from "../services/areaPreparacion.service";

export function useAreaPreparacion() {
  const [areas, setArea] = useState<ModelDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);

    try {
      const data = await getAll();
      const mapped: ModelDTO[] = data.map((p: any) => ({
        areaPreparacionId: p.areaPreparacionId,
        nombre: p.nombre,
        descripcion: p.descripcion,
        activo: p.activo,
        detalle: p.detalle,
      }));

      setArea(mapped);
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
    areas,
    loading,
    refetch,
  };
}