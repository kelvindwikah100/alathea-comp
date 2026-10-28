"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Laptop,
  Cpu,
  Monitor,
  HardDrive,
  Keyboard,
  Mouse,
  Headphones,
  Package,
  RefreshCw,
  Search,
  Check,
} from "lucide-react";
import {
  getCategories,
  getProducts,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/catalog";
import { Category, Product } from "@/types/database";
import { categorySchema, CategorySchemaType } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AVAILABLE_ICONS = [
  { name: "Laptop", icon: Laptop },
  { name: "Cpu", icon: Cpu },
  { name: "Monitor", icon: Monitor },
  { name: "HardDrive", icon: HardDrive },
  { name: "Keyboard", icon: Keyboard },
  { name: "Mouse", icon: Mouse },
  { name: "Headphones", icon: Headphones },
  { name: "Package", icon: Package },
];

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = Object.fromEntries(
  AVAILABLE_ICONS.map(({ name, icon }) => [name, icon])
);

// Helper to auto-generate slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema as any),
    defaultValues: {
      name: "",
      slug: "",
      icon: "Package",
      description: "",
    },
  });

  const selectedIcon = watch("icon");

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error("Failed to load categories:", err);
      toast.error("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateDialog = () => {
    setEditingCategory(null);
    reset({
      name: "",
      slug: "",
      icon: "Laptop",
      description: "",
    });
    setIsFormOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      icon: category.icon || "Package",
      description: category.description || "",
    });
    setIsFormOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name, { shouldValidate: true });
    // Only auto-generate slug when creating a new category
    if (!editingCategory) {
      setValue("slug", slugify(name), { shouldValidate: true });
    }
  };

  const onFormSubmit = async (data: CategorySchemaType) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success("Kategori Diperbarui", {
          description: `Kategori ${data.name} berhasil diperbarui.`,
        });
      } else {
        await createCategory(data);
        toast.success("Kategori Dibuat", {
          description: `Kategori ${data.name} berhasil ditambahkan.`,
        });
      }
      setIsFormOpen(false);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error("Gagal Menyimpan Kategori", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success("Kategori Dihapus", {
        description: `Kategori ${categoryToDelete.name} telah dihapus.`,
      });
      setCategoryToDelete(null);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menghapus kategori";
      toast.error("Gagal Menghapus", { description: message });
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            Kelola Kategori Hardware
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Atur klasifikasi produk komputer, komponen, dan aksesoris IT.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="rounded-xl border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs gap-1.5 h-10 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </Button>
          <Button
            onClick={openCreateDialog}
            className="clay-button rounded-xl text-xs gap-1.5 h-10 px-4 font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kategori</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="clay-card rounded-2xl p-4 border border-neutral-200/80 dark:border-neutral-800/80 flex items-center gap-3">
        <Search className="w-4 h-4 text-neutral-400 shrink-0" />
        <Input
          type="text"
          placeholder="Cari kategori berdasarkan nama atau slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm h-8 p-0 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
        />
      </div>

      {/* Categories Table Card */}
      <div className="clay-card rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            Daftar Kategori ({filteredCategories.length})
          </span>
          <span className="text-neutral-500 font-mono">
            {categories.length} Total Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                <th className="pb-3 font-normal w-12">Ikon</th>
                <th className="pb-3 font-normal">Nama Kategori</th>
                <th className="pb-3 font-normal">Slug URL</th>
                <th className="pb-3 font-normal">Deskripsi</th>
                <th className="pb-3 font-normal text-center">Jumlah Produk</th>
                <th className="pb-3 font-normal text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    Tidak ada kategori yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const Icon = CATEGORY_ICON_MAP[cat.icon] || Package;
                  const productCount = products.filter((p) => p.category_id === cat.id).length;
                  return (
                    <tr
                      key={cat.id}
                      className="group hover:bg-neutral-200/30 dark:hover:bg-neutral-900/40 transition-colors"
                    >
                      {/* Icon */}
                      <td className="py-3.5">
                        <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                          <Icon className="w-4 h-4" />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3.5 font-semibold text-neutral-900 dark:text-neutral-100">
                        {cat.name}
                      </td>

                      {/* Slug */}
                      <td className="py-3.5">
                        <code className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300">
                          /{cat.slug}
                        </code>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 text-neutral-600 dark:text-neutral-400 max-w-[260px] truncate">
                        {cat.description || "-"}
                      </td>

                      {/* Product Count */}
                      <td className="py-3.5 text-center">
                        <Badge
                          variant="outline"
                          className="font-mono text-[11px] bg-neutral-200/50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700"
                        >
                          {productCount} item
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditDialog(cat)}
                            className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/80 dark:hover:bg-neutral-800 transition-colors"
                            title="Edit Kategori"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 transition-colors"
                            title="Hapus Kategori"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Category Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="clay-card border border-neutral-200 dark:border-neutral-800 max-w-lg sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {editingCategory ? "Edit Kategori Hardware" : "Tambah Kategori Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Nama Kategori
              </Label>
              <Input
                placeholder="misal: PC Rakitan / Laptop Gaming"
                className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-sm"
                {...register("name")}
                onChange={handleNameChange}
              />
              {errors.name && (
                <p className="text-xs text-rose-500">{errors.name.message}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Slug URL (Auto-generated / Editable)
              </Label>
              <div className="relative">
                <Input
                  placeholder="pc-rakitan"
                  className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-sm font-mono"
                  {...register("slug")}
                />
              </div>
              {errors.slug && (
                <p className="text-xs text-rose-500">{errors.slug.message}</p>
              )}
            </div>

            {/* Icon Picker */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Pilih Ikon Hardware
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_ICONS.map(({ name, icon: IconComponent }) => {
                  const isSelected = selectedIcon === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setValue("icon", name, { shouldValidate: true })}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all text-xs ${
                        isSelected
                          ? "bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-sm"
                          : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200/50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-[10px] font-medium">{name}</span>
                    </button>
                  );
                })}
              </div>
              {errors.icon && (
                <p className="text-xs text-rose-500">{errors.icon.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Deskripsi Singkat (Opsional)
              </Label>
              <Textarea
                placeholder="Penjelasan ringkas mengenai kategori produk ini..."
                rows={3}
                className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl text-sm"
                {...register("description")}
              />
            </div>

            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl border-neutral-300 dark:border-neutral-800 text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="clay-button rounded-xl text-xs font-semibold px-5"
              >
                {isSubmitting ? "Menyimpan..." : editingCategory ? "Simpan Perubahan" : "Buat Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={Boolean(categoryToDelete)} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent className="clay-card border border-neutral-200 dark:border-neutral-800 sm:rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Hapus Kategori &ldquo;{categoryToDelete?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-neutral-600 dark:text-neutral-400">
              Tindakan ini tidak dapat dibatalkan. Menghapus kategori ini dapat menyebabkan produk di bawah kategori ini menjadi tidak terkategori.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-neutral-300 dark:border-neutral-800 text-xs">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              Ya, Hapus Kategori
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
