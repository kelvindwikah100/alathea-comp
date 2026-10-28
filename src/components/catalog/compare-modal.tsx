"use client";

import React, { useMemo } from "react";
import Image from "@/components/ui/smart-image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCompare } from "@/context/compare-context";
import { formatRupiah, generateWhatsAppLink } from "@/lib/utils";
import {
  Scale,
  X,
  MessageCircle,
  ArrowUpRight,
  Package,
  Check,
  Minus,
} from "lucide-react";

export function CompareModal() {
  const {
    compareProducts,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
  } = useCompare();

  // Extract all unique specification labels from all compared products
  const uniqueSpecLabels = useMemo(() => {
    const labelSet = new Set<string>();
    compareProducts.forEach((p) => {
      p.specifications?.forEach((s) => {
        if (s.label) {
          labelSet.add(s.label.trim());
        }
      });
    });
    return Array.from(labelSet);
  }, [compareProducts]);

  return (
    <Dialog open={isCompareModalOpen} onOpenChange={setIsCompareModalOpen}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px]! glass-panel border border-zinc-200/90 dark:border-zinc-800 shadow-2xl font-jakarta">
        <DialogHeader className="pb-4 border-b border-zinc-200/70 dark:border-zinc-800 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#141414] dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 shadow-sm">
              <Scale className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-[-0.02em]">
                Komparasi Spesifikasi Hardware
              </DialogTitle>
              <p className="text-xs text-[#676B74] dark:text-zinc-400 mt-0.5">
                Membandingkan {compareProducts.length} produk terpilih secara berdampingan.
              </p>
            </div>
          </div>

          {compareProducts.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs text-[#676B74] hover:text-[#111111] dark:hover:text-white underline cursor-pointer shrink-0"
            >
              Hapus Semua
            </button>
          )}
        </DialogHeader>

        {compareProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-[#8D939E] mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#111111] dark:text-white mb-1">
              Tidak Ada Produk yang Dipilih
            </h4>
            <p className="text-xs text-[#676B74] dark:text-zinc-400 mb-6 max-w-sm mx-auto">
              Silakan pilih tombol &quot;Bandingkan&quot; pada kartu produk di katalog untuk melihat perbandingan spesifikasi.
            </p>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="px-6 py-2.5 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-xs font-semibold shadow-xs"
            >
              Tutup Modal
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto pt-4 pb-2">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className="w-[180px] text-left p-3 text-xs uppercase font-bold text-[#8D939E] tracking-wider border-b border-zinc-200/80 dark:border-zinc-800">
                    Atribut
                  </th>
                  {compareProducts.map((p) => (
                    <th
                      key={p.id}
                      className="p-3 text-left border-b border-zinc-200/80 dark:border-zinc-800 align-top"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-xs font-semibold text-[#141414] dark:text-zinc-200 px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                          {p.brand}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCompare(p.id)}
                          className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center transition cursor-pointer text-zinc-600 dark:text-zinc-300"
                          title="Hapus dari perbandingan"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Photo Thumbnail */}
                      <div className="relative w-full h-36 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden mb-3">
                        {p.images?.[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="240px"
                          />
                        ) : (
                          <Package className="w-10 h-10 text-zinc-400 mx-auto mt-12" />
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-[#111111] dark:text-white line-clamp-2 mb-1">
                        {p.name}
                      </h4>
                      <Link
                        href={`/products/${p.slug}`}
                        onClick={() => setIsCompareModalOpen(false)}
                        className="text-[11px] text-[#676B74] hover:text-[#111111] dark:hover:text-white flex items-center gap-1 font-medium underline mb-3"
                      >
                        <span>Lihat Detail</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-xs">
                {/* Row: Price */}
                <tr className="bg-white/40 dark:bg-zinc-900/40">
                  <td className="p-3 font-semibold text-[#676B74] dark:text-zinc-400">
                    Harga Resmi
                  </td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3">
                      <span className="font-mono text-base font-bold text-[#111111] dark:text-white block">
                        {formatRupiah(p.discount_price || p.price)}
                      </span>
                      {p.discount_price && (
                        <span className="font-mono text-[11px] text-[#8D939E] line-through block">
                          {formatRupiah(p.price)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row: Stock Status */}
                <tr>
                  <td className="p-3 font-semibold text-[#676B74] dark:text-zinc-400">
                    Ketersediaan Unit
                  </td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 font-medium text-[11px] text-[#111111] dark:text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#111111] dark:bg-white" />
                        {p.stock_status === "available"
                          ? "Ready Stock"
                          : p.stock_status === "pre_order"
                          ? "Pre-Order"
                          : "Habis"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row: SKU */}
                <tr className="bg-white/40 dark:bg-zinc-900/40">
                  <td className="p-3 font-semibold text-[#676B74] dark:text-zinc-400">
                    Nomor SKU
                  </td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 font-mono font-medium text-[#111111] dark:text-white">
                      {p.sku}
                    </td>
                  ))}
                </tr>

                {/* Dynamic Spec Rows */}
                {uniqueSpecLabels.map((label, idx) => (
                  <tr key={label} className={idx % 2 === 0 ? "bg-white/40 dark:bg-zinc-900/40" : ""}>
                    <td className="p-3 font-semibold text-[#676B74] dark:text-zinc-400">
                      {label}
                    </td>
                    {compareProducts.map((p) => {
                      const match = p.specifications?.find(
                        (s) => s.label.toLowerCase() === label.toLowerCase()
                      );
                      return (
                        <td
                          key={p.id}
                          className="p-3 font-mono text-[#2D3138] dark:text-zinc-200 leading-relaxed"
                        >
                          {match ? match.value : <Minus className="w-3.5 h-3.5 text-zinc-300" />}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Action Row: Direct Order via WhatsApp */}
                <tr className="bg-white/80 dark:bg-zinc-800/80">
                  <td className="p-3 font-semibold text-[#111111] dark:text-white">
                    Pemesanan
                  </td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3">
                      <a
                        href={p.stock_status === "out_of_stock" ? undefined : generateWhatsAppLink(p)}
                        aria-disabled={p.stock_status === "out_of_stock"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none h-10 px-4 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-[#262626] transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Pesan via WA</span>
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
