"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "@/components/ui/smart-image";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Laptop,
  Cpu,
  Monitor,
  HardDrive,
  Keyboard,
  Mouse,
  Headphones,
} from "lucide-react";
import { getProducts, getCategories } from "@/lib/services/catalog";
import { Product, Category } from "@/types/database";
import { formatIDR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Map category icons to Lucide components
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Laptop: Laptop,
  Cpu: Cpu,
  Monitor: Monitor,
  HardDrive: HardDrive,
  Keyboard: Keyboard,
  Mouse: Mouse,
  Headphones: Headphones,
  Package: Package,
};

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute KPI metrics
  const totalProducts = products.length;
  const readyStockCount = products.filter((p) => p.stock_status === "available").length;
  const preOrderOrOutCount = products.filter(
    (p) => p.stock_status === "pre_order" || p.stock_status === "out_of_stock"
  ).length;
  const totalCategories = categories.length;

  // Compute distribution of products per category
  const categoryCounts = categories.map((cat) => {
    const count = products.filter((p) => p.category_id === cat.id).length;
    const percentage = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
    return {
      ...cat,
      count,
      percentage,
    };
  });

  // Recent 5 products
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Ringkasan Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Pantau status katalog, klasifikasi kategori, dan ketersediaan inventaris hardware toko.
        </p>
      </div>

      {/* 4 Tactile Clay KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Total Produk */}
        <div className="clay-card rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Total Produk
            </span>
            <div className="w-9 h-9 rounded-xl bg-neutral-900/10 dark:bg-neutral-100/10 text-neutral-900 dark:text-neutral-100 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
              {loading ? "..." : totalProducts}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 inline" />
              Aktif dalam katalog publik
            </p>
          </div>
        </div>

        {/* KPI 2: Ready Stock */}
        <div className="clay-card rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Ready Stock
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
              {loading ? "..." : readyStockCount}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              Siap kirim via WhatsApp
            </p>
          </div>
        </div>

        {/* KPI 3: Pre-Order / Stok Habis */}
        <div className="clay-card rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              PO & Habis
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
              {loading ? "..." : preOrderOrOutCount}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              Perlu restock atau perakitan
            </p>
          </div>
        </div>

        {/* KPI 4: Total Kategori */}
        <div className="clay-card rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Total Kategori
            </span>
            <div className="w-9 h-9 rounded-xl bg-neutral-900/10 dark:bg-neutral-100/10 text-neutral-900 dark:text-neutral-100 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
              {loading ? "..." : totalCategories}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              Segmen klasifikasi hardware
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Category Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution Card */}
        <div className="lg:col-span-1 clay-card rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Distribusi Kategori
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Porsi produk per kategori
              </p>
            </div>
            <Link
              href="/admin/categories"
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium inline-flex items-center gap-1"
            >
              Kelola <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {categoryCounts.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon] || Package;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                      <Icon className="w-3.5 h-3.5 text-neutral-500" />
                      {cat.name}
                    </span>
                    <span className="font-mono text-neutral-500 dark:text-neutral-400">
                      {cat.count} item ({cat.percentage}%)
                    </span>
                  </div>
                  <Progress value={cat.percentage} className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Products Card */}
        <div className="lg:col-span-2 clay-card rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Produk Terbaru
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                5 produk yang baru ditambahkan atau diperbarui
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium inline-flex items-center gap-1"
            >
              Semua Produk <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                  <th className="pb-2.5 font-normal">Produk</th>
                  <th className="pb-2.5 font-normal">Kategori</th>
                  <th className="pb-2.5 font-normal">Harga</th>
                  <th className="pb-2.5 font-normal">Status</th>
                  <th className="pb-2.5 font-normal text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
                {recentProducts.map((p) => {
                  const thumb = p.images?.[0] || "/placeholder.png";
                  return (
                    <tr key={p.id} className="group hover:bg-neutral-200/40 dark:hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shrink-0 relative">
                            <Image
                              src={thumb}
                              alt={p.name}
                              fill
                              sizes="36px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 max-w-[200px] sm:max-w-[240px]">
                              {p.name}
                            </div>
                            <div className="font-mono text-[10px] text-neutral-500">
                              {p.sku} • {p.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-neutral-200/60 dark:bg-neutral-800/60 border-neutral-300 dark:border-neutral-700 font-normal"
                        >
                          {p.category?.name || "Hardware"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                        {formatIDR(p.price)}
                      </td>
                      <td className="py-3 pr-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono capitalize ${
                            p.stock_status === "available"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : p.stock_status === "pre_order"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {p.stock_status === "available"
                            ? "Ready"
                            : p.stock_status === "pre_order"
                            ? "Pre-Order"
                            : "Habis"}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium"
                        >
                          Lihat <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
