"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
} from "lucide-react";
import { getCategories, getProducts } from "@/lib/services/catalog";
import { formatRupiah, calculateDiscountPercentage, generateWhatsAppLink } from "@/lib/utils";
import { Category, Product } from "@/types/database";

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
    return matchesCategory && matchesSearch;
  });

  const featuredProduct = products.find((p) => p.is_featured) || products[0];

  const handleScrollToCatalog = () => {
    setActiveStep(3);
    const catalogEl = document.getElementById("catalog-section");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] dark:bg-[#0F1012] text-[#111111] dark:text-[#F4F4F5] flex flex-col items-center justify-start overflow-x-clip selection:bg-[#111111] selection:text-white transition-colors duration-200 font-jakarta">
      {/* ============================================================
          1. FIXED / STICKY TOP NAVBAR (Subtle Drop Shadow & Frosted Glass)
         ============================================================ */}
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0F1012]/85 backdrop-blur-md border-b border-zinc-200/70 dark:border-zinc-800/70 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-11 py-3.5 flex items-center justify-between">
          {/* Left Group: Logo + Menu + Search */}
          <div className="flex items-center">
            <Link
              href="/"
              onClick={() => {
                setTransportMode("paused");
                setSecondsElapsed(97);
                setWheelRotation(0);
              }}
              className="text-[25px] font-extrabold tracking-[-0.035em] text-[#111111] dark:text-white leading-none select-none"
            >
              Alathea.
            </Link>

            {/* Menu Button with custom 2-line + dot icon */}
            <button
              onClick={() => setActiveModal("menu")}
              className="ml-8 sm:ml-[54px] flex items-center gap-2.5 text-[13.5px] font-medium text-[#1E1E1E] dark:text-zinc-200 hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Open Menu"
            >
              <span className="flex flex-col justify-center gap-[3.5px] w-[22px]">
                <span className="w-[22px] h-[1.6px] bg-[#1E1E1E] dark:bg-zinc-200 rounded-full" />
                <span className="flex items-center justify-between w-[22px]">
                  <span className="w-[2px] h-[1.6px] bg-[#1E1E1E] dark:bg-zinc-200 rounded-full" />
                  <span className="w-[17px] h-[1.6px] bg-[#1E1E1E] dark:bg-zinc-200 rounded-full" />
                </span>
              </span>
              <span>Menu</span>
            </button>

            {/* Search Icon Button */}
            <button
              onClick={() => setActiveModal("search")}
              className="ml-7 text-[#1E1E1E] dark:text-zinc-300 hover:opacity-70 transition-opacity p-1 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-[17px] h-[17px] stroke-[1.8] text-[#111111] dark:text-white" />
            </button>
          </div>

          {/* Right Group: Theme Switcher + Compare Bag + Contact Us WhatsApp Pill */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* Light/Dark Mode Toggle */}
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-[42px] h-[42px] rounded-full border border-[#DCDFE6] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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

            {/* Shopping / Compare Bag Button with external superscript counter */}
            <div className="relative">
              <button
                onClick={() => {
                  setCartCount((c) => (c >= 9 ? 1 : c + 1));
                  handleScrollToCatalog();
                }}
                className="w-[42px] h-[42px] rounded-full border border-[#DCDFE6] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Shopping Bag"
                title="Lihat Item Terpilih"
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
                {cartCount}
              </span>
            </div>

            {/* Contact WhatsApp Dark Pill Button */}
            <button
              onClick={() => setActiveModal("contact")}
              className="h-[42px] pl-5 sm:pl-6 pr-4 sm:pr-5 rounded-full bg-[#141414] dark:bg-zinc-100 text-[#F1F1F1] dark:text-zinc-950 flex items-center gap-4 sm:gap-7 hover:bg-[#262626] dark:hover:bg-white transition-colors cursor-pointer shadow-sm"
            >
              <span className="text-[13px] font-normal tracking-[0.01em]">Contact Us</span>
              <ArrowUpRight className="w-[15px] h-[15px] text-[#EAEAEA] dark:text-zinc-900 stroke-[1.7]" />
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
                        ? "bg-[#111111] dark:bg-white text-white dark:text-black border border-[#111111] dark:border-white"
                        : "bg-white/90 dark:bg-zinc-900 text-[#1E1E1E] dark:text-zinc-400 border border-[#484E58] dark:border-zinc-700 hover:border-[#111111]"
                    }`}
                    title={`Bagian 0${step}`}
                  >
                    {step}
                  </button>
                );
              })}
            </div>

            <div className="mt-9 w-[1.5px] h-[106px] bg-[#CBD5E6] dark:bg-zinc-800 relative rounded-full overflow-hidden">
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
                <div className="w-[50px] h-[50px] rounded-full bg-[#EAEFF6] dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[22px] h-[22px] stroke-[#141414] dark:stroke-zinc-100"
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
                  <p className="text-[13.5px] font-normal text-[#8D939E] dark:text-zinc-400 leading-snug mt-0.5">
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
              <p className="text-[16.5px] sm:text-[17px] font-normal text-[#676B74] dark:text-zinc-400 leading-[1.6] max-w-[440px] mb-8">
                Get the best by trusting us, we offer the best quality and the best price with official warranty.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={handleScrollToCatalog}
                  className="w-[206px] h-[58px] rounded-full border-[1.2px] border-[#262626] dark:border-zinc-700 bg-transparent hover:bg-[#111111] hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black text-[#111111] dark:text-zinc-100 group transition-all duration-200 flex items-center justify-between px-7 cursor-pointer"
                >
                  <span className="text-[15px] font-medium tracking-[-0.01em]">Buy Now</span>
                  <ArrowUpRight className="w-[18px] h-[18px] stroke-[1.8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#111111] dark:text-white group-hover:text-white dark:group-hover:text-black" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Tilted Flagship Workstation Assembly + 3 Frosted Widgets */}
            <div className="lg:col-span-6 relative h-[520px] flex items-center justify-center mt-10 lg:mt-0">
              <div className="relative w-[360px] h-[454px] rotate-[15.5deg] translate-x-6 -translate-y-1 select-none">
                {/* Bottom Metallic Heatpipe Pole Extending Down Behind Bottom Card */}
                <div
                  className="absolute -bottom-[210px] right-[40px] w-[52px] h-[230px] z-0 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, #6E7E94 0%, #9BAAC0 22%, #C5D2E4 45%, #8494AA 72%, #59677B 100%)",
                    boxShadow: "8px 16px 28px rgba(100,120,150,0.28)",
                  }}
                >
                  <div
                    className="w-full h-full opacity-45"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px, rgba(25,35,50,0.3) 4px)",
                    }}
                  />
                  <div className="absolute inset-y-0 left-[38%] w-[2.5px] bg-[#2D3748]/70" />
                  <div className="absolute inset-y-0 left-[44%] w-[1px] bg-white/60" />
                </div>

                {/* Top-Left CNC Jack Sleeve Protrusion */}
                <div
                  className="absolute -top-[42px] left-[28px] w-[11px] h-[44px] rounded-t-sm"
                  style={{
                    background:
                      "linear-gradient(90deg, #E2E9F3 0%, #FFFFFF 45%, #C5D1E3 85%, #9AA8BE 100%)",
                    boxShadow: "0 -2px 6px rgba(160,180,205,0.25)",
                  }}
                />

                {/* Left Side Sculpted Aluminum Rocker / Side-Lever Mechanism */}
                <div className="absolute top-[74px] -left-[22px] w-[26px] h-[222px] z-10 pointer-events-none">
                  <svg viewBox="0 0 32 240" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="leverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F2F6FC" />
                        <stop offset="55%" stopColor="#DAE5F4" />
                        <stop offset="100%" stopColor="#B2C1D8" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 28,4 L 14,12 C 8,15 6,22 6,30 L 6,96 C 6,104 12,110 12,118 C 12,126 6,132 6,140 L 6,204 C 6,214 10,220 18,224 L 28,228 Z"
                      fill="url(#leverGrad)"
                      stroke="#9BAAC2"
                      strokeWidth="1"
                    />
                    <circle cx="17" cy="24" r="4.5" fill="#BCCAE0" stroke="#7A8A9F" strokeWidth="0.8" />
                    <path d="M 6,108 Q 20,120 6,132" fill="none" stroke="#7C8B9F" strokeWidth="1.4" />
                    <circle cx="18" cy="120" r="3" fill="#68768A" />
                    <circle cx="17" cy="212" r="5" fill="#C4D2E6" stroke="#7A8A9F" strokeWidth="1" />
                  </svg>
                </div>

                {/* Right Side 3D Extruded Chassis Edge */}
                <div
                  className="absolute top-[16px] -right-[7px] w-[8px] h-[422px] rounded-r-[14px] z-0"
                  style={{
                    background: "linear-gradient(180deg, #C7D5EA 0%, #9EB0CA 50%, #7E90AC 100%)",
                  }}
                >
                  <div className="w-[3.5px] h-[24px] bg-[#64748B] rounded-r-sm mt-[68px] ml-[5px]" />
                  <div className="w-[3.5px] h-[34px] bg-[#475569] rounded-r-sm mt-[14px] ml-[5px]" />
                  <div className="w-[3.5px] h-[22px] bg-[#64748B] rounded-r-sm mt-[38px] ml-[5px]" />
                </div>

                {/* MAIN ANODIZED CHASSIS BODY */}
                <div
                  className="relative w-full h-full rounded-[22px] overflow-hidden z-10 flex flex-col justify-between"
                  style={{
                    background:
                      "linear-gradient(142deg, #F5F8FD 0%, #E5EDF8 38%, #D2DFEF 76%, #C2D2E8 100%)",
                    boxShadow:
                      "inset 0 2px 3px rgba(255,255,255,0.95), inset -4px -4px 12px rgba(135,155,185,0.38), -12px 24px 48px rgba(145,168,200,0.32)",
                    border: "1px solid rgba(255,255,255,0.85)",
                  }}
                >
                  {/* Header Zone: "ALATHEA •" and OLED Screen */}
                  <div className="relative pt-4 px-6 flex items-start justify-between">
                    <div className="flex items-center gap-3.5">
                      <span className="text-[24px] font-bold tracking-[0.04em] text-[#5B6678] leading-none">
                        ALATHEA
                      </span>
                      <span className="w-[5px] h-[5px] rounded-full bg-[#1E242B] mt-0.5" />
                    </div>

                    <span className="w-[4px] h-[4px] rounded-full bg-[#252B33] mt-3.5 -ml-6" />

                    {/* Recessed OLED Display */}
                    <div
                      className="w-[92px] h-[46px] rounded-[6px] bg-[#0D1218] p-1.5 flex flex-col justify-between border-[1.5px] border-[#515E70] shadow-inner -mr-1 mt-0.5"
                      style={{
                        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.85), 0 1px 2px rgba(255,255,255,0.6)",
                      }}
                    >
                      <div className="font-mono text-[12px] font-semibold tracking-[0.14em] text-[#F1F5F9] leading-none text-center">
                        READY
                      </div>
                      <div className="flex items-center justify-between px-0.5 font-mono">
                        <span className="text-[9.5px] font-medium text-[#CBD5E1] tracking-tighter leading-none">
                          {formatOledTimer(secondsElapsed)}
                        </span>
                        <span className="bg-[#D8E2EF] text-[#0D1218] text-[8.5px] font-bold px-1 py-[0.5px] rounded-[2px] leading-tight">
                          0{trackNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status indicator on upper-left & badge on right */}
                  <div className="absolute top-[60px] left-[22px] w-[7px] h-[7px] rounded-full bg-white/90 shadow-[0_0_6px_#fff]" />
                  <div className="absolute top-[86px] right-[18px] w-[14px] h-[14px] rounded-[3px] bg-[#141414] text-white text-[8.5px] font-bold flex items-center justify-center shadow-sm">
                    PC
                  </div>

                  {/* CENTER MOTORIZED TURBINE JOG WHEEL */}
                  <div className="relative w-[306px] h-[306px] mx-auto -mt-3 rounded-full flex items-center justify-center">
                    <div
                      className="w-full h-full rounded-full border-[1.6px] border-[#6F7E94] flex items-center justify-center relative overflow-hidden transition-transform duration-75"
                      style={{
                        transform: `rotate(${wheelRotation}deg)`,
                        background:
                          "conic-gradient(from 135deg at 50% 50%, #E7EFFA 0deg, #D5E1F2 75deg, #EEF4FC 155deg, #C9D7EC 245deg, #E2ECFA 315deg, #E7EFFA 360deg)",
                        boxShadow:
                          "inset 0 2px 5px rgba(255,255,255,0.9), inset 0 -3px 8px rgba(120,140,170,0.35), 0 3px 10px rgba(90,110,140,0.18)",
                      }}
                    >
                      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/75 to-transparent -rotate-[42deg]" />

                      <div className="absolute w-full h-full flex items-center justify-center rotate-[44deg]">
                        <div className="w-full h-[1px] bg-[#9AA8BE]/55" />
                        <span className="absolute left-[46px] -top-[14px] font-mono text-[10.5px] font-semibold tracking-[0.08em] text-[#687588] select-none">
                          RTX 4070
                        </span>
                        <span className="absolute right-[42px] top-[6px] font-mono text-[10.5px] font-semibold tracking-[0.1em] text-[#687588] select-none">
                          7800X3D
                        </span>
                      </div>

                      <div
                        className="relative z-10 w-[76px] h-[76px] rounded-full flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #778192 0%, #586272 100%)",
                          boxShadow: "inset 0 2px 4px rgba(255,255,255,0.25), 0 2px 6px rgba(40,50,65,0.35)",
                        }}
                      >
                        <span className="absolute top-[18px] right-[26px] w-[4.5px] h-[4.5px] rounded-full bg-[#E8EEF6]" />
                        <span className="absolute bottom-[25px] left-[16px] w-[4.5px] h-[4.5px] rounded-full bg-[#E8EEF6]" />
                        <span className="absolute bottom-[16px] right-[22px] w-[4.5px] h-[4.5px] rounded-full bg-[#E8EEF6]" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-[88px] right-[22px] w-[22px] h-[22px] rounded-full border border-[#96A5BC]/75 pointer-events-none" />

                  {/* BOTTOM PHYSICAL TRANSPORT KEYS */}
                  <div className="relative h-[82px] w-full px-5 bg-transparent flex flex-col justify-end">
                    <div className="w-full h-[2px] bg-[#647286]" />

                    <div className="grid grid-cols-3 h-[76px] w-full bg-[#647286] gap-[2px]">
                      <button
                        onClick={() =>
                          setTransportMode((m) => (m === "recording" ? "paused" : "recording"))
                        }
                        title="Turbo Mode"
                        className={`relative h-full w-full transition-all cursor-pointer active:translate-y-[1px] ${
                          transportMode === "recording" ? "brightness-95" : "hover:brightness-98"
                        }`}
                        style={{
                          background: "linear-gradient(180deg, #DCE6F6 0%, #CBD8EC 82%, #B8C8E0 100%)",
                          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.85)",
                        }}
                      >
                        <span
                          className={`absolute top-3.5 left-3.5 w-[11px] h-[11px] rounded-full bg-[#111111] ${
                            transportMode === "recording" ? "animate-ping" : ""
                          }`}
                        />
                        <span className="absolute top-3.5 left-3.5 w-[11px] h-[11px] rounded-full bg-[#111111]" />
                      </button>

                      <button
                        onClick={() =>
                          setTransportMode((m) => (m === "playing" ? "paused" : "playing"))
                        }
                        title="Silent Airflow"
                        className={`relative h-full w-full flex items-center justify-center transition-all cursor-pointer active:translate-y-[1px] ${
                          transportMode === "playing" ? "brightness-95" : "hover:brightness-98"
                        }`}
                        style={{
                          background: "linear-gradient(180deg, #DCE6F6 0%, #CBD8EC 82%, #B8C8E0 100%)",
                          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.85)",
                        }}
                      >
                        <svg viewBox="0 0 16 16" className="w-[13px] h-[13px] fill-[#181E26] -mt-2">
                          <polygon points="3,2 14,8 3,14" />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          setTransportMode("paused");
                          setTrackNumber((t) => (t % 9) + 1);
                        }}
                        title="Stop / Reset"
                        className="relative h-full w-full flex items-center justify-center transition-all cursor-pointer hover:brightness-98 active:translate-y-[1px]"
                        style={{
                          background: "linear-gradient(180deg, #DCE6F6 0%, #CBD8EC 82%, #B8C8E0 100%)",
                          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.85)",
                        }}
                      >
                        <div className="w-[10px] h-[10px] bg-[#181E26] rounded-[1px] -mt-2" />
                      </button>
                    </div>

                    <div className="w-full h-[5px] bg-gradient-to-b from-[#9BAAC0] to-[#BCCAE0] border-t border-[#728197]" />
                  </div>
                </div>
              </div>

              {/* 3 FLOATING FROSTED GLASS CALLOUT WIDGETS & SVG POINTER LINES */}
              {/* 1. TOP-LEFT CALLOUT */}
              <div className="absolute top-[28px] left-[6px] sm:left-[18px] z-30 flex items-center pointer-events-none">
                <div
                  className="w-[160px] py-[16px] px-3.5 rounded-[18px] text-center backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(238,242,247,0.92) 0%, rgba(229,234,242,0.88) 100%)",
                    boxShadow:
                      "0 10px 25px rgba(150,165,190,0.16), inset 0 1px 1px rgba(255,255,255,0.95)",
                    border: "1px solid rgba(255,255,255,0.85)",
                  }}
                >
                  <div className="text-[13px] font-semibold text-[#18181B] leading-tight">
                    OLED 240Hz
                  </div>
                  <div className="text-[9.5px] font-normal text-[#7B818E] mt-1.5 leading-tight">
                    ROG Nebula 100% DCI-P3 Display
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
                    <linearGradient id="lineLithium" x1="0" y1="0" x2="98" y2="48" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#262B33" stopOpacity="0.95" />
                      <stop offset="72%" stopColor="#4A5568" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,10 L 74,10 Q 90,10 90,26 L 88,44"
                    stroke="url(#lineLithium)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* 2. MIDDLE-LEFT CALLOUT */}
              <div className="absolute bottom-[132px] -left-[4px] sm:left-[0px] z-30 flex items-center pointer-events-none">
                <div
                  className="w-[160px] py-[16px] px-3.5 rounded-[18px] text-center backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(238,242,247,0.92) 0%, rgba(229,234,242,0.88) 100%)",
                    boxShadow:
                      "0 10px 25px rgba(150,165,190,0.16), inset 0 1px 1px rgba(255,255,255,0.95)",
                    border: "1px solid rgba(255,255,255,0.85)",
                  }}
                >
                  <div className="text-[13px] font-semibold text-[#18181B] leading-tight">
                    Zero-Glow Airflow
                  </div>
                  <div className="text-[9.5px] font-normal text-[#7B818E] mt-1.5 leading-tight">
                    Silent Acoustic Architecture
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
                    <linearGradient id="lineNoise" x1="0" y1="80" x2="150" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#22262E" stopOpacity="0.95" />
                      <stop offset="65%" stopColor="#4B5563" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,76 L 44,76 Q 50,76 55,72 L 146,6"
                    stroke="url(#lineNoise)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* 3. BOTTOM-RIGHT CALLOUT */}
              <div className="absolute bottom-[36px] right-0 z-30 flex items-center pointer-events-none">
                <svg
                  width="68"
                  height="96"
                  viewBox="0 0 68 96"
                  fill="none"
                  className="-mr-[1px] -mt-8 overflow-visible"
                >
                  <defs>
                    <linearGradient id="lineChipset" x1="68" y1="86" x2="4" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#262B33" stopOpacity="0.95" />
                      <stop offset="65%" stopColor="#525E70" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 68,84 L 36,84 Q 30,84 27,77 L 4,8"
                    stroke="url(#lineChipset)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>

                <div
                  className="w-[160px] py-[16px] px-3.5 rounded-[18px] text-center backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(238,242,247,0.92) 0%, rgba(229,234,242,0.88) 100%)",
                    boxShadow:
                      "0 10px 25px rgba(150,165,190,0.16), inset 0 1px 1px rgba(255,255,255,0.95)",
                    border: "1px solid rgba(255,255,255,0.85)",
                  }}
                >
                  <div className="text-[13px] font-semibold text-[#18181B] leading-tight">
                    RTX 4070 & Ryzen
                  </div>
                  <div className="text-[9.5px] font-normal text-[#7B818E] mt-1.5 leading-tight">
                    Flagship Desktop Computing
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* ============================================================
              4. BOTTOM 2 FEATURE CARDS ROW (Exact Reference UI Design)
             ============================================================ */}
          <section className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-4">
            {/* LEFT CARD: Materials (Exact Screenshot Match) */}
            <div
              className="h-auto sm:h-[196px] rounded-[28px] px-8 sm:px-9 py-6 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(234,239,246,0.92) 0%, rgba(238,242,248,0.86) 100%)",
                boxShadow:
                  "0 4px 24px rgba(165,180,205,0.12), inset 0 1px 1px rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.85)",
              }}
            >
              <div className="max-w-[252px] z-10 text-left">
                <h3 className="text-[27px] font-medium text-[#111111] tracking-[-0.02em] leading-tight mb-3">
                  Materials
                </h3>
                <p className="text-[13px] font-normal text-[#2D3138] leading-[1.48]">
                  Seluruh sasis laptop dan casing PC menggunakan CNC titanium crystal & aerospace grade aluminum yang kokoh, dingin, dan bebas resonansi.
                </p>
              </div>

              <div className="flex items-center gap-4 sm:gap-5 mt-4 sm:mt-0 z-10">
                <TitaniumCrystalGraphic />

                <button
                  onClick={() => setActiveModal("materials")}
                  className="w-[56px] h-[56px] rounded-full bg-[#0C0C0C] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer shadow-md"
                  aria-label="Jelajahi Material"
                >
                  <ArrowUpRight className="w-[20px] h-[20px] stroke-[1.8] text-white" />
                </button>
              </div>
            </div>

            {/* RIGHT CARD: Ai Assistant (Exact Reference Match) */}
            <div className="relative">
              <div
                className="hidden lg:block absolute -bottom-[28px] right-[176px] w-[52px] h-[42px] rotate-[15.5deg] z-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, #6A7A90 0%, #98A8BE 25%, #C2D0E2 48%, #7E8EA4 76%, #526074 100%)",
                  boxShadow: "4px 8px 18px rgba(90,110,140,0.25)",
                }}
              >
                <div className="absolute inset-y-0 left-[38%] w-[2px] bg-[#2D3748]/70" />
              </div>

              <div
                className="relative z-10 h-auto sm:h-[196px] rounded-[28px] px-8 sm:px-9 py-6 flex flex-col sm:flex-row items-center justify-between overflow-hidden backdrop-blur-md"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(233,238,245,0.88) 0%, rgba(237,241,247,0.84) 100%)",
                  boxShadow:
                    "0 4px 24px rgba(165,180,205,0.12), inset 0 1px 1px rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.85)",
                }}
              >
                <div className="max-w-[268px] z-10 text-left">
                  <h3 className="text-[27px] font-medium text-[#111111] tracking-[-0.02em] leading-tight mb-3">
                    Ai Assistant
                  </h3>
                  <p className="text-[13px] font-normal text-[#2D3138] leading-[1.48]">
                    Konsultasikan kebutuhan rakit PC, gaming, editing 4K, hingga kecocokan soket dan PSU secara cerdas dengan tim Alathea Comp.
                  </p>
                </div>

                <div className="flex items-center gap-6 sm:gap-7 mt-4 sm:mt-0 z-10">
                  <AiOrbGraphic isListening={transportMode === "recording"} />

                  <button
                    onClick={() => setActiveModal("ai")}
                    className="w-[56px] h-[56px] rounded-full bg-[#0C0C0C] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer shadow-md"
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

            {/* Quick Category Filters (Strict Monochrome) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-[#141414] dark:bg-white text-white dark:text-black shadow-sm"
                    : "bg-[#F0F3F7] dark:bg-zinc-850 text-[#2D3138] dark:text-zinc-300 hover:bg-[#E2E7EE]"
                }`}
              >
                Semua ({products.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                    selectedCategory === c.slug
                      ? "bg-[#141414] dark:bg-white text-white dark:text-black shadow-sm"
                      : "bg-[#F0F3F7] dark:bg-zinc-850 text-[#2D3138] dark:text-zinc-300 hover:bg-[#E2E7EE]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid (Matching the Materials Card Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const discount = calculateDiscountPercentage(p.price, p.discount_price);
              return (
                <div
                  key={p.id}
                  className="rounded-[28px] p-5 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(234,239,246,0.92) 0%, rgba(238,242,248,0.86) 100%)",
                    boxShadow:
                      "0 4px 24px rgba(165,180,205,0.12), inset 0 1px 1px rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.85)",
                  }}
                >
                  <div>
                    {/* Brand & Stock Badge (Monochrome) */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-zinc-800 text-[11px] font-semibold text-[#141414] dark:text-zinc-200 border border-white/60 dark:border-zinc-700">
                        {p.brand}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-zinc-800 text-[11px] font-medium text-[#141414] dark:text-zinc-200 border border-white/60 dark:border-zinc-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#141414] dark:bg-white" />
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
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-mono text-base font-bold text-[#111111] dark:text-white">
                        {formatRupiah(p.discount_price || p.price)}
                      </span>
                      {p.discount_price && (
                        <span className="font-mono text-xs text-[#8D939E] line-through">
                          {formatRupiah(p.price)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        className="h-[38px] rounded-full border border-[#D0D5DD] dark:border-zinc-700 bg-white/80 dark:bg-zinc-800 hover:bg-white text-[#141414] dark:text-zinc-200 text-xs font-semibold flex items-center justify-center transition cursor-pointer"
                      >
                        Detail
                      </Link>
                      <a
                        href={generateWhatsAppLink(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-[38px] rounded-full bg-[#141414] dark:bg-white text-white dark:text-black hover:bg-[#262626] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
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
              className="rounded-[28px] p-12 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(234,239,246,0.92) 0%, rgba(238,242,248,0.86) 100%)",
                border: "1px solid rgba(255,255,255,0.85)",
              }}
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
                      href={featuredProduct ? generateWhatsAppLink(featuredProduct) : "https://wa.me/6281234567890"}
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

              {/* AI Modal */}
              {activeModal === "ai" && (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-[#141414] dark:text-zinc-200 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#141414] dark:text-zinc-200" /> Rekomendasi Pintar
                  </div>
                  <h4 className="text-2xl font-bold mb-2 text-[#111111] dark:text-white">
                    Asisten Rakit PC & Hardware
                  </h4>
                  <p className="text-sm text-[#676B74] dark:text-zinc-400 leading-relaxed mb-4">
                    Ingin merakit PC untuk rendering AutoCAD, Blender, atau gaming AAA di budget tertentu? Klik tombol di bawah untuk konsultasi langsung dengan teknisi spesialis kami via WhatsApp.
                  </p>
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Admin%20Alathea%20Comp%2C%20saya%20ingin%20konsultasi%20spesifikasi%20PC%20rakitan."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-[#141414] dark:bg-zinc-100 text-white dark:text-black text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-white dark:text-black" /> Mulai Konsultasi Gratis
                  </a>
                </div>
              )}

              {/* Menu Modal */}
              {activeModal === "menu" && (
                <div>
                  <h4 className="text-xl font-bold mb-4 text-[#111111] dark:text-white">Navigasi Toko</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        handleScrollToCatalog();
                      }}
                      className="w-full p-3 text-left rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold flex items-center justify-between text-[#111111] dark:text-white"
                    >
                      <span>Katalog Lengkap</span>
                      <ArrowUpRight className="w-4 h-4 text-[#111111] dark:text-zinc-400" />
                    </button>
                    <Link
                      href="/admin"
                      className="w-full p-3 text-left rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold flex items-center justify-between text-[#111111] dark:text-white"
                    >
                      <span>Admin CMS Dashboard</span>
                      <ArrowUpRight className="w-4 h-4 text-[#111111] dark:text-zinc-400" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Search Modal */}
              {activeModal === "search" && (
                <div>
                  <h4 className="text-xl font-bold mb-3 text-[#111111] dark:text-white">Cari Produk Hardware</h4>
                  <div className="p-3 rounded-2xl bg-[#EEF2F6] dark:bg-zinc-800 flex items-center gap-2 mb-4 border border-zinc-200 dark:border-zinc-700">
                    <Search className="w-4 h-4 text-[#111111] dark:text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Cari laptop, GPU, PC rakitan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-[#111111] dark:text-white"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      handleScrollToCatalog();
                    }}
                    className="w-full py-2.5 rounded-full bg-[#111111] dark:bg-zinc-100 text-white dark:text-black text-xs font-semibold cursor-pointer"
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
                    href="https://wa.me/6281234567890?text=Halo%20Admin%20Alathea%20Comp%2C%20saya%20ingin%20bertanya%20mengenai%20produk."
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
                    {formatRupiah(selectedProduct.discount_price || selectedProduct.price)}
                  </span>
                </div>
                <a
                  href={generateWhatsAppLink(selectedProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4 text-white dark:text-black" />
                  <span>Order Sekarang</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
