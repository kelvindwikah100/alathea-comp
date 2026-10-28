"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "@/components/ui/smart-image";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Star,
  Check,
} from "lucide-react";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "@/lib/services/catalog";
import { Product, Category, StockStatus } from "@/types/database";
import { productSchema, ProductSchemaType } from "@/lib/validations/schemas";
import { formatIDR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

// Helper to auto-generate slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// Specification templates
const SPEC_TEMPLATES = {
  laptop: [
    { label: "Processor", value: "" },
    { label: "RAM", value: "" },
    { label: "Storage", value: "" },
    { label: "Kartu Grafis (GPU)", value: "" },
    { label: "Ukuran & Tipe Layar", value: "" },
    { label: "Sistem Operasi", value: "Windows 11 Home" },
    { label: "Garansi", value: "2 Tahun Resmi Distributor" },
  ],
  pc: [
    { label: "Processor", value: "" },
    { label: "Motherboard", value: "" },
    { label: "RAM", value: "" },
    { label: "Kartu Grafis (GPU)", value: "" },
    { label: "Storage SSD", value: "" },
    { label: "Power Supply (PSU)", value: "" },
    { label: "Casing & Cooling", value: "" },
    { label: "Garansi", value: "3 Tahun Parts Garansi Toko" },
  ],
  monitor: [
    { label: "Ukuran Layar", value: "" },
    { label: "Resolusi", value: "" },
    { label: "Refresh Rate", value: "" },
    { label: "Tipe Panel", value: "IPS" },
    { label: "Response Time", value: "1ms (GtG)" },
    { label: "Color Gamut", value: "100% sRGB" },
    { label: "Port I/O", value: "HDMI, DisplayPort" },
    { label: "Garansi", value: "3 Tahun Resmi" },
  ],
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [upgradeFilter, setUpgradeFilter] = useState("all"); // "all" | "upgradable" | "non_upgradable"

  // Dialog & state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isCheckingImageUrl, setIsCheckingImageUrl] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema as any),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      brand: "",
      category_id: "",
      stock_status: "available",
      is_featured: false,
      price: 0,
      discount_price: null,
      short_description: "",
      description: "",
      specifications: [],
      images: [],
      is_ram_upgradable: false,
      is_ssd_upgradable: false,
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "specifications",
  });

  const watchedImages = watch("images") || [];
  const watchedFeatured = watch("is_featured");
  const watchedStockStatus = watch("stock_status");
  const watchedCategoryId = watch("category_id");
  const watchedRamUpgradable = watch("is_ram_upgradable") ?? false;
  const watchedSsdUpgradable = watch("is_ssd_upgradable") ?? false;

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load products", err);
      toast.error("Gagal memuat katalog produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Check URL query action=new
  useEffect(() => {
    if (searchParams.get("action") === "new" && categories.length > 0) {
      openCreateDialog();
    }
  }, [searchParams, categories]);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setImageUrlInput("");
    reset({
      name: "",
      slug: "",
      sku: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: "",
      category_id: categories[0]?.id || "",
      stock_status: "available",
      is_featured: false,
      price: 0,
      discount_price: null,
      short_description: "",
      description: "",
      specifications: [
        { label: "Garansi", value: "Resmi Distributor 2 Tahun" },
        { label: "Kondisi", value: "Baru / Original Segel" },
      ],
      images: [],
      is_ram_upgradable: false,
      is_ssd_upgradable: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setImageUrlInput("");
    reset({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      brand: product.brand,
      category_id: product.category_id || categories[0]?.id || "",
      stock_status: product.stock_status,
      is_featured: product.is_featured,
      price: product.price,
      discount_price: product.discount_price || null,
      short_description: product.short_description || "",
      description: product.description || "",
      specifications: product.specifications || [],
      images: product.images || [],
      is_ram_upgradable: product.is_ram_upgradable ?? false,
      is_ssd_upgradable: product.is_ssd_upgradable ?? false,
    });
    setIsDialogOpen(true);
  };

  // Auto generate slug on name change when creating
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name, { shouldValidate: true });
    if (!editingProduct) {
      setValue("slug", slugify(name), { shouldValidate: true });
    }
  };

  // Image management
  const handleAddImageUrl = async () => {
    const url = imageUrlInput.trim();
    if (!url) return;

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      toast.error("Link Tidak Valid", { description: "Masukkan link lengkap yang diawali https://" });
      return;
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      toast.error("Link Tidak Valid", { description: "Link gambar harus diawali https://" });
      return;
    }

    // Make sure the link is an actual image, not a web page (e.g. a news article).
    setIsCheckingImageUrl(true);
    const isImage = await new Promise<boolean>((resolve) => {
      const probe = new window.Image();
      const timer = window.setTimeout(() => resolve(false), 10000);
      probe.onload = () => {
        window.clearTimeout(timer);
        resolve(probe.naturalWidth > 0);
      };
      probe.onerror = () => {
        window.clearTimeout(timer);
        resolve(false);
      };
      probe.src = url;
    });
    setIsCheckingImageUrl(false);

    if (!isImage) {
      toast.error("Link Ini Bukan Gambar", {
        description:
          "Sepertinya ini link halaman web. Buka gambarnya, klik kanan, pilih \"Salin alamat gambar\", lalu tempel di sini.",
      });
      return;
    }

    setValue("images", [...watchedImages, url]);
    setImageUrlInput("");
    toast.success("Gambar Ditambahkan");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setValue("images", [...watchedImages, url]);
      toast.success("Foto Produk Berhasil Diunggah");
    } catch {
      toast.error("Gagal mengunggah foto produk");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setValue(
      "images",
      watchedImages.filter((_, idx) => idx !== indexToRemove)
    );
  };

  // Apply template
  const applyTemplate = (type: "laptop" | "pc" | "monitor") => {
    replace(SPEC_TEMPLATES[type]);
    toast.info(`Template ${type.toUpperCase()} Diterapkan`);
  };

  // Quick toggle featured switch
  const handleToggleFeatured = async (product: Product) => {
    const newFeatured = !product.is_featured;
    try {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_featured: newFeatured } : p))
      );
      await updateProduct(product.id, { is_featured: newFeatured });
      toast.success(
        newFeatured ? "Produk Dijadikan Unggulan" : "Status Unggulan Dihapus",
        { description: product.name }
      );
    } catch {
      toast.error("Gagal memperbarui status unggulan");
      loadData();
    }
  };

  // Form submit
  const onFormSubmit = async (data: ProductSchemaType) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success("Produk Diperbarui", {
          description: `Data ${data.name} berhasil disimpan.`,
        });
      } else {
        await createProduct(data);
        toast.success("Produk Ditambahkan", {
          description: `Produk ${data.name} berhasil dipublikasikan.`,
        });
      }
      setIsDialogOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error("Gagal Menyimpan Produk", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      toast.success("Produk Dihapus", {
        description: `${productToDelete.name} telah dihapus dari katalog.`,
      });
      setProductToDelete(null);
      loadData();
    } catch {
      toast.error("Gagal menghapus produk");
    }
  };

  // Filtered dataset for Table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchFilter === "" ||
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchFilter.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || p.category_id === categoryFilter;

      const matchesStock =
        stockFilter === "all" || p.stock_status === stockFilter;

      const matchesUpgrade =
        upgradeFilter === "all" ||
        (upgradeFilter === "upgradable" && (p.is_ram_upgradable || p.is_ssd_upgradable)) ||
        (upgradeFilter === "non_upgradable" && !p.is_ram_upgradable && !p.is_ssd_upgradable);

      return matchesSearch && matchesCategory && matchesStock && matchesUpgrade;
    });
  }, [products, searchFilter, categoryFilter, stockFilter, upgradeFilter]);

  // TanStack Table columns definition
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "thumbnail",
        header: "Produk",
        cell: ({ row }) => {
          const p = row.original;
          const thumb = p.images?.[0] || "/placeholder.png";
          return (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shrink-0 relative">
                <Image
                  src={thumb}
                  alt={p.name}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 max-w-[220px]">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate text-xs">
                  {p.name}
                </div>
                <div className="text-[11px] font-mono text-neutral-500 truncate">
                  {p.brand} • <span className="text-neutral-400">{p.sku}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => {
          const p = row.original;
          return (
            <Badge
              variant="outline"
              className="text-[10px] font-medium bg-neutral-200/60 dark:bg-neutral-800/60 border-neutral-300 dark:border-neutral-700"
            >
              {p.category?.name || "Uncategorized"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "upgradable",
        header: "Upgrade",
        cell: ({ row }) => {
          const p = row.original;
          const hasRam = p.is_ram_upgradable;
          const hasSsd = p.is_ssd_upgradable;
          if (!hasRam && !hasSsd) {
            return (
              <span className="text-[10px] font-mono text-neutral-400">Soldered</span>
            );
          }
          return (
            <div className="flex flex-wrap items-center gap-1">
              {hasRam && (
                <Badge
                  variant="outline"
                  className="text-[9px] font-mono font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent px-1.5 py-0"
                >
                  +RAM
                </Badge>
              )}
              {hasSsd && (
                <Badge
                  variant="outline"
                  className="text-[9px] font-mono font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 px-1.5 py-0"
                >
                  +SSD
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Harga",
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="font-mono text-xs">
              <div className="font-bold text-neutral-900 dark:text-neutral-100">
                {formatIDR(p.price)}
              </div>
              {p.discount_price && (
                <div className="text-[10px] text-neutral-400 line-through">
                  {formatIDR(p.discount_price)}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "stock_status",
        header: "Status Stok",
        cell: ({ row }) => {
          const status = row.original.stock_status;
          return (
            <Badge
              variant="outline"
              className={`text-[10px] font-mono font-medium ${
                status === "available"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : status === "pre_order"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
              }`}
            >
              {status === "available"
                ? "Ready"
                : status === "pre_order"
                ? "Pre-Order"
                : "Habis"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "is_featured",
        header: "Unggulan",
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={p.is_featured}
                onCheckedChange={() => handleToggleFeatured(p)}
                aria-label="Toggle featured"
              />
              {p.is_featured && (
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <a
                href={`/products/${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
                title="Lihat Halaman Publik"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => openEditDialog(p)}
                className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
                title="Edit Produk"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setProductToDelete(p)}
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 transition-colors"
                title="Hapus Produk"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data: filteredProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            Kelola Katalog Produk
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Tambah, edit spesifikasi teknis dinamis, harga, foto, dan status ketersediaan hardware.
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
            <span>Tambah Produk</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="clay-card rounded-2xl p-4 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 clay-inset">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama produk, brand, atau SKU..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-hidden"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Toggle Chip for Hanya Upgradable */}
          <button
            type="button"
            onClick={() => setUpgradeFilter(upgradeFilter === "upgradable" ? "all" : "upgradable")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 border cursor-pointer h-9 ${
              upgradeFilter === "upgradable"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs"
                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
            title="Filter hanya hardware yang mendukung upgrade RAM / SSD"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Hanya Upgradable</span>
          </button>

          {/* Upgradability Filter Select */}
          <Select
            value={upgradeFilter === "all" ? "" : upgradeFilter}
            onValueChange={(val) => setUpgradeFilter(val || "all")}
          >
            <SelectTrigger className="w-[160px] h-9 text-xs rounded-xl bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800">
              <SelectValue placeholder="Semua Hardware" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Semua Hardware</SelectItem>
              <SelectItem value="upgradable">Hanya Upgradable</SelectItem>
              <SelectItem value="non_upgradable">Non-Upgradable (Soldered)</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={categoryFilter === "all" ? "" : categoryFilter}
            onValueChange={(val) => setCategoryFilter(val || "all")}
          >
            <SelectTrigger className="w-[150px] h-9 text-xs rounded-xl bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <Select
            value={stockFilter === "all" ? "" : stockFilter}
            onValueChange={(val) => setStockFilter(val || "all")}
          >
            <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800">
              <SelectValue placeholder="Semua Stok" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Semua Stok</SelectItem>
              <SelectItem value="available">Ready Stock</SelectItem>
              <SelectItem value="pre_order">Pre-Order</SelectItem>
              <SelectItem value="out_of_stock">Stok Habis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TanStack Table Card */}
      <div className="clay-card rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
            Daftar Inventaris ({filteredProducts.length})
          </span>
          <span className="text-neutral-500 font-mono">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium"
                >
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="pb-3 font-normal px-2 first:pl-0 last:pr-0">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-neutral-500">
                    Tidak ada produk yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-neutral-200/30 dark:hover:bg-neutral-900/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-2 first:pl-0 last:pr-0">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] text-neutral-500 font-mono">
            Menampilkan {filteredProducts.length} item
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0 rounded-lg border-neutral-300 dark:border-neutral-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0 rounded-lg border-neutral-300 dark:border-neutral-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="clay-card border border-neutral-200 dark:border-neutral-800 max-w-3xl max-h-[90vh] overflow-y-auto sm:rounded-2xl p-6">
          <DialogHeader className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {editingProduct ? "Edit Detail Produk Hardware" : "Tambah Produk Baru ke Katalog"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-2">
            {/* 1. Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                1. Informasi Dasar Produk
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-medium">Nama Produk</Label>
                  <Input
                    placeholder="misal: ASUS ROG Zephyrus G16 (2024)"
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
                  <Label className="text-xs font-medium">Slug URL (Auto-generated)</Label>
                  <Input
                    placeholder="asus-rog-zephyrus-g16-2024"
                    className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-xs font-mono"
                    {...register("slug")}
                  />
                  {errors.slug && (
                    <p className="text-xs text-rose-500">{errors.slug.message}</p>
                  )}
                </div>

                {/* SKU */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">SKU / Kode Stok</Label>
                  <Input
                    placeholder="ALT-ROG-G16"
                    className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-xs font-mono uppercase"
                    {...register("sku")}
                  />
                  {errors.sku && (
                    <p className="text-xs text-rose-500">{errors.sku.message}</p>
                  )}
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Brand / Pabrikan</Label>
                  <Input
                    placeholder="ASUS / Lenovo / AMD / NVIDIA"
                    className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-sm"
                    {...register("brand")}
                  />
                  {errors.brand && (
                    <p className="text-xs text-rose-500">{errors.brand.message}</p>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Kategori</Label>
                  <Select
                    value={watchedCategoryId}
                    onValueChange={(val) => setValue("category_id", val ?? "", { shouldValidate: true })}
                  >
                    <SelectTrigger className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-xs">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category_id && (
                    <p className="text-xs text-rose-500">{errors.category_id.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Pricing & Stock Section */}
            <div className="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                2. Harga & Ketersediaan Stok
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Price */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Harga Normal (IDR)</Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="25000000"
                    className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-xs font-mono"
                    {...register("price")}
                  />
                  {errors.price && (
                    <p className="text-xs text-rose-500">{errors.price.message}</p>
                  )}
                </div>

                {/* Discount Price */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Harga Promo / Setelah Diskon (Opsional)</Label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="22000000"
                    className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-xs font-mono"
                    {...register("discount_price")}
                  />
                  {errors.discount_price ? (
                    <p className="text-xs text-rose-500">{errors.discount_price.message}</p>
                  ) : (
                    <p className="text-[11px] text-neutral-500">
                      Diisi jika ada diskon. Harga Normal akan tampil dicoret.
                    </p>
                  )}
                </div>

                {/* Stock Status */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Status Stok</Label>
                  <Select
                    value={watchedStockStatus}
                    onValueChange={(val) =>
                      setValue("stock_status", (val ?? "available") as StockStatus, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-xs">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="available">Ready Stock</SelectItem>
                      <SelectItem value="pre_order">Pre-Order</SelectItem>
                      <SelectItem value="out_of_stock">Stok Habis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Is Featured Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Jadikan Produk Unggulan (Featured Bento Showcase)
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Produk unggulan akan diprioritaskan di grid depan dan bento showcase.
                  </div>
                </div>
                <Switch
                  checked={watchedFeatured}
                  onCheckedChange={(val) => setValue("is_featured", val)}
                />
              </div>

              {/* Dukungan Custom Upgrade RAM & SSD */}
              <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                      Dukungan Custom Upgrade Hardware
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Tentukan apakah modul RAM atau slot SSD NVMe pada laptop/unit ini dapat di-upgrade.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* RAM Upgrade Toggle */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        Mendukung Upgrade RAM
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {watchedRamUpgradable ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Ya, memiliki slot SO-DIMM lepas-pasang
                          </span>
                        ) : (
                          <span className="text-neutral-400">
                            Tidak (RAM On-board / Soldered)
                          </span>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={watchedRamUpgradable}
                      onCheckedChange={(val) => setValue("is_ram_upgradable", val)}
                    />
                  </div>

                  {/* SSD Upgrade Toggle */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        Mendukung Upgrade SSD
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {watchedSsdUpgradable ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Ya, memiliki slot M.2 NVMe ekstra/swappable
                          </span>
                        ) : (
                          <span className="text-neutral-400">
                            Tidak (Penyimpanan permanen / 1 slot terisi)
                          </span>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={watchedSsdUpgradable}
                      onCheckedChange={(val) => setValue("is_ssd_upgradable", val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Dynamic Specification Builder */}
            <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                    3. Dynamic Specification Builder (JSONB)
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Tambahkan spesifikasi teknis untuk tabel perbandingan & detail produk.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-400">Template:</span>
                  <button
                    type="button"
                    onClick={() => applyTemplate("laptop")}
                    className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Laptop
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("pc")}
                    className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  >
                    PC
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate("monitor")}
                    className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Monitor
                  </button>
                </div>
              </div>

              {/* Specs Rows */}
              <div className="clay-inset rounded-xl p-3 bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 space-y-2">
                {fields.length === 0 ? (
                  <p className="text-center py-4 text-xs text-neutral-500">
                    Belum ada spesifikasi. Klik template di atas atau &ldquo;+ Tambah Spesifikasi&rdquo;.
                  </p>
                ) : (
                  fields.map((field, idx) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder="Label (e.g. Processor)"
                        className="h-8 text-xs font-medium bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800 rounded-lg w-1/3"
                        {...register(`specifications.${idx}.label` as const)}
                      />
                      <Input
                        placeholder="Nilai (e.g. AMD Ryzen 7 7800X3D)"
                        className="h-8 text-xs bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800 rounded-lg flex-1"
                        {...register(`specifications.${idx}.value` as const)}
                      />
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ label: "", value: "" })}
                  className="w-full mt-2 h-8 rounded-lg border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-medium gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Baris Spesifikasi
                </Button>
              </div>
            </div>

            {/* 4. Multi-Image Manager */}
            <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                4. Multi-Image Manager (Foto & Galeri Produk)
              </h3>

              {/* Upload or Add URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Upload File */}
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload File (Storage / Local)
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploadingImage}
                    className="h-9 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:bg-neutral-200 dark:file:bg-neutral-800 file:text-neutral-700 dark:file:text-neutral-300"
                  />
                  {isUploadingImage && (
                    <p className="text-[10px] text-neutral-500 animate-pulse">
                      Mengunggah gambar...
                    </p>
                  )}
                </div>

                {/* Add External URL */}
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" /> Atau Masukkan URL Gambar
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="h-9 text-xs font-mono flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={isCheckingImageUrl}
                      onClick={handleAddImageUrl}
                      className="h-9 rounded-xl text-xs px-3"
                    >
                      {isCheckingImageUrl ? "Memeriksa..." : "Tambah"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Previews */}
              <div className="clay-inset rounded-xl p-3 bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800">
                <div className="text-[11px] font-mono text-neutral-500 mb-2">
                  Daftar Gambar ({watchedImages.length}): Foto pertama akan menjadi sampul utama katalog.
                </div>
                {watchedImages.length === 0 ? (
                  <p className="text-center py-4 text-xs text-neutral-400">
                    Belum ada foto produk yang ditambahkan.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {watchedImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="group relative aspect-square rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Thumbnail ${i}`}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 text-[8px] font-mono bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 px-1 py-0.5 rounded-sm">
                            Utama
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Descriptions Section */}
            <div className="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                5. Deskripsi Produk
              </h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Ringkasan Singkat (Short Description)</Label>
                  <Input
                    placeholder="misal: Laptop gaming ultra tipis dengan layar OLED 240Hz dan GPU RTX 4080."
                    className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl h-10 text-xs"
                    {...register("short_description")}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Deskripsi Lengkap Produk</Label>
                  <Textarea
                    placeholder="Jelaskan fitur unggulan, kondisi unit, kelengkapan paket penjualan..."
                    rows={4}
                    className="clay-inset bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 rounded-xl text-xs"
                    {...register("description")}
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl border-neutral-300 dark:border-neutral-800 text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="clay-button rounded-xl text-xs font-semibold px-6"
              >
                {isSubmitting ? "Menyimpan..." : editingProduct ? "Simpan Perubahan" : "Publikasikan Produk"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION ALERT DIALOG */}
      <AlertDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent className="clay-card border border-neutral-200 dark:border-neutral-800 sm:rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Hapus &ldquo;{productToDelete?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-neutral-600 dark:text-neutral-400">
              Produk ini akan dihapus permanen dari basis data dan tidak akan lagi muncul di katalog publik pengunjung.
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
              Ya, Hapus Produk
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-neutral-500 font-mono animate-pulse">
          Memuat halaman inventaris...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
