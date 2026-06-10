import { useEffect } from 'react'
import { useAuthInit } from './features/auth/hooks/useAuthInit'
import { ToastProvider } from './components/ui/toast/ToastProvicer'
import './App.css'
import AppRouter from './app/router'

function App() {
  useEffect(() => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  }
}, []);

useAuthInit();
  return (
   <ToastProvider>
      <AppRouter />
    </ToastProvider>
  )
}

export default App
