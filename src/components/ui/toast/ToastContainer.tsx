import Toast from "./Toast";
import type { Toast as ToastType } from "./toast.types";

export default function ToastContainer({
  toasts,
}: {
  toasts: ToastType[];
}) {
  return (
    <div className="fixed bottom-6 right-6 z-9999 space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
