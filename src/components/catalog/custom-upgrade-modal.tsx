"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Cpu,
  HardDrive,
  Check,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Wrench,
  HelpCircle,
} from "lucide-react";
import { UpgradeOption, SelectedUpgradePlan } from "@/types/database";
import { getUpgradeOptions } from "@/lib/services/catalog";
import { formatRupiah } from "@/lib/utils";

interface CustomUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyUpgrade: (plan: SelectedUpgradePlan) => void;
  currentPlan?: SelectedUpgradePlan;
}

export const CustomUpgradeModal: React.FC<CustomUpgradeModalProps> = ({
  isOpen,
  onClose,
  onApplyUpgrade,
  currentPlan,
}) => {
  const [options, setOptions] = useState<UpgradeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRam, setSelectedRam] = useState<UpgradeOption | null>(
    currentPlan?.ram || null
  );
  const [selectedSsd, setSelectedSsd] = useState<UpgradeOption | null>(
    currentPlan?.ssd || null
  );

  useEffect(() => {
    if (isOpen) {
      loadUpgradeOptions();
      if (currentPlan) {
        setSelectedRam(currentPlan.ram || null);
        setSelectedSsd(currentPlan.ssd || null);
      }
    }
  }, [isOpen, currentPlan]);

  const loadUpgradeOptions = async () => {
    try {
      setIsLoading(true);
      const data = await getUpgradeOptions();
      setOptions(data);
    } catch (err) {
      console.warn("Failed to load upgrade options:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const ramOptions = options.filter((o) => o.category === "RAM");
  const ssdOptions = options.filter((o) => o.category === "SSD");

  const ramCost = selectedRam?.price || 0;
  const ssdCost = selectedSsd?.price || 0;
  const totalCost = ramCost + ssdCost;

  const handleApply = () => {
    onApplyUpgrade({
      ram: selectedRam,
      ssd: selectedSsd,
    });
    onClose();

    // Smooth scroll to catalog section
    setTimeout(() => {
      const catalogEl = document.getElementById("catalog-section");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  const handleConsultWhatsApp = () => {
    const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848";
    const cleanNumber = rawNumber.replace(/[^0-9]/g, "");

    let message = "Halo Teknisi & Admin Alathea Comp, saya ingin konsultasi mengenai kecocokan slot RAM dan SSD untuk upgrade laptop pilihan saya.";
    if (selectedRam || selectedSsd) {
      message += "\n\nRencana Upgrade Saya:";
      if (selectedRam) message += `\n- RAM: ${selectedRam.name} (${selectedRam.slot_type})`;
      if (selectedSsd) message += `\n- SSD: ${selectedSsd.name} (${selectedSsd.slot_type})`;
    }
    message += "\n\nMohon rekomendasi tipe unit laptop yang paling sesuai. Terima kasih!";

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#18191D] rounded-[28px] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer transition-colors z-20"
          aria-label="Tutup Modal"
        >
          <X className="w-4 h-4 text-[#111111] dark:text-zinc-200" />
        </button>

        {/* ================================================================
            1. MODAL HEADER
           ================================================================ */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5 pr-10 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Garansi Resmi Alathea Comp Tetap Aktif</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111111] dark:text-white">
            Simulasi Custom Upgrade Laptop
          </h3>
          <p className="text-xs sm:text-sm text-[#676B74] dark:text-zinc-400 mt-1">
            Tingkatkan performa multitasking dan ruang penyimpanan secara instan. Pemasangan dilakukan teknisi resmi dengan pengujian QC profesional sebelum dikirim.
          </p>
        </div>

        {/* ================================================================
            2. SCROLLABLE UPGRADE SELECTION (RAM & SSD)
           ================================================================ */}
        <div className="overflow-y-auto py-5 space-y-6 flex-1 pr-1">
          {/* Section: RAM Upgrade */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[#111111] dark:text-white">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-[#111111] dark:text-white uppercase tracking-wider">
                  1. Opsi Upgrade RAM (DDR5)
                </h4>
              </div>
              <span className="text-[11px] text-[#8D939E] font-medium">Pilih 1 Opsi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option: Tanpa Upgrade RAM */}
              <button
                type="button"
                onClick={() => setSelectedRam(null)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedRam === null
                    ? "border-[#141414] dark:border-white bg-[#F4F6F9] dark:bg-zinc-800/90 shadow-xs"
                    : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#111111] dark:text-white">
                    Tanpa Upgrade RAM
                  </div>
                  <div className="text-[11px] text-[#8D939E] mt-0.5">
                    Gunakan kapasitas RAM bawaan laptop
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-xs font-mono font-semibold text-[#8D939E]">Rp 0</span>
                  {selectedRam === null && (
                    <div className="w-4 h-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center mt-1 ml-auto">
                      <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              </button>

              {/* Dynamic RAM Options */}
              {ramOptions.map((opt) => {
                const isSelected = selectedRam?.id === opt.id;
                const isOutOfStock = !opt.is_active;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => !isOutOfStock && setSelectedRam(opt)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isOutOfStock
                        ? "opacity-45 bg-zinc-100 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
                        : isSelected
                        ? "border-[#141414] dark:border-white bg-[#F4F6F9] dark:bg-zinc-800/90 shadow-xs cursor-pointer"
                        : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50 cursor-pointer"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#111111] dark:text-white">
                        {opt.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#8D939E] mt-0.5">
                        {opt.slot_type}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 text-[10px] font-semibold">
                          Stok Habis
                        </span>
                      ) : (
                        <>
                          <span className="text-xs font-mono font-bold text-[#111111] dark:text-white block">
                            +{formatRupiah(opt.price)}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center mt-1 ml-auto">
                              <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: SSD Storage Upgrade */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[#111111] dark:text-white">
                  <HardDrive className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-[#111111] dark:text-white uppercase tracking-wider">
                  2. Opsi Tambah Penyimpanan (SSD NVMe)
                </h4>
              </div>
              <span className="text-[11px] text-[#8D939E] font-medium">Pilih 1 Opsi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option: Tanpa Upgrade SSD */}
              <button
                type="button"
                onClick={() => setSelectedSsd(null)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedSsd === null
                    ? "border-[#141414] dark:border-white bg-[#F4F6F9] dark:bg-zinc-800/90 shadow-xs"
                    : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#111111] dark:text-white">
                    Tanpa Upgrade SSD
                  </div>
                  <div className="text-[11px] text-[#8D939E] mt-0.5">
                    Gunakan kapasitas SSD bawaan laptop
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-xs font-mono font-semibold text-[#8D939E]">Rp 0</span>
                  {selectedSsd === null && (
                    <div className="w-4 h-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center mt-1 ml-auto">
                      <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              </button>

              {/* Dynamic SSD Options */}
              {ssdOptions.map((opt) => {
                const isSelected = selectedSsd?.id === opt.id;
                const isOutOfStock = !opt.is_active;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => !isOutOfStock && setSelectedSsd(opt)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isOutOfStock
                        ? "opacity-45 bg-zinc-100 dark:bg-zinc-850 border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
                        : isSelected
                        ? "border-[#141414] dark:border-white bg-[#F4F6F9] dark:bg-zinc-800/90 shadow-xs cursor-pointer"
                        : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50 cursor-pointer"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-[#111111] dark:text-white">
                        {opt.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#8D939E] mt-0.5">
                        {opt.slot_type}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 text-[10px] font-semibold">
                          Stok Habis
                        </span>
                      ) : (
                        <>
                          <span className="text-xs font-mono font-bold text-[#111111] dark:text-white block">
                            +{formatRupiah(opt.price)}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center mt-1 ml-auto">
                              <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==============================================================
              3. SUMMARY BOX (RINGKASAN KALKULASI)
             ============================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F0F4F8] dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-semibold text-[#676B74] dark:text-zinc-400">
                Rincian Upgrade Terpilih
              </span>
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">
                <Wrench className="w-3 h-3" />
                Gratis biaya pemasangan oleh teknisi resmi
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-[#2D3138] dark:text-zinc-300">
                <span>Modul RAM:</span>
                <span className="font-semibold font-mono">
                  {selectedRam ? `${selectedRam.name} (+${formatRupiah(selectedRam.price)})` : "Bawaan Pabrik (Rp 0)"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#2D3138] dark:text-zinc-300">
                <span>Storage SSD:</span>
                <span className="font-semibold font-mono">
                  {selectedSsd ? `${selectedSsd.name} (+${formatRupiah(selectedSsd.price)})` : "Bawaan Pabrik (Rp 0)"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#8D939E] block">Total Estimasi Biaya Upgrade:</span>
                <span className="text-lg sm:text-xl font-mono font-extrabold text-[#111111] dark:text-white">
                  +{formatRupiah(totalCost)}
                </span>
              </div>
              {totalCost > 0 && (
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black">
                  Paket Aktif
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================
            4. ACTION BUTTONS (FOOTER MODAL)
           ================================================================ */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleConsultWhatsApp}
            className="w-full sm:w-auto h-11 px-5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-[#141414] dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Tanya Kecocokan Slot</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="w-full sm:w-auto h-11 px-7 rounded-full bg-[#141414] dark:bg-white hover:bg-[#262626] dark:hover:bg-zinc-100 text-white dark:text-black text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <span>Terapkan & Pilih Laptop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
