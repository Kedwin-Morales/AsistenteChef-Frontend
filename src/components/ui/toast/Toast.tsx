import type { Toast as ToastType } from "./toast.types";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

const icons = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  info: <Info className="text-blue-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
};

export default function Toast({ toast }: { toast: ToastType }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white shadow-lg border">
      {icons[toast.type]}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
