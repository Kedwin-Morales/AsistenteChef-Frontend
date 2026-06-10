import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import HomePage from "@/features/home/page/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
