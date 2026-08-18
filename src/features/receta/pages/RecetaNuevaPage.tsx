import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MoveLeft, ArrowLeft, ArrowRight, CloudCheck} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import { useFamiliaMenu } from "@/features/familiaMenu/hooks/useFamiliaMenu";
import { useAreaPreparacion } from "@/features/areaPreparacion/hooks/useAreaPreparacion";
import { useIngrediente } from "@/features/ingrediente/hooks/useIngrediente";
import { sileo } from "sileo";
import { confirm } from "@/shared/utils/swal";
import { getErrorMessage } from "@/shared/services/error.utils";
import { crear, editar, getById } from "../services/receta.service";
import type { CreateDTO, ModelDETCreate, ModelDTO } from "../types/receta.types";
import RecetaWizardSteps from "../components/RecetaWizardSteps";
import RecetaInfoBaseSection from "../components/RecetaInfoBaseSection";
import RecetaIngredientesSection from "../components/RecetaIngredientesSection";
import RecetaPreparacionSection from "../components/RecetaPreparacionSection";
import { MorphIcon } from "morphicons/react";
import { Eye, Pencil } from "lucide"; // data, not components

type WizardStep = 1 | 2 | 3;
type PageMode = "create" | "edit" | "view";

const SECTION1_REQUIRED: Record<
  "nombre" | "descripcion" | "porciones" | "rendimiento" | "familiaMenuId" | "areaPreparacionId",
  boolean
> = {
  nombre: true,
  descripcion: false,
  porciones: false,
  rendimiento: false,
  familiaMenuId: true,
  areaPreparacionId: true,
};

const FIELD_LABELS: Record<string, string> = {
  nombre: "Nombre de la receta",
  descripcion: "Descripción",
  porciones: "Porciones",
  rendimiento: "Rendimiento",
  familiaMenuId: "Familia del menú",
  areaPreparacionId: "Área de preparación",
};

const EMPTY_FORM: CreateDTO = {
  nombre: "",
  descripcion: "",
  porciones: undefined,
  rendimiento: "",
  familiaMenuId: "",
  areaPreparacionId: "",
  detalle: [],
  detPreparacion: [],
};

function isFilled(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return !Number.isNaN(value);
  return true;
}

function mapModelToForm(model: ModelDTO): CreateDTO {
  return {
    nombre: model.nombre ?? "",
    descripcion: model.descripcion ?? "",
    porciones: model.porciones ? Number(model.porciones) : undefined,
    rendimiento: model.rendimiento ?? "",
    familiaMenuId: model.familiaMenu?.familiaMenuId ?? "",
    areaPreparacionId: model.areaPreparacion?.areaPreparacionId ?? "",
    detalle: (model.detalle ?? []).map((d) => ({
      ingredienteId: d.ingredienteId ?? "",
      cantidad: d.cantidad ?? 0,
      medida: d.medida ?? "",
    })),
    detPreparacion: (model.detPreparacion ?? []).map((p, i) => ({
      nroPaso: p.nroPaso ?? i + 1,
      Descripcion: p.descripcion ?? "",
    })),
  };
}

