"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Clock,
  ExternalLink,
  Info,
  MapPin,
  MessageCircle,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { getStoreInfo, updateStoreInfo } from "@/lib/services/catalog";
import { storeInfoSchema, StoreInfoFormValues } from "@/lib/validations/schemas";
import { INITIAL_STORE_INFO } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const sectionClass =
  "p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4";
const inputClass = "rounded-xl h-10 text-xs";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] text-red-500">{message}</p>;
}

function toFormValues(info: StoreInfoFormValues): StoreInfoFormValues {
  return {
    name: info.name,
    description: info.description,
    highlights: info.highlights,
    weekday_hours: info.weekday_hours,
    weekend_hours: info.weekend_hours,
    address: info.address,
    whatsapp_number: info.whatsapp_number,
  };
}

export default function AdminAboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StoreInfoFormValues>({
    resolver: zodResolver(storeInfoSchema),
    defaultValues: toFormValues(INITIAL_STORE_INFO),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "highlights" });

  const loadInfo = () =>
    getStoreInfo()
      .then((info) => {
        reset(toFormValues(info));
        setLastUpdated(info.updated_at);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Gagal Memuat Data", {
          description: "Tidak dapat memuat informasi toko.",
        });
      })
      .finally(() => setIsLoading(false));

  useEffect(() => {
    loadInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: StoreInfoFormValues) => {
    try {
      setIsSaving(true);
      const saved = await updateStoreInfo(values);
      reset(toFormValues(saved));
      setLastUpdated(saved.updated_at);
      toast.success("Informasi Toko Disimpan", {
        description: "Halaman Tentang Alathea Comp sudah diperbarui.",
      });
    } catch (err: unknown) {
      toast.error("Gagal Menyimpan Data", {
        description: err instanceof Error ? err.message : "Terjadi kesalahan sistem.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Info className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
            <span>Tentang Toko</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Ubah isi halaman Tentang Alathea Comp: deskripsi, keunggulan, jam operasional, alamat, dan kontak.
            {lastUpdated && (
              <span className="block text-xs mt-1 font-mono">
                Terakhir diperbarui: {new Date(lastUpdated).toLocaleString("id-ID")}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/tentang"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Halaman</span>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              loadInfo();
            }}
            className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            type="submit"
            disabled={isSaving || isLoading || !isDirty}
            className="rounded-xl bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-950 font-semibold shadow-sm"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </Button>
        </div>
      </div>

      {/* Profile */}
      <section className={sectionClass}>
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Profil Toko
        </h2>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Nama Toko</Label>
          <Input {...register("name")} className={inputClass} />
          <FieldError message={errors.name?.message} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Deskripsi Singkat</Label>
          <Textarea {...register("description")} rows={4} className="rounded-xl text-xs" />
          <FieldError message={errors.description?.message} />
        </div>
      </section>

      {/* Highlights */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Keunggulan Toko
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={fields.length >= 6}
            onClick={() => append({ title: "", text: "" })}
            className="rounded-xl text-xs h-8"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Tambah
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-xs text-neutral-500">Belum ada keunggulan. Klik Tambah untuk menambahkan.</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-neutral-500">
                  Keunggulan #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                  title="Hapus keunggulan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Judul</Label>
                <Input {...register(`highlights.${index}.title`)} className={inputClass} />
                <FieldError message={errors.highlights?.[index]?.title?.message} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Keterangan</Label>
                <Textarea
                  {...register(`highlights.${index}.text`)}
                  rows={2}
                  className="rounded-xl text-xs"
                />
                <FieldError message={errors.highlights?.[index]?.text?.message} />
              </div>
            </div>
          ))}
        </div>
        <FieldError message={errors.highlights?.message} />
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hours */}
        <section className={sectionClass}>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Clock className="w-4 h-4" /> Jam Operasional
          </h2>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Senin – Sabtu</Label>
            <Input {...register("weekday_hours")} placeholder="09.00 – 21.00 WIB" className={inputClass} />
            <FieldError message={errors.weekday_hours?.message} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Minggu & Hari Libur</Label>
            <Input {...register("weekend_hours")} placeholder="10.00 – 18.00 WIB" className={inputClass} />
            <FieldError message={errors.weekend_hours?.message} />
          </div>
        </section>

        {/* Contact */}
        <section className={sectionClass}>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Alamat & Kontak
          </h2>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Alamat Showroom</Label>
            <Textarea {...register("address")} rows={2} className="rounded-xl text-xs" />
            <FieldError message={errors.address?.message} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> Nomor WhatsApp
            </Label>
            <Input
              {...register("whatsapp_number")}
              placeholder="6281234567890"
              className={`${inputClass} font-mono`}
            />
            <FieldError message={errors.whatsapp_number?.message} />
          </div>
        </section>
      </div>
    </form>
  );
}
