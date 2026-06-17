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
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300
        ${isDarkMode ? "bg-stone-900 text-stone-100" : "bg-gradient-to-br from-orange-50 via-amber-50 to-stone-100 text-stone-800"}
      `}
    >
      <AuthTopBar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 flex items-center justify-center p-6 bg-(--color-bg)">
        {children}
      </main>
    </div>
  );
}