export default function RecetaNuevaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const { isDarkMode } = useLoginUI();
  const { familias, loading: loadingFamilias } = useFamiliaMenu();
  const { areas, loading: loadingAreas } = useAreaPreparacion();
  const { ingredientes, unidades, loading: loadingIngredientes } =
    useIngrediente();

  const isViewRoute = location.pathname.startsWith("/recetas/ver/");
  const isEditRoute = location.pathname.startsWith("/recetas/editar/");
  const mode: PageMode = isViewRoute ? "view" : isEditRoute ? "edit" : "create";

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [formData, setFormData] = useState<CreateDTO>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode !== "create");
  const dirtyRef = useRef(false);

  const familiasActivas = familias.filter((f) => f.activo);
  const areasActivas = areas.filter((a) => a.activo);
  const ingredientesActivos = ingredientes.filter((i) => i.activo);
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    setOpen(true);    
    setTimeout(() => {
      navigate(`/recetas/editar/${id}`);
    }, 800);
  };

  /* ---- Cargar datos en modo edición ---- */
  useEffect(() => {
    let mounted = true;
    if (mode !== "create" && id) {
      const loadData = async () => {
        setLoading(true);
        try {
          const data = await getById(id);
          if (mounted) {
            setFormData(mapModelToForm(data));
          }
        } catch (error) {
          if (mounted) {
            sileo.error({
              title: "Error",
              description: getErrorMessage(error, "No se pudo cargar la receta."),
            });
            navigate("/recetas");
          }
        } finally {
          if (mounted) setLoading(false);
        }
      };
      loadData();
    }
    return () => {
      mounted = false;
    };
  }, [id, mode, navigate]);

  const markDirty = useCallback(() => {
    dirtyRef.current = true;
  }, []);

  const handleFieldChange = (patch: Partial<CreateDTO>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    markDirty();
  };

  const addIngrediente = (item: ModelDETCreate) => {
    setFormData((prev) => ({
      ...prev,
      detalle: [...(prev.detalle ?? []), item],
    }));
    markDirty();
  };

  const removeIngrediente = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detalle: (prev.detalle ?? []).filter((_, i) => i !== index),
    }));
    markDirty();
  };

  const updateIngrediente = (index: number, cantidad: number, medida: string) => {
    setFormData((prev) => ({
      ...prev,
      detalle: (prev.detalle ?? []).map((item, i) =>
        i === index ? { ...item, cantidad, medida } : item
      ),
    }));
    markDirty();
  };

  const addPaso = (descripcion: string) => {
    setFormData((prev) => {
      const actuales = prev.detPreparacion ?? [];
      return {
        ...prev,
        detPreparacion: [
          ...actuales,
          { nroPaso: actuales.length + 1, Descripcion: descripcion },
        ],
      };
    });
    markDirty();
  };

  const removePaso = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detPreparacion: (prev.detPreparacion ?? [])
        .filter((_, i) => i !== index)
        .map((paso, i) => ({ ...paso, nroPaso: i + 1 })),
    }));
    markDirty();
  };

  /* ---- beforeunload ---- */
  useEffect(() => {
    if (mode === "view") return;
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [mode]);

  /* ---- validaciones ---- */
  const validateSection1 = (): boolean => {
    const missing = (
      Object.keys(SECTION1_REQUIRED) as (keyof typeof SECTION1_REQUIRED)[]
    ).filter((key) => SECTION1_REQUIRED[key] && !isFilled(formData[key]));

    if (missing.length > 0) {
      const labels = missing.map((key) => FIELD_LABELS[key]).join(", ");
      sileo.warning({
        title: "¡Atención!",
        description: `Completa los siguientes campos: ${labels}.`,
      });
      return false;
    }
    return true;
  };

  /* ---- navegación ---- */
  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateSection1()) return;
      setDirection("forward");
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if ((formData.detalle?.length ?? 0) === 0) {
        sileo.warning({
          title: "¡Atención!",
          description: "Debes agregar al menos un ingrediente para continuar.",
        });
        return;
      }
      setDirection("forward");
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) return;
    setDirection("backward");
    setCurrentStep((prev) => (prev - 1) as WizardStep);
  };

  const handleStepClick = (step: number) => {
    if (step >= currentStep) return;
    setDirection("backward");
    setCurrentStep(step as WizardStep);
  };

  const handleCancel = async () => {
    if (dirtyRef.current && mode !== "view") {
      const result = await confirm({
        title: "¿Descartar cambios?",
        text: "Perderás los datos ingresados en este formulario.",
        icon: "warning",
        confirmButtonText: "Descartar",
        cancelButtonText: "Seguir editando",
        isDarkMode,
      });
      if (!result.isConfirmed) return;
    }
    navigate("/recetas");
  };

  const handleSave = async () => {
    if (saving) return;

    if (!validateSection1()) return;
    if ((formData.detalle?.length ?? 0) === 0) {
      sileo.warning({
        title: "¡Atención!",
        description: "Debes agregar al menos un ingrediente para continuar.",
      });
      return;
    }

    const payload: CreateDTO = { ...formData };
    setSaving(true);
    try {
      if (mode === "edit" && id) {
        await editar(id, {
          recetaId: id,
          nombre: payload.nombre ?? "",
          descripcion: payload.descripcion ?? "",
          porciones: payload.porciones?.toString() ?? "",
          rendimiento: payload.rendimiento ?? "",
          familiaMenuId: payload.familiaMenuId ?? "",
          areaPreparacionId: payload.areaPreparacionId ?? "",
          detalle: payload.detalle ?? [],
          detPreparacion: payload.detPreparacion ?? [],
        });
        sileo.success({
          title: "¡Operación exitosa!",
          description: "La receta se actualizó correctamente.",
        });
      } else {
        await crear(payload);
        sileo.success({
          title: "¡Operación exitosa!",
          description: "La receta se guardó correctamente.",
        });
      }
      dirtyRef.current = false;
      navigate("/recetas");
    } catch (error) {
      sileo.error({
        title: "Error de sistema",
        description: getErrorMessage(error, "No se pudo guardar la receta."),
      });
    } finally {
      setSaving(false);
    }
  };

  const animClass =
    direction === "forward"
      ? "animate-[slide-in-right_0.3s_ease-out]"
      : "animate-[slide-in-left_0.3s_ease-out]";

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <RecetaInfoBaseSection
          isDarkMode={isDarkMode}
          form={formData}
          familias={familiasActivas}
          areas={areasActivas}
          required={SECTION1_REQUIRED}
          onChange={handleFieldChange}
          readOnly={mode === "view"}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <RecetaIngredientesSection
          isDarkMode={isDarkMode}
          detalle={formData.detalle ?? []}
          ingredientes={ingredientesActivos}
          unidades={unidades}
          onAdd={addIngrediente}
          onUpdate={updateIngrediente}
          onRemove={removeIngrediente}
          onDirty={markDirty}
          readOnly={mode === "view"}
        />
      );
    }

    return (
      <RecetaPreparacionSection
        isDarkMode={isDarkMode}
        pasos={formData.detPreparacion ?? []}
        onAdd={addPaso}
        onRemove={removePaso}
        onDirty={markDirty}
        readOnly={mode === "view"}
      />
    );
  };

  if (loading || loadingFamilias || loadingAreas || loadingIngredientes) {
    return (
      <AppLayout>
        <LoadingScreen message="Cargando..." isDarkMode={isDarkMode} />
      </AppLayout>
    );
  }

  const titles = {
    create: "Nueva Receta",
    edit: "Editar Receta",
    view: "Ver Receta",
  };

  const subtitles = {
    create: "Define la información base, agrega los ingredientes y detalla el proceso de elaboración.",
    edit: "Modifica la información de la receta.",
    view: "Detalle de la receta seleccionada.",
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-8">
          <button
            type="button"
            onClick={handleCancel}
            className={`flex items-center gap-2 text-sm hover:text-(--primary) ${
              isDarkMode ? "text-(--primary)" : "text-(--secondary)"
            }`}
          >
            <MoveLeft size={28} />
            Recetas
          </button>
          <div className="mt-3 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-(--primary)">{titles[mode]}</h1>
            {mode === "view" && (
              <button
                type="button"
                onClick={handleEdit}
                aria-expanded={open}
                className="flex gap-1 items-center p-2 text-base font-semibold text-(--secondary) rounded-xl hover:opacity-90 hover:text-(--primary) hover:bg-(--secondary)/20 transition"
              >
                <MorphIcon spring="snappy" icon={open ? Eye : Pencil} /> Editar
              </button>
            )}
          </div>
          <p className="mt-1 text-neutral-500">{subtitles[mode]}</p>
        </header>

        {/* STEPS */}
        <RecetaWizardSteps
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* SECTION */}
        <div key={currentStep} className={animClass}>
          {renderStep()}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancelar"
          >
            {mode === "view" ? "Volver" : "Cancelar"}
          </button>
          
          <div className="flex flex-col-reverse sm:flex-row gap-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-guardar"
                >
                  <ArrowLeft size={18} /> Anterior
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-guardar"
                >
                  Siguiente <ArrowRight size={18} />
                </button>
              ) : (
                mode !== "view" && (
                  <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-guardar disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CloudCheck size={18} /> {mode === "edit" ? "Actualizar" : "Guardar"}
                    </>
                  )}
                </button>
                )              
              )}
            </div>
        </div>
      </div>
    </AppLayout>
  );
}