
import { Moon, Sun, ChefHat } from "lucide-react";

interface Props {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export default function AuthTopBar({
    isDarkMode,
    toggleDarkMode,
}: Props) {

   
    return (
        <header
            className={`w-full p-6 flex justify-between items-center bg-(--color-bg) relative z-10 border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} backdrop-blur-md`}
        >
            <div className="flex items-center gap-2">
                <div className="bg-gradient shadow-xl-secondary p-2 rounded-xl shadow-sm text-white">
                    <ChefHat size={24} />
                </div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient bg-clip-text text-transparent">AsistentePRO</span>
            </div>

            <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode} 
            className={`p-3 rounded-full transition-all ${isDarkMode ? 'bg-olive-100 text-slate-900 hover:bg-(--secondary)' : 'bg-neutral-700 text-white hover:bg-(--secondary)'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        </header>
    );
}
