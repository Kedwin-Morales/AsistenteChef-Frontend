import {
  PlusCircle,
  Eye,
  Pencil,
  UserCog,
  Tags,
  UserPlus,
  WholeWord,
  KeyRound,
  IdCard,
  User,
  Ban,
} from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import SearchFilter from "@/components/ui/SearchFilter";
import DataTable, { type TableColumn } from "@/components/ui/DataTable";
import EntityModal, {
  type ModalField,
  type ModalMode,
} from "@/components/ui/EntityModal";
import { useToast } from "@/components/ui/toast/useToast";
import { useUsers } from "../hooks/useUsers";
import { createUser, deleteUser, updateUser } from "../services/user.service";
import type { UserDTO } from "../types/user.types";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getErrorMessage } from "@/shared/services/error.utils";
import { confirm } from "@/shared/utils/swal";
import { sileo } from "sileo";

type UserFilter = "nombre" | "documento";

export default function UserPage() {
  const toast = useToast();
  const { users, roles, loading, refetch } = useUsers();
  const { isDarkMode } = useLoginUI();
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<UserFilter>("nombre");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<UserDTO | null>(null);

  const fields: ModalField<UserDTO & { rolId?: string }>[] = [
    {
      name: "nombre",
      label: "Nombre: ",
      icon: WholeWord,
      colSpan: 3,
      required: true,
      type: "text",
    },
    {
      name: "apellido",
      label: "Apellido: ",
      icon: WholeWord,
      colSpan: 3,
      required: true,
      type: "text",
    },
    {
      name: "documento",
      label: "Cédula: ",
      icon: IdCard,
      colSpan: 3,
      required: true,
      type: "number",
      inputMode: "numeric",
    },
    {
      name: "rolId",
      label: "Rol: ",
      icon: UserCog,
      colSpan: 3,
      required: true,
      type: "select",
      options: roles.map((r) => ({ label: r.name, value: r.id })),
    },
    ...(modalMode === "create"
      ? [
          {
            name: "password" as keyof UserDTO,
            label: "Contraseña",
            icon: KeyRound,
            colSpan: 6,
            required: true,
            type: "password" as const,
          },
        ]
      : []),
    ...(modalMode === "edit"
      ? [
          {
            name: "activo" as keyof UserDTO,
            label: "Activo: ",
            icon: Tags as typeof Tags,
            colSpan: 6,
            type: "boolean" as const,
          },
        ]
      : []),
  ];

  const handleSubmit = async (data: Partial<UserDTO>) => {
    if (!data.nombre || !data.apellido || !data.documento) {
      return sileo.warning({
        title: "¡Atención!",
        description:
          "Por favor, revisa los datos ingresados: Nombres y Cedula son obligatorio.",
      });
    }

    try {
      if (modalMode === "create") {
        const password = (data as any).password;
        if (!password) return toast.error("Contraseña es obligatoria");
        await createUser({
          documento: data.documento,
          nombre: data.nombre,
          apellido: data.apellido,
          password,
          rolId: (data as any).rolId,
        });
        sileo.success({
          title: "¡Operación exitosa!",
          description: "El registro se guardó correctamente.",
        });
      }

      if (modalMode === "edit" && selected?.id) {
        await updateUser(selected.id, {
          documento: data.documento,
          nombre: data.nombre,
          apellido: data.apellido,
          activo: data.activo ?? true,
          rolId: (data as any).rolId,
        });

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

  const confirmarDelete = async (model: UserDTO) => {
    const result = await confirm({
      title: "Anular",
      text: `¿Desea anular: ${model.nombre} ${model.apellido}?`,
      icon: "question",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      isDarkMode,
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(model.id);
        sileo.success({
          title: "¡Operación exitosa!",
          description: "El registro se anuló correctamente.",
        });
        await refetch();
      } catch (error) {
        sileo.error({
          title: "Error de sistema",
          description: getErrorMessage(
            error,
            "No se pudo procesar la solicitud: Error al anular.",
          ),
        });
      }
    }
  };

  const filtered = users.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.documento}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const columns: TableColumn<UserDTO>[] = [
    {
      key: "nombre",
      header: "Nombre",
      render: (row) => (
        <span className="font-semibold">
          {row.nombre} {row.apellido}
        </span>
      ),
    },
    {
      key: "documento",
      header: "Documento",
      render: (row) => <span>{row.documento}</span>,
    },
    {
      key: "role",
      header: "Rol",
      render: (row) => (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
          {row.role?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "activo",
      header: "Estado",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${row.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {row.activo ? "Activo" : "Inactivo"}
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
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
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
            <Ban size={16} />
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
            <User size={30} />
            Usuarios
          </h1>
          <p className="text-sm text-neutral-500">
            Gestión de usuarios del sistema.
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

      <SearchFilter<UserFilter>
        filterValue={filterBy}
        searchValue={search}
        placeholder="Buscar..."
        options={[
          { value: "nombre", label: "Nombre" },
          { value: "documento", label: "Cedula" },
        ]}
        onFilterChange={setFilterBy}
        onSearchChange={setSearch}
        isDarkMode={isDarkMode}
      />

      <DataTable<UserDTO>
        data={filtered}
        columns={columns}
        rowKey={(row) => row?.id}
        emptyMessage="No se encontraron resultados."
        isDarkMode={isDarkMode}
      />

      <EntityModal<UserDTO & { rolId?: string }>
        open={modalOpen}
        key={`${modalMode}-${selected?.id ?? "new"}`}
        title={
          modalMode === "create"
            ? "Crear"
            : modalMode === "edit"
              ? "Editar"
              : "Detalles"
        }
        headerIcon={UserPlus}
        mode={modalMode}
        data={selected ? { ...selected, rolId: selected.role?.id ?? "" } : null}
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
