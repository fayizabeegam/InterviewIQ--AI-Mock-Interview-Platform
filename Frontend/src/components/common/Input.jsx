import { Eye, EyeOff } from "lucide-react";

function Input({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  showPassword,
  togglePassword,
  className = "",
}) {
  const isPassword = type === "password";

  return (
    <div className="relative">
      {/* Left Icon */}
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}

      {/* Input */}
      <input
            name={name}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`
                h-14
                w-full
                rounded-xl
                border
                border-[#D8DEE9]
                bg-white
                pl-12
                ${isPassword ? "pr-12" : "pr-4"}
                text-[15px]
                text-slate-800
                placeholder:text-[#A3A3A3]
                outline-none
                transition-all
                focus:border-[#3B82F6]
                focus:ring-4
                focus:ring-blue-100
                ${className}
            `}
        />
      {/* Password Toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}

export default Input;