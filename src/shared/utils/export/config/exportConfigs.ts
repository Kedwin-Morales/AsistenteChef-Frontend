import type { ExportConfig } from "../types/export.types";

export const exportConfigs: Record<string, ExportConfig> = {
  Ingredientes: {
    entityType: "Ingredientes",
    title: "Exportar Datos Ingredientes",
    fileName: "ingredientes",
    columns: [
      { header: "ID", field: "ingredienteId" },
      { header: "Nombre", field: "nombre" },
      { header: "Código", field: "codigo" },
      { header: "Tipo", field: "tipoIngrediente?.nombre" },
      { header: "Unidad de Medida", field: "unidadMedida?.nombre" },
      { header: "Símbolo", field: "unidadMedida?.simbolo" },
      { header: "Costo", field: "costo" },
      { header: "Descripción", field: "descripcion" },
      {
        header: "Estado",
        field: "activo",
        formatter: (value) => (value ? "Activo" : "Inactivo"),
      },
      {
        header: "Fecha Creación",
        field: "fechaCreacion",
        formatter: (value) => (value ? new Date(value).toLocaleDateString() : ""),
      },
    ],
  },
  IngredientesFormat: {
    entityType: "Ingredientes",
    title: "Formato para Ingredientes",
    fileName: "FormatoIngredientes",
    columns: [
        { header: "Nombre", field: "nombre" },
        { header: "Tipo", field: "tipo" },   
        { header: "Ud. Medida", field: "unidad"},
        { header: "Costo", field: "costo" },   
        { header: "Código", field: "codigo" },   
        { header: "Descripción", field: "descripcion" },   
    ],
  },
  Usuario: {
    entityType: "Usuario",
    title: "Exportar Usuarios",
    fileName: "usuarios",
    columns: [
      { header: "ID", field: "usuarioId" },
      { header: "Documento", field: "documento" },
      { header: "Nombre", field: "nombre" },
      { header: "Apellido", field: "apellido" },
      { header: "Rol", field: "rol" },
      { header: "Sede", field: "sede" },
      { header: "Tipo Documento", field: "tipoDocumento" },
      { header: "Empresa", field: "empresa" },
      {
        header: "Activo",
        field: "activo",
        formatter: (value) => (value ? "Activo" : "Inactivo"),
      },
      {
        header: "Fecha Creación",
        field: "fechaCreacion",
        formatter: (value) => (value ? new Date(value).toLocaleDateString() : ""),
      },
    ],
  },
  Role: {
    entityType: "Role",
    title: "Exportar Roles",
    fileName: "roles",
    columns: [
      { header: "ID", field: "roleId" },
      { header: "Nombre", field: "nombre" },
      { header: "Descripción", field: "descripcion" },
      {
        header: "Activo",
        field: "activo",
        formatter: (value) => (value ? "Activo" : "Inactivo"),
      },
    ],
  },
  FamiliaMenu: {
    entityType: "FamiliaMenu",
    title: "Exportar Familias de Menú",
    fileName: "familias-menu",
    columns: [
      { header: "ID", field: "familiaMenuId" },
      { header: "Nombre", field: "nombre" },
      { header: "Descripción", field: "descripcion" },
      {
        header: "Activo",
        field: "activo",
        formatter: (value) => (value ? "Activo" : "Inactivo"),
      },
    ],
  },
  CategoriaPlato: {
    entityType: "CategoriaPlato",
    title: "Exportar Categorías de Plato",
    fileName: "categorias-plato",
    columns: [
      { header: "ID", field: "categoriaPlatoId" },
      { header: "Nombre", field: "nombre" },
      { header: "Descripción", field: "descripcion" },
      {
        header: "Activo",
        field: "activo",
        formatter: (value) => (value ? "Activo" : "Inactivo"),
      },
    ],
  },
  Proveedor: {
    entityType: "Proveedor",
    title: "Exportar Proveedores",
    fileName: "proveedores",
    columns: [
      { header: "ID", field: "proveedorId" },
      { header: "Nombre", field: "nombre" },
      { header: "Contacto", field: "contacto" },
      { header: "Teléfono", field: "telefono" },
      { header: "Email", field: "email" },
      { header: "Dirección", field: "direccion" },
      {
        header: "Activo",
        field: "activo",
        formatter: (value) => (value ? "Activo" : "Inactivo"),
      },
    ],
  },
  TipoIngrediente: {
    entityType: "TipoIngrediente",
    title: "Exportar Tipos de Ingrediente",
    fileName: "tipos-ingrediente",
    columns: [
      { header: "ID", field: "tipoIngredienteId" },
      { header: "Nombre", field: "nombre" },
      { header: "Descripción", field: "descripcion" },
      {
        header: "Activo",
        field: "activo",
        formatter: (value) => (value ? "Activo" : "Inactivo"),
      },
    ],
  },
  UnidadMedida: {
    entityType: "UnidadMedida",
    title: "Exportar Unidades de Medida",
    fileName: "unidades-medida",
    columns: [
      { header: "ID", field: "unidadMedidaId" },
      { header: "Nombre", field: "nombre" },
      { header: "Símbolo", field: "simbolo" },
      { header: "Descripción", field: "descripcion" },
      {
        header: "Activo",
        field: "activo",
        formatter: (value) => (value ? "Activo" : "Inactivo"),
      },
    ],
  },
};

export type ExportConfigKey = keyof typeof exportConfigs;