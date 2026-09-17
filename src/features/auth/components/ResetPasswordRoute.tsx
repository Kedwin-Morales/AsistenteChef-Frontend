import { Navigate, useLocation } from "react-router-dom";
import ResetPasswordForm from "./ResetPasswordForm";

interface ResetPasswordState {
  correo?: string;
}

export default function ResetPasswordRoute() {
  const location = useLocation();
  const state = location.state as ResetPasswordState | null;
  const correo = state?.correo;

  if (!correo) {
    return <Navigate to="/forgot-password" replace />;
  }

  return <ResetPasswordForm correo={correo} />;
}