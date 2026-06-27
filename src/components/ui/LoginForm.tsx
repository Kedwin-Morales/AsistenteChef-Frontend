import { useForm } from "react-hook-form";
import { User, Lock, ChefHat } from "lucide-react";
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

      toast.success("¡Bienvenido!");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch {
      toast.error("Error al iniciar sesión. Credenciales incorrectas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-(--bg-form) backdrop-blur-xl w-full rounded-[2 rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] border-none
      p-8 sm:p-10"
    >
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-gradient shadow-xl-secondary rounded-2xl flex items-center justify-center mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <ChefHat size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-(--primary) tracking-tight">
          AsistentePRO
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px">
        <InputField
          label="Usuario:"
          icon={User}
          type="text"
          placeholder="Cedula"
          isDarkMode={isDarkMode}
          disabled={isSubmitting}
          {...register("documento")}
        />
        <br />
        <InputField
          label="Contraseña:"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          isDarkMode={isDarkMode}
          disabled={isSubmitting}
          {...register("password")}
        />
        <div className="flex justify-end mb-6 pt-2">
          <a
            href="#"
            className={`text-xs font-medium hover:underline text-(--primary)`}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

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
              Iniciando sesión...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>

      <footer className="mt-8 text-center mb-1">
        <p
          className={`text-[10px] uppercase tracking-widest font-semibold ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          © Elaborado por Kedwin Morales - 2026. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
