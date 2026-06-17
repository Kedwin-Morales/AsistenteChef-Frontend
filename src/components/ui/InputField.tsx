import { forwardRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  isDarkMode: boolean;
}

const InputField = forwardRef<HTMLInputElement, Props>(
  ({ label, icon: Icon, isDarkMode, type, onChange, onKeyDown, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        const cleaned = e.target.value.replace(/[^0-9.,-]/g, "");
        if (cleaned !== e.target.value) {
          e.target.value = cleaned;
        }
      }
      onChange?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (type === "number") {
        const allowed = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
        if (allowed.includes(e.key)) return;
        if (e.ctrlKey || e.metaKey) return;
        if (/^[0-9.,-]$/.test(e.key)) return;
        e.preventDefault();
      }
      onKeyDown?.(e);
    };

    return (
      <div className="w-full">
        <label
          className={`block mb-1 font-semibold text-md ${
            isDarkMode ? "text-(--primary)" : "text-(--primary)"
          }`}
        >
          {label}
          {rest.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div
          className={`
            relative rounded-xl border transition-all duration-300
            {/*${isDarkMode ? "border-slate-700 bg-(--color-bg)" : "border-slate-300 bg-(--color-bg)"}*/}
            focus-within:ring-2 focus-within:ring-(--secondary) focus-within:border-(--secondary)`}
        >
          {Icon && (
            <Icon
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
            />
          )}

          <input
            ref={ref}
            {...rest}
            type={isPassword && showPassword ? "text" : type}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`
              w-full py-3 pr-4 ${Icon ? "pl-10" : "pl-4"} text-md
              bg-transparent outline-none text-gray-900 dark:text-gray-100
              placeholder:text-gray-400
            `}
            style={type === "number" ? { MozAppearance: "textfield" } : undefined}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-500 hover:text-slate-800"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;