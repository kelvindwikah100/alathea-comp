"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ServerOff,
  Loader2,
  Copy,
  Check,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/services/catalog";
import { loginSchema, LoginFormData } from "@/lib/validations/schemas";
import {
  getAdminCredentials,
  verifyAdminCredentials,
  setAdminSession,
  DEFAULT_ADMIN_CREDENTIALS,
} from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { BrandLogo } from "@/components/layout/brand-logo";
export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeCreds, setActiveCreds] = useState(DEFAULT_ADMIN_CREDENTIALS);
  const hasSupabase = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Muat kredensial admin saat ini (jika pernah diubah di dashboard)
    const creds = getAdminCredentials();
    setActiveCreds(creds);
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} disalin ke clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUseSampleAccount = () => {
    setValue("email", activeCreds.email, { shouldValidate: true });
    setValue("password", activeCreds.password, { shouldValidate: true });
    toast.success("Kredensial contoh berhasil diisikan ke form!", {
      description: "Klik tombol 'Masuk ke Dashboard' untuk melanjutkan.",
    });
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // 1. Supabase Auth first: only a real Supabase session can save to the database (RLS).
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

      // 2. Local demo account (browser only). With Supabase active this is Demo Mode:
      //    pages open, but changes cannot be saved to the database.
      const isLocalValid = verifyAdminCredentials(data.email, data.password);
      if (isLocalValid) {
        setAdminSession(data.email, activeCreds.name, hasSupabase);
        if (hasSupabase) {
          toast.warning("Masuk sebagai Mode Demo", {
            description:
              "Akun ini bukan akun Supabase, jadi perubahan tidak bisa disimpan ke database. Login dengan akun Supabase untuk menyimpan.",
          });
        } else {
          toast.success("Berhasil Masuk", {
            description: `Selamat datang kembali, ${activeCreds.name}!`,
          });
        }
        setTimeout(() => {
          window.location.href = "/admin";
        }, hasSupabase ? 1500 : 300);
        return;
      }

      // 3. Jika gagal verifikasi
      toast.error("Gagal Masuk", {
        description:
          "Email atau kata sandi tidak cocok. Silakan gunakan kredensial contoh di atas atau klik 'Isi Otomatis Kredensial Contoh'.",
      });
      setIsLoading(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.";
      toast.error("Terjadi Kesalahan", { description: message });
      setIsLoading(false);
    }
  };

  const handleEnterDemoMode = () => {
    setIsDemoLoading(true);
    try {
      setAdminSession(activeCreds.email, "Demo Administrator", true);
      toast.success("Mode Demo Aktif", {
        description: "Masuk sebagai Demo Administrator Alathea Comp.",
      });
      setTimeout(() => {
        window.location.href = "/admin";
      }, 300);
    } catch {
      toast.error("Gagal mengaktifkan mode demo");
      setIsDemoLoading(false);
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

        {/* Sample Credentials Card (Bantuan Login & Contoh Akun) */}
        <div className="clay-card rounded-2xl p-4 sm:p-5 border border-neutral-300/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Contoh Kredensial Login
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
            >
              Default Demo
            </Badge>
          </div>

          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Gunakan akun administrator resmi berikut untuk masuk ke dashboard:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Email Box */}
            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="min-w-0 pr-1">
                <span className="text-[10px] block font-mono text-neutral-400 dark:text-neutral-500 uppercase">
                  Email
                </span>
                <span className="font-mono text-neutral-900 dark:text-neutral-100 font-medium truncate block">
                  {activeCreds.email}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(activeCreds.email, "Email")}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Salin Email"
              >
                {copiedField === "Email" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Password Box */}
            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="min-w-0 pr-1">
                <span className="text-[10px] block font-mono text-neutral-400 dark:text-neutral-500 uppercase">
                  Password
                </span>
                <span className="font-mono text-neutral-900 dark:text-neutral-100 font-medium truncate block">
                  {activeCreds.password}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(activeCreds.password, "Password")}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Salin Password"
              >
                {copiedField === "Password" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Auto-Fill Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseSampleAccount}
            className="w-full h-8 rounded-xl text-xs font-semibold bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 gap-1.5 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Isi Otomatis Kredensial Contoh
          </Button>
        </div>

        {/* Tactile Clay Login Card */}
        <div className="clay-card rounded-2xl p-6 sm:p-8 space-y-6 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
              <span>Otentikasi CMS</span>
            </div>
            {hasSupabase ? (
              <Badge
                variant="outline"
                className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              >
                ● Supabase Online
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 border-neutral-400/30 bg-neutral-200/50 dark:bg-neutral-800/50"
              >
                <ServerOff className="w-3 h-3 mr-1 inline" /> Offline Mode
              </Badge>
            )}
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
                  disabled={isLoading || isDemoLoading}
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
                  className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1"
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
                  disabled={isLoading || isDemoLoading}
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
              disabled={isLoading || isDemoLoading}
              className="w-full h-11 rounded-xl clay-button font-medium text-sm gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-neutral-300/80 dark:border-neutral-800 w-full" />
            <span className="bg-neutral-200 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-neutral-600 dark:text-neutral-400 absolute">
              ATAU PENGUJIAN
            </span>
          </div>

          {/* Quick Demo Mode Access Button */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleEnterDemoMode}
              disabled={isLoading || isDemoLoading}
              className="w-full h-11 rounded-xl border border-dashed border-neutral-400/80 dark:border-neutral-700 bg-neutral-200/40 dark:bg-neutral-900/40 hover:bg-neutral-200/80 dark:hover:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 text-xs font-semibold gap-2 shadow-sm transition-all"
            >
              {isDemoLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyiapkan Sesi Demo...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  Masuk Mode Demo Admin (1-Klik)
                </>
              )}
            </Button>
            <p className="text-[11px] text-center text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Anda juga dapat mengganti email dan kata sandi admin secara bebas di dalam halaman Pengaturan Akun di Dashboard.
            </p>
          </div>
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
