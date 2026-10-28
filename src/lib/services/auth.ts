"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/services/catalog";

export interface AdminCredentials {
  email: string;
  password: string;
  name: string;
  updatedAt?: string;
}

export interface AdminSession {
  isLoggedIn: boolean;
  email: string;
  name: string;
  role: string;
  isDemo: boolean;
  lastLogin?: string;
}

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: "admin@alatheacomp.id",
  password: "admin123",
  name: "Super Administrator",
  updatedAt: new Date().toISOString(),
};

const CREDENTIALS_KEY = "alathea_admin_credentials";
const SESSION_USER_KEY = "alathea_admin_user";
const LOGGED_IN_KEY = "alathea_admin_logged_in";

/**
 * Mengambil kredensial aktif admin (dari localStorage atau fallback ke default)
 */
export function getAdminCredentials(): AdminCredentials {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_CREDENTIALS;
  }

  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (!raw) {
      // Inisialisasi default
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_ADMIN_CREDENTIALS));
      return DEFAULT_ADMIN_CREDENTIALS;
    }
    const parsed = JSON.parse(raw);
    return {
      email: parsed.email || DEFAULT_ADMIN_CREDENTIALS.email,
      password: parsed.password || DEFAULT_ADMIN_CREDENTIALS.password,
      name: parsed.name || DEFAULT_ADMIN_CREDENTIALS.name,
      updatedAt: parsed.updatedAt || DEFAULT_ADMIN_CREDENTIALS.updatedAt,
    };
  } catch {
    return DEFAULT_ADMIN_CREDENTIALS;
  }
}

/**
 * Menyimpan kredensial baru admin
 */
export function saveAdminCredentials(
  newCredentials: Partial<AdminCredentials>
): AdminCredentials {
  const current = getAdminCredentials();
  const updated: AdminCredentials = {
    ...current,
    ...newCredentials,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));

    // Sinkronisasi dengan sesi aktif jika sedang login
    const sessionRaw = localStorage.getItem(SESSION_USER_KEY);
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        session.email = updated.email;
        session.name = updated.name;
        localStorage.setItem(SESSION_USER_KEY, JSON.stringify(session));
      } catch {
        // ignore
      }
    }
  }

  return updated;
}

/**
 * Mengambil status sesi admin saat ini
 */
export function getAdminSession(): AdminSession {
  const fallbackCreds = getAdminCredentials();

  if (typeof window === "undefined") {
    return {
      isLoggedIn: false,
      email: fallbackCreds.email,
      name: fallbackCreds.name,
      role: "Super Administrator",
      isDemo: true,
    };
  }

  try {
    const isLoggedIn = localStorage.getItem(LOGGED_IN_KEY) === "true";
    const sessionRaw = localStorage.getItem(SESSION_USER_KEY);
    const sessionData = sessionRaw ? JSON.parse(sessionRaw) : null;

    return {
      isLoggedIn,
      email: sessionData?.email || fallbackCreds.email,
      name: sessionData?.name || fallbackCreds.name,
      role: sessionData?.role || "Super Administrator",
      isDemo: sessionData?.isDemo ?? true,
      lastLogin: sessionData?.lastLogin,
    };
  } catch {
    return {
      isLoggedIn: false,
      email: fallbackCreds.email,
      name: fallbackCreds.name,
      role: "Super Administrator",
      isDemo: true,
    };
  }
}

/**
 * Mengeset sesi admin setelah login berhasil
 */
export function setAdminSession(email?: string, name?: string, isDemo = false): void {
  if (typeof window === "undefined") return;

  const creds = getAdminCredentials();
  const effectiveEmail = email || creds.email;
  const effectiveName = name || creds.name;

  // Set cookie for middleware
  document.cookie = "alathea_demo_admin=true; path=/; max-age=86400; SameSite=Lax";

  // Set localStorage
  localStorage.setItem(LOGGED_IN_KEY, "true");
  const sessionData: AdminSession = {
    isLoggedIn: true,
    email: effectiveEmail,
    name: effectiveName,
    role: "Super Administrator",
    isDemo,
    lastLogin: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(sessionData));
}

/**
 * Mengakhiri sesi login admin
 */
export async function clearAdminSession(): Promise<void> {
  if (typeof window === "undefined") return;

  document.cookie = "alathea_demo_admin=; path=/; max-age=0; SameSite=Lax";
  localStorage.removeItem(LOGGED_IN_KEY);
  localStorage.removeItem(SESSION_USER_KEY);

  // Jika Supabase aktif, logout juga dari Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Memverifikasi kecocokan email & password admin
 */
export function verifyAdminCredentials(email: string, pass: string): boolean {
  const creds = getAdminCredentials();
  return (
    creds.email.trim().toLowerCase() === email.trim().toLowerCase() &&
    creds.password === pass
  );
}

/**
 * Mengubah email admin dengan validasi password saat ini
 */
export async function updateAdminEmail(
  currentPassword: string,
  newEmail: string
): Promise<{ success: boolean; message: string }> {
  const creds = getAdminCredentials();

  if (creds.password !== currentPassword) {
    return {
      success: false,
      message: "Kata sandi saat ini yang Anda masukkan salah.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    return {
      success: false,
      message: "Format email baru tidak valid.",
    };
  }

  saveAdminCredentials({ email: newEmail.trim().toLowerCase() });

  // Update ke Supabase Auth jika sedang aktif
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.updateUser({ email: newEmail.trim().toLowerCase() });
      }
    } catch {
      // Non-blocking fallback
    }
  }

  return {
    success: true,
    message: "Email administrator berhasil diperbarui.",
  };
}

/**
 * Mengubah password admin dengan validasi password saat ini
 */
export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const creds = getAdminCredentials();

  if (creds.password !== currentPassword) {
    return {
      success: false,
      message: "Kata sandi saat ini yang Anda masukkan salah.",
    };
  }

  if (newPassword.length < 6) {
    return {
      success: false,
      message: "Kata sandi baru minimal harus 6 karakter.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      success: false,
      message: "Kata sandi baru tidak boleh sama dengan kata sandi saat ini.",
    };
  }

  saveAdminCredentials({ password: newPassword });

  // Update ke Supabase Auth jika sedang aktif
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.updateUser({ password: newPassword });
      }
    } catch {
      // Non-blocking fallback
    }
  }

  return {
    success: true,
    message: "Kata sandi administrator berhasil diperbarui.",
  };
}

/**
 * Mereset kredensial kembali ke akun default contoh
 */
export function resetAdminCredentialsToDefault(): AdminCredentials {
  if (typeof window !== "undefined") {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_ADMIN_CREDENTIALS));
  }
  return DEFAULT_ADMIN_CREDENTIALS;
}
