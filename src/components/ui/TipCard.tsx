import { Link } from "react-router-dom";
import { type LucideIcon, MoveUpRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";

export interface TipCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  linkText?: string;
  href?: string;
  className?: string;
  delay?: number;
  fecha?: string;
}

export default function TipCard({
  title,
  icon: Icon,
  description,
  linkText,
  href,
  className = "",
  delay = 0,
  fecha ,
}: TipCardProps) {
  const { isDarkMode } = useLoginUI();

  const hasLink = Boolean(linkText && href);

  return (
    <ScrollReveal delay={delay} className={className}>
      <article
        className={`
          group relative flex flex-col rounded-3xl border border-b-5 border-(--bordes) bg-(--bg-form)
          shadow-sm hover:shadow-lg hover:-translate-y-1
          transition-all duration-300 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary) focus-visible:ring-offset-2
          ${hasLink ? "cursor-pointer" : ""}
          min-h-40 card-skew bg-(--primary)
        `}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start gap-4">
            <div
              className={`
                shrink-0 flex items-center justify-center w-12 h-12 rounded-xl
                transition-all duration-300 ease-out
                group-hover:scale-110 group-hover:translate-x-1
                ${isDarkMode
                  ? "bg-(--secondary)/15 text-(--secondary) border border-(--secondary)/30"
                  : "bg-(--secondary)/40 text-(--secondary) border border-(--secondary)/30"}
              `}
              aria-hidden="true"
            >
              <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`
                  text-base font-bold tracking-tight transition-colors duration-200
                  group-hover:text-(--secondary)
                  text-white
                `}
              >
                {title}
              </h3>
            </div>
          </div>

          <div className="flex-1 my-3">
            <p
              className={`
                text-sm leading-relaxed transition-colors duration-200
                text-neutral-300
                group-hover:text-(--secondary)
              `}
            >
              {description}
            </p>
          </div>
          {fecha &&(
            <div className={`
                inline-flex items-center gap-1.5 text-sm font-medium mt-4
                transition-all duration-200
                ${isDarkMode ? "text-(--secondary)" : "text-(--secondary)"}
                group-hover:translate-x-1
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary) focus-visible:ring-offset-2 rounded
              `}>              
              <h3>{fecha}</h3>
            </div>
          )}
          {hasLink && href && (
            <Link
              to={href}
              target="_blanket"
              className={`
                inline-flex items-center gap-1.5 text-sm font-medium mt-4
                transition-all duration-200
                ${isDarkMode ? "text-(--secondary)" : "text-(--secondary)"}
                group-hover:translate-x-1
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary) focus-visible:ring-offset-2 rounded
              `}
              aria-label={`Ir a ${linkText}`}
            >
              {linkText}
              <MoveUpRight size={22} />
            </Link>
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
      </article>
    </ScrollReveal>
  );
}