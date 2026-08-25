import { type LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";

export type TrendType = "positive" | "negative" | "neutral";

export interface StatCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  footerIcon?: LucideIcon;
  footerText?: string;
  trend?: TrendType;
  className?: string;
  delay?: number;
}

function getTrendClasses(trend: TrendType, isDarkMode: boolean): string {
  const base = "inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200";
  switch (trend) {
    case "positive":
      return `${base} ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`;
    case "negative":
      return `${base} ${isDarkMode ? "text-red-400" : "text-red-600"}`;
    case "neutral":
    default:
      return `${base} ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`;
  }
}

function getTrendIcon(trend: TrendType): React.ReactNode {
  switch (trend) {
    case "positive":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      );
    case "negative":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      );
    case "neutral":
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
        </svg>
      );
  }
}

export default function StatCard({
  title,
  icon: Icon,
  value,
  footerIcon: FooterIcon,
  footerText,
  trend = "neutral",
  className = "",
  delay = 0,
}: StatCardProps) {
  const { isDarkMode } = useLoginUI();

  const FooterIconComponent = FooterIcon;

  return (
    <ScrollReveal delay={delay} className={className}>
      <div
        className={`
          group relative flex flex-col rounded-2xl border border-b-5 border-(--bordes) bg-(--bg-form)
          shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.015]
          transition-all duration-300 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary) focus-visible:ring-offset-2
          min-h-40 card-skew
        `}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3
                className={`
                  text-sm font-medium tracking-tight truncate transition-colors duration-200
                  ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}
                  group-hover:text-(--texto)/80
                `}
              >
                {title}
              </h3>
            </div>
            <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-xl
                transition-all duration-300 ease-out
                ${isDarkMode
                  ? "bg-(--primary)/10 text-(--primary) border border-(--primary)/20"
                  : "bg-(--primary)/10 text-(--primary) border border-(--primary)/20"}
                group-hover:scale-110
              `}
              aria-hidden="true"
            >
              <Icon size={20} />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center my-4">
            <div
              className={`
                text-3xl sm:text-4xl font-bold tracking-tight transition-colors duration-200
                ${isDarkMode ? "text-(--texto)" : "text-(--texto)"}
              `}
            >
              {value}
            </div>
          </div>

          {(FooterIconComponent || footerText) && (
            <div
              className={`
                pt-4 border-t transition-colors duration-300
                ${isDarkMode ? "border-neutral-700/50" : "border-neutral-200"}
                group-hover:border-(--secondary)/30
              `}
            >
              <span
                className={getTrendClasses(trend, isDarkMode)}
                aria-label={`Tendencia ${trend === "positive" ? "positiva" : trend === "negative" ? "negativa" : "neutral"}`}
              >
                {getTrendIcon(trend)}
                {footerText && <span>{footerText}</span>}
                {FooterIconComponent && <FooterIconComponent size={14} aria-hidden="true" className="ml-1" />}
              </span>
            </div>
          )}
        </div>

        <div
          className={`
            absolute inset-0 rounded-2xl pointer-events-none
            transition-all duration-300 ease-out
            border border-transparent group-hover:border-(--secondary)/30
          `}
          aria-hidden="true"
        />
      </div>
    </ScrollReveal>
  );
}