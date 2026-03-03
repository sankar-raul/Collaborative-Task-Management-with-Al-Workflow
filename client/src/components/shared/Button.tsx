import React from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] focus:ring-indigo-500 shadow-md hover:shadow-lg",

    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-[0.98] focus:ring-gray-400",

    outline:
      "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-[0.98] focus:ring-indigo-500",

    danger:
      "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] focus:ring-red-500 shadow-md hover:shadow-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;