"use client";

import React, { useEffect, useState } from "react";
import Image from "@/components/ui/smart-image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Cpu,
  Package,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Truck,
  Wrench,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { getProductBySlug, getProducts } from "@/lib/services/catalog";
import { formatRupiah, calculateDiscountPercentage, generateWhatsAppLink, getStockBadgeColors } from "@/lib/utils";
import { Product, SelectedUpgradePlan } from "@/types/database";
import { CustomUpgradeModal } from "@/components/catalog/custom-upgrade-modal";
import { useCart } from "@/context/cart-context";


import { BrandLogo } from "@/components/layout/brand-logo";
function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] dark:bg-[#0F1012] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-6 sm:px-11 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-7 h-[460px] rounded-[28px] bg-zinc-200/60 dark:bg-zinc-800/60" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-6 w-32 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60" />
            <div className="h-10 w-full rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60" />
            <div className="h-24 w-full rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60" />
            <div className="h-36 w-full rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Custom Upgrade state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState<SelectedUpgradePlan | null>(null);

  // Cart context
  const { totalItems, setIsCartOpen, addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (!slug) return;

    let isCancelled = false;
    async function loadData() {
      setIsLoading(true);
      try {
        const item = await getProductBySlug(slug);
        if (!isCancelled) {
          setProduct(item);
          setSelectedImageIndex(0);

          if (item?.category?.slug) {
            const related = await getProducts({
              categorySlug: item.category.slug,
            });
            if (!isCancelled) {
              setRelatedProducts(related.filter((p) => p.id !== item.id).slice(0, 4));
            }
          } else {
            const all = await getProducts();
            if (!isCancelled) {
              setRelatedProducts(all.filter((p) => p.id !== item?.id).slice(0, 4));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link produk berhasil disalin ke clipboard!");
    }
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const discount = product ? calculateDiscountPercentage(product.price, product.discount_price) : null;
  const activeImage = product?.images?.[selectedImageIndex] || product?.images?.[0] || null;

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] dark:bg-[#0F1012] text-[#111111] dark:text-[#F4F4F5] flex flex-col items-center justify-start overflow-x-clip selection:bg-[#111111] selection:text-white transition-colors duration-200 font-jakarta">
      {/* ============================================================
          1. FIXED / STICKY TOP NAVBAR (Strict Monochrome)
         ============================================================ */}
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0F1012]/85 backdrop-blur-md border-b border-zinc-200/70 dark:border-zinc-800/70 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-11 py-3.5 flex items-center justify-between">
          {/* Left: Brand & Back to Catalog */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="flex items-center select-none"
              aria-label="Alathea Comp – Beranda"
            >
              <BrandLogo className="h-9 sm:h-10" priority />
            </Link>

            <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700 hidden sm:block" />

            <Link
              href="/#catalog-section"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#676B74] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
              <span>Kembali ke Katalog</span>
            </Link>
          </div>

          {/* Right: Theme Toggle & WhatsApp Contact */}
          <div className="flex items-center gap-3">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-[42px] h-[42px] rounded-full border border-[#DCDFE6] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-white" />
                ) : (
                  <Moon className="w-4 h-4 text-[#111111]" />
                )}
              </button>
            )}

            {/* Shopping Bag Button with Dynamic Counter */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative w-[42px] h-[42px] rounded-full border border-[#DCDFE6] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Keranjang Belanja"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4 text-[#111111] dark:text-zinc-200" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848"}?text=Halo%20Admin%20Alathea%20Comp%2C%20saya%20ingin%20konsultasi%20hardware.`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[42px] px-5 sm:px-6 rounded-full bg-[#141414] dark:bg-zinc-100 text-[#F1F1F1] dark:text-zinc-950 flex items-center gap-2 hover:bg-[#262626] dark:hover:bg-white transition-colors cursor-pointer shadow-sm text-[13px] font-medium"
            >
              <MessageCircle className="w-4 h-4 text-white dark:text-black" />
              <span className="hidden sm:inline">Hubungi Kami</span>
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================
          2. MAIN CONTENT CONTAINER (1440px desktop max-width)
         ============================================================ */}
      <div className="w-full max-w-[1440px] px-6 sm:px-11 pt-6 pb-24 flex flex-col justify-start">
        
        {/* Breadcrumb Hierarchy */}
        <nav className="flex items-center gap-2 text-xs text-[#8D939E] dark:text-zinc-400 mb-6 font-medium flex-wrap">
          <Link href="/" className="hover:text-[#111111] dark:hover:text-white transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <Link href="/#catalog-section" className="hover:text-[#111111] dark:hover:text-white transition-colors">
            Katalog Hardware
          </Link>
          {product?.category?.name && (
            <>
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <span className="text-[#676B74] dark:text-zinc-300">{product.category.name}</span>
            </>
          )}
          {product?.name && (
            <>
              <ChevronRight className="w-3 h-3 text-zinc-400" />
              <span className="text-[#111111] dark:text-white font-semibold truncate max-w-[280px]">
                {product.name}
              </span>
            </>
          )}
        </nav>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-7 h-[460px] rounded-[28px] bg-zinc-200/60 dark:bg-zinc-800/60" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-6 w-32 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60" />
              <div className="h-10 w-full rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60" />
              <div className="h-24 w-full rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60" />
              <div className="h-36 w-full rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>
          </div>
        )}

        {/* PRODUCT NOT FOUND STATE */}
        {!isLoading && !product && (
          <div
            className="p-12 text-center rounded-[28px] border border-zinc-200 dark:border-zinc-800 my-12 frost-card"
          >
            <Package className="w-16 h-16 text-[#141414] dark:text-zinc-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-[#111111] dark:text-white">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-sm text-[#676B74] mb-6 max-w-md mx-auto">
              Produk dengan tautan ini tidak tersedia atau telah diperbarui. Silakan kembali ke katalog untuk melihat produk lainnya.
            </p>
            <Link
              href="/#catalog-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] text-white text-xs font-semibold shadow hover:bg-zinc-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog Utama</span>
            </Link>
          </div>
        )}

        {/* ============================================================
            3. PRODUCT SHOWCASE (2 Columns Desktop)
           ============================================================ */}
        {!isLoading && product && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
              
              {/* LEFT COLUMN: Main Showcase & Image Gallery in Materials Card */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div
                  className="p-6 sm:p-8 rounded-[28px] relative transition-all duration-300 frost-card"
                >
                  {/* Top Overlay Badges */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-xs font-semibold text-[#141414] dark:text-zinc-200 border border-white/60 dark:border-zinc-700">
                        {product.brand}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-800 text-[11px] font-mono font-medium text-[#676B74] dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700">
                        SKU: {product.sku}
                      </span>
                      {Boolean(product.is_ram_upgradable || product.is_ssd_upgradable) && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/80 dark:border-emerald-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Upgradable
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-800 text-xs font-medium border border-zinc-200/60 dark:border-zinc-700 ${getStockBadgeColors(product.stock_status)?.text ?? "text-[#111111] dark:text-white"}`}>
                        <span className={`w-2 h-2 rounded-full ${getStockBadgeColors(product.stock_status)?.dot ?? "bg-[#111111] dark:bg-white"}`} />
                        {product.stock_status === "available"
                          ? "Ready Stock"
                          : product.stock_status === "pre_order"
                          ? "Pre-Order"
                          : "Stok Habis"}
                      </span>
                      {discount && (
                        <span className="px-2.5 py-1 rounded-full bg-[#141414] text-white font-mono text-xs font-bold shadow-xs">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </div>


                  {/* Main Large Image Canvas with Smooth Crossfade & Subtle Scale */}
                  <div className="rounded-[22px] bg-white dark:bg-[#18191D] border border-white dark:border-zinc-800 p-4 relative aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center overflow-hidden shadow-inner group">
                    {activeImage ? (
                      <div
                        key={selectedImageIndex}
                        className="relative w-full h-full animate-in fade-in zoom-in-95 duration-400 ease-out"
                      >
                        <Image
                          src={activeImage}
                          alt={product.name}
                          fill
                          priority
                          className="object-cover rounded-[18px] group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                          sizes="(max-width: 1024px) 100vw, 55vw"
                        />
                      </div>
                    ) : (
                      <Package className="w-16 h-16 text-zinc-400" />
                    )}
                  </div>

                  {/* Image Thumbnails Selector with Smooth Hover & Active Ring Indicator */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                      {product.images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative w-20 h-20 rounded-[16px] overflow-hidden transition-all duration-300 ease-out cursor-pointer shrink-0 bg-white dark:bg-zinc-900 group ${
                            selectedImageIndex === idx
                              ? "ring-2 ring-[#111111] dark:ring-white border-2 border-white dark:border-zinc-900 scale-100 shadow-md"
                              : "border border-zinc-200/80 dark:border-zinc-800 opacity-60 hover:opacity-100 hover:scale-105"
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`${product.name} preview ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Trust Micro-Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[11.5px] text-[#2D3138] dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#111111] dark:text-white shrink-0" />
                      <span>100% Produk Asli & BNIB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#111111] dark:text-white shrink-0" />
                      <span>Pengiriman Packing Kayu Aman</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-[#111111] dark:text-white shrink-0" />
                      <span>QC & Stress-Test Siap Pakai</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Product Metadata, Pricing & Order Box */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Header Information */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8D939E] dark:text-zinc-400 mb-2">
                    <span>{product.brand}</span>
                    <span>•</span>
                    <span>{product.category?.name || "Hardware"}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-[#111111] dark:text-white leading-[1.2] tracking-[-0.02em] mb-3">
                    {product.name}
                  </h1>

                  <p className="text-sm text-[#676B74] dark:text-zinc-400 leading-relaxed">
                    {product.short_description}
                  </p>
                </div>

                {/* Pricing & Order Card in Materials Box */}
                <div
                  className="p-6 rounded-[28px] border transition-all frost-card"
                >
                  {(() => {
                    const isUpgradable = Boolean(product.is_ram_upgradable || product.is_ssd_upgradable);
                    const ramExtra = isUpgradable && upgradePlan?.ram ? upgradePlan.ram.price : 0;
                    const ssdExtra = isUpgradable && upgradePlan?.ssd ? upgradePlan.ssd.price : 0;
                    const totalUpgrade = ramExtra + ssdExtra;
                    const basePrice = product.discount_price || product.price;
                    const combinedPrice = basePrice + totalUpgrade;

                    return (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs uppercase font-bold tracking-wider text-[#8D939E] dark:text-zinc-400">
                            {totalUpgrade > 0 ? "Total Estimasi Unit + Upgrade" : "Harga Resmi Distributor"}
                          </span>
                          {isUpgradable && (
                            <button
                              type="button"
                              onClick={() => setIsUpgradeModalOpen(true)}
                              className="text-[11px] font-bold text-[#141414] dark:text-white underline hover:opacity-75 cursor-pointer flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              {upgradePlan && (upgradePlan.ram || upgradePlan.ssd) ? "Ubah Paket Upgrade" : "+ Custom Upgrade"}
                            </button>
                          )}
                        </div>

                        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                          <span className="font-mono text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white">
                            {formatRupiah(combinedPrice)}
                          </span>
                          {product.discount_price && totalUpgrade === 0 && (
                            <span className="font-mono text-base text-[#8D939E] line-through">
                              {formatRupiah(product.price)}
                            </span>
                          )}
                        </div>

                        {/* Upgrade Summary Pills if selected */}
                        {isUpgradable && upgradePlan && (upgradePlan.ram || upgradePlan.ssd) && (
                          <div className="mb-4 p-3 rounded-xl bg-white/90 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700 text-xs space-y-1">
                            <div className="font-bold text-[#111111] dark:text-white flex items-center justify-between">
                              <span>Paket Upgrade Terpilih (+{formatRupiah(totalUpgrade)}):</span>
                              <button
                                type="button"
                                onClick={() => setUpgradePlan(null)}
                                className="text-[10px] text-zinc-400 hover:text-red-500 font-medium"
                              >
                                Batal
                              </button>
                            </div>
                            {upgradePlan.ram && (
                              <div className="text-[11.5px] text-[#2D3138] dark:text-zinc-300">
                                • RAM: {upgradePlan.ram.name} (+{formatRupiah(upgradePlan.ram.price)})
                              </div>
                            )}
                            {upgradePlan.ssd && (
                              <div className="text-[11.5px] text-[#2D3138] dark:text-zinc-300">
                                • SSD: {upgradePlan.ssd.name} (+{formatRupiah(upgradePlan.ssd.price)})
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-[11.5px] text-[#676B74] dark:text-zinc-400 mb-6">
                          *Harga sudah termasuk PPN & bergaransi resmi distributor Indonesia. Pemasangan oleh teknisi resmi Alathea Comp.
                        </p>

                        {/* Primary CTA Buttons */}
                        <div className="space-y-3">
                          <a
                            href={
                              product.stock_status === "out_of_stock"
                                ? undefined
                                : generateWhatsAppLink(
                                    product,
                                    currentUrl,
                                    isUpgradable && upgradePlan ? upgradePlan : undefined
                                  )
                            }
                            aria-disabled={product.stock_status === "out_of_stock"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none w-full h-[52px] rounded-full bg-[#141414] dark:bg-white text-white dark:text-black hover:bg-[#262626] dark:hover:bg-zinc-100 font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md transition cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>
                              {totalUpgrade > 0 ? "Order Unit + Upgrade via WhatsApp" : "Order via WhatsApp Resmi"}
                            </span>
                          </a>

                          <button
                            type="button"
                            disabled={product.stock_status === "out_of_stock"}
                            onClick={() => addToCart(product, 1, isUpgradable && upgradePlan ? upgradePlan : undefined)}
                            className="w-full h-[48px] rounded-full border-2 border-[#141414] dark:border-white bg-transparent hover:bg-[#141414] hover:text-white dark:hover:bg-white dark:hover:text-black text-[#141414] dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>+ Tambah ke Keranjang Belanja</span>
                          </button>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={handleCopyLink}
                              className="h-[44px] rounded-full border border-[#D0D5DD] dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 hover:bg-white text-[#141414] dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
                              <span>Bagikan Link</span>
                            </button>

                            <a
                              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848"}?text=Halo%20Admin%20Alathea%2C%20saya%20ingin%20tanya%20kompatibilitas%20untuk%20produk%20${encodeURIComponent(product.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-[44px] rounded-full border border-[#D0D5DD] dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 hover:bg-white text-[#141414] dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Cpu className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
                              <span>Tanya Teknisi</span>
                            </a>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>


                {/* Key Spec Quick Highlights */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="p-5 rounded-[24px] bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/70 space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#8D939E] dark:text-zinc-400 mb-3">
                      Ringkasan Spesifikasi Utama
                    </h5>
                    {product.specifications.slice(0, 4).map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs py-1 border-b border-zinc-100 dark:border-zinc-800/80 last:border-b-0"
                      >
                        <span className="text-[#676B74] dark:text-zinc-400">{spec.label}</span>
                        <span className="font-mono font-medium text-[#111111] dark:text-white text-right max-w-[60%] truncate">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================
                4. FULL TECHNICAL SPECIFICATIONS & DESCRIPTION
               ============================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-zinc-200/70 dark:border-zinc-800/70">
              
              {/* Detailed Description */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xl font-bold text-[#111111] dark:text-white">
                  Deskripsi & Ulasan Produk
                </h3>
                <div className="p-6 sm:p-8 rounded-[28px] bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 text-sm text-[#2D3138] dark:text-zinc-300 leading-relaxed space-y-4">
                  {product.description ? (
                    product.description.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    <p>{product.short_description}</p>
                  )}
                  <p className="text-xs text-[#8D939E] dark:text-zinc-400 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                    Alathea menjamin seluruh unit yang dikirimkan adalah produk resmi original dengan nomor seri terdaftar dan bergaransi resmi.
                  </p>
                </div>
              </div>

              {/* Complete Spec Matrix */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-xl font-bold text-[#111111] dark:text-white">
                  Spesifikasi Teknis Lengkap
                </h3>
                <div className="space-y-2">
                  {product.specifications?.map((spec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-[18px] bg-[#F4F6F9] dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between text-xs text-[#2D3138] dark:text-zinc-200"
                    >
                      <span className="text-[#8D939E] font-medium">{spec.label}</span>
                      <span className="font-mono font-semibold text-right max-w-[65%]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ============================================================
                5. RELATED HARDWARE RECOMMENDATIONS
               ============================================================ */}
            {relatedProducts.length > 0 && (
              <div className="pt-12 border-t border-zinc-200/70 dark:border-zinc-800/70">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#111111] dark:text-white">
                      Produk Terkait Lainnya
                    </h3>
                    <p className="text-xs text-[#676B74] dark:text-zinc-400 mt-0.5">
                      Pilihan alternatif dengan performa dan spesifikasi serupa
                    </p>
                  </div>
                  <Link
                    href="/#catalog-section"
                    className="text-xs font-semibold text-[#111111] dark:text-white hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Semua</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((rel) => {
                    const relDiscount = calculateDiscountPercentage(rel.price, rel.discount_price);
                    return (
                      <div
                        key={rel.id}
                        className="p-5 flex flex-col justify-between group transition-all duration-300 rounded-[28px] frost-card"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-[#141414] dark:text-zinc-200 px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-zinc-800 border border-white/80">
                              {rel.brand}
                            </span>
                            <span className="text-[11px] font-mono text-[#8D939E]">
                              {rel.category?.name || "Hardware"}
                            </span>
                          </div>

                          <Link
                            href={`/products/${rel.slug}`}
                            className="block rounded-[20px] bg-white/90 dark:bg-zinc-900 border border-white/90 dark:border-zinc-800 p-2 mb-4 h-40 relative overflow-hidden group cursor-pointer"
                          >
                            {rel.images?.[0] ? (
                              <Image
                                src={rel.images[0]}
                                alt={rel.name}
                                fill
                                className="object-cover rounded-[16px] group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, 25vw"
                              />
                            ) : (
                              <Package className="w-10 h-10 text-zinc-400 mx-auto mt-14" />
                            )}
                            {relDiscount && (
                              <span className="absolute top-2.5 left-2.5 bg-[#141414] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                -{relDiscount}%
                              </span>
                            )}
                          </Link>

                          <Link href={`/products/${rel.slug}`}>
                            <h4 className="font-bold text-sm line-clamp-2 mb-1.5 text-[#111111] dark:text-white hover:underline">
                              {rel.name}
                            </h4>
                          </Link>
                          <p className="text-[11.5px] text-[#676B74] dark:text-zinc-400 line-clamp-2 mb-3">
                            {rel.short_description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="font-mono text-base font-bold text-[#111111] dark:text-white">
                              {formatRupiah(rel.discount_price || rel.price)}
                            </span>
                          </div>
                          <Link
                            href={`/products/${rel.slug}`}
                            className="w-full h-[38px] rounded-full bg-[#141414] dark:bg-white text-white dark:text-black hover:bg-[#262626] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                          >
                            <span>Lihat Detail</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            6. FOOTER (Strict Monochrome)
           ============================================================ */}
        <footer className="mt-20 pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8D939E] dark:text-zinc-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111111] dark:text-white">Alathea Comp.</span>
            <span>— Precision Hardware & Workstation Atelier</span>
          </div>
          <div>© {new Date().getFullYear()} Alathea Comp. All rights reserved.</div>
        </footer>
        {/* Custom Upgrade Simulation Modal */}
        <CustomUpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          onApplyUpgrade={(plan) => setUpgradePlan(plan)}
          currentPlan={upgradePlan || undefined}
        />
      </div>
    </div>
  );
}


export default function ProductDetailPage() {
  return (
    <React.Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent />
    </React.Suspense>
  );
}
