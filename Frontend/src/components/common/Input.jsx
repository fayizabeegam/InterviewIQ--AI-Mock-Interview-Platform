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
        type={isPassword && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border border-gray-300 py-4 ${
          icon ? "pl-12" : "pl-4"
        } ${isPassword ? "pr-12" : "pr-4"} outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${className}`}
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