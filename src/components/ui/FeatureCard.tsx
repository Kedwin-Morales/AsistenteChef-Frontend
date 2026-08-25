import { Link } from "react-router-dom";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from '@/components/ui/ScrollReveal';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  route: string;
  badge?: string;
  variant?: "default" | "highlighted";
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  image,
  route,
  badge,
  variant = "default",
}: FeatureCardProps) {
  const { isDarkMode } = useLoginUI();
  const isHighlighted = variant === "highlighted";

  return (
    <ScrollReveal>
      <Link
        to={route}
        className={`card-skew
          group relative flex flex-col overflow-hidden rounded-3xl
          border-b-5 border-(--bordes) transition-all duration-300 ease-out
          ${isHighlighted
            ? "border-2 border-(--secondary)/50 shadow-xl-secondary"
            : "border border-(--bordes) shadow-sm hover:shadow-lg"}
          bg-(--bg-form)
          hover:-translate-y-1 hover:scale-[1.015]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary) focus-visible:ring-offset-2
          min-h-85
        `}
        aria-label={`Navegar a ${title}`}
      >
        <div
          className={`
            relative h-40 w-full overflow-hidden
            transition-all duration-500 ease-out
            group-hover:scale-105
          `}
          aria-hidden="true"
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
          <div
            className={`
              absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
            `}
            aria-hidden="true"
          />
          {badge && (
            <span
              className={`
                absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full
                ${isHighlighted
                  ? "bg-(--secondary) text-white"
                  : "bg-(--primary) text-white"}
                shadow-lg
              `}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col p-6 gap-4">
          <div
            className={`
              flex items-center justify-center w-12 h-12 rounded-xl
              transition-all duration-300 ease-out
              group-hover:scale-110 group-hover:translate-x-1
              ${isHighlighted
                ? "bg-(--secondary)/15 text-(--secondary) border border-(--secondary)/30"
                : "bg-(--primary)/10 text-(--primary) border border-(--primary)/20"}
            `}
            aria-hidden="true"
          >
            <Icon size={22} />
          </div>

          <div className="flex-1 flex flex-col justify-between min-h-35">
            <div>
              <h3
                className={`
                  text-lg font-bold tracking-tight transition-colors duration-200
                  group-hover:text-(--secondary)
                  text-(--texto)
                `}
              >
                {title}
              </h3>
              <p
                className={`
                  mt-2 text-sm leading-relaxed transition-colors duration-200
                  ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}
                  group-hover:text-(--texto)/80
                `}
              >
                {description}
              </p>
            </div>

            <div
              className={`
                pt-4 border-t transition-colors duration-300
                ${isDarkMode ? "border-neutral-700/50" : "border-neutral-200"}
                group-hover:border-(--secondary)/30
              `}
            >
              <span
                className={`
                  inline-flex items-center gap-1.5 text-sm font-medium
                  transition-all duration-200
                  ${isHighlighted
                    ? "text-(--secondary) group-hover:translate-x-1"
                    : "text-(--primary) group-hover:text-(--secondary) group-hover:translate-x-1"}
                `}
                aria-hidden="true"
              >
                Acceder
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div
          className={`
            absolute inset-0 rounded-xl pointer-events-none
            transition-all duration-300 ease-out
            ${isHighlighted
              ? "border-2 border-(--secondary)/30 opacity-0 group-hover:opacity-100"
              : "border border-transparent"}
          `}
          aria-hidden="true"
        />
      </Link>
    </ScrollReveal>

  );
}