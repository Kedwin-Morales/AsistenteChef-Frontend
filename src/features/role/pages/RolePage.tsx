import { PlusCircle, Eye, Pencil, Trash2, Shield } from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import EntityModal, {
  type ModalField,
  type ModalMode,
} from "@/components/ui/EntityModal";
import { useToast } from "@/components/ui/toast/useToast";
import { useRoles } from "../hooks/useRoles";
import { createRole, updateRole, deleteRole } from "../services/role.service";
import type { RoleDTO } from "../types/role.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/utils/swal";

export default function RolePage() {
  const toast = useToast();
  const { roles, loading, refetch } = useRoles();
  const { isDarkMode } = useLoginUI();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<RoleDTO | null>(null);

  const fields: ModalField<RoleDTO>[] = [
    {
      name: "name",
      label: "Nombre:",
      icon: Shield,
      colSpan: 6,
      required: true,
      type: "text",
    },
  ];

  const handleSubmit = async (data: Partial<RoleDTO>) => {
    if (!data.name) return toast.error("Nombre es obligatorio");

    try {
      if (modalMode === "create") {
        await createRole(data.name);
        toast.success("Creado exitosamente.");
      }

      if (modalMode === "edit" && selected?.id) {
        await updateRole(selected.id, data.name);
        toast.success("Actualizado con éxito.");
      }

      setModalOpen(false);
      setSelected(null);
      await refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, "Error al crear."));
    }
  };

  const confirmarDelete = async (role: RoleDTO) => {
    const result = await confirm({
      title: "Eliminar",
      text: `¿Eliminar: "${role.name}"?`,
      icon: "error",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      isDarkMode,
    });

    if (result.isConfirmed) {
      try {
        await deleteRole(role.id);
        toast.success("Eliminado con exito.");
        await refetch();
      } catch (error) {
        toast.error(getErrorMessage(error, "Error al eliminar."));
      }
    }
  };

  const filtered = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: TableColumn<RoleDTO>[] = [
    {
      key: "name",
      header: "Rol",
      align: "center",
      render: (row) => (
        <span className="font-semibold flex items-center gap-2">
          <Shield size={18} className="text-(--primary)" />
          {row.name}
        </span>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setSelected(row);
              setModalMode("view");
              setModalOpen(true);
            }}
            className="p-2 text-cyan-600 hover:bg-cyan-100 rounded-lg"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => {
              setSelected(row);
              setModalMode("edit");
              setModalOpen(true);
            }}
            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => confirmarDelete(row)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <AppLayout>
        <LoadingScreen
          fullScreen
          isDarkMode={isDarkMode}
          message="Cargando..."
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-(--primary)">Roles</h1>
          <p className="text-sm text-neutral-500">
            Gestión de roles del sistema.
          </p>
        </div>
        <button
          onClick={() => {
            setSelected(null);
            setModalMode("create");
            setModalOpen(true);
          }}
          className="bg-gradient btn-gradient shadow-xl-secondary"
        >
          <PlusCircle size={18} /> Nuevo
        </button>
      </div>
      <SearchFilter
        filterValue="name"
        searchValue={search}
        placeholder="Buscar..."
        options={[{ value: "name", label: "Nombre" }]}
        onFilterChange={() => {}}
        onSearchChange={setSearch}
        isDarkMode={isDarkMode}
      />
      <DataTable<RoleDTO>
        data={filtered}
        columns={columns}
        rowKey={(row) => row.id}
        emptyMessage="No se encontraron resultados."
        isDarkMode={isDarkMode}
      />

      <EntityModal<RoleDTO>
        open={modalOpen}
        key={`${modalMode}-${selected?.id ?? "new"}`}
        title={
          modalMode === "create"
            ? "Nuevo"
            : modalMode === "edit"
              ? "Editar Rol"
              : "Detalle Rol"
        }
        headerIcon={Shield}
        mode={modalMode}
        data={selected}
        fields={fields}
        isDarkMode={isDarkMode}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
      />
    </AppLayout>
  );
}
