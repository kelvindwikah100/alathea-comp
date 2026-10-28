"use client";

import React, { useState } from "react";
import Image from "@/components/ui/smart-image";
import Link from "next/link";
import { Package, MessageCircle, Scale, ArrowUpRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/database";
import { formatRupiah, calculateDiscountPercentage, generateWhatsAppLink, getStockBadgeColors } from "@/lib/utils";

import { useCompare } from "@/context/compare-context";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: Product;
  onCompareToggle?: (product: Product) => void;
  isCompared?: boolean;
}

export function ProductCard({ product, onCompareToggle }: ProductCardProps) {
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { addToCart } = useCart();
  const compared = isInCompare(product.id);
  const discount = calculateDiscountPercentage(product.price, product.discount_price);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
    if (onCompareToggle) {
      onCompareToggle(product);
    }
  };

  return (
    <div
      className="p-5 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 font-jakarta rounded-[28px] frost-card"
    >
      <div>
        {/* Top Header: Brand Pill & Stock Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#141414] dark:text-zinc-200 px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-zinc-800 border border-white/80 dark:border-zinc-700">
            {product.brand}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${getStockBadgeColors(product.stock_status)?.dot ?? "bg-zinc-500"}`}
            />
            <span className={`text-[11px] font-medium ${getStockBadgeColors(product.stock_status)?.text ?? "text-[#2D3138] dark:text-zinc-400"}`}>
              {product.stock_status === "available"
                ? "Ready Stock"
                : product.stock_status === "pre_order"
                ? "Pre-Order"
                : "Habis"}
            </span>
          </div>
        </div>

        {/* Recessed Image Frame with Next.js Image */}
        <Link
          href={`/products/${product.slug}`}
          className="block rounded-[20px] bg-white/90 dark:bg-zinc-900 border border-white/90 dark:border-zinc-800 p-2 mb-4 h-44 relative overflow-hidden group cursor-pointer"
        >
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover rounded-[16px] group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Package className="w-10 h-10 text-zinc-400 mx-auto mt-14" />
          )}
          {discount && (
            <span className="absolute top-2.5 left-2.5 bg-[#141414] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              -{discount}%
            </span>
          )}
        </Link>

        {/* Category Label */}
        <span className="text-[11px] font-mono text-[#8D939E] dark:text-zinc-400 block mb-1">
          {product.category?.name || "Hardware"}
        </span>

        {/* Product Title (2-line clamp) */}
        <Link href={`/products/${product.slug}`}>
          <h4 className="font-bold text-sm line-clamp-2 mb-1.5 text-[#111111] dark:text-white hover:underline cursor-pointer">
            {product.name}
          </h4>
        </Link>

        {/* Short Description */}
        <p className="text-[11.5px] text-[#676B74] dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
          {product.short_description}
        </p>

        {/* Technical Specs Micro-pills */}
        {product.specifications?.slice(0, 2).map((s, idx) => (
          <div
            key={idx}
            className="px-2.5 py-1 mb-1.5 rounded-[12px] bg-white/70 dark:bg-zinc-800/70 border border-white/80 dark:border-zinc-700/60 text-[10.5px] truncate text-[#2D3138] dark:text-zinc-300"
          >
            <span className="text-[#8D939E] font-medium">{s.label}: </span>
            <span className="font-mono">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Price & Action Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono text-base font-bold text-[#111111] dark:text-white">
            {formatRupiah(product.discount_price || product.price)}
          </span>
          {product.discount_price && (
            <span className="font-mono text-xs text-[#8D939E] line-through">
              {formatRupiah(product.price)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-12 gap-2">
          {/* Detail Button */}
          <Link
            href={`/products/${product.slug}`}
            className="col-span-6 h-[38px] rounded-full border border-[#D0D5DD] dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 hover:bg-white text-[#141414] dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
          >
            <span>Detail</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Quick Add to Cart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            disabled={product.stock_status === "out_of_stock"}
            title={product.stock_status === "out_of_stock" ? "Stok habis" : "Tambah ke Keranjang"}
            className="col-span-3 h-[38px] rounded-full border border-[#D0D5DD] dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 hover:bg-[#141414] hover:text-white dark:hover:bg-white dark:hover:text-black text-[#141414] dark:text-zinc-300 flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          {/* Quick Compare Toggle Button */}
          <button
            type="button"
            onClick={handleCompareClick}
            title={compared ? "Hapus dari perbandingan" : "Bandingkan spesifikasi"}
            className={`col-span-3 h-[38px] rounded-full flex items-center justify-center transition cursor-pointer border ${
              compared
                ? "bg-[#141414] text-white dark:bg-white dark:text-black border-transparent shadow-xs"
                : "border-[#D0D5DD] dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 hover:bg-white text-[#141414] dark:text-zinc-300"
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
