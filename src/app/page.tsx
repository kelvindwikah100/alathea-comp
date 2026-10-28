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
} from "lucide-react";
import { getCategories, getHomepageHero, getProducts } from "@/lib/services/catalog";
import { formatRupiah, calculateDiscountPercentage, generateWhatsAppLink, getStockBadgeColors } from "@/lib/utils";
import { Category, HomepageHero, Product, SelectedUpgradePlan } from "@/types/database";
import { INITIAL_HOMEPAGE_HERO } from "@/lib/seed-data";
import { RamSsdHardwareGraphic } from "@/components/catalog/ram-ssd-graphic";
import { CustomUpgradeModal } from "@/components/catalog/custom-upgrade-modal";
import { useCart } from "@/context/cart-context";

import { BrandLogo } from "@/components/layout/brand-logo";
/**
 * Custom Titanium Crystal Cluster Component
 * Renders a photorealistic multi-faceted raw titanium crystal rock tilted at -36deg
 * matching the exact silhouette, contrast, and chrome facets from the reference design.
 */
const TitaniumCrystalGraphic: React.FC = () => {
  const facets = [
    { points: "28,118 18,98 32,76 52,58 76,38 102,22 128,16 152,26 164,46 154,72 134,94 108,116 78,132 48,134", fill: "url(#crystalBase)" },
    { points: "22,102 36,92 44,108 30,118", fill: "#D8DEE8" },
    { points: "36,92 52,86 44,108", fill: "#4A5260" },
    { points: "30,118 44,108 58,120 42,130", fill: "#9AA4B4" },
    { points: "44,108 64,98 58,120", fill: "#1E232B" },
    { points: "42,130 58,120 74,126 56,135", fill: "#E6ECF5" },
    { points: "58,120 78,108 74,126", fill: "#5C6474" },
    { points: "26,84 44,74 36,92 20,96", fill: "#F4F7FB" },
    { points: "44,74 58,82 36,92", fill: "#2B313B" },
    { points: "34,68 54,58 44,74", fill: "#B8C2D2" },
    { points: "52,86 70,74 64,98 44,108", fill: "#ECEFF6" },
    { points: "70,74 86,84 64,98", fill: "#353C48" },
    { points: "64,98 86,84 94,102 78,108", fill: "#C8D2E2" },
    { points: "78,108 94,102 104,114 82,124", fill: "#D8E2F0" },
    { points: "78,108 96,100 102,114 84,122", fill: "#F5F8FC" },
    { points: "54,58 74,48 70,74 52,68", fill: "#7D8798" },
    { points: "74,48 92,58 70,74", fill: "#1B2028" },
    { points: "70,74 92,58 102,74 86,84", fill: "#E2E9F3" },
    { points: "86,84 102,74 114,88 94,102", fill: "#525B6B" },
    { points: "94,102 114,88 124,98 104,114", fill: "#B4BFCE" },
    { points: "74,48 94,32 108,44 92,58", fill: "#EFF4FA" },
    { points: "92,58 108,44 122,56 102,74", fill: "#2C333F" },
    { points: "102,74 122,56 134,68 114,88", fill: "#DCE4F0" },
    { points: "114,88 134,68 144,78 124,98", fill: "#3B4352" },
    { points: "94,32 116,20 124,34 108,44", fill: "#8B96A8" },
    { points: "108,44 124,34 138,44 122,56", fill: "#F8FAFD" },
    { points: "122,56 138,44 150,56 134,68", fill: "#636D7E" },
    { points: "116,20 138,16 144,30 124,34", fill: "#E4EBF5" },
    { points: "124,34 144,30 156,42 138,44", fill: "#232933" },
    { points: "138,44 156,42 162,56 150,56", fill: "#C2CCE0" },
    { points: "134,68 150,56 158,68 144,78", fill: "#EDF2F9" },
    { points: "58,72 68,64 74,76 62,82", fill: "#FFFFFF" },
    { points: "82,52 94,46 98,58 86,62", fill: "#FFFFFF" },
    { points: "106,34 118,28 122,40 110,44", fill: "#FFFFFF" },
    { points: "42,96 52,90 56,100 46,104", fill: "#FFFFFF" },
    { points: "96,78 108,72 112,82 100,86", fill: "#FFFFFF" },
    { points: "126,50 136,44 140,54 130,58", fill: "#FFFFFF" },
    { points: "68,104 78,98 82,108 72,112", fill: "#FFFFFF" },
    { points: "132,22 142,20 146,28 136,32", fill: "#FFFFFF" },
    { points: "48,66 56,62 58,70 46,72", fill: "#12161C" },
    { points: "76,62 84,58 86,68 74,70", fill: "#12161C" },
    { points: "102,52 110,48 112,58 100,60", fill: "#12161C" },
    { points: "62,88 72,84 74,94 60,94", fill: "#12161C" },
    { points: "116,70 126,66 128,76 114,78", fill: "#12161C" },
    { points: "88,92 98,88 100,98 86,98", fill: "#12161C" },
    { points: "32,104 40,100 42,110 30,112", fill: "#12161C" },
  ];

  return (
    <div className="relative w-[175px] h-[150px] flex items-center justify-center select-none pointer-events-none -mr-2">
      <div className="absolute w-[135px] h-[44px] bg-[#7C889B]/25 blur-xl rounded-full -rotate-[32deg] translate-y-4 translate-x-1" />
      <svg
        viewBox="0 0 180 150"
        className="w-full h-full drop-shadow-[0_10px_14px_rgba(30,40,60,0.22)]"
        fill="none"
      >
        <defs>
          <linearGradient id="crystalBase" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B4250" />
            <stop offset="35%" stopColor="#8E99AC" />
            <stop offset="70%" stopColor="#525B6C" />
            <stop offset="100%" stopColor="#CBD4E4" />
          </linearGradient>
          <linearGradient id="shardSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#B8C4D8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#2A303C" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <g>
          {facets.map((f, idx) => (
            <polygon
              key={idx}
              points={f.points}
              fill={f.fill}
              stroke="#2B323E"
              strokeWidth="0.45"
              strokeLinejoin="bevel"
            />
          ))}
          <polygon points="18,98 26,84 34,94 22,106" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="46,62 62,48 68,60 52,70" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="80,36 98,24 104,36 86,46" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="112,20 132,14 136,26 118,30" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="142,24 158,34 152,48 138,38" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="148,58 162,66 146,82 136,72" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="122,96 138,84 128,104 110,112" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="88,118 108,108 96,124 76,130" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
          <polygon points="52,128 74,122 62,136 42,134" fill="url(#shardSheen)" stroke="#3A4250" strokeWidth="0.5" />
        </g>

        <polyline
          points="24,96 42,74 58,80 76,50 94,56 112,28 130,34 146,24"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeOpacity="0.85"
          fill="none"
        />
        <polyline
          points="36,116 58,102 74,110 98,86 116,94 138,68 154,54"
          stroke="#FFFFFF"
          strokeWidth="0.9"
          strokeOpacity="0.75"
          fill="none"
        />
      </svg>
    </div>
  );
};

