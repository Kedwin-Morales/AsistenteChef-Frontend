import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useLoginUI } from "../hooks/useLoginUI";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/ui/LoginForm";

export default function LoginPage() {
  const isAuth = useAuthStore(s => s.isAuthenticated);

  const {
    isDarkMode,
    toggleDarkMode,
  } = useLoginUI();

  if (isAuth) return <Navigate to="/" />;

  return (
   <AuthLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    >
      <div className="w-full max-w-md h-auto rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full flex flex-col justify-center ">
          <LoginForm
            isDarkMode={isDarkMode}
          />
        </div>

      </div>
    </AuthLayout>
  );
}
