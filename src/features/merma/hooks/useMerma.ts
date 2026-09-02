/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { ModelDTO } from "../types/merma.types";
import { getAll } from "../services/merma.service";

export function useMerma() {
  const [mermas, setMerma] = useState<ModelDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);

    try {
      const data = await getAll();
      const mapped: ModelDTO[] = data.map((t: any) => ({
        mermaId: t.mermaId,
        motivo: t.motivo,
        cantidad: t.cantidad,
        fecha: t.fecha,
        urlImagen: t.urlImagen,
        activo: t.activo,
        recetaId: t.recetaId ?? "",
        receta: t.receta ?? null,
        subRecetaId: t.subRecetaId ?? "",
        subReceta: t.subReceta ?? null,
        unidadMedidaId: t.unidadMedidaId ?? "",
        unidadMedida: t.unidadMedida ?? null,
        areaPreparacionId: t.areaPreparacionId ?? "",
        areaPreparacion: t.areaPreparacion ?? null,
      }));
      setMerma(mapped);
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
    mermas,
    loading,
    refetch,
  };
}
