import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyRound, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import InputField from "../../../components/ui/InputField";
import AuthFormLayout from "./AuthFormLayout";
import { useLoginUI } from "../hooks/useLoginUI";
import { verificarCodigo } from "../services/auth.service";

interface FormValues {
  codigo: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

interface Props {
  correo: string;
}

export default function ResetPasswordForm({ correo }: Props) {
  const { isDarkMode } = useLoginUI();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onInvalid = () => {
    const firstKey = Object.keys(errors)[0] as keyof FormValues | undefined;
    const message = firstKey ? errors[firstKey]?.message : undefined;

    sileo.warning({
      title: "Datos inválidos",
      description:
        typeof message === "string"
          ? message
          : "Revisa los campos antes de continuar.",
    });
  };

  const onSubmit = async ({ codigo, nuevaPassword }: FormValues) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await verificarCodigo({
        correo: correo.trim(),
        codigo: codigo.trim(),
        nuevaPassword,
      });

      sileo.success({
        title: "¡Contraseña restablecida!",
        description:
          "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 600);
    } catch {
      sileo.error({
        title: "¡No se pudo restablecer!",
        description:
          "El código es incorrecto o expiró. Inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormLayout>
      <div className="bg-linear-to-t from-(--bg-form) via-transparent via-5% to-(--bg-form) w-full p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-gradient shadow-xl-secondary rounded-2xl flex items-center justify-center mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <KeyRound size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-(--primary) tracking-tight">
            Restablecer contraseña
          </h1>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-neutral-400" : "text-neutral-500"
            }`}
          >
            Ingresa el código recibido y define tu nueva contraseña.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-(--bordes) px-4 py-3 text-center">
          <p className="mb-1 text-[11px] uppercase tracking-widest font-semibold text-neutral-400">
            Correo de recuperación
          </p>
          <p className="break-all text-md font-bold text-(--primary)">
            {correo}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <InputField
            label="Código de recuperación:"
            icon={KeyRound}
            type="text"
            placeholder="Ingresa el código recibido"
            isDarkMode={isDarkMode}
            disabled={isSubmitting}
            {...register("codigo", {
              required: "Ingresa el código de recuperación.",
            })}
          />
          <br />
          <InputField
            label="Nueva contraseña:"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            isDarkMode={isDarkMode}
            disabled={isSubmitting}
            {...register("nuevaPassword", {
              required: "Ingresa una nueva contraseña.",
            })}
          />
          <br />
          <InputField
            label="Confirmar contraseña:"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            isDarkMode={isDarkMode}
            disabled={isSubmitting}
            {...register("confirmarPassword", {
              required: "Confirma la nueva contraseña.",
              validate: (value) =>
                value === getValues("nuevaPassword") ||
                "Las contraseñas no coinciden.",
            })}
          />

          <div className="mt-6 mb-6 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full bg-gradient btn-gradient shadow-xl-secondary transform active:scale-[0.98] transition-all duration-200
                ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}
              `}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Restableciendo...
                </>
              ) : (
                "Restablecer contraseña"
              )}
            </button>
          </div>
        </form>

        <div className="flex justify-center mb-2">
          <Link
            to="/login"
            className="text-xs font-medium hover:underline text-(--primary)"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </AuthFormLayout>
  );
}