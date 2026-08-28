import {
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  Shield,
  ShieldPlus,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import EntityModal, {
  type ModalField,
  type ModalMode,
} from "@/components/ui/EntityModal";
import { useRoles } from "../hooks/useRoles";
import { createRole, updateRole, deleteRole } from "../services/role.service";
import type { RoleDTO } from "../types/role.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/shared/utils/swal";
import { sileo } from "sileo";
import StatCard from "@/components/ui/StatCard";
import DataCardList from "@/components/ui/DataCardList";

export default function RolePage() {
  const { roles, loading, refetch } = useRoles();
  const { isDarkMode } = useLoginUI();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<RoleDTO | null>(null);

  const fields: ModalField<RoleDTO>[] = [
    {
      name: "name",
      label: "Nombre: ",
      icon: Shield,
      colSpan: 6,
      required: true,
      type: "text",
    },
  ];

  const handleSubmit = async (data: Partial<RoleDTO>) => {
    if (!data.name) {
      return sileo.warning({
        title: "¡Atención!",
        description:
          "Por favor, revisa los datos ingresados: Nombre es obligatorio.",
      });
    }

    try {
      if (modalMode === "create") {
        await createRole(data.name);
        sileo.success({
          title: "¡Operación exitosa!",
          description: "El registro se guardó correctamente.",
        });
      }

      if (modalMode === "edit" && selected?.id) {
        await updateRole(selected.id, data.name);
        sileo.success({
          title: "¡Operación exitosa!",
          description: "Cambios guardados con éxito.",
        });
      }

      setModalOpen(false);
      setSelected(null);
      await refetch();
    } catch (error) {
      sileo.error({
        title: "Error de sistema",
        description: getErrorMessage(
          error,
          "No se pudo procesar la solicitud: Error al guardar.",
        ),
      });
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
        sileo.success({
          title: "¡Operación exitosa!",
          description: "El registro se elimino correctamente.",
        });
        await refetch();
      } catch (error) {
        sileo.error({
          title: "Error de sistema",
          description: getErrorMessage(
            error,
            "No se pudo procesar la solicitud: Error al eliminar.",
          ),
        });
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
          <h1 className="flex items-center gap-2 text-2xl font-bold text-(--primary)">
            <Shield size={30} />
            Roles
          </h1>
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
            {/* StatCard y TipCard */}
      <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Roles"
          icon={Shield}
          value={roles.length}
          footerIcon={TrendingUp}
          footerText="Control total."
          trend="positive"
          delay={200}
        />
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
      
      <div className="hidden md:block">
        <DataTable<RoleDTO>
          data={filtered}
          columns={columns}
          rowKey={(row) => row.id}
          emptyMessage="No se encontraron resultados."
          isDarkMode={isDarkMode}
        />
      </div>
      
      {/* ================= MOBILE ================= */}
      <div className="block md:hidden">
        <DataCardList<RoleDTO>
          data={filtered}
          getKey={(row) =>
            row.id
              ? row.id.toString()
              : ""
          }
          title={(row) => row.name}
          onView={(row) => {
            setSelected(row);
            setModalMode("view");
            setModalOpen(true);
          }}
          onEdit={(row) => {
            setSelected(row);
            setModalMode("edit");
            setModalOpen(true);
          }}
          onDelete={(row) => {
            confirmarDelete(row);
          }}
          emptyMessage="No se encontraron resultados."
          isDarkMode={isDarkMode}
        />
      </div>

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
        headerIcon={ShieldPlus}
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
