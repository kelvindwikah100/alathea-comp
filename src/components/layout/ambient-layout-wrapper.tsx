"use client";

import React from "react";

interface AmbientLayoutWrapperProps {
  children: React.ReactNode;
  /**
   * Kelas tambahan untuk pembungkus terluar (outer wrapper)
   */
  className?: string;
  /**
   * Kelas tambahan untuk kontainer konten utama (inner relative container)
   */
  containerClassName?: string;
}

/**
 * AmbientLayoutWrapper
 *
 * Komponen pembungkus (wrapper) layout utama dengan dukungan:
 * - Tema Light Mode (neutral-100) & Dark Mode (neutral-950)
 * - Transisi warna mulus (transition-colors duration-300)
 * - Pendaran ambient glow lembut (soft white spotlight) di tengah layar
 * - Struktur z-index aman (glow tidak menghalangi interaksi/klik pengguna)
 * - Mencegah horizontal scrollbar dengan overflow-hidden
 */
export const AmbientLayoutWrapper: React.FC<AmbientLayoutWrapperProps> = ({
  children,
  className = "",
  containerClassName = "",
}) => {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950 ${className}`}
    >
      {/* =========================================================================
          DEKORATIF AMBIENT GLOW / SOFT SPOTLIGHT
          - pointer-events-none & select-none agar bebas dari interaksi klik/seleksi
          - z-0 berada di bawah layer konten utama
          ========================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* 1. Primary Center Ambient Glow (Pendaran Utama di Tengah) */}
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[650px] sm:h-[650px] lg:w-[880px] lg:h-[720px] rounded-full bg-white/80 dark:bg-white/[0.07] blur-3xl transition-colors duration-300" />

        {/* 2. Secondary Top Diffuse Light (Gradasi Halus dari Atas untuk Menambah Kedalaman / Depth) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-b from-white/70 via-white/20 to-transparent dark:from-white/[0.05] dark:via-white/[0.015] dark:to-transparent blur-2xl transition-colors duration-300" />
      </div>

      {/* =========================================================================
          KONTEN UTAMA
          - relative z-10 memastikan tombol, link, dan form input dapat diklik tanpa halangan
          ========================================================================= */}
      <div className={`relative z-10 w-full ${containerClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default AmbientLayoutWrapper;

