/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { ModelDTO } from "../types/montaje.types";
import { getAll } from "../services/montaje.service";

export function useMontaje() {
  const [montajes, setMontaje] = useState<ModelDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);

    try {
      const data = await getAll();
      const mapped: ModelDTO[] = data.map((t: any) => ({
        montajeId: t.montajeId,
        nombre: t.nombre,
        descripcion: t.descripcion,
        porciones: t.porciones,
        costoUnidad: t.costoUnidad,
        costoPorcion: t.costoPorcion,
        precio: t.precio,
        fecha: t.fecha,
        urlImagen: t.urlImagen,
        activo: t.activo,
        categoriaId: t.categoriaId ?? "",
        CategoriasPlato: t.CategoriasPlato ?? t.categoriasPlato ?? null,
        areaPreparacionId: t.areaPreparacionId ?? "",
        areaPreparacion: t.areaPreparacion ?? null,
        detalle: t.detalle,
        detPreparacion: t.detPreparacion,
      }));
      setMontaje(mapped);
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
    montajes,
    loading,
    refetch,
  };
}
