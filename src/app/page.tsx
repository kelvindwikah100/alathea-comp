"use client";

import React, { useState, useEffect } from "react";
import Image from "@/components/ui/smart-image";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Search,
  Check,
  Sparkles,
  Volume2,
  Cpu,
  BatteryCharging,
  ShieldCheck,
  X,
  Package,
  MessageCircle,
  Sun,
  Moon,
  ShoppingBag,
  Phone,
  SlidersHorizontal,
} from "lucide-react";
import {
  getCategories,
  getProducts,
  getLocalCategories,
  getLocalProducts,
  enrichProductUpgradability,
} from "@/lib/services/catalog";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "@/lib/seed-data";
import { formatRupiah, calculateDiscountPercentage, generateWhatsAppLink, getStockBadgeColors } from "@/lib/utils";
import { Category, Product, SelectedUpgradePlan } from "@/types/database";
import { CustomUpgradeModal } from "@/components/catalog/custom-upgrade-modal";
import { useCart } from "@/context/cart-context";

import { BrandLogo } from "@/components/layout/brand-logo";

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Dialog and Modal states
  const [activeModal, setActiveModal] = useState<null | "menu" | "search" | "contact" | "buy" | "materials" | "ai">(null);

  // Catalog state - initialized deterministically with seed data to prevent SSR/client hydration mismatch
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(() =>
    INITIAL_PRODUCTS.map(enrichProductUpgradability)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Cart Context
  const { totalItems, setIsCartOpen, addToCart } = useCart();

  // Custom Upgrade state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [appliedUpgradePlan, setAppliedUpgradePlan] = useState<SelectedUpgradePlan | null>(null);
  const [showOnlyUpgradable, setShowOnlyUpgradable] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isCurrent = true;

    // Immediately load client localStorage updates if available (safe after hydration)
    const localCats = getLocalCategories();
    const localProds = getLocalProducts().map(enrichProductUpgradability);
    if (localCats.length > 0) setCategories(localCats);
    if (localProds.length > 0) setProducts(localProds);

    async function loadCatalog() {
      try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        if (!isCurrent) return;
        if (cats && cats.length > 0) setCategories(cats);
        if (prods && prods.length > 0) setProducts(prods);
      } catch (err) {
        console.warn("Could not sync remote catalog, keeping local data:", err);
      }
    }
    loadCatalog();

    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category?.slug === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUpgradable = !showOnlyUpgradable || p.is_ram_upgradable || p.is_ssd_upgradable;
    return matchesCategory && matchesSearch && matchesUpgradable;
  });

  const featuredProduct = products.find((p) => p.is_featured) || products[0];

  const handleScrollToCatalog = () => {
    const catalogEl = document.getElementById("catalog-section");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] dark:bg-[#0b0d10] text-[#111111] dark:text-[#F4F4F5] flex flex-col items-center justify-start overflow-x-clip selection:bg-[#111111] selection:text-white transition-colors duration-200 font-jakarta">
      {/* ============================================================
          1. FIXED / STICKY TOP NAVBAR (Subtle Drop Shadow & Frosted Glass)
         ============================================================ */}
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0b0d10]/85 backdrop-blur-md border-b border-zinc-200/70 dark:border-zinc-800/70 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-11 py-3.5 flex items-center justify-between gap-2">
          {/* Left Group: Logo + Menu + Search */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center select-none"
              aria-label="Alathea Comp – Beranda"
            >
              <BrandLogo className="h-7 sm:h-11" priority />
            </Link>

            {/* Menu Button with custom 2-line + dot icon */}
            <button
              onClick={() => setActiveModal("menu")}
              className="ml-3 sm:ml-[54px] flex items-center gap-2.5 text-[13.5px] font-medium text-[#1E1E1E] dark:text-zinc-200 hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open Menu"
            >
              <span className="flex flex-col justify-center gap-[3.5px] w-[22px]">
                <span className="w-[22px] h-[1.6px] bg-[#1E1E1E] dark:bg-zinc-200 rounded-full" />
                <span className="flex items-center justify-between w-[22px]">
                  <span className="w-[2px] h-[1.6px] bg-[#1E1E1E] dark:bg-zinc-200 rounded-full" />
                  <span className="w-[17px] h-[1.6px] bg-[#1E1E1E] dark:bg-zinc-200 rounded-full" />
                </span>
              </span>
              <span className="hidden sm:inline">Menu</span>
            </button>

            {/* Search Icon Button */}
            <button
              onClick={() => setActiveModal("search")}
              className="ml-2 sm:ml-7 text-[#1E1E1E] dark:text-zinc-300 hover:opacity-70 transition-opacity p-1 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-[17px] h-[17px] stroke-[1.8] text-[#111111] dark:text-white" />
            </button>
          </div>

          {/* Right Group: Theme Switcher + Compare Bag + Contact Us WhatsApp Pill */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Light/Dark Mode Toggle */}
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full border border-[#DCDFE6] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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

            {/* Shopping Bag Button with dynamic counter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full border border-[#DCDFE6] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Shopping Bag"
                title="Buka Keranjang Belanja"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[17px] h-[17px] stroke-[#1E1E1E] dark:stroke-zinc-200"
                  fill="none"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 7h12l1 13H5L6 7z" />
                  <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                </svg>
              </button>
              <span className="absolute -top-0.5 -right-2 text-[11px] font-semibold text-[#141414] dark:text-zinc-200 leading-none">
                {totalItems}
              </span>
            </div>

            {/* Contact WhatsApp Dark Pill Button */}
            <button
              onClick={() => setActiveModal("contact")}
              aria-label="Contact Us"
              className="w-[38px] h-[38px] justify-center sm:w-auto sm:h-[42px] sm:justify-start sm:pl-6 sm:pr-5 rounded-full bg-[#141414] dark:bg-zinc-100 text-[#F1F1F1] dark:text-zinc-950 flex items-center sm:gap-7 hover:bg-[#262626] dark:hover:bg-white transition-colors cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline text-[13px] font-normal tracking-[0.01em]">Contact Us</span>
              <ArrowUpRight className="hidden sm:block w-[15px] h-[15px] text-[#EAEAEA] dark:text-zinc-900 stroke-[1.7]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Catalog View Container */}
      <div className="font-jakarta relative w-full max-w-[1440px] px-4 sm:px-11 pt-6 sm:pt-8 pb-20 flex flex-col justify-between">
        {/* ============================================================
            PRODUCT CATALOG SECTION (Direct View)
           ============================================================ */}
        <section id="catalog-section" className="relative z-20 space-y-8 scroll-mt-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-[11px] font-semibold text-[#141414] dark:text-zinc-200 mb-2.5">
                <Package className="w-3.5 h-3.5 text-[#141414] dark:text-zinc-200" />
                <span>KATALOG HARDWARE PILIHAN</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#111111] dark:text-white">
                Pilih Komputer & Komponen Impian Anda
              </h2>
            </div>

            {/* Quick Category Filters & Upgradable Toggle */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setShowOnlyUpgradable(false);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                  selectedCategory === "all" && !showOnlyUpgradable
                    ? "bg-[#141414] dark:bg-white text-white dark:text-black shadow-sm"
                    : "bg-[#F0F3F7] text-[#2D3138] hover:bg-[#E2E7EE]"
                }`}
              >
                Semua ({products.length})
              </button>

              <button
                onClick={() => setShowOnlyUpgradable(!showOnlyUpgradable)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  showOnlyUpgradable
                    ? "bg-[#141414] dark:bg-white text-white dark:text-black shadow-sm"
                    : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hanya Upgradable</span>
              </button>

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                    selectedCategory === c.slug && !showOnlyUpgradable
                      ? "bg-[#141414] dark:bg-white text-white dark:text-black shadow-sm"
                      : "bg-[#F0F3F7] text-[#2D3138] hover:bg-[#E2E7EE]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Custom Upgrade Simulation Banner */}
          {appliedUpgradePlan && (appliedUpgradePlan.ram || appliedUpgradePlan.ssd) && (
            <div className="p-4 rounded-2xl bg-[#EEF3F8] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#141414] dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111111] dark:text-white flex items-center gap-2">
                    <span>Simulasi Custom Upgrade Diterapkan</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      +{formatRupiah((appliedUpgradePlan.ram?.price || 0) + (appliedUpgradePlan.ssd?.price || 0))}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#676B74] dark:text-zinc-300 mt-0.5">
                    {appliedUpgradePlan.ram ? `RAM: ${appliedUpgradePlan.ram.name}` : "RAM: Bawaan"}
                    {" • "}
                    {appliedUpgradePlan.ssd ? `SSD: ${appliedUpgradePlan.ssd.name}` : "SSD: Bawaan"}
                    {" (Garansi Resmi 100% Tetap Aktif)"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-800 text-[#141414] dark:text-white text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 cursor-pointer shadow-xs"
                >
                  Ubah Paket
                </button>
                <button
                  onClick={() => setAppliedUpgradePlan(null)}
                  className="px-3 py-1.5 rounded-full text-zinc-500 hover:text-red-500 text-xs font-medium cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Product Cards Grid (Matching the Materials Card Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const discount = calculateDiscountPercentage(p.price, p.discount_price);
              const isUpgradable = Boolean(p.is_ram_upgradable || p.is_ssd_upgradable);

              const ramAdd = isUpgradable && appliedUpgradePlan?.ram ? appliedUpgradePlan.ram.price : 0;
              const ssdAdd = isUpgradable && appliedUpgradePlan?.ssd ? appliedUpgradePlan.ssd.price : 0;
              const totalUpgradeAdd = ramAdd + ssdAdd;

              const basePrice = p.discount_price || p.price;
              const finalCombinedPrice = basePrice + totalUpgradeAdd;

              return (
                <div
                  key={p.id}
                  className="rounded-[28px] p-5 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-200 frost-card"
                >
                  <div>
                    {/* Brand & Stock & Upgradable Badge (Monochrome) */}
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-zinc-800 text-[11px] font-semibold text-[#141414] dark:text-zinc-200 border border-white/60 dark:border-zinc-700">
                          {p.brand}
                        </span>
                        {isUpgradable && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsUpgradeModalOpen(true);
                            }}
                            className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 cursor-pointer transition"
                            title="Klik untuk simulasi kustomisasi RAM & SSD"
                          >
                            <Sparkles className="w-2.5 h-2.5" /> Upgradable
                          </button>
                        )}
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-zinc-800 text-[11px] font-medium border border-white/60 dark:border-zinc-700 flex items-center gap-1.5 ${getStockBadgeColors(p.stock_status)?.text ?? "text-[#141414] dark:text-zinc-200"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStockBadgeColors(p.stock_status)?.dot ?? "bg-[#141414] dark:bg-white"}`} />
                        {p.stock_status === "available"
                          ? "Tersedia"
                          : p.stock_status === "pre_order"
                          ? "Pre-Order"
                          : "Habis"}
                      </span>
                    </div>

                    {/* Image Frame with Link to Product Detail Page */}
                    <Link
                      href={`/products/${p.slug}`}
                      className="block rounded-[20px] bg-white/90 dark:bg-zinc-900 border border-white/90 dark:border-zinc-800 p-2 mb-4 h-44 relative overflow-hidden group cursor-pointer"
                    >
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover rounded-[16px] group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 25vw"
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

                    {/* Product Name & Short Description */}
                    <Link href={`/products/${p.slug}`}>
                      <h4 className="font-bold text-sm line-clamp-2 mb-1.5 text-[#111111] dark:text-white hover:underline cursor-pointer">
                        {p.name}
                      </h4>
                    </Link>
                    <p className="text-[11.5px] text-[#676B74] dark:text-zinc-400 line-clamp-2 mb-3">
                      {p.short_description}
                    </p>

                    {/* Technical Specs Micro-pills */}
                    {p.specifications?.slice(0, 2).map((s, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1 mb-1.5 rounded-[12px] bg-white/70 dark:bg-zinc-800/70 border border-white/80 dark:border-zinc-700/60 text-[10.5px] truncate text-[#2D3138] dark:text-zinc-300"
                      >
                        <span className="text-[#8D939E] font-medium">{s.label}: </span>
                        <span className="font-mono">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-base font-bold text-[#111111] dark:text-white">
                          {formatRupiah(finalCombinedPrice)}
                        </span>
                        {p.discount_price && totalUpgradeAdd === 0 && (
                          <span className="font-mono text-xs text-[#8D939E] line-through">
                            {formatRupiah(p.price)}
                          </span>
                        )}
                      </div>
                      {totalUpgradeAdd > 0 && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-0.5">
                          Termasuk Custom Upgrade (+{formatRupiah(totalUpgradeAdd)})
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        className="col-span-4 h-[38px] rounded-full border border-[#D0D5DD] dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 hover:bg-white text-[#141414] dark:text-zinc-200 text-xs font-semibold flex items-center justify-center transition cursor-pointer"
                      >
                        Detail
                      </Link>
                      <button
                        type="button"
                        disabled={p.stock_status === "out_of_stock"}
                        onClick={() =>
                          addToCart(
                            p,
                            1,
                            isUpgradable && appliedUpgradePlan ? appliedUpgradePlan : undefined
                          )
                        }
                        className="col-span-4 h-[38px] rounded-full border border-[#141414] dark:border-white bg-transparent hover:bg-[#141414] hover:text-white dark:hover:bg-white dark:hover:text-black text-[#141414] dark:text-white text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                        title={p.stock_status === "out_of_stock" ? "Stok habis" : "Tambah ke Keranjang"}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>+Cart</span>
                      </button>
                      <a
                        href={
                          p.stock_status === "out_of_stock"
                            ? undefined
                            : generateWhatsAppLink(
                                p,
                                undefined,
                                isUpgradable && appliedUpgradePlan ? appliedUpgradePlan : undefined
                              )
                        }
                        aria-disabled={p.stock_status === "out_of_stock"}
                        title={p.stock_status === "out_of_stock" ? "Stok habis" : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none col-span-4 h-[38px] rounded-full bg-[#141414] dark:bg-white text-white dark:text-black hover:bg-[#262626] text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


          {filteredProducts.length === 0 && (
            <div
              className="rounded-[28px] p-12 text-center frost-card"
            >
              <Package className="w-12 h-12 text-[#141414] dark:text-zinc-400 mx-auto mb-3" />
              <h4 className="font-bold text-base mb-1 text-[#111111] dark:text-white">Produk Tidak Ditemukan</h4>
              <p className="text-xs text-[#676B74]">Coba ubah kata kunci pencarian atau kategori filter.</p>
            </div>
          )}
        </section>

        {/* ============================================================
            6. MODALS & DRAWERS (Strict Monochrome)
           ============================================================ */}
        {activeModal && (
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="bg-white dark:bg-[#18191D] rounded-[24px] max-w-md w-full p-7 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4 text-[#111111] dark:text-zinc-200" />
              </button>

              {/* Buy Modal */}
              {activeModal === "buy" && (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-[#141414] dark:text-zinc-200 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#141414] dark:text-zinc-200" /> Flagship Workstation Edition
                  </div>
                  <h4 className="text-2xl font-bold mb-2 text-[#111111] dark:text-white">
                    {featuredProduct ? featuredProduct.name : "Alathea Workstation Zero-Glow"}
                  </h4>
                  <p className="text-sm text-[#676B74] dark:text-zinc-400 mb-5 leading-relaxed">
                    Sistem komputasi desktop rakitan industrial dengan manajemen kabel presisi, motherboard PCIe 5.0, dan GPU RTX 40 series.
                  </p>
                  <div className="space-y-2.5 mb-6 text-xs text-[#2D3138] dark:text-zinc-300">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F4F7FB] dark:bg-zinc-800/60">
                      <Cpu className="w-4 h-4 text-[#111111] dark:text-white" />
                      <span>AMD Ryzen 7 7800X3D (8 Cores, 96MB 3D V-Cache)</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F4F7FB] dark:bg-zinc-800/60">
                      <BatteryCharging className="w-4 h-4 text-[#111111] dark:text-white" />
                      <span>PSU Corsair RM750e 750W 80+ Gold ATX 3.0</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F4F7FB] dark:bg-zinc-800/60">
                      <Volume2 className="w-4 h-4 text-[#111111] dark:text-white" />
                      <span>Zero-Glow Matte Acoustic Airflow (DeepCool AK620)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <span className="text-xs text-[#8D939E] block">Harga Rakitan</span>
                      <span className="text-2xl font-bold font-mono text-[#111111] dark:text-white">
                        {featuredProduct ? formatRupiah(featuredProduct.price) : "Rp 27.490.000"}
                      </span>
                    </div>
                    <a
                      href={featuredProduct ? generateWhatsAppLink(featuredProduct) : `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-[#141414] dark:bg-zinc-100 text-white dark:text-black text-sm font-medium hover:bg-zinc-800 transition flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-white dark:text-black" /> Pesan via WA
                    </a>
                  </div>
                </div>
              )}

              {/* Materials Modal */}
              {activeModal === "materials" && (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-[#141414] dark:text-zinc-200 text-xs font-semibold mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#141414] dark:text-zinc-200" /> Standar Industri
                  </div>
                  <h4 className="text-2xl font-bold mb-2 text-[#111111] dark:text-white">
                    Aerospace Aluminum & Zero-Glow Chassis
                  </h4>
                  <p className="text-sm text-[#676B74] dark:text-zinc-400 leading-relaxed mb-4">
                    Setiap unit sasis yang kami tawarkan melalui uji toleransi getaran dan disipasi termal. Kami mengutamakan material padat tanpa lampu RGB berlebihan demi keheningan dan fokus kerja maksimal.
                  </p>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-3 rounded-full bg-[#141414] dark:bg-zinc-100 text-white dark:text-black text-sm font-medium cursor-pointer"
                  >
                    Tutup Preview
                  </button>
                </div>
              )}

              {/* WhatsApp Consultation Modal */}
              {activeModal === "ai" && (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-[#141414] dark:text-zinc-200 text-xs font-semibold mb-3">
                    <MessageCircle className="w-3.5 h-3.5 text-[#141414] dark:text-zinc-200" /> Konsultasi Gratis
                  </div>
                  <h4 className="text-2xl font-bold mb-2 text-[#111111] dark:text-white">
                    Konsultasi Laptop & Rakit PC
                  </h4>
                  <p className="text-sm text-[#676B74] dark:text-zinc-400 leading-relaxed mb-4">
                    Ingin merakit PC untuk rendering AutoCAD, Blender, atau gaming AAA di budget tertentu? Klik tombol di bawah untuk konsultasi langsung dengan teknisi spesialis kami via WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848"}?text=Halo%20Admin%20Alathea%20Comp%2C%20saya%20ingin%20konsultasi%20spesifikasi%20PC%20rakitan.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-[#141414] dark:bg-zinc-100 text-white dark:text-black text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-white dark:text-black" /> Mulai Konsultasi Gratis
                  </a>
                </div>
              )}

              {/* Menu Modal (Navigasi Toko + Store Information) */}
              {activeModal === "menu" && (
                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
                  <div>
                    <h4 className="text-xl font-bold mb-3 text-[#111111] dark:text-white">Navigasi Toko</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setActiveModal(null);
                          handleScrollToCatalog();
                        }}
                        className="w-full p-3 text-left rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold flex items-center justify-between text-[#111111] dark:text-white transition cursor-pointer"
                      >
                        <span>Katalog Lengkap</span>
                        <ArrowUpRight className="w-4 h-4 text-[#111111] dark:text-zinc-400" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveModal(null);
                          setIsUpgradeModalOpen(true);
                        }}
                        className="w-full p-3 text-left rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold flex items-center justify-between text-[#111111] dark:text-white transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Simulasi Custom Upgrade (RAM & SSD)</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#111111] dark:text-zinc-400" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveModal("ai");
                        }}
                        className="w-full p-3 text-left rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold flex items-center justify-between text-[#111111] dark:text-white transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                          <span>Konsultasi Gratis via WhatsApp</span>
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#111111] dark:text-zinc-400" />
                      </button>
                      <Link
                        href="/tentang"
                        onClick={() => setActiveModal(null)}
                        className="w-full p-3 text-left rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold flex items-center justify-between text-[#111111] dark:text-white transition cursor-pointer"
                      >
                        <span>Tentang Alathea Comp</span>
                        <ArrowUpRight className="w-4 h-4 text-[#111111] dark:text-zinc-400" />
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setActiveModal(null)}
                        className="w-full p-3 text-left rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold flex items-center justify-between text-[#111111] dark:text-white transition cursor-pointer"
                      >
                        <span>Admin CMS Dashboard</span>
                        <ArrowUpRight className="w-4 h-4 text-[#111111] dark:text-zinc-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Modal with Quick Clear Button */}
              {activeModal === "search" && (
                <div>
                  <h4 className="text-xl font-bold mb-3 text-[#111111] dark:text-white">Cari Produk Hardware</h4>
                  <div className="p-3 rounded-2xl bg-[#EEF2F6] dark:bg-zinc-800 flex items-center gap-2 mb-4 border border-zinc-200 dark:border-zinc-700">
                    <Search className="w-4 h-4 text-[#111111] dark:text-zinc-400 shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Cari laptop, GPU, PC rakitan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#111111] dark:text-white"
                      autoFocus
                    />
                    {searchQuery.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          searchInputRef.current?.focus();
                        }}
                        className="w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600 flex items-center justify-center text-zinc-700 dark:text-zinc-200 transition cursor-pointer shrink-0"
                        title="Hapus pencarian"
                      >
                        <X className="w-3 h-3 stroke-[2.2]" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      handleScrollToCatalog();
                    }}
                    className="w-full py-2.5 rounded-full bg-[#111111] dark:bg-zinc-100 text-white dark:text-black text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Tampilkan Hasil Pencarian
                  </button>
                </div>
              )}

              {/* Contact Modal */}
              {activeModal === "contact" && (
                <div>
                  <h4 className="text-xl font-bold mb-2 text-[#111111] dark:text-white">Kontak Alathea Comp</h4>
                  <p className="text-sm text-[#676B74] dark:text-zinc-400 mb-4">
                    Layanan pelanggan dan tim teknisi kami siap membantu setiap hari kerja (09.00 - 21.00 WIB).
                  </p>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848"}?text=Halo%20Admin%20Alathea%20Comp%2C%20saya%20ingin%20bertanya%20mengenai%20produk.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-[#141414] dark:bg-zinc-100 text-white dark:text-black text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-white dark:text-black" /> Hubungi via WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Quick-View Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-white dark:bg-[#18191D] rounded-[24px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-[#111111] dark:text-zinc-200" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-xs font-semibold text-[#141414] dark:text-zinc-200">
                  {selectedProduct.brand}
                </span>
                <span className="text-xs font-mono text-[#8D939E]">SKU: {selectedProduct.sku}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[#111111] dark:text-white">
                {selectedProduct.name}
              </h3>

              <div className="rounded-[20px] bg-[#EEF2F6] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 h-56 relative overflow-hidden mb-4">
                {selectedProduct.images?.[0] ? (
                  <Image
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                ) : (
                  <Package className="w-12 h-12 text-zinc-400 mx-auto mt-16" />
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#2D3138] dark:text-zinc-300 mb-4 leading-relaxed">
                {selectedProduct.description || selectedProduct.short_description}
              </p>

              {/* Specifications Table */}
              <div className="mb-6 space-y-1.5">
                <h5 className="font-bold text-xs uppercase text-[#8D939E] tracking-wider mb-2">
                  Spesifikasi Teknis
                </h5>
                {selectedProduct.specifications?.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#F4F6F9] dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between text-xs text-[#2D3138] dark:text-zinc-200"
                  >
                    <span className="text-[#8D939E] font-medium">{s.label}</span>
                    <span className="font-mono font-semibold text-right max-w-[60%]">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <span className="text-xs text-[#8D939E] block">Harga</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-[#111111] dark:text-white">
                    {formatRupiah(
                      (selectedProduct.discount_price || selectedProduct.price) +
                        (appliedUpgradePlan && (selectedProduct.is_ram_upgradable || selectedProduct.is_ssd_upgradable)
                          ? (selectedProduct.is_ram_upgradable && appliedUpgradePlan.ram ? appliedUpgradePlan.ram.price : 0) +
                            (selectedProduct.is_ssd_upgradable && appliedUpgradePlan.ssd ? appliedUpgradePlan.ssd.price : 0)
                          : 0)
                    )}
                  </span>
                  {appliedUpgradePlan && (selectedProduct.is_ram_upgradable || selectedProduct.is_ssd_upgradable) && (
                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                      (Termasuk Custom Upgrade Terpilih)
                    </span>
                  )}
                </div>
                <a
                  href={
                    selectedProduct.stock_status === "out_of_stock"
                      ? undefined
                      : generateWhatsAppLink(
                          selectedProduct,
                          undefined,
                          selectedProduct.is_ram_upgradable || selectedProduct.is_ssd_upgradable
                            ? appliedUpgradePlan || undefined
                            : undefined
                        )
                  }
                  aria-disabled={selectedProduct.stock_status === "out_of_stock"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none px-6 py-2.5 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4 text-white dark:text-black" />
                  <span>Order Sekarang</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Custom Upgrade Simulation Modal */}
        <CustomUpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          onApplyUpgrade={(plan) => {
            setAppliedUpgradePlan(plan);
            if (plan.ram || plan.ssd) {
              setShowOnlyUpgradable(true);
            }
          }}
          currentPlan={appliedUpgradePlan || undefined}
        />
      </div>
    </div>
  );
}

