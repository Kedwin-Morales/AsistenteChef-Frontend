import { useForm } from "react-hook-form";
import { User, Lock, Croissant } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import { loginRequest } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { LoginRequest } from "@/features/auth/types/auth.types";
import { useToast } from "@/components/ui/toast/useToast";
import { useState } from "react";

interface Props {
  isDarkMode: boolean;
}

export default function LoginForm({ isDarkMode }: Props) {
  const { register, handleSubmit } = useForm<LoginRequest>();
  const setTokens = useAuthStore((s) => s.setTokens);
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: LoginRequest) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const res = await loginRequest(data);

      setTokens(res.token);

      toast.success("¡Bienvenido! Has iniciado sesión exitosamente.");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch {
      toast.error(
        "Error al iniciar sesión. Revisa tus credenciales e intenta nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-xl w-full  rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] border border-white dark:border-stone-700/50 p-8 sm:p-10">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <Croissant size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-800 dark:text-white tracking-tight">
          PanaderiaOS
        </h1>
        <p className="text-stone-500 dark:text-stone-400 font-medium mt-1">
          ERP & CRM Gestión Empresarial
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-4">
        <InputField
          label="Usuario"
          icon={User}
          type="text"
          placeholder="Ingresa tu cedula"
          isDarkMode={isDarkMode}
          disabled={isSubmitting}
          {...register("documento")}
        />

        <InputField
          label="Contraseña"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          isDarkMode={isDarkMode}
          disabled={isSubmitting}
          {...register("password")}
        />

        <div className="flex justify-end mb-6">
          <a
            href="#"
            className={`text-xs font-medium hover:underline text-amber-600`}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`
    w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transform active:scale-[0.98] transition-all duration-200
    ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}
  `}
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Iniciando sesión...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>

      <footer className="mt-12 text-center mb-8">
        <p
          className={`text-[10px] uppercase tracking-widest font-semibold ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          © Elaborado por Kedwin Morales - 2026. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
