import { motion } from "framer-motion";

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
      <div className="flex flex-col items-center gap-8">
        {/* ORBITAL ANIMATION */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-(--secondary)/20"
            animate={{ 
              scale: [1.5, 1, 1.5],
              opacity: [0.8, 1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "linear",
            }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-3 rounded-full border-2 border-(--secondary)/20"
            animate={{ 
              scale: [1.2, 1.2, 1.2],
              opacity: [0.8, 1, 0.8], 
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
            }}
          />

          {/* Inner pulse */}
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* TEXT */}
        <motion.p
          className={`text-sm tracking-widest uppercase ${
            isDarkMode ? "text-neutral-400" : "text-neutral-500"
          }`}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
