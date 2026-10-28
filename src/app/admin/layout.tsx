"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Package,
  Layers,
  Sliders,
  ExternalLink,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  ServerOff,
  ChevronRight,
  Info,
  MonitorSmartphone,
  UserCog,
  TrendingUp,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/services/catalog";
import { createClient } from "@/lib/supabase/client";
import {
  getAdminSession,
  getAdminCredentials,
  clearAdminSession,
} from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { BrandLogo, BrandMark } from "@/components/layout/brand-logo";
interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Penjualan & Omset",
    href: "/admin/sales",
    icon: TrendingUp,
    exact: false,
  },
  {
    label: "Kelola Produk",
    href: "/admin/products",
    icon: Package,
    exact: false,
  },
  {
    label: "Kelola Kategori",
    href: "/admin/categories",
    icon: Layers,
    exact: false,
  },
  {
    label: "Custom Upgrade",
    href: "/admin/upgrades",
    icon: Sliders,
    exact: false,
  },
  {
    label: "Tampilan Beranda",
    href: "/admin/homepage",
    icon: MonitorSmartphone,
    exact: false,
  },
  {
    label: "Tentang Toko",
    href: "/admin/about",
    icon: Info,
    exact: false,
  },
  {
    label: "Pengaturan Akun",
    href: "/admin/settings",
    icon: UserCog,
    exact: false,
  },
];


export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState({
    email: "admin@alatheacomp.id",
    name: "Admin Alathea",
  });
  const hasSupabase = isSupabaseConfigured();

  useEffect(() => {
    setMounted(true);
    const session = getAdminSession();
    const creds = getAdminCredentials();
    setAdminUser({
      email: session.email || creds.email,
      name: session.name || creds.name,
    });
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // If on login page, render children without sidebar shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await clearAdminSession();
      toast.success("Berhasil Keluar", {
        description: "Sesi admin telah diakhiri dengan aman.",
      });
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    }
  };

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Overview";
    if (pathname.startsWith("/admin/sales")) return "Laporan Penjualan & Penghasilan";
    if (pathname.startsWith("/admin/products")) return "Kelola Katalog Produk";
    if (pathname.startsWith("/admin/categories")) return "Kelola Kategori Hardware";
    if (pathname.startsWith("/admin/upgrades")) return "Kelola Custom Upgrade (RAM & SSD)";
    if (pathname.startsWith("/admin/about")) return "Kelola Tentang Toko";
    if (pathname.startsWith("/admin/homepage")) return "Kelola Tampilan Beranda";
    if (pathname.startsWith("/admin/settings")) return "Pengaturan Akun & Keamanan";
    return "Admin CMS";
  };


  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-30 w-full h-16 bg-neutral-100/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-neutral-200/60 dark:bg-neutral-900/60 border border-neutral-300/60 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
            aria-label="Toggle mobile sidebar"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo (Visible on Mobile) */}
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:hidden"
          >
            <BrandMark className="h-8 w-8" />
            <span className="text-sm">Alathea CMS</span>
          </Link>

          {/* Breadcrumb / Title on Desktop */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Alathea Admin
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-600 dark:text-neutral-400 font-medium">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Connection Status Badge */}
          {hasSupabase ? (
            <Badge
              variant="outline"
              className="hidden sm:inline-flex items-center gap-1.5 py-1 px-2.5 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Database Online
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 py-1 px-2.5 text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 bg-neutral-200/50 dark:bg-neutral-800/50"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CMS Terproteksi</span>
              <span className="sm:hidden">Aktif</span>
            </Badge>
          )}

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-xl bg-neutral-200/60 dark:bg-neutral-900/60 border border-neutral-300/60 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          )}

          {/* View Public Storefront Link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-neutral-300/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Katalog Publik</span>
          </Link>

          {/* Logout Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-9 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 px-3 gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </header>

      {/* Body: Sidebar + Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Tactile Matte Glass + Clay) */}
        <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-950/60 backdrop-blur-md p-4 justify-between shrink-0">
          <div className="space-y-6">
            {/* Sidebar Brand */}
            <div className="px-2 pt-1">
              <Link href="/admin" className="flex items-center gap-3 group">
                <div>
                  <BrandLogo className="h-10" />
                  <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                    Control Panel v2.0
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Section */}
            <div className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Menu Utama
              </div>
              <nav className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 font-semibold shadow-sm"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-900/60"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Public Link */}
            <div className="pt-2">
              <div className="px-3 pb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Eksternal
              </div>
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-900/60 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Lihat Katalog Publik</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">↗</span>
              </Link>
            </div>
          </div>

          {/* Sidebar Footer User Info */}
          <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <Link
              href="/admin/settings"
              className="clay-card rounded-xl p-3 flex items-center gap-3 border border-neutral-200/70 dark:border-neutral-800/70 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group block"
              title="Buka Pengaturan Akun"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-neutral-100 dark:group-hover:text-neutral-950 transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {adminUser.name}
                  </p>
                  <span className="text-[10px] text-neutral-400 font-mono">Ubah</span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono truncate">
                  {adminUser.email}
                </p>
              </div>
            </Link>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div className="relative z-50 w-72 bg-neutral-100 dark:bg-neutral-950 p-5 flex flex-col justify-between shadow-xl border-r border-neutral-200 dark:border-neutral-800">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <BrandLogo className="h-9" />
                      <p className="text-[10px] font-mono text-neutral-500">v2.0</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {NAV_ITEMS.map((item) => {
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 font-semibold"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-900"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-900"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span>Lihat Katalog Publik</span>
                  </Link>
                </nav>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full h-10 rounded-xl text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/10 gap-2 justify-center"
                >
                  <LogOut className="w-4 h-4" /> Keluar dari Admin
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
