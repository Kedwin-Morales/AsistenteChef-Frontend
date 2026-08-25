import { Mail, Phone} from "lucide-react";
import { FaLinkedin, FaWhatsapp, FaGithub } from "react-icons/fa";
import { useLoginUI } from "@/features/auth/hooks/useLoginUI";

export default function Footer() {
  const { isDarkMode } = useLoginUI();

  const links = {
    soporte: [
      { label: "Centro de ayuda", href: "/ayuda" },
      { label: "Documentación", href: "/docs" },
    ],
    contacto: [
      { label: "kedwin.morales@gmail.com", href: "mailto:kedwin.morales@gmail.com", icon: Mail },
      { label: "+584242816485", href: "tel:+584242816485", icon: Phone },
    ],
    legal: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
    ],
    social: [
      { label: "GitHub", href: "https://github.com", icon: FaGithub },
      { label: "WhatsApp", href: "https://whatsApp.com", icon: FaWhatsapp },
      { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
    ],
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`
        w-full border-t ${isDarkMode ? "bg-(--color-bg) border-(--secondary)/30 text-neutral-500" : "bg-(--color-bg) border-(--secondary)/30 text-neutral-500"}
      `}
      role="contentinfo"
    >
      <div className="max-w-1xl mx-auto px-2 py-2 md:py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-1 md:gap-3">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <span className="font-bold px-2 text-neutral-500 text-1xl flex items-center">
                AsistentePRO
            </span>
            <div className="flex items-center gap-0.5">
              <img
                src="/Clovercube.png"
                alt="AsistentePro"
                className="w-30 h-10 object-contain opacity-80"
              />
              {links.social.map((item) => (
                <a
                  key={item.label}
                  // href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    p-1 rounded-lg
                    ${isDarkMode
                      ? "hover:bg-(--secondary)/30 text-neutral-400"
                      : "hover:bg-(--secondary)/50 text-neutral-500"}
                  `}
                  aria-label={item.label}
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          {/* Contacto */}
          <div className="mb-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-1 text-neutral-500">
              Contacto
            </h3>
            <ul className="space-y-1">
              {links.contacto.map((item) => (
                <li key={item.label}>
                  <a
                    //href={item.href}
                    target="_blank"
                    className={`
                      flex items-center gap-2 text-sm transition-colors
                      ${isDarkMode
                        ? "hover:text-(--secondary)/30 text-neutral-500"
                        : "hover:text-(--secondary)/50 text-neutral-500"}
                    `}
                  >
                    <item.icon size={16} className="shrink-0 opacity-60" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div className="mb-1"> 
            <h3 className="text-sm font-semibold uppercase mb-1 tracking-wider text-neutral-500">
              Soporte
            </h3>
            <ul className="space-y-1">
              {links.soporte.map((item) => (
                <li key={item.label}>
                  <a
                    //href={item.href}
                    target="_blank"
                    className={`
                      text-sm transition-colors
                      ${isDarkMode
                        ? "hover:text-(--secondary)/30 text-neutral-500"
                        : "hover:text-(--secondary)/50 text-neutral-500"}
                    `}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="mb-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-1 text-neutral-500">
              Legal
            </h3>
            <ul className="space-y-1">
              {links.legal.map((item) => (
                <li key={item.label}>
                  <a
                    //href={item.href}
                    target="_blank"
                    className={`
                      text-sm
                      ${isDarkMode
                        ? "hover:text-(--secondary)/30 text-neutral-500"
                        : "hover:text-(--secondary)/50 text-neutral-500"}
                    `}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`mt-2 pt-1 border-t ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`}
        >
          <p className="text-sm text-neutral-500 pb-2">
              Asistente inteligente para la gestión profesional de recetas,
              ingredientes y planificación culinaria. Diseñado para chefs y
              cocinas modernas.
            </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-neutral-500">
              © {currentYear} AsistentePro. Todos los derechos reservados. 
            </p>
            <p className="text-sm text-neutral-500">
              Desarrollado por Kedwin Morales
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}