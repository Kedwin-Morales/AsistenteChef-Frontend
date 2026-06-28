import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import HomePage from "@/features/home/page/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RolePage from "@/features/role/pages/RolePage";
import UserPage from "@/features/user/pages/UserPage";
import UnidadPage from "@/features/unidadMedida/pages/UnidadPage";
import TipoIngrediente from "@/features/tipoIngrediente/pages/TipoIngredientePage"


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/roles" element={<RolePage />} />
          <Route path="/usuario" element={<UserPage />} />
          <Route path="/unidad-medida" element={<UnidadPage />} />
          <Route path="/tipo-ingredientes" element={<TipoIngrediente />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
