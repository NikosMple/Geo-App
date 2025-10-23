import React from "react";

const Icon = ({ name, className = "w-6 h-6", strokeWidth = 1.8 }) => {
  const common = {
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
    focusable: false,
  };

  switch (name) {
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c3 4 3 14 0 18" />
          <path d="M12 3c-3 4-3 14 0 18" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 21V5" />
          <path d="M5 5c4-2 6 2 10 0v9c-4 2-6-2-10 0" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M10 19V9" />
          <path d="M16 19V3" />
          <path d="M2 19h20" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 5l6-2 6 2v14l-6-2-6 2-6-2V3l6 2z" />
          <path d="M9 5v14" />
          <path d="M15 3v14" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M9 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );
    case "login":
      return (
        <svg {...common}>
          <path d="M15 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2" />
          <path d="M10 17l-5-5 5-5" />
          <path d="M5 12h14" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 5l7 7-7 7" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="M11 19l-7-7 7-7" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M20.8 6.6a5.5 5.5 0 0 0-7.8 0L12 7.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-6.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6l4 2" />
        </svg>
      );
    default:
      return null;
  }
};

export default Icon;
