"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/services/catalog";
import { loginSchema, LoginFormData } from "@/lib/validations/schemas";
import {
  verifyAdminCredentials,
  setAdminSession,
} from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/layout/brand-logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasSupabase = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // 1. Supabase Auth (jika Supabase dikonfigurasi)
      if (hasSupabase) {
        const supabase = createClient();
        if (supabase) {
          const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

          if (!error) {
            setAdminSession(data.email, "Administrator", false);
            toast.success("Berhasil Masuk", {
              description: "Selamat datang kembali di Alathea Comp Admin CMS.",
            });
            setTimeout(() => {
              window.location.href = "/admin";
            }, 300);
            return;
          }
        }
      }

      // 2. Verifikasi kredensial admin resmi
      const isLocalValid = verifyAdminCredentials(data.email, data.password);
      if (isLocalValid) {
        setAdminSession(data.email, "Super Administrator", false);
        toast.success("Berhasil Masuk", {
          description: "Selamat datang kembali di Alathea Comp Admin CMS.",
        });
        setTimeout(() => {
          window.location.href = "/admin";
        }, 300);
        return;
      }

      // 3. Kredensial tidak valid
      toast.error("Gagal Masuk", {
        description: "Email atau kata sandi yang Anda masukkan salah. Akses ditolak.",
      });
      setIsLoading(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.";
      toast.error("Terjadi Kesalahan", { description: message });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Geometry (Zero Glow) */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-neutral-200/70 dark:bg-neutral-900/80 border border-neutral-300/80 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold tracking-tight shadow-sm transition-transform active:scale-95"
          >
            <BrandLogo className="h-10" priority />
            <Badge
              variant="outline"
              className="text-[10px] font-mono uppercase bg-neutral-300/60 dark:bg-neutral-800 border-neutral-400/40 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
            >
              CMS
            </Badge>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 pt-2">
            Portal Administrator
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Masuk untuk mengelola katalog, spesifikasi teknis, dan inventaris produk.
          </p>
        </div>

        {/* Tactile Clay Login Card */}
        <div className="clay-card rounded-2xl p-6 sm:p-8 space-y-6 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
              <span>Otentikasi CMS</span>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 bg-neutral-200/50 dark:bg-neutral-800/50"
            >
              <Lock className="w-3 h-3 mr-1 inline" /> Area Terbatas
            </Badge>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email Administrator
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@alatheacomp.id"
                  className="pl-10 h-11 clay-inset rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border-neutral-300/80 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 dark:text-rose-400 font-medium pt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Kata Sandi
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" /> Sembunyikan
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" /> Tampilkan
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="pl-10 pr-10 h-11 clay-inset rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border-neutral-300/80 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus-visible:ring-1 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
                  disabled={isLoading}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 dark:text-rose-400 font-medium pt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl clay-button font-medium text-sm gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi Kredensial...
                </>
              ) : (
                <>
                  Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-[11px] text-center text-neutral-500 dark:text-neutral-400 leading-relaxed pt-2 border-t border-neutral-200/80 dark:border-neutral-800">
            Hanya pemilik dan tim administrator resmi Alathea Comp yang memiliki izin akses ke portal ini.
          </p>
        </div>

        {/* Back to Public Storefront */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline transition-colors"
          >
            ← Kembali ke Katalog Publik Alathea Comp
          </Link>
        </div>
      </div>
    </div>
  );
}
