"use client";

import React from "react";
import Link from "next/link";
import { Cpu, MessageCircle, MapPin, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#0D0E10] font-jakarta transition-colors">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-11 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Store Overview */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-2xl font-extrabold tracking-[-0.035em] text-[#111111] dark:text-white leading-none select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-[#141414] dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span>Alathea Comp.</span>
            </Link>

            <p className="text-xs sm:text-sm text-[#676B74] dark:text-zinc-400 max-w-sm leading-relaxed">
              Katalog kurasi hardware komputer, laptop berperforma tinggi, dan stasiun kerja arsitektural. Mengedepankan komponen bergaransi resmi, reliabilitas termal, dan estetika industrial zero-glow.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F6] dark:bg-zinc-800 text-[11px] font-medium text-[#111111] dark:text-zinc-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garansi Resmi 100%</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2F6] dark:bg-zinc-800 text-[11px] font-medium text-[#111111] dark:text-zinc-200">
                <span>QC & Stress-Test Siap Pakai</span>
              </span>
            </div>
          </div>

          {/* Category Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#111111] dark:text-white">
              Kategori Hardware
            </h5>
            <ul className="space-y-2 text-xs text-[#676B74] dark:text-zinc-400">
              <li>
                <Link href="/#catalog-section" className="hover:text-[#111111] dark:hover:text-white transition-colors">
                  Laptop High-Performance & Ultrabook
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-[#111111] dark:hover:text-white transition-colors">
                  PC Rakitan Gaming & Workstation
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-[#111111] dark:hover:text-white transition-colors">
                  Komponen PC (GPU, CPU, Motherboard)
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-[#111111] dark:hover:text-white transition-colors">
                  Monitor OLED & High Refresh Rate
                </Link>
              </li>
              <li>
                <Link href="/#catalog-section" className="hover:text-[#111111] dark:hover:text-white transition-colors">
                  Aksesoris Desk Setup & Mechanical Keyboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Hours & Store Location */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-[#111111] dark:text-white">
              Atelier & Layanan Pelanggan
            </h5>
            <div className="space-y-2 text-xs text-[#676B74] dark:text-zinc-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#111111] dark:text-white shrink-0 mt-0.5" />
                <span>
                  Jl. Boulevard IT Hardware No. 88, Kawasan Komputasi Presisi, Indonesia.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#111111] dark:text-white shrink-0 mt-0.5" />
                <span>
                  Senin – Sabtu: 09.00 – 21.00 WIB (Konsultasi Teknis & Pemesanan)
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848"}?text=Halo%20Admin%20Alathea%20Comp%2C%20saya%20ingin%20konsultasi%20spesifikasi.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-xs font-semibold hover:bg-zinc-800 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat via WhatsApp</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin Link */}
        <div className="mt-12 pt-6 border-t border-zinc-200/70 dark:border-zinc-800/70 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8D939E] dark:text-zinc-400 gap-3">
          <p>© 2026 Alathea Comp. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-[#111111] dark:hover:text-white transition-colors">
              Admin CMS Login
            </Link>
            <span>•</span>
            <span>Zero-Glow Hardware Precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
