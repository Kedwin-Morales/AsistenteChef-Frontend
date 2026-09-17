import type { ReactNode } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { useLoginUI } from "../hooks/useLoginUI";

interface Props {
  children: ReactNode;
}

export default function AuthFormLayout({ children }: Props) {
  const { isDarkMode, toggleDarkMode } = useLoginUI();

  return (
    <AuthLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    >
      <div className="w-full max-w-md h-auto rounded-3xl border-b-5 border-(--bordes) flex flex-col md:flex-row overflow-hidden shadow-xl-secondary">
        <div className="w-full flex flex-col justify-center">
          {children}
        </div>
      </div>
    </AuthLayout>
  );
}