import type { ImportConfig } from "../types/import.types";

export const importConfigs: Record<string, ImportConfig> = {
  Ingredientes: {
    entityType: "Ingredientes",
    title: "Importar Ingredientes",
    description: "Procesar el archivo (Excel) con los siguientes datos:",
    columns: [
        { header: "Nombre", field: "nombre", required: true, description: "Debe ser único" },
        { header: "Tipo", field: "tipo", required: true, description: "Debe asignar un tipo de ingrediente" },   
        { header: "Ud. Medida", field: "unidad", required: true, description: "Debe asignar una unidad de medidad" },
        { header: "Costo", field: "costo" },   
        { header: "Código", field: "codigo" },   
        { header: "Descripción", field: "descripcion" },   
    ],
  },
  Usuario: {
    entityType: "Usuario",
    title: "Importar Usuarios",
    description: "Sube un archivo Excel con los datos de los usuarios. Si no se especifica contraseña se generará una automática.",
    columns: [
      { header: "Documento", field: "documento", required: true, description: "Debe ser único. Se usará como username" },
      { header: "Nombre", field: "nombre", required: true },
      { header: "Apellido", field: "apellido" },
      { header: "Rol", field: "rol", required: true, description: "Debe coincidir con un rol existente (Admin, Gerente, etc.)" },
      { header: "Sede", field: "sede", required: true, description: "Debe coincidir con el nombre de una sede activa" },
      { header: "Tipo Documento", field: "tipoDocumento", description: "Ej: Cédula, Pasaporte, etc." },
      { header: "Contraseña", field: "contraseña", description: "Si se omite se genera automática con el documento" },
      { header: "EMPRESA", field: "empresa", description: "Nombre de la empresa" },
      { header: "ACTIVO", field: "activo", description: "true/false o 1/0. Por defecto true" },
    ],
  },
};
