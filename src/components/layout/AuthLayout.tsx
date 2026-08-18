import AuthTopBar from "./AuthTopBar";

interface Props {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function AuthLayout({
  children,
  isDarkMode,
  toggleDarkMode,
}: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/fondo-login.jpg')",
        }}
      />
      {/* Overlay + blur */}
      <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-xs" />

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <AuthTopBar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>

      {/* Contenido / Login */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {children}
      </main>

    </div>
  );
}
