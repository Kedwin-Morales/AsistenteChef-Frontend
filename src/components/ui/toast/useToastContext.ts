import { useContext } from "react";
import { ToastContext } from "./ToastContext";

export const useToastContext = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error(
      "useToast debe usarse dentro de ToastProvider"
    );
  }

  return ctx;
};
