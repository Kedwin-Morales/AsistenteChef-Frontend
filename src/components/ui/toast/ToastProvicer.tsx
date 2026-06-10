import { useState } from "react";
import { ToastContext } from "./ToastContext";
import ToastContainer from "./ToastContainer";
import type { Toast, ToastType } from "./toast.types";
import { v4 as uuidv4 } from "uuid";


export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: ToastType = "info"
  ) => {
    const id = uuidv4()

    setToasts((prev) => [
      ...prev,
      { id, message, type },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}
