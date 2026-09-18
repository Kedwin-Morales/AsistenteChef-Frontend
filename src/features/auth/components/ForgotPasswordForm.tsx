import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, UndoDot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import InputField from "../../../components/ui/InputField";
import AuthFormLayout from "./AuthFormLayout";
import { useLoginUI } from "../hooks/useLoginUI";
import { solicitarCodigo } from "../services/auth.service";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormValues {
  correo: string;
}

export default function ForgotPasswordForm() {
  const { isDarkMode } = useLoginUI();
  const {
    register,
    handleSubmit,
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

  const onSubmit = async ({ correo }: FormValues) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const email = correo.trim();
      await solicitarCodigo({ correo: email });

      sileo.success({
        title: "¡Código enviado!",
        description:
          "Revisa tu correo e ingresa el código de recuperación para continuar.",
      });

      setTimeout(() => {
        navigate("/reset-password", { state: { correo: email } });
      }, 600);
    } catch {
      sileo.error({
        title: "¡No se pudo enviar el código!",
        description:
          "Verifica que el correo sea correcto e inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormLayout>
      <div className="bg-linear-to-t from-(--bg-form) to-transparent w-full p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-gradient shadow-xl-secondary rounded-2xl flex items-center justify-center mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Mail size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-(--primary) tracking-tight">
            Recuperar contraseña
          </h1>
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-neutral-400" : "text-neutral-300"
            }`}
          >
            Ingresa tu correo electrónico y te enviaremos un código para
            restablecer tu contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <InputField
            label="Correo electrónico:"
            icon={Mail}
            type="email"
            placeholder="correo@ejemplo.com"
            isDarkMode={isDarkMode}
            disabled={isSubmitting}
            {...register("correo", {
              required: "Ingresa tu correo electrónico.",
              pattern: {
                value: EMAIL_PATTERN,
                message: "Ingresa un correo electrónico válido.",
              },
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
                  Enviando código...
                </>
              ) : (
                "Enviar código"
              )}
            </button>
          </div>
        </form>

        <div className="flex justify-center mb-2">
          <Link
            to="/login"
            className="flex gap-3 text-sm font-medium hover:bg-(--secondary)/20 p-2 rounded-3xl text-(--primary) hover:scale-105"
          >
            <UndoDot size={18}/>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </AuthFormLayout>
  );
}