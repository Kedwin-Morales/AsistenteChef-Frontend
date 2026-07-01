import { useEffect } from "react";
import { useAuthInit } from "./features/auth/hooks/useAuthInit";
import { ToastProvider } from "./components/ui/toast/ToastProvicer";
import "./App.css";
import AppRouter from "./app/router";
import { Toaster } from "sileo";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";

function App() {
  const { isDarkMode } = useLoginUI();
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useAuthInit();
  return (
    <ToastProvider>
      <Toaster position="bottom-right" options={{
        fill: isDarkMode ? '#E5E5E5' : '#404040',
        styles: { 
          description: isDarkMode ? 'text-neutral-800' : 'text-neutral-200',
        },
      }} />
      <AppRouter />
    </ToastProvider>
  );
}

export default App;
