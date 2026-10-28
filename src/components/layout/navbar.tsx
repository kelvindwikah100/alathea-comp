"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Search,
  Sun,
  Moon,
  ArrowUpRight,
  Cpu,
  LayoutDashboard,
  MessageCircle,
  Scale,
  ShoppingBag,
} from "lucide-react";
import { openCommandSearch } from "@/components/catalog/command-search";
import { useCompare } from "@/context/compare-context";
import { useCart } from "@/context/cart-context";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { compareProducts, setIsCompareModalOpen } = useCompare();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0F1012]/85 backdrop-blur-md border-b border-zinc-200/70 dark:border-zinc-800/70 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all font-jakarta">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-11 py-3.5 flex items-center justify-between gap-4">
        
        {/* LEFT: Logo & Quick Navigation Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[22px] font-extrabold tracking-[-0.035em] text-[#111111] dark:text-white leading-none select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#141414] dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span>Alathea.</span>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 text-[13px] font-medium text-[#676B74] dark:text-zinc-400">
            <Link
              href="/#catalog-section"
              className="hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              Katalog
            </Link>
            <Link
              href="/#bento-showcase"
              className="hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              Unggulan
            </Link>
            <Link
              href="/#categories"
              className="hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              Kategori
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 hover:text-[#111111] dark:hover:text-white transition-colors text-xs px-2 py-0.5 rounded-full border border-zinc-300/80 dark:border-zinc-700/80"
            >
              <LayoutDashboard className="w-3 h-3 text-[#111111] dark:text-white" />
              <span>Admin Panel</span>
            </Link>
          </nav>
        </div>

        {/* CENTER / RIGHT: Command Search Trigger & Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Tactile Command Search Trigger Button */}
          <button
            type="button"
            onClick={openCommandSearch}
            className="h-[38px] px-3 sm:px-4 rounded-full border border-zinc-200/90 dark:border-zinc-700/80 bg-[#EEF2F6]/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-[#676B74] dark:text-zinc-400 flex items-center gap-2 sm:gap-3 text-xs transition cursor-pointer shadow-xs"
            title="Buka Pencarian Cepat (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
            <span className="hidden lg:inline text-xs text-[#2D3138] dark:text-zinc-300">
              Cari laptop, GPU, rakitan...
            </span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[#8D939E] dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* Light / Dark Mode Toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-[38px] h-[38px] rounded-full border border-[#DCDFE6] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
              title={theme === "dark" ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-white" />
              ) : (
                <Moon className="w-4 h-4 text-[#111111]" />
              )}
            </button>
          )}

          {/* Compare Counter Button */}
          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            className="relative w-[38px] h-[38px] rounded-full border border-[#DCDFE6] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Buka Komparasi Produk"
            aria-label="Komparasi Produk"
          >
            <Scale className="w-4 h-4 text-[#111111] dark:text-zinc-200" />
            {compareProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                {compareProducts.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button with Dynamic Counter */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative w-[38px] h-[38px] rounded-full border border-[#DCDFE6] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Buka Keranjang Belanja"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4 text-[#111111] dark:text-zinc-200" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          {/* WhatsApp Direct Contact Pill Button */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848"}?text=Halo%20Admin%20Alathea%20Comp%2C%20saya%20ingin%20konsultasi%20hardware.`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-[38px] pl-4 sm:pl-5 pr-3.5 sm:pr-4 rounded-full bg-[#141414] dark:bg-zinc-100 text-[#F1F1F1] dark:text-zinc-950 flex items-center gap-2 sm:gap-3 hover:bg-[#262626] dark:hover:bg-white transition-colors cursor-pointer shadow-xs text-xs font-medium"
          >
            <span>Hubungi Kami</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#EAEAEA] dark:text-zinc-900 stroke-[1.8]" />
          </a>
        </div>
      </div>
    </header>
  );
}
