"use client";

import React, { useEffect } from "react";
import Image from "@/components/ui/smart-image";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatRupiah } from "@/lib/utils";

export function CartDrawer() {
  const {
    cartItems,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    getWhatsAppCheckoutUrl,
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-jakarta">
      {/* Backdrop with smooth blur and fade */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Right Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-[440px] bg-white dark:bg-[#141518] shadow-2xl border-l border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between animate-in slide-in-from-right duration-300 ease-out">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#141414] dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0 shadow-sm">
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#111111] dark:text-white">
                    Keranjang Belanja
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-[11px] font-bold font-mono text-[#141414] dark:text-zinc-200">
                    {totalItems} item
                  </span>
                </div>
                <p className="text-xs text-[#676B74] dark:text-zinc-400">
                  Unit katalog Alathea Comp pilihan Anda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Kosongkan seluruh keranjang"
                >
                  Kosongkan
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
                aria-label="Tutup Keranjang"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-20 h-20 rounded-3xl bg-[#F0F4F8] dark:bg-zinc-800/80 flex items-center justify-center mb-5 text-[#8D939E] dark:text-zinc-400 shadow-inner">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] dark:text-white mb-2">
                  Keranjang Masih Kosong
                </h4>
                <p className="text-xs sm:text-sm text-[#676B74] dark:text-zinc-400 max-w-[280px] mb-6 leading-relaxed">
                  Belum ada laptop atau hardware yang dimasukkan. Temukan perangkat impian Anda di katalog kami.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    const el = document.getElementById("catalog-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-3 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#262626] dark:hover:bg-zinc-200 transition shadow-sm cursor-pointer"
                >
                  <span>Mulai Eksplorasi Katalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const hasUpgrade = Boolean(
                  item.selectedUpgrade?.ram || item.selectedUpgrade?.ssd
                );

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 transition-all flex gap-3.5 items-start relative group"
                  >
                    {/* Thumbnail Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-18 h-18 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 p-1 relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform"
                    >
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                          sizes="72px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-[#141414] dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                          {item.product.brand}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono truncate">
                          {item.product.sku}
                        </span>
                      </div>

                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-bold text-xs sm:text-sm text-[#111111] dark:text-white line-clamp-1 hover:underline block"
                      >
                        {item.product.name}
                      </Link>

                      {/* Upgrade summary pill if present */}
                      {hasUpgrade && (
                        <div className="my-1 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-900/60 text-[10px] text-emerald-800 dark:text-emerald-300 space-y-0.5">
                          <div className="font-bold flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Custom Upgrade:
                          </div>
                          {item.selectedUpgrade?.ram && (
                            <div className="truncate">• {item.selectedUpgrade.ram.name}</div>
                          )}
                          {item.selectedUpgrade?.ssd && (
                            <div className="truncate">• {item.selectedUpgrade.ssd.name}</div>
                          )}
                        </div>
                      )}

                      {/* Unit Price */}
                      <div className="font-mono text-xs font-bold text-[#141414] dark:text-white mt-1">
                        {formatRupiah(item.unitPrice)}
                        <span className="text-[10px] text-zinc-400 font-normal font-sans ml-1">
                          / unit
                        </span>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                        {/* Stepper */}
                        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                            aria-label="Kurangi Kuantitas"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-mono text-[#111111] dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                            aria-label="Tambah Kuantitas"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Subtotal */}
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 block leading-none">
                            Subtotal
                          </span>
                          <span className="font-mono text-xs font-extrabold text-[#111111] dark:text-white">
                            {formatRupiah(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-3 right-3 p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                      title="Hapus produk ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer (Summary & CTA Actions) */}
          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              {/* Cost Summary Box */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Total Kuantitas</span>
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                    {totalItems} unit
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Biaya Pemasangan & Packing Kayu</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Gratis (Garansi Resmi)
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#111111] dark:text-white">
                    Total Estimasi
                  </span>
                  <span className="font-mono text-xl font-extrabold text-[#111111] dark:text-white">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-[11px] text-[#2D3138] dark:text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-[#111111] dark:text-white shrink-0" />
                <span>100% Unit Resmi Distributor & Teknisi Bersertifikasi</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  href={getWhatsAppCheckoutUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black hover:bg-[#262626] dark:hover:bg-zinc-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pesan / Checkout via WhatsApp</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full h-10 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-semibold text-[#141414] dark:text-zinc-200 transition cursor-pointer"
                >
                  Lanjut Belanja
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
