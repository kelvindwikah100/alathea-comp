import React from "react";
import Link from "next/link";
import { Cpu, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 font-jakarta">
      <div
        className="p-8 sm:p-12 max-w-lg w-full text-center space-y-6 rounded-[28px] frost-card"
      >
        {/* Hardware Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#141414] dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto shadow-sm">
          <Cpu className="w-8 h-8" />
        </div>

        {/* 404 Headline */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8D939E] dark:text-zinc-400">
            Error 404 • Halaman Tidak Ditemukan
          </span>
          <h1 className="text-3xl font-extrabold text-[#111111] dark:text-white tracking-[-0.03em]">
            Hardware Not Found
          </h1>
          <p className="text-xs text-[#676B74] dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Halaman atau produk yang Anda tuju mungkin telah dipindahkan atau kodenya telah diperbarui.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-center">
          <Link href="/">
            <button
              type="button"
              className="px-6 py-3 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-xs font-semibold shadow-xs hover:bg-zinc-800 transition cursor-pointer inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Katalog Alathea Comp
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
