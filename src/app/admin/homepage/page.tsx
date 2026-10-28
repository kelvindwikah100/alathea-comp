"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "@/components/ui/smart-image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ExternalLink,
  ImageIcon,
  Loader2,
  MessageSquareText,
  MonitorSmartphone,
  RefreshCw,
  Save,
  ShoppingBag,
  Upload,
} from "lucide-react";
import {
  getHomepageHero,
  getProducts,
  updateHomepageHero,
  uploadProductImage,
} from "@/lib/services/catalog";
import { homepageHeroSchema, HomepageHeroFormValues } from "@/lib/validations/schemas";
import { INITIAL_HOMEPAGE_HERO } from "@/lib/seed-data";
import { HomepageHero, Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sectionClass =
  "p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4";
const inputClass = "rounded-xl h-10 text-xs";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const CALLOUT_POSITIONS = ["Kiri Atas", "Kiri Tengah", "Kanan Bawah"];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] text-red-500">{message}</p>;
}

function toFormValues(hero: HomepageHero): HomepageHeroFormValues {
  // Always exactly 3 labels, matching the 3 fixed positions on the homepage.
  const callouts = [0, 1, 2].map((i) => ({
    title: hero.callouts[i]?.title ?? "",
    subtitle: hero.callouts[i]?.subtitle ?? "",
  }));
  return {
    image_url: hero.image_url,
    image_alt: hero.image_alt,
    product_url: hero.product_url ?? "",
    product_slug: hero.product_slug ?? "",
    callouts,
  };
}

export default function AdminHomepagePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<HomepageHeroFormValues>({
    resolver: zodResolver(homepageHeroSchema),
    defaultValues: toFormValues(INITIAL_HOMEPAGE_HERO),
  });

  const imageUrl = watch("image_url");
  const imageAlt = watch("image_alt");
  const productSlug = watch("product_slug");
  const productUrl = watch("product_url");

  const loadHero = async () => {
    try {
      const [heroData, prods] = await Promise.all([getHomepageHero(), getProducts()]);
      setProductsList(prods);
      reset(toFormValues(heroData));
    } catch (err) {
      console.error(err);
      toast.error("Gagal Memuat Data", { description: "Tidak dapat memuat tampilan beranda." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHero();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File Tidak Didukung", { description: "Pilih file gambar (JPG, PNG, WEBP, AVIF)." });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("File Terlalu Besar", { description: "Ukuran gambar maksimal 5MB." });
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadProductImage(file, "homepage");
      setValue("image_url", url, { shouldDirty: true, shouldValidate: true });
      toast.success("Gambar Diunggah", {
        description: "Klik Simpan Perubahan untuk menampilkannya di beranda.",
      });
    } catch (err: unknown) {
      toast.error("Gagal Mengunggah", {
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat upload.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: HomepageHeroFormValues) => {
    try {
      setIsSaving(true);
      reset(toFormValues(await updateHomepageHero(values)));
      toast.success("Tampilan Beranda Disimpan", {
        description: "Gambar dan label di beranda sudah diperbarui.",
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
            <MonitorSmartphone className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
            <span>Tampilan Beranda</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Ganti gambar utama di bagian atas beranda dan teks 3 label yang mengelilinginya.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Beranda</span>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              loadHero();
            }}
            className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            type="submit"
            disabled={isSaving || isLoading || isUploading || !isDirty}
            className="rounded-xl bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-950 font-semibold shadow-sm"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Image */}
        <section className={`${sectionClass} lg:col-span-3`}>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Gambar Utama
          </h2>

            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
              {imageUrl ? (
                <Image src={imageUrl} alt={imageAlt || "Pratinjau gambar"} fill className="object-contain p-4" sizes="600px" />
              ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400">
                Belum ada gambar
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Mengunggah...
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl text-xs h-10"
          >
            <Upload className="w-4 h-4 mr-1.5" /> Unggah Gambar Baru
          </Button>
          <p className="text-[11px] text-neutral-500">
            JPG, PNG, WEBP, atau AVIF, maksimal 5MB. Disarankan foto produk asli dengan rasio 4:3 atau mendekati persegi.
          </p>
          <FieldError message={errors.image_url?.message} />

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Deskripsi Gambar (alt text)</Label>
            <Input
              {...register("image_alt")}
              placeholder="Contoh: Laptop ASUS ROG di meja kerja"
              className={inputClass}
            />
            <FieldError message={errors.image_alt?.message} />
          </div>

          {/* Product Link / Buy Now Target */}
          <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Produk Terkait & Tautan Tombol &ldquo;Buy Now&rdquo;</span>
              </Label>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Otomatis Masuk Keranjang
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Pilih produk dari katalog agar saat pengunjung mengklik tombol <strong>Buy Now</strong> di beranda, laptop/produk tersebut langsung dibeli dan masuk ke keranjang belanja.
            </p>

            {/* Quick dropdown */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">Pilih Cepat dari Katalog Produk</Label>
              <select
                value={productSlug || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const matched = productsList.find((p) => p.slug === val || p.id === val);
                  if (matched) {
                    setValue("product_slug", matched.slug, { shouldDirty: true, shouldValidate: true });
                    setValue("product_url", `/products/${matched.slug}`, { shouldDirty: true, shouldValidate: true });
                    if (!imageAlt) {
                      setValue("image_alt", matched.name, { shouldDirty: true });
                    }
                  } else if (!val) {
                    setValue("product_slug", "", { shouldDirty: true });
                    setValue("product_url", "", { shouldDirty: true });
                  }
                }}
                className="w-full rounded-xl h-10 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 px-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="">-- Pilih Produk Laptop / Komponen --</option>
                {productsList.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.brand} - {p.name} ({new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.discount_price || p.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Slug & URL inputs */}
            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">Slug Produk</Label>
                <Input
                  {...register("product_slug")}
                  placeholder="Contoh: apple-macbook-pro-16-m4-max"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">Link URL Produk</Label>
                <Input
                  {...register("product_url")}
                  placeholder="Contoh: /products/apple-macbook-pro-16-m4-max"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Active product link preview */}
            {productSlug && (
              <div className="p-2.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/70 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-700 dark:text-neutral-300 truncate">
                  Target Buy Now: <strong className="font-mono text-neutral-900 dark:text-neutral-100">{productSlug}</strong>
                </span>
                {productUrl && (
                  <Link
                    href={productUrl}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 hover:underline shrink-0 ml-2"
                  >
                    <span>Cek Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Callouts */}
        <section className={`${sectionClass} lg:col-span-2`}>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <MessageSquareText className="w-4 h-4" /> Label di Sekitar Gambar
          </h2>
          <p className="text-[11px] text-neutral-500">
            Kosongkan judul untuk menyembunyikan label tersebut.
          </p>

          {CALLOUT_POSITIONS.map((position, index) => (
            <div
              key={position}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 space-y-3"
            >
              <span className="text-[11px] font-mono font-semibold text-neutral-500">
                Label {index + 1} · {position}
              </span>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Judul</Label>
                <Input {...register(`callouts.${index}.title`)} className={inputClass} />
                <FieldError message={errors.callouts?.[index]?.title?.message} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Keterangan</Label>
                <Input {...register(`callouts.${index}.subtitle`)} className={inputClass} />
                <FieldError message={errors.callouts?.[index]?.subtitle?.message} />
              </div>
            </div>
          ))}
        </section>
      </div>
    </form>
  );
}
