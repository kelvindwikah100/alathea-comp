"use client";

import React from "react";
import Image from "@/components/ui/smart-image";
import { Scale, X, Trash2, ArrowUpRight, Package } from "lucide-react";
import { useCompare } from "@/context/compare-context";

export function CompareBar() {
  const { compareProducts, removeFromCompare, clearCompare, setIsCompareModalOpen } = useCompare();

  if (compareProducts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl font-jakarta animate-in slide-in-from-bottom-5 duration-200">
      <div className="glass-panel p-3 sm:p-4 rounded-[26px] border border-zinc-200/90 dark:border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-3 sm:gap-6 flex-wrap sm:flex-nowrap">
        
        {/* Left: Product Mini Thumbnails */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center -space-x-2">
            {compareProducts.map((p) => (
              <div
                key={p.id}
                className="relative group w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border-2 border-white dark:border-zinc-800 shadow-sm overflow-hidden shrink-0"
              >
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <Package className="w-5 h-5 text-zinc-400 mx-auto mt-3" />
                )}
                {/* Remove button overlay */}
                <button
                  type="button"
                  onClick={() => removeFromCompare(p.id)}
                  title={`Hapus ${p.name}`}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>

          <div className="text-left">
            <span className="text-xs font-bold text-[#111111] dark:text-white block leading-tight">
              {compareProducts.length} dari 3 Produk
            </span>
            <span className="text-[11px] text-[#676B74] dark:text-zinc-400">
              Siap dibandingkan
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={clearCompare}
            className="h-9 px-3 rounded-full text-xs font-semibold text-[#676B74] hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hapus Semua</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            className="h-10 px-5 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center gap-2 shadow-md hover:bg-[#262626] dark:hover:bg-zinc-100 transition cursor-pointer active:scale-98"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Bandingkan Sekarang</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
