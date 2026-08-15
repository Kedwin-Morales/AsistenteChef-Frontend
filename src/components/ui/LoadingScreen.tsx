import { motion } from "framer-motion";
import { ThinkingOrb } from "thinking-orbs";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  isDarkMode?: boolean;
}

export default function LoadingScreen({
  message = "Cargando sistema...",
  fullScreen = true,
  isDarkMode = false,
}: LoadingScreenProps) {
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 z-50" : "w-full py-16"
      } flex items-center justify-center transition-colors duration-500 ${
        isDarkMode ? "bg-(--color-bg)" : "bg-(--color-bg)"
      }`}
    >
      <motion.div
      // --- Animación de aparición (Framer Motion) ---
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 1.5, 
        ease: "easeInOut",
        delay: 0.2
      }}      
      // --- Aplicamos la clase de movimiento de fondo continua (CSS) ---
      className="p-5 rounded-full xl shadow-xl-secondary flex flex-col 
        items-center justify-center animate-gradient-move"
    >      
      <div
        className={`flex items-center gap-8`}
      >
        {/* ANIMATION */}
        <ThinkingOrb state="solving" size={64} speed={0.5} />
        {/* TEXT */}
        <motion.p
          className={`text-sm tracking-widest uppercase ${
            isDarkMode ? "text-neutral-300" : "text-neutral-600"
          }`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          {message}
        </motion.p>
        <ThinkingOrb state="shaping" size={64} speed={1.6} />
      </div>
    </motion.div>
    </div>
  );
}
