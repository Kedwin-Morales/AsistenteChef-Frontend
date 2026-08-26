import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import HomePage from "@/features/home/page/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RolePage from "@/features/role/pages/RolePage";
import UserPage from "@/features/user/pages/UserPage";
import UnidadPage from "@/features/unidadMedida/pages/UnidadPage";
import TipoIngredientePage from "@/features/tipoIngrediente/pages/TipoIngredientePage";
import ProveedorPage from "@/features/proveedor/pages/ProveedorPage";
import IngredientePage from "@/features/ingrediente/pages/IngredientePage";
import FamiliaMenuPage from "@/features/familiaMenu/pages/FamiliaMenuPage";
import CategoriaPlatoPage from "@/features/categoriaPlato/pages/CategoriaPlatoPage";
import AreaPreparacionPage from "@/features/areaPreparacion/pages/AreaPreparacionPage";
import MaestroPage from "@/features/maestro/page/MaestroPage";
import RecetaPage from "@/features/receta/pages/RecetasPage"
import RecetaNuevaPage from "@/features/receta/pages/RecetaNuevaPage"
import SubRecetaPage from "@/features/subReceta/pages/SubRecetasPage"
import SubRecetaNuevaPage from "@/features/subReceta/pages/SubRecetaNuevaPage"
import ConsejoPage from "@/features/consejo/pages/ConsejoPage"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/maestro" element={<MaestroPage />} />
          <Route path="/roles" element={<RolePage />} />
          <Route path="/usuario" element={<UserPage />} />
          <Route path="/unidad-medida" element={<UnidadPage />} />
          <Route path="/tipo-ingredientes" element={<TipoIngredientePage />} />
          <Route path="/proveedores" element={<ProveedorPage />} />
          <Route path="/ingredientes" element={<IngredientePage />} />
          <Route path="/familia-menu" element={<FamiliaMenuPage />} />
          <Route path="/categoria-plato" element={<CategoriaPlatoPage />} />
          <Route path="/area-preparacion" element={<AreaPreparacionPage />} />
          <Route path="/recetas" element={<RecetaPage />} />
          <Route path="/recetas/nueva" element={<RecetaNuevaPage />} />
          <Route path="/recetas/editar/:id" element={<RecetaNuevaPage />} />
          <Route path="/recetas/ver/:id" element={<RecetaNuevaPage />} />
          <Route path="/sub-recetas" element={<SubRecetaPage />} />
          <Route path="/sub-recetas/nueva" element={<SubRecetaNuevaPage />} />
          <Route path="/sub-recetas/editar/:id" element={<SubRecetaNuevaPage />} />
          <Route path="/sub-recetas/ver/:id" element={<SubRecetaNuevaPage />} />
          <Route path="/consejos" element={<ConsejoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