/**
 * Custom AI Assistant Minimalist Metallic Orb Component (Monochrome Greyscale)
 */
const AiOrbGraphic: React.FC<{ isListening?: boolean }> = ({ isListening = false }) => {
  return (
    <div className="relative w-[124px] h-[124px] flex items-center justify-center select-none pointer-events-none">
      <div
        className={`w-[122px] h-[122px] rounded-full flex items-center justify-center relative transition-transform duration-700 ${
          isListening ? "scale-105" : ""
        }`}
        style={{
          background:
            "radial-gradient(circle at 70% 30%, #F5F7FA 0%, #E4E8EE 52%, #D5DBE4 85%, #CBD2DC 100%)",
          boxShadow:
            "inset 0 2px 8px rgba(255,255,255,0.9), inset 0 -4px 12px rgba(160,170,185,0.35), 0 8px 20px rgba(180,190,205,0.22)",
        }}
      >
        <div
          className="w-[88px] h-[88px] rounded-full relative overflow-hidden flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 65% 65%, #FFFFFF 0%, #E6EAF0 38%, #B8C2CE 74%, #9EAAB8 100%)",
            boxShadow:
              "0 6px 18px rgba(140,150,165,0.3), inset 0 2px 6px rgba(255,255,255,0.95)",
          }}
        >
          <div
            className="absolute -top-2 -left-2 w-[66px] h-[66px] rounded-full opacity-80"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #94A0B0 0%, #BAC5D2 55%, transparent 75%)",
              filter: "blur(2px)",
            }}
          />

          <div
            className="absolute -top-1 right-0 w-[62px] h-[62px] rounded-full opacity-90"
            style={{
              background:
                "radial-gradient(circle at 60% 35%, #F4F6F9 0%, #D8DFE8 55%, transparent 78%)",
              filter: "blur(1px)",
            }}
          />

          <div
            className="absolute bottom-0 -left-1 w-[58px] h-[58px] rounded-full opacity-80"
            style={{
              background:
                "radial-gradient(circle at 30% 70%, #A8B4C2 0%, #CCD4DE 60%, transparent 80%)",
              filter: "blur(2px)",
            }}
          />

          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <defs>
              <radialGradient id="orbGlowCoreMono" cx="62%" cy="62%" r="42%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="45%" stopColor="#F8FAFC" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#D5DDE6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#A8B5C2" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="petalEdgeMono" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C98A6" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#B0BDCC" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M 14,55 C 24,22 68,20 84,48 C 68,34 34,38 14,55 Z"
              fill="url(#petalEdgeMono)"
              opacity="0.75"
            />
            <path
              d="M 24,78 C 20,44 52,28 82,42 C 58,42 40,56 24,78 Z"
              fill="#94A2B2"
              opacity="0.35"
            />
            <circle cx="58" cy="58" r="34" fill="url(#orbGlowCoreMono)" />
          </svg>

          <div className="absolute inset-0 rounded-full border border-white/80 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Reference interactive states
  const [activeStep, setActiveStep] = useState<number>(1);
  const [transportMode, setTransportMode] = useState<"paused" | "playing" | "recording">("paused");
  const [secondsElapsed, setSecondsElapsed] = useState<number>(97);
  const [trackNumber, setTrackNumber] = useState<number>(4);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<null | "menu" | "search" | "contact" | "buy" | "materials" | "ai">(null);
  const [cartCount, setCartCount] = useState<number>(1);

  // Catalog state
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Cart Context
  const { totalItems, setIsCartOpen, addToCart } = useCart();

  // Hero image + floating labels, editable in Admin > Tampilan Beranda
  const [hero, setHero] = useState<HomepageHero>(INITIAL_HOMEPAGE_HERO);
  useEffect(() => {
    getHomepageHero().then((res) => {
      if (res) setHero(res);
    });
  }, []);

  // Custom Upgrade state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [appliedUpgradePlan, setAppliedUpgradePlan] = useState<SelectedUpgradePlan | null>(null);
  const [showOnlyUpgradable, setShowOnlyUpgradable] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadCatalog() {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
    }
    loadCatalog();
  }, []);

  // Motorized cooling wheel animation on interactive play/record
  useEffect(() => {
    if (transportMode === "paused") return;

    const timerInterval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    const wheelInterval = setInterval(() => {
      setWheelRotation((prev) => (prev + (transportMode === "recording" ? 2.5 : 1.5)) % 360);
    }, 30);

    return () => {
      clearInterval(timerInterval);
      clearInterval(wheelInterval);
    };
  }, [transportMode]);

  const formatOledTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${hrs}.${pad(mins)}.${pad(secs)}`;
  };

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

  // Resolve product linked to homepage hero banner (by product_slug or product_url)
  const heroProduct = React.useMemo(() => {
    if (hero?.product_slug) {
      const match = products.find(
        (p) => p.slug === hero.product_slug || p.id === hero.product_slug
      );
      if (match) return match;
    }
    if (hero?.product_url) {
      const slugMatch = hero.product_url.split("/products/")[1]?.split(/[?#]/)[0]?.replace(/\/$/, "");
      if (slugMatch) {
        const match = products.find((p) => p.slug === slugMatch || p.id === slugMatch);
        if (match) return match;
      }
      const rawMatch = products.find((p) => p.slug === hero.product_url || p.id === hero.product_url);
      if (rawMatch) return rawMatch;
    }
    return products.find((p) => p.slug === "apple-macbook-pro-16-m4-max") || featuredProduct;
  }, [hero?.product_slug, hero?.product_url, products, featuredProduct]);

  const handleScrollToCatalog = () => {
    setActiveStep(3);
    const catalogEl = document.getElementById("catalog-section");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
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
              onClick={() => {
                setTransportMode("paused");
                setSecondsElapsed(97);
                setWheelRotation(0);
              }}
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

      {/* Locked-Proportion Desktop Frame Container (1440px reference) */}
      <div className="font-jakarta relative w-full max-w-[1440px] px-6 sm:px-11 pt-4 pb-20 flex flex-col justify-between">
        
        {/* Ambient neutral cool light behind the flagship hardware */}
        <div
          className="pointer-events-none absolute right-[8%] top-[12%] w-[520px] h-[520px] rounded-full opacity-35 dark:opacity-10 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #E2E8F0 0%, #EEF2F6 55%, transparent 100%)",
          }}
        />

        {/* ============================================================
            2. HERO ZONE WRAPPER WITH PINNED VERTICAL STEP INDICATOR
           ============================================================ */}
        <div className="relative w-full">
          {/* Vertical Step Indicator (Strictly bound to Hero Section) */}
          <div className="hidden lg:flex flex-col items-center absolute -left-[24px] xl:-left-[42px] top-[42%] -translate-y-1/2 z-20 select-none">
            <div className="flex flex-col items-center">
              {[1, 2, 3].map((step, index) => {
                const isActive = activeStep === step;
                return (
                  <button
                    key={step}
                    onClick={() => {
                      setActiveStep(step);
                      if (step === 3) handleScrollToCatalog();
                    }}
                    style={{ zIndex: 30 - index * 10 }}
                    className={`w-[21px] h-[21px] rounded-full text-[11px] font-medium flex items-center justify-center transition-all cursor-pointer ${
                      index > 0 ? "-mt-[3.5px]" : ""
                    } ${
                      isActive
                        ? "bg-[#111111] dark:bg-white text-white dark:text-black dark:font-semibold border border-[#111111] dark:border-white"
                        : "bg-white/90 dark:bg-transparent text-[#1E1E1E] dark:text-white/55 border border-[#484E58] dark:border-white/25 hover:border-[#111111] dark:hover:border-white/60 dark:hover:text-white"
                    }`}
                    title={`Bagian 0${step}`}
                  >
                    {step}
                  </button>
                );
              })}
            </div>

            <div className="mt-9 w-[1.5px] h-[106px] bg-[#CBD5E6] dark:bg-white/10 relative rounded-full overflow-hidden">
              <div
                className="absolute left-0 w-full bg-[#141414] dark:bg-zinc-100 transition-all duration-300"
                style={{
                  height: "46px",
                  bottom: activeStep === 1 ? "0px" : activeStep === 2 ? "30px" : "60px",
                }}
              />
            </div>

            <span className="mt-2 text-[12px] font-medium text-[#222222] dark:text-zinc-400 tracking-tight font-mono">
              0{activeStep}
            </span>
          </div>

          {/* MAIN HERO SECTION (Left Copy + Right Hardware Assembly) */}
          <main className="relative grid grid-cols-1 lg:grid-cols-12 items-center pt-8 pb-4 lg:pl-[112px]">
            {/* LEFT COLUMN: Hero Copy & CTA */}
            <div className="lg:col-span-6 z-20 pr-2">
              {/* Hot Hardware Badge */}
              <div className="flex items-center gap-4 mb-7">
                <div className="w-[50px] h-[50px] rounded-full bg-[#EAEFF6] dark:bg-white/[0.05] dark:border dark:border-white/10 dark:shadow-[0_0_24px_rgba(56,189,248,0.15)] flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-[22px] h-[22px] stroke-[#141414] dark:stroke-sky-300 motion-safe:animate-[spin_14s_linear_infinite]"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="3.5" x2="12" y2="20.5" />
                    <line x1="4.6" y1="7.75" x2="19.4" y2="16.25" />
                    <line x1="19.4" y1="7.75" x2="4.6" y2="16.25" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-[#141414] dark:text-zinc-100 leading-tight tracking-[-0.01em]">
                    Hot Hardware
                  </h2>
                  <p className="text-[13.5px] font-normal text-[#8D939E] dark:text-[#A1A1AA] leading-snug mt-0.5">
                    Revolution in Personal Computing
                  </p>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-[40px] sm:text-[54px] xl:text-[56px] font-medium text-[#111111] dark:text-white leading-[1.14] tracking-[-0.028em] mb-6">
                Discover The Best Digital
                <br />
                Computer & Hardware
              </h1>

              {/* Subtitle */}
              <p className="text-[16.5px] sm:text-[17px] font-normal text-[#676B74] dark:text-[#A1A1AA] leading-[1.6] max-w-[440px] mb-8">
                Get the best by trusting us, we offer the best quality and the best price with official warranty.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const targetProduct = heroProduct || featuredProduct;
                    if (targetProduct) {
                      addToCart(targetProduct, 1);
                      setIsCartOpen(true);
                    } else if (hero?.product_url) {
                      window.location.href = hero.product_url;
                    } else {
                      handleScrollToCatalog();
                    }
                  }}
                  className="w-[206px] h-[58px] rounded-full border-[1.2px] border-[#262626] dark:border-white bg-transparent dark:bg-white hover:bg-[#111111] hover:text-white dark:hover:bg-white dark:hover:text-black dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] text-[#111111] dark:text-black group transition-all duration-200 flex items-center justify-between px-7 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b0d10]"
                >
                  <span className="text-[15px] font-medium dark:font-semibold tracking-[-0.01em]">Buy Now</span>
                  <ArrowUpRight className="w-[18px] h-[18px] stroke-[1.8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#111111] dark:text-black group-hover:text-white dark:group-hover:text-black" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: MacBook Pro Flagship Laptop Visual (Full Object + Drop Shadow) + 3 Floating Widgets */}
            <div className="lg:col-span-6 relative h-[520px] flex items-center justify-center mt-10 lg:mt-0">
              {/* Dark mode ambient light behind the hardware */}
              <div
                aria-hidden="true"
                className="hidden dark:block pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] sm:w-[560px] sm:h-[560px] rounded-full blur-[60px]"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(56, 189, 248, 0.12) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)",
                }}
              />
              {/* Full Laptop Object directly without div container, with rich realistic drop shadow */}
              <div className="relative z-10 w-[420px] sm:w-[500px] lg:w-[540px] h-[340px] sm:h-[390px] select-none flex items-center justify-center translate-x-1 lg:translate-x-3 transition-transform duration-700 hover:scale-[1.03]">
                {hero ? (
                  <Image
                    src={hero.image_url || "/macbook-hero.png"}
                    alt={hero.image_alt || "Apple MacBook Pro M4 Max"}
                    fill
                    priority
                    className="object-contain"
                    style={{
                      filter:
                        "drop-shadow(-18px 28px 36px rgba(15, 23, 42, 0.26)) drop-shadow(0 10px 18px rgba(0, 0, 0, 0.12))",
                    }}
                    sizes="(max-width: 640px) 420px, (max-width: 1024px) 500px, 540px"
                  />
                ) : (
                  <div className="w-[420px] h-[300px] rounded-3xl animate-pulse bg-neutral-200/50 dark:bg-neutral-800/50" />
                )}
              </div>

              {/* 3 FLOATING FROSTED GLASS CALLOUT WIDGETS & SVG POINTER LINES */}
              {/* 1. TOP-LEFT CALLOUT */}
              {hero?.callouts[0]?.title && (
                <div className="absolute top-[28px] left-[6px] sm:left-[18px] z-30 flex items-center pointer-events-none animate-in fade-in duration-500">
                  <div className="hero-callout w-[170px] text-center">
                    <div className="text-[13px] font-bold text-[#18181B] dark:text-white leading-tight">
                      {hero.callouts[0].title}
                    </div>
                    <div className="text-[10px] font-medium text-[#64748B] dark:text-[#A1A1AA] mt-1 leading-tight">
                      {hero.callouts[0].subtitle}
                    </div>
                  </div>

                  <svg
                    width="98"
                    height="48"
                    viewBox="0 0 98 48"
                    fill="none"
                    className="-ml-[1px] mt-7 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="lineLiquid" x1="0" y1="0" x2="98" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#262B33" stopOpacity="0.95" />
                        <stop offset="72%" stopColor="#4A5568" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,10 L 74,10 Q 90,10 90,26 L 88,44"
                      stroke="url(#lineLiquid)"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      className="hero-pointer"
                    />
                    <circle cx="88" cy="44" r="2" className="hidden dark:block fill-white/50" />
                  </svg>
                </div>
              )}

              {/* 2. MIDDLE-LEFT CALLOUT */}
              {hero?.callouts[1]?.title && (
                <div className="absolute bottom-[132px] -left-[4px] sm:left-[0px] z-30 flex items-center pointer-events-none animate-in fade-in duration-500">
                  <div className="hero-callout w-[170px] text-center">
                    <div className="text-[13px] font-bold text-[#18181B] dark:text-white leading-tight">
                      {hero.callouts[1].title}
                    </div>
                    <div className="text-[10px] font-medium text-[#64748B] dark:text-[#A1A1AA] mt-1 leading-tight">
                      {hero.callouts[1].subtitle}
                    </div>
                  </div>

                  <svg
                    width="155"
                    height="95"
                    viewBox="0 0 155 95"
                    fill="none"
                    className="-ml-[1px] -mt-5 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="lineBattery" x1="0" y1="80" x2="150" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#22262E" stopOpacity="0.95" />
                        <stop offset="65%" stopColor="#4B5563" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,76 L 44,76 Q 50,76 55,72 L 146,6"
                      stroke="url(#lineBattery)"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      className="hero-pointer"
                    />
                    <circle cx="146" cy="6" r="2" className="hidden dark:block fill-white/50" />
                  </svg>
                </div>
              )}

              {/* 3. BOTTOM-RIGHT CALLOUT */}
              {hero?.callouts[2]?.title && (
                <div className="absolute bottom-[36px] right-0 z-30 flex items-center pointer-events-none animate-in fade-in duration-500">
                  <svg
                    width="68"
                    height="96"
                    viewBox="0 0 68 96"
                    fill="none"
                    className="-mr-[1px] -mt-8 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="lineM4" x1="68" y1="86" x2="4" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#262B33" stopOpacity="0.95" />
                        <stop offset="65%" stopColor="#525E70" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 68,84 L 36,84 Q 30,84 27,77 L 4,8"
                      stroke="url(#lineM4)"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      className="hero-pointer"
                    />
                    <circle cx="4" cy="8" r="2" className="hidden dark:block fill-white/50" />
                  </svg>

                  <div className="hero-callout w-[170px] text-center">
                    <div className="text-[13px] font-bold text-[#18181B] dark:text-white leading-tight">
                      {hero.callouts[2].title}
                    </div>
                    <div className="text-[10px] font-medium text-[#64748B] dark:text-[#A1A1AA] mt-1 leading-tight">
                      {hero.callouts[2].subtitle}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* ============================================================
              4. BOTTOM 2 FEATURE CARDS ROW (Exact Reference UI Design)
             ============================================================ */}
          <section className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-4">
            {/* LEFT CARD: Custom Upgrade (RAM & SSD NVMe) */}
            <div
              onClick={() => setIsUpgradeModalOpen(true)}
              className="h-auto sm:h-[196px] rounded-[28px] px-8 sm:px-9 py-6 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 frost-card"
            >
              <div className="max-w-[260px] z-10 text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-zinc-800 text-[10.5px] font-bold text-[#141414] dark:text-zinc-200 mb-2 border border-white/80">
                  <Sparkles className="w-3 h-3 text-[#111111] dark:text-white" />
                  <span>GARANSI TETAP AKTIF</span>
                </div>
                <h3 className="text-[26px] font-medium text-[#111111] tracking-[-0.02em] leading-tight mb-2">
                  Custom Upgrade
                </h3>
                <p className="text-[12.5px] font-normal text-[#2D3138] leading-[1.48]">
                  Tingkatkan kapasitas RAM DDR5 dan penyimpanan SSD NVMe langsung pada unit laptop pilihanmu tanpa menggugurkan garansi resmi.
                </p>
              </div>

              <div className="flex items-center gap-4 sm:gap-5 mt-4 sm:mt-0 z-10">
                <RamSsdHardwareGraphic />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUpgradeModalOpen(true);
                  }}
                  className="w-[56px] h-[56px] rounded-full bg-[#0C0C0C] text-white flex items-center justify-center group-hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer shadow-md"
                  aria-label="Buka Simulasi Custom Upgrade"
                >
                  <ArrowUpRight className="w-[20px] h-[20px] stroke-[1.8] text-white" />
                </button>
              </div>
            </div>

            {/* RIGHT CARD: WhatsApp Consultation */}
            <div className="relative">
              <div
                onClick={() => setActiveModal("ai")}
                className="relative z-10 h-auto sm:h-[196px] rounded-[28px] px-8 sm:px-9 py-6 flex flex-col sm:flex-row items-center justify-between overflow-hidden backdrop-blur-md group cursor-pointer hover:shadow-lg transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(233,238,245,0.88) 0%, rgba(237,241,247,0.84) 100%)",
                  boxShadow:
                    "0 4px 24px rgba(165,180,205,0.12), inset 0 1px 1px rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.85)",
                }}
              >
                <div className="max-w-[268px] z-10 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-zinc-800 text-[10.5px] font-bold text-[#141414] dark:text-zinc-200 mb-2 border border-white/80">
                    <MessageCircle className="w-3 h-3 text-[#111111] dark:text-white" />
                    <span>VIA WHATSAPP</span>
                  </div>
                  <h3 className="text-[26px] font-medium text-[#111111] tracking-[-0.02em] leading-tight mb-2">
                    Konsultasi Gratis
                  </h3>
                  <p className="text-[12.5px] font-normal text-[#2D3138] leading-[1.48]">
                    Konsultasikan spesifikasi laptop untuk kuliah, kerja, gaming, hingga editing 4K sesuai budget, langsung dengan tim Alathea Comp lewat WhatsApp.
                  </p>
                </div>

                <div className="flex items-center gap-6 sm:gap-7 mt-4 sm:mt-0 z-10">
                  <AiOrbGraphic isListening={transportMode === "recording"} />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModal("ai");
                    }}
                    className="w-[56px] h-[56px] rounded-full bg-[#0C0C0C] text-white flex items-center justify-center group-hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer shadow-md"
                    aria-label="Konsultasi AI"
                  >
                    <ArrowUpRight className="w-[20px] h-[20px] stroke-[1.8] text-white" />
                  </button>
                </div>
              </div>
            </div>

          </section>
        </div>

        {/* ============================================================
            5. INTERACTIVE PRODUCT CATALOG SECTION (Exact Card Style)
           ============================================================ */}
        <section id="catalog-section" className="relative z-20 mt-20 space-y-8 scroll-mt-20">
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
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Upgradable
                          </span>
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

