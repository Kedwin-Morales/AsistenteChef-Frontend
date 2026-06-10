
import { Moon, Sun, Croissant } from "lucide-react";

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
            className={`w-full p-6 flex justify-between items-center relative z-10 border-b border-stone-200/50 dark:border-stone-800/50 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md
        `}
        >
            <div className="flex items-center gap-2">
                <div className="bg-gradient-to-tr from-amber-500 to-orange-500 p-2 rounded-xl shadow-sm text-white">
                    <Croissant size={24} />
                </div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">PanaderiaOS</span>
            </div>

            <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode} 
            className={`p-3 rounded-full transition-all ${isDarkMode ? 'bg-yellow-400 text-slate-900' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        </header>
    );
}
