import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function ProtectedRoute() {
    const isAuth = useAuthStore((s) => s.isAuthenticated);

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
