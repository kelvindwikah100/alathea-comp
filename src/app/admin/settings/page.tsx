"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  Clock,
  Laptop,
} from "lucide-react";
import {
  getAdminCredentials,
  getAdminSession,
  updateAdminEmail,
  updateAdminPassword,
  resetAdminCredentialsToDefault,
  DEFAULT_ADMIN_CREDENTIALS,
  AdminCredentials,
  AdminSession,
} from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function AdminSettingsPage() {
  const [credentials, setCredentials] = useState<AdminCredentials>(DEFAULT_ADMIN_CREDENTIALS);
  const [session, setSession] = useState<AdminSession | null>(null);

  // Email form state
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailAuthPassword, setEmailAuthPassword] = useState("");
  const [showEmailAuthPass, setShowEmailAuthPass] = useState(false);

  // Password form state
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const creds = getAdminCredentials();
    const sess = getAdminSession();
    setCredentials(creds);
    setSession(sess);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} berhasil disalin!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Handler Ganti Email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.error("Alamat email baru wajib diisi.");
      return;
    }
    if (!emailAuthPassword) {
      toast.error("Kata sandi saat ini wajib diisi untuk verifikasi keamanan.");
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const res = await updateAdminEmail(emailAuthPassword, newEmail);
      if (res.success) {
        toast.success("Email Berhasil Diperbarui", {
          description: `Email administrator kini telah diubah menjadi: ${newEmail.trim().toLowerCase()}`,
        });
        setNewEmail("");
        setEmailAuthPassword("");
        refreshData();
      } else {
        toast.error("Gagal Memperbarui Email", {
          description: res.message,
        });
      }
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui email.");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // 2. Handler Ganti Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Kata sandi saat ini wajib diisi.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Kata sandi baru minimal harus 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await updateAdminPassword(currentPassword, newPassword);
      if (res.success) {
        toast.success("Kata Sandi Berhasil Diperbarui", {
          description: "Kata sandi administrator telah diperbarui secara aman.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        refreshData();
      } else {
        toast.error("Gagal Memperbarui Kata Sandi", {
          description: res.message,
        });
      }
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui kata sandi.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // 3. Handler Reset ke Default
  const handleResetToDefault = () => {
    resetAdminCredentialsToDefault();
    refreshData();
    setShowResetConfirm(false);
    toast.success("Kredensial Direset ke Default", {
      description: `Email: ${DEFAULT_ADMIN_CREDENTIALS.email} | Sandi: ${DEFAULT_ADMIN_CREDENTIALS.password}`,
    });
  };

  // Helper meteran kekuatan kata sandi
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "" };
    if (pwd.length < 6) return { label: "Sangat Lemah", color: "bg-rose-500", width: "25%" };
    if (pwd.length < 8) return { label: "Cukup", color: "bg-amber-500", width: "50%" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { label: "Kuat", color: "bg-emerald-500", width: "100%" };
    }
    return { label: "Baik", color: "bg-blue-500", width: "75%" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant="outline"
            className="text-[11px] font-mono uppercase bg-neutral-200/60 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
          >
            Security & Authentication
          </Badge>
          <span className="text-xs text-neutral-400">•</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            CMS Control Panel
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Pengaturan Akun & Keamanan
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          Kelola email administrator, perbarui kata sandi, dan pantau status sesi login CMS.
        </p>
      </div>

      {/* Overview Active Profile Card */}
      <div className="clay-card rounded-2xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-950 flex items-center justify-center font-bold text-lg shadow-sm">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                {credentials.name}
              </span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                ● Aktif
              </Badge>
            </div>
            <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 mt-0.5">
              {credentials.email}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
              <span>Role: Super Administrator (Full Access)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-200 dark:border-neutral-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleCopy(credentials.email, "Email")}
            className="h-8 rounded-xl text-xs gap-1.5"
          >
            {copiedKey === "Email" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            Salin Email
          </Button>
        </div>
      </div>

      {/* Main Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form 1: Ganti Email */}
        <div className="clay-card rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Ganti Email Administrator
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Perbarui alamat email login CMS Alathea Comp.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateEmail} className="space-y-4">
            {/* Current Email Display */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Email Saat Ini
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="email"
                  value={credentials.email}
                  readOnly
                  disabled
                  className="pl-10 h-10 rounded-xl bg-neutral-200/50 dark:bg-neutral-900/50 border-neutral-300/50 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-mono"
                />
              </div>
            </div>

            {/* New Email */}
            <div className="space-y-1.5">
              <Label htmlFor="newEmail" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Alamat Email Baru
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="admin-baru@alatheacomp.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-xs"
                  required
                />
              </div>
            </div>

            {/* Password Confirmation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailAuthPassword" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Kata Sandi Saat Ini (Verifikasi)
                </Label>
                <button
                  type="button"
                  onClick={() => setShowEmailAuthPass(!showEmailAuthPass)}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1"
                >
                  {showEmailAuthPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="emailAuthPassword"
                  type={showEmailAuthPass ? "text" : "password"}
                  placeholder="Masukkan kata sandi saat ini"
                  value={emailAuthPassword}
                  onChange={(e) => setEmailAuthPassword(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-xs"
                  required
                />
              </div>
              <p className="text-[10px] text-neutral-500">
                Diperlukan untuk memverifikasi bahwa perubahan dilakukan oleh pemilik akun resmi.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isUpdatingEmail}
              className="w-full h-10 rounded-xl clay-button text-xs font-medium gap-2"
            >
              {isUpdatingEmail ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memperbarui...
                </>
              ) : (
                <>
                  Simpan Perubahan Email <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Form 2: Ganti Password */}
        <div className="clay-card rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Ganti Kata Sandi (Password)
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Perbarui kata sandi untuk mengamankan akses CMS.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="currentPassword" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Kata Sandi Saat Ini
                </Label>
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1"
                >
                  {showCurrentPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="currentPassword"
                  type={showCurrentPass ? "text" : "password"}
                  placeholder="Masukkan kata sandi saat ini"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-xs"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="newPassword" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Kata Sandi Baru
                </Label>
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1"
                >
                  {showNewPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="newPassword"
                  type={showNewPass ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-xs"
                  required
                />
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-neutral-500">Kekuatan Sandi:</span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Konfirmasi Kata Sandi Baru
                </Label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1"
                >
                  {showConfirmPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-xs"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full h-10 rounded-xl clay-button text-xs font-medium gap-2"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memperbarui Sandi...
                </>
              ) : (
                <>
                  Perbarui Kata Sandi <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Security Information Card */}
      <div className="clay-card rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Keamanan Akses Administrator
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Pastikan Anda menggunakan kata sandi yang kuat dan tidak membagikan kredensial login portal ini kepada pihak yang tidak berwenang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
