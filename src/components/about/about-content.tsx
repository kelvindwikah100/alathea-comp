"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Laptop,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { getStoreInfo } from "@/lib/services/catalog";
import { StoreInfo } from "@/types/database";

import { BrandLogo } from "@/components/layout/brand-logo";
const HIGHLIGHT_ICONS = [Laptop, ShieldCheck, Wrench, Sparkles];

const cardClass =
  "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800";

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${className}`} />;
}

export function AboutContent() {
  const [info, setInfo] = useState<StoreInfo | null>(null);

  useEffect(() => {
    getStoreInfo().then(setInfo);
  }, []);

  const waLink = info
    ? `https://wa.me/${info.whatsapp_number}?text=${encodeURIComponent(
        `Halo Admin ${info.name}, saya ingin bertanya tentang toko.`
      )}`
    : undefined;

  return (
    <main className="min-h-screen font-jakarta px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#676B74] dark:text-zinc-400 hover:text-[#111111] dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* Hero */}
        <section className="p-6 sm:p-8 rounded-[28px] bg-[#EEF2F6] dark:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="mb-6">
            <BrandLogo className="h-14 sm:h-16" priority />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 text-[#141414] dark:text-zinc-200 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Tentang Kami
          </div>
          {info ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white tracking-[-0.03em] mb-3">
                {info.name}
              </h1>
              <p className="text-sm text-[#676B74] dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {info.description}
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}
        </section>

        {/* Highlights */}
        {info ? (
          info.highlights.length > 0 && (
            <section className="grid gap-4 sm:grid-cols-3">
              {info.highlights.map(({ title, text }, i) => {
                const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
                return (
                  <div key={i} className={cardClass}>
                    <Icon className="w-5 h-5 text-[#111111] dark:text-zinc-200 mb-3" />
                    <h2 className="text-sm font-bold text-[#111111] dark:text-white mb-1">{title}</h2>
                    <p className="text-xs text-[#676B74] dark:text-zinc-400 leading-relaxed">{text}</p>
                  </div>
                );
              })}
            </section>
          )
        ) : (
          <section className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`${cardClass} space-y-2`}>
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </section>
        )}

        {/* Hours & Address */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className={`${cardClass} space-y-3`}>
            <h2 className="text-sm font-bold text-[#111111] dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4" /> Jam Operasional
            </h2>
            <div className="space-y-1.5 text-xs text-[#676B74] dark:text-zinc-300">
              <div className="flex justify-between gap-3">
                <span>Senin – Sabtu</span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  {info ? info.weekday_hours : "…"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Minggu & Hari Libur</span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  {info ? info.weekend_hours : "…"}
                </span>
              </div>
            </div>
          </div>

          <div className={`${cardClass} space-y-3`}>
            <h2 className="text-sm font-bold text-[#111111] dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Alamat Showroom
            </h2>
            {info ? (
              <p className="text-xs text-[#676B74] dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {info.address}
              </p>
            ) : (
              <Skeleton className="h-3 w-3/4" />
            )}
          </div>
        </section>

        {/* CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!info}
          className="w-full py-3.5 rounded-full bg-[#141414] dark:bg-zinc-100 text-white dark:text-black text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-white transition aria-disabled:pointer-events-none aria-disabled:opacity-60"
        >
          <MessageCircle className="w-4 h-4" /> Hubungi Kami via WhatsApp
        </a>
      </div>
    </main>
  );
}
