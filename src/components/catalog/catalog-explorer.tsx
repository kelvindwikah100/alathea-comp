"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Package,
  Check,
  ChevronDown,
} from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Product, Category, StockStatus } from "@/types/database";
import { formatRupiah } from "@/lib/utils";

interface CatalogExplorerProps {
  products: Product[];
  categories: Category[];
  initialCategorySlug?: string;
}

export function CatalogExplorer({
  products,
  categories,
  initialCategorySlug = "all",
}: CatalogExplorerProps) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available unique brands derived dynamically from catalog
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Toggle brand selection
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrands([]);
    setSelectedStock("all");
    setMaxPrice(50000000);
    setSortBy("newest");
  };

  // Check if any filter is active
  const isFilterActive =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== "all" ||
    selectedBrands.length > 0 ||
    selectedStock !== "all" ||
    maxPrice < 50000000;

  // Filter & Sort calculation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchDesc = p.short_description?.toLowerCase().includes(q) || false;
          if (!matchName && !matchBrand && !matchSku && !matchDesc) return false;
        }

        // Category
        if (selectedCategory !== "all") {
          if (p.category?.slug !== selectedCategory) return false;
        }

        // Brand
        if (selectedBrands.length > 0) {
          if (!selectedBrands.includes(p.brand)) return false;
        }

        // Stock status
        if (selectedStock !== "all") {
          if (p.stock_status !== selectedStock) return false;
        }

        // Max price
        const currentPrice = p.discount_price || p.price;
        if (currentPrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discount_price || a.price;
        const priceB = b.discount_price || b.price;

        switch (sortBy) {
          case "price-asc":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "newest":
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [products, searchQuery, selectedCategory, selectedBrands, selectedStock, maxPrice, sortBy]);

  // Sidebar Filter Form Content (reused in desktop sidebar & mobile drawer)
  const FilterControls = () => (
    <div className="space-y-6 font-jakarta">
      {/* Search Input Well */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#8D939E] dark:text-zinc-400 block mb-2">
          Pencarian Cepat
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari tipe, seri, chipset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-8 rounded-xl bg-white/90 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-xs text-[#111111] dark:text-white placeholder:text-[#8D939E] focus:outline-none focus:border-[#111111] dark:focus:border-white transition"
          />
          <Search className="w-3.5 h-3.5 text-[#8D939E] absolute left-3 top-3 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#8D939E] dark:text-zinc-400 block mb-2">
          Kategori Hardware
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#141414] dark:bg-white text-white dark:text-black shadow-xs"
                : "bg-white/60 dark:bg-zinc-800/60 hover:bg-white text-[#2D3138] dark:text-zinc-300"
            }`}
          >
            <span>Semua Kategori</span>
            <span className="font-mono text-[11px] opacity-80">{products.length}</span>
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category?.slug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? "bg-[#141414] dark:bg-white text-white dark:text-black shadow-xs"
                    : "bg-white/60 dark:bg-zinc-800/60 hover:bg-white text-[#2D3138] dark:text-zinc-300"
                }`}
              >
                <span>{cat.name}</span>
                <span className="font-mono text-[11px] opacity-80">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Checkbox Multi-Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#8D939E] dark:text-zinc-400 block mb-2">
          Pabrikan / Brand
        </label>
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {availableBrands.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            const count = products.filter((p) => p.brand === brand).length;
            return (
              <label
                key={brand}
                className="flex items-center justify-between text-xs text-[#2D3138] dark:text-zinc-300 cursor-pointer p-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-zinc-800/60 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleBrandToggle(brand)}
                    className="rounded-md data-[state=checked]:bg-[#141414] data-[state=checked]:border-[#141414] dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black"
                  />
                  <span className="font-medium">{brand}</span>
                </div>
                <span className="font-mono text-[11px] text-[#8D939E]">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Stock Status Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#8D939E] dark:text-zinc-400 block mb-2">
          Status Ketersediaan
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "all", label: "Semua" },
            { id: "available", label: "Ready Stock" },
            { id: "pre_order", label: "Pre-Order" },
            { id: "out_of_stock", label: "Habis" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStock(st.id)}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition cursor-pointer text-center ${
                selectedStock === st.id
                  ? "bg-[#141414] dark:bg-white text-white dark:text-black shadow-xs"
                  : "bg-white/60 dark:bg-zinc-800/60 hover:bg-white text-[#2D3138] dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <label className="font-bold uppercase tracking-wider text-[#8D939E] dark:text-zinc-400">
            Maksimum Budget
          </label>
          <span className="font-mono font-bold text-[#111111] dark:text-white">
            {formatRupiah(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={5000000}
          max={50000000}
          step={1000000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#111111] dark:accent-white cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] font-mono text-[#8D939E] mt-1">
          <span>Rp 5 Jt</span>
          <span>Rp 50 Jt</span>
        </div>
      </div>

      {/* Reset Filter Button */}
      {isFilterActive && (
        <button
          onClick={handleResetFilters}
          className="w-full py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 text-xs font-semibold text-[#111111] dark:text-white flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Filter</span>
        </button>
      )}
    </div>
  );

  return (
    <section id="catalog-section" className="w-full pt-10 pb-20 font-jakarta">
      {/* SECTION HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8D939E] block mb-1">
            Official Store Inventory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-white tracking-[-0.02em]">
            Katalog Hardware Komputer
          </h2>
        </div>

        {/* Top Control Bar: Total Count + Mobile Filter Trigger + Sort Select */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Sheet Trigger */}
          <div className="lg:hidden">
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger className="h-9 px-4 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-[#111111] dark:text-white flex items-center gap-2 shadow-xs cursor-pointer">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter</span>
                {isFilterActive && (
                  <span className="w-2 h-2 rounded-full bg-[#111111] dark:bg-white" />
                )}
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:max-w-md p-6 overflow-y-auto bg-white/95 dark:bg-[#18191D]/95 backdrop-blur-md"
              >
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-lg font-bold text-[#111111] dark:text-white">
                    Filter Hardware
                  </SheetTitle>
                </SheetHeader>
                <FilterControls />
              </SheetContent>
            </Sheet>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8D939E] hidden sm:inline">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-3 rounded-full border border-zinc-200/80 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-[#111111] dark:text-white shadow-xs focus:outline-none cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="name-asc">Nama: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS BAR */}
      {isFilterActive && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-[#8D939E] font-medium mr-1">Filter Aktif:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-xs text-[#111111] dark:text-zinc-200 border border-white">
              <span>Cari: &quot;{searchQuery}&quot;</span>
              <button onClick={() => setSearchQuery("")} className="hover:text-black dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-xs text-[#111111] dark:text-zinc-200 border border-white">
              <span>Kategori: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
              <button onClick={() => setSelectedCategory("all")} className="hover:text-black dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBrands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-xs text-[#111111] dark:text-zinc-200 border border-white"
            >
              <span>Brand: {brand}</span>
              <button onClick={() => handleBrandToggle(brand)} className="hover:text-black dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedStock !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-xs text-[#111111] dark:text-zinc-200 border border-white">
              <span>
                Stok: {selectedStock === "available" ? "Ready" : selectedStock === "pre_order" ? "PO" : "Habis"}
              </span>
              <button onClick={() => setSelectedStock("all")} className="hover:text-black dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {maxPrice < 50000000 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFF6] dark:bg-zinc-800 text-xs text-[#111111] dark:text-zinc-200 border border-white font-mono">
              <span>≤ {formatRupiah(maxPrice)}</span>
              <button onClick={() => setMaxPrice(50000000)} className="hover:text-black dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-[#676B74] hover:text-[#111111] dark:hover:text-white underline cursor-pointer ml-1"
          >
            Bersihkan Semua
          </button>
        </div>
      )}

      {/* MAIN LAYOUT: DESKTOP SIDEBAR + PRODUCT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* DESKTOP SIDEBAR FILTER (3 COLUMNS) */}
        <aside
          className="hidden lg:block lg:col-span-3 p-6 rounded-[28px] sticky top-24 frost-card"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200/60 dark:border-zinc-800">
            <h3 className="font-bold text-sm text-[#111111] dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Spesifikasi</span>
            </h3>
            {isFilterActive && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#676B74] hover:text-[#111111] dark:hover:text-white underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <FilterControls />
        </aside>

        {/* PRODUCT GRID (9 COLUMNS) */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between text-xs text-[#8D939E] mb-4">
            <span>
              Menampilkan <strong className="text-[#111111] dark:text-white font-mono">{filteredProducts.length}</strong> unit hardware
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            /* EMPTY FILTER RESULT STATE */
            <div
              className="p-12 text-center rounded-[28px] border border-zinc-200/80 dark:border-zinc-800 space-y-4 font-jakarta frost-card"
            >
              <Package className="w-12 h-12 text-[#141414] dark:text-zinc-400 mx-auto" />
              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="font-bold text-base text-[#111111] dark:text-white">
                  Produk Tidak Ditemukan
                </h4>
                <p className="text-xs text-[#676B74] dark:text-zinc-400 leading-relaxed">
                  Tidak ada hardware yang cocok dengan kombinasi filter Anda. Coba reset filter atau ubah kata kunci pencarian.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-xs font-semibold shadow-xs hover:bg-zinc-800 transition cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
