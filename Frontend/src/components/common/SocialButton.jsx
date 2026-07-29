function SocialButton({
  icon,
  text,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-300 bg-white py-4 font-medium transition-all duration-300 hover:bg-gray-50 hover:shadow-md ${className}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default SocialButton;