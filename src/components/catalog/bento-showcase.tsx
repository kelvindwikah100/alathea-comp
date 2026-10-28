"use client";

import React from "react";
import Image from "@/components/ui/smart-image";
import Link from "next/link";
import {
  Laptop,
  Cpu,
  HardDrive,
  Monitor,
  Keyboard,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  VolumeX,
  Package,
} from "lucide-react";
import { Product, Category } from "@/types/database";
import { formatRupiah, calculateDiscountPercentage } from "@/lib/utils";

interface BentoShowcaseProps {
  featuredProducts: Product[];
  categories: Category[];
  onSelectCategory?: (slug: string) => void;
}

export function BentoShowcase({
  featuredProducts,
  categories,
  onSelectCategory,
}: BentoShowcaseProps) {
  const flagship = featuredProducts[0] || null;
  const secondaryFeatured = featuredProducts[1] || null;

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "laptop":
        return <Laptop className="w-5 h-5 text-[#111111] dark:text-white" />;
      case "pc-rakitan":
        return <Cpu className="w-5 h-5 text-[#111111] dark:text-white" />;
      case "komponen-pc":
        return <HardDrive className="w-5 h-5 text-[#111111] dark:text-white" />;
      case "monitor":
        return <Monitor className="w-5 h-5 text-[#111111] dark:text-white" />;
      case "aksesoris":
        return <Keyboard className="w-5 h-5 text-[#111111] dark:text-white" />;
      default:
        return <Package className="w-5 h-5 text-[#111111] dark:text-white" />;
    }
  };

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
    const el = document.getElementById("catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="bento-showcase" className="w-full my-12 font-jakarta">
      <div className="flex items-center justify-between mb-7">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-[11px] font-semibold text-[#141414] dark:text-zinc-200 mb-2">
            <Sparkles className="w-3 h-3 text-[#111111] dark:text-white" />
            <span>Kurasi Hardware Unggulan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-white tracking-[-0.02em]">
            Bento Grid Showcase
          </h2>
        </div>
        <Link
          href="#catalog-section"
          className="text-xs font-semibold text-[#111111] dark:text-white flex items-center gap-1 hover:underline"
        >
          <span>Eksplor Katalog</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Asymmetric Bento Grid: 12 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        
        {/* TILE 1: Primary Large Flagship Showcase (7 Columns) */}
        {flagship && (
          <div
            className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden rounded-[28px] frost-card"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-800 text-xs font-semibold text-[#141414] dark:text-zinc-200 border border-white/90">
                  {flagship.brand} • Flagship Edition
                </span>
                <span className="text-xs font-mono font-medium text-[#8D939E]">
                  SKU: {flagship.sku}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white mb-2 leading-tight">
                {flagship.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#676B74] dark:text-zinc-400 mb-6 max-w-lg leading-relaxed">
                {flagship.short_description}
              </p>
            </div>

            {/* Image Preview with Hover Lift */}
            <div className="relative w-full h-56 sm:h-64 rounded-[22px] bg-white/90 dark:bg-zinc-900 border border-white dark:border-zinc-800 overflow-hidden mb-6 flex items-center justify-center">
              {flagship.images?.[0] ? (
                <Image
                  src={flagship.images[0]}
                  alt={flagship.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-[20px]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                <Package className="w-16 h-16 text-zinc-400" />
              )}
            </div>

            {/* Price & CTA Action */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
              <div>
                <span className="text-[11px] text-[#8D939E] block">Harga Resmi</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">
                  {formatRupiah(flagship.discount_price || flagship.price)}
                </span>
              </div>
              <Link
                href={`/products/${flagship.slug}`}
                className="h-[44px] px-6 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-xs font-semibold flex items-center gap-2 hover:bg-[#262626] transition shadow-xs cursor-pointer"
              >
                <span>Lihat Detail Unit</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: 5 Columns for Category Tiles & Secondary Highlights */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* TILE 2: Quick Category Explorer (5 Interactive Category Pills) */}
          <div
            id="categories"
            className="p-6 rounded-[28px] transition-all frost-card"
          >
            <h4 className="text-sm font-bold text-[#111111] dark:text-white mb-3">
              Katalog Kategori Hardware
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="p-3 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border border-white/90 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-700 transition flex flex-col items-start justify-between gap-2 text-left cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#EEF2F6] dark:bg-zinc-700/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#111111] dark:text-white block">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#8D939E] dark:text-zinc-400">
                      Pilihan Unit
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TILE 3: Secondary Featured Product or Tech Standard Card */}
          {secondaryFeatured ? (
            <div
              className="p-6 rounded-[28px] flex flex-col justify-between transition-all frost-card"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-zinc-800 text-[11px] font-semibold text-[#141414] dark:text-zinc-200">
                  {secondaryFeatured.brand}
                </span>
                <span className="font-mono text-xs font-bold text-[#111111] dark:text-white">
                  {formatRupiah(secondaryFeatured.discount_price || secondaryFeatured.price)}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-700 shrink-0 overflow-hidden relative">
                  {secondaryFeatured.images?.[0] ? (
                    <Image
                      src={secondaryFeatured.images[0]}
                      alt={secondaryFeatured.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-zinc-400 mx-auto mt-6" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#111111] dark:text-white line-clamp-2 mb-1">
                    {secondaryFeatured.name}
                  </h4>
                  <p className="text-[11px] text-[#676B74] dark:text-zinc-400 line-clamp-2">
                    {secondaryFeatured.short_description}
                  </p>
                </div>
              </div>

              <Link
                href={`/products/${secondaryFeatured.slug}`}
                className="w-full h-[38px] rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <span>Lihat Spesifikasi</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            /* TILE 4: Zero-Glow Acoustic & QC Standard */
            <div
              className="p-6 rounded-[28px] flex flex-col justify-between frost-card"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center mb-3">
                  <VolumeX className="w-5 h-5 text-[#111111] dark:text-white" />
                </div>
                <h4 className="font-bold text-base text-[#111111] dark:text-white mb-1.5">
                  Zero-Glow Acoustic Chassis
                </h4>
                <p className="text-xs text-[#676B74] dark:text-zinc-400 leading-relaxed mb-4">
                  Setiap unit PC rakitan diuji dengan beban termal Cinebench dan FurMark selama 4 jam tanpa lampu RGB menyilaukan demi fokus kerja studio maksimal.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#111111] dark:text-white pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Thermal & Acoustic Verified</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
