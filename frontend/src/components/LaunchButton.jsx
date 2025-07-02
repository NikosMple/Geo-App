import React from 'react';

const LaunchButton = ({ 
  text = "Launch", 
  onClick, 
  disabled = false,
  size = "medium",
  variant = "default",
  icon = null,
  narrow = false, // New prop for narrow buttons
  className = "",
  ...props 
}) => {
  
  // Default arrow launch icon (clean and modern)
  const defaultIcon = (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="transition-transform duration-500 ease-out"
    >
      <path 
        d="M7 17L17 7M17 7H8M17 7V16" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  // Size classes with narrow options
  const sizeClasses = {
    small: narrow ? "text-sm px-3 py-1.5" : "text-sm px-4 py-2",
    medium: narrow ? "text-base px-4 py-2" : "text-base px-6 py-3", 
    large: narrow ? "text-lg px-6 py-3" : "text-lg px-8 py-4"
  };

  // Updated variant classes with better colors
  const variantClasses = {
    default: "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 shadow-lg",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-lg shadow-green-500/25",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/25",
    warning: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/25",
    info: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25",
    purple: "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 shadow-lg shadow-violet-500/25",
    orange: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-lg shadow-orange-500/25",
    dark: "bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 shadow-lg",
    light: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-gray-800 shadow-lg"
  };

  // Icon size classes
  const iconSizeClasses = {
    small: "w-3.5 h-3.5",
    medium: "w-4 h-4",
    large: "w-5 h-5"
  };

  // Text color based on variant
  const textColor = variant === 'light' ? 'text-gray-800' : 'text-white';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative
        inline-flex items-center justify-center
        font-semibold ${textColor}
        border-0 rounded-lg
        transition-all duration-300 ease-out
        transform hover:-translate-y-1 hover:shadow-xl
        active:translate-y-0 active:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        whitespace-nowrap
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? '' : 'hover:scale-105'}
        ${narrow ? 'min-w-0' : 'min-w-[120px]'}
        ${className}
      `}
      {...props}
    >
      {/* Icon */}
      <div className={`
        ${iconSizeClasses[size]} 
        ${narrow ? 'mr-1.5' : 'mr-2'} flex-shrink-0
        transform 
        transition-all duration-500 ease-out
        group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110
      `}>
        {icon || defaultIcon}
      </div>
      
      {/* Text */}
      <span className="transition-transform duration-500 ease-out group-hover:translate-x-1">
        {text}
      </span>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-white pointer-events-none"></div>
    </button>
  );
};

export default LaunchButton;