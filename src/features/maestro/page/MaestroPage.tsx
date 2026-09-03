import AppLayout from "@/components/layout/AppLayout";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import FeatureCard from "@/components/ui/FeatureCard";
import { MAESTRO_MODULES, MAESTRO_DASHBOARD_CONFIG } from "../config/maestro.config";
import { GiCook } from "react-icons/gi";

export default function MaestroPage() {
  const { isDarkMode } = useLoginUI();

  return (
    <AppLayout>
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>            
            <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-bold tracking-tight text-(--primary)">
              <GiCook size={32} />
              {MAESTRO_DASHBOARD_CONFIG.title}
            </h1>
            <p className="mt-2 text-lg text-(--texto)/70 max-w-2xl">
              {MAESTRO_DASHBOARD_CONFIG.description}
            </p>
            <p className="mt-1 text-sm text-(--texto)/50">{MAESTRO_DASHBOARD_CONFIG.subtitle}</p>
          </div>
          <div className="hidden md:block w-100 h-px bg-linear-to-r from-(--primary) via-(--secondary) to-transparent opacity-30" />
        </div>

        <div
          className={`
            px-4 py-3 rounded-xl border
            ${isDarkMode ? "bg-neutral-800/50 border-neutral-700/50" : "bg-(--bg-form) border-(--bordes)"}
          `}
          role="region"
          aria-label="Resumen de módulos disponibles"
        >
          <p className="text-sm text-(--texto)/60">
            • {MAESTRO_MODULES.length} opciones de configuración disponibles {" "}
            {/* {MAESTRO_MODULES.filter((m) => m.variant === "highlighted").length} módulos principales •{" "}
            {MAESTRO_MODULES.filter((m) => m.badge === "Próximamente").length} en desarrollo */}
          </p>
        </div>
      </header>

      <main>
        <div
          className={`
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-3
          `}
          role="list"
          aria-label="Módulos del Maestro de Cocina"
        >
            {MAESTRO_MODULES.map((module) => (
            <FeatureCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              image={module.image}
              route={module.route}
              badge={module.badge}
              variant={module.variant}
            />
          ))}          
        </div>
        <section className="mt-16" aria-labelledby="footer-info">
          <h2 id="footer-info" className="sr-only">
            Información adicional
          </h2>
          <div
            className={`
              grid gap-4 md:grid-cols-3
              px-4 py-6 rounded-2xl border
              ${isDarkMode ? "bg-neutral-800/30 border-neutral-700/50" : "bg-(--bg-form) border-(--bordes)"}
            `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                  shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                  ${isDarkMode ? "bg-(--secondary)/15" : "bg-(--primary)/10"}
                  text-(--secondary)
                `}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-(--texto)">Datos Maestros</h3>
                <p className="text-sm text-(--texto)/60 mt-0.5">
                  Configuración centralizada que alimenta todos los Módulos de la Aplicación.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className={`
                  shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                  ${isDarkMode ? "bg-emerald-500/15" : "bg-emerald-500/10"}
                  text-emerald-500
                `}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-(--texto)">Integridad</h3>
                <p className="text-sm text-(--texto)/60 mt-0.5">
                  Validaciones cruzadas y referencias entre módulos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className={`
                  shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                  ${isDarkMode ? "bg-amber-500/15" : "bg-amber-500/10"}
                  text-amber-500
                `}
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-(--texto)">Trazabilidad</h3>
                <p className="text-sm text-(--texto)/60 mt-0.5">
                  Historial completo de cambios y auditoría automática.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}