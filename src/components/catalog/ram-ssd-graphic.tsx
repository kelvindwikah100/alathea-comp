"use client";

import React from "react";

/**
 * Custom Hardware Visual Graphic for RAM & SSD NVMe Upgrade
 * Renders a high-detail 3D hardware visual of an SO-DIMM DDR5 module and an M.2 NVMe SSD
 * in sleek silver, chrome, metallic sheen, and gold contact pins matching the TP-7 monochrome aesthetic.
 */
export const RamSsdHardwareGraphic: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-[175px] h-[150px] flex items-center justify-center select-none pointer-events-none -mr-2 group ${className}`}
    >
      {/* Ambient soft shadow */}
      <div className="absolute w-[140px] h-[48px] bg-[#7C889B]/25 dark:bg-black/40 blur-xl rounded-full -rotate-[18deg] translate-y-6 translate-x-1" />

      <svg
        width="175"
        height="150"
        viewBox="0 0 175 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible transition-transform duration-300 ease-out group-hover:scale-105"
      >
        <defs>
          {/* Gradients for RAM & SSD */}
          <linearGradient id="ramBody" x1="20" y1="30" x2="130" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#EEF2F7" />
            <stop offset="70%" stopColor="#D5DEEB" />
            <stop offset="100%" stopColor="#A8B5C8" />
          </linearGradient>

          <linearGradient id="ssdBody" x1="45" y1="45" x2="155" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E222A" />
            <stop offset="40%" stopColor="#2D333F" />
            <stop offset="85%" stopColor="#14171D" />
            <stop offset="100%" stopColor="#0B0D10" />
          </linearGradient>

          <linearGradient id="metalPlate" x1="50" y1="50" x2="140" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#DCE4F0" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#A4B3C6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E2E9F4" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="goldPins" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="specularSheen" x1="30" y1="30" x2="140" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
          </linearGradient>

          <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#1E232B" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* ==============================================================
            1. SO-DIMM RAM MODULE (Tilted layer behind SSD, -16deg)
           ============================================================== */}
        <g transform="rotate(-18 85 75)" filter="url(#cardShadow)">
          {/* RAM PCB Substrate */}
          <rect
            x="24"
            y="26"
            width="106"
            height="54"
            rx="5"
            fill="url(#ramBody)"
            stroke="#98A7BC"
            strokeWidth="0.8"
          />

          {/* Golden Edge Connector Pins */}
          <g fill="url(#goldPins)">
            {Array.from({ length: 18 }).map((_, i) => (
              <rect
                key={i}
                x={28 + i * 5.4}
                y="74"
                width="3.2"
                height="6"
                rx="0.6"
              />
            ))}
          </g>
          {/* Key notch in the middle of RAM contacts */}
          <rect x="73" y="73" width="5" height="7.5" fill="#C2CCD8" rx="1" />

          {/* PCB Micro Traces */}
          <path
            d="M 32 34 L 56 34 L 62 40 L 98 40 M 34 46 L 50 46 L 54 50 L 80 50"
            stroke="#BDCAD9"
            strokeWidth="0.6"
            strokeDasharray="2 1"
          />

          {/* RAM Chips (DDR5 BGA ICs) */}
          <g>
            <rect x="32" y="36" width="16" height="26" rx="2" fill="#181C23" stroke="#333A48" strokeWidth="0.6" />
            <rect x="52" y="36" width="16" height="26" rx="2" fill="#181C23" stroke="#333A48" strokeWidth="0.6" />
            <rect x="72" y="36" width="16" height="26" rx="2" fill="#181C23" stroke="#333A48" strokeWidth="0.6" />
            <rect x="92" y="36" width="16" height="26" rx="2" fill="#181C23" stroke="#333A48" strokeWidth="0.6" />

            {/* Spec Label on Chip */}
            <text x="40" y="51" fill="#758296" fontSize="4.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              DDR5
            </text>
            <text x="60" y="51" fill="#758296" fontSize="4.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              5600
            </text>
            <text x="80" y="51" fill="#758296" fontSize="4.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              32GB
            </text>
            <text x="100" y="51" fill="#758296" fontSize="4.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              OC
            </text>
          </g>

          {/* Subtle PCB Top Edge Highlight */}
          <line x1="25" y1="27" x2="129" y2="27" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.9" />
        </g>

        {/* ==============================================================
            2. M.2 NVMe SSD MODULE (Foreground diagonal layer, -32deg)
           ============================================================== */}
        <g transform="rotate(-34 98 85)" filter="url(#cardShadow)">
          {/* M.2 SSD PCB (Dark Matte Gunmetal) */}
          <rect
            x="48"
            y="52"
            width="88"
            height="34"
            rx="4"
            fill="url(#ssdBody)"
            stroke="#4A5568"
            strokeWidth="0.75"
          />

          {/* M.2 Half-moon Screw Mount Notch on Left */}
          <path
            d="M 48 64 A 5 5 0 0 1 48 74 Z"
            fill="#C5D0DE"
          />
          <circle cx="48" cy="69" r="3.2" fill="#8896A8" />

          {/* Brushed Aluminum Metallic Heatspreader Shield */}
          <rect
            x="58"
            y="55"
            width="64"
            height="28"
            rx="2.5"
            fill="url(#metalPlate)"
            stroke="#FFFFFF"
            strokeWidth="0.6"
          />

          {/* Laser-engraved Heatsink Fins / Stylized Grooves */}
          <path
            d="M 64 61 L 116 61 M 64 66 L 116 66 M 64 71 L 116 71 M 64 76 L 116 76"
            stroke="#8191A6"
            strokeWidth="0.65"
            strokeLinecap="round"
          />

          {/* NVMe Badge & Speed Typography */}
          <rect x="74" y="62" width="34" height="13" rx="2" fill="#0E1217" />
          <text x="91" y="70" fill="#FFFFFF" fontSize="4.6" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.08em" textAnchor="middle">
            NVMe Gen4
          </text>
          <text x="91" y="74" fill="#93C5FD" fontSize="3" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            7400 MB/s
          </text>

          {/* M.2 Gold Pin Connector on Right */}
          <g fill="url(#goldPins)">
            {Array.from({ length: 9 }).map((_, i) => (
              <rect
                key={i}
                x={130}
                y={56 + i * 2.8}
                width="5"
                height="1.8"
                rx="0.4"
              />
            ))}
          </g>

          {/* Status Indicator LED (Minimal White Glow) */}
          <circle cx="61" cy="58" r="1" fill="#FFFFFF" />
          <circle cx="61" cy="58" r="2.2" fill="#FFFFFF" fillOpacity="0.3" />

          {/* Specular Diagonal Light Sweep */}
          <polygon
            points="70,55 86,55 76,83 60,83"
            fill="url(#specularSheen)"
            opacity="0.45"
          />
        </g>
      </svg>
    </div>
  );
};
