"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Sliders,
  Plus,
  Search,
  Cpu,
  HardDrive,
  Edit2,
  Trash2,
  Check,
  X,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  getUpgradeOptions,
  createUpgradeOption,
  updateUpgradeOption,
  deleteUpgradeOption,
  toggleUpgradeOptionStatus,
} from "@/lib/services/catalog";
import { UpgradeOption, UpgradeOptionFormData } from "@/types/database";
import {
  upgradeOptionSchema,
  UpgradeOptionFormValues,
} from "@/lib/validations/schemas";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function AdminUpgradesPage() {
  const [options, setOptions] = useState<UpgradeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "RAM" | "SSD">("ALL");

  // Dialog & Form states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<UpgradeOption | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpgradeOptionFormValues>({
    resolver: zodResolver(upgradeOptionSchema as any),
    defaultValues: {
      category: "RAM",
      name: "",
      slot_type: "",
      price: 0,
      is_active: true,
    },
  });

  const selectedCategory = watch("category");
  const isActive = watch("is_active");

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setIsLoading(true);
      const data = await getUpgradeOptions();
      setOptions(data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal Memuat Data", {
        description: "Tidak dapat memuat daftar opsi custom upgrade.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingOption(null);
    reset({
      category: "RAM",
      name: "",
      slot_type: "SO-DIMM DDR5",
      price: 550000,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (option: UpgradeOption) => {
    setEditingOption(option);
    reset({
      category: option.category,
      name: option.name,
      slot_type: option.slot_type,
      price: option.price,
      is_active: option.is_active,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: UpgradeOptionFormValues) => {
    try {
      setIsSubmitting(true);
      if (editingOption) {
        await updateUpgradeOption(editingOption.id, data);
        toast.success("Opsi Upgrade Diperbarui", {
          description: `Paket ${data.name} berhasil disimpan.`,
        });
      } else {
        await createUpgradeOption(data);
        toast.success("Opsi Upgrade Ditambahkan", {
          description: `Paket ${data.name} siap digunakan pelanggan.`,
        });
      }
      setIsDialogOpen(false);
      loadOptions();
    } catch (err: any) {
      toast.error("Gagal Menyimpan Data", {
        description: err.message || "Terjadi kesalahan sistem.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean, name: string) => {
    try {
      await toggleUpgradeOptionStatus(id);
      setOptions((prev) =>
        prev.map((o) => (o.id === id ? { ...o, is_active: !currentStatus } : o))
      );
      toast.success(
        !currentStatus ? "Paket Diaktifkan" : "Paket Diset Stok Habis",
        {
          description: `${name} sekarang ${!currentStatus ? "Tersedia" : "Nonaktif"}.`,
        }
      );
    } catch (err: any) {
      toast.error("Gagal Mengubah Status", {
        description: err.message || "Gagal mengubah ketersediaan stok.",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteUpgradeOption(deletingId);
      toast.success("Opsi Upgrade Dihapus", {
        description: "Paket kustom upgrade telah dihapus secara permanen.",
      });
      setDeletingId(null);
      loadOptions();
    } catch (err: any) {
      toast.error("Gagal Menghapus", {
        description: err.message || "Gagal menghapus opsi upgrade.",
      });
    }
  };

  // Filtered options
  const filteredOptions = useMemo(() => {
    return options.filter((o) => {
      const matchesCategory =
        categoryFilter === "ALL" ? true : o.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.slot_type.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [options, categoryFilter, searchQuery]);

  // Statistics
  const totalOptions = options.length;
  const activeRamCount = options.filter((o) => o.category === "RAM" && o.is_active).length;
  const activeSsdCount = options.filter((o) => o.category === "SSD" && o.is_active).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
            <span>Manajemen Custom Upgrade (RAM & SSD)</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Kelola opsi paket upgrade RAM DDR5 dan storage SSD NVMe yang dapat dipilih pengunjung di halaman utama.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadOptions}
            className="rounded-xl border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            onClick={openCreateDialog}
            className="rounded-xl bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-950 font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tambah Paket Upgrade</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Total Paket Tersedia
            </span>
            <span className="text-2xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100">
              {totalOptions}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <Sliders className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Paket RAM Aktif
            </span>
            <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {activeRamCount} Opsi
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Paket SSD NVMe Aktif
            </span>
            <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
              {activeSsdCount} Opsi
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Button
            size="sm"
            variant={categoryFilter === "ALL" ? "default" : "outline"}
            onClick={() => setCategoryFilter("ALL")}
            className="rounded-xl text-xs h-9 px-4"
          >
            Semua ({options.length})
          </Button>
          <Button
            size="sm"
            variant={categoryFilter === "RAM" ? "default" : "outline"}
            onClick={() => setCategoryFilter("RAM")}
            className="rounded-xl text-xs h-9 px-4 gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>RAM DDR5 ({options.filter((o) => o.category === "RAM").length})</span>
          </Button>
          <Button
            size="sm"
            variant={categoryFilter === "SSD" ? "default" : "outline"}
            onClick={() => setCategoryFilter("SSD")}
            className="rounded-xl text-xs h-9 px-4 gap-1.5"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>SSD NVMe ({options.filter((o) => o.category === "SSD").length})</span>
          </Button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari paket atau slot..."
            className="pl-9 h-9 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-850 border-neutral-200 dark:border-neutral-800"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-850/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Nama Paket Upgrade</th>
                <th className="py-3.5 px-4">Tipe Slot / Spek</th>
                <th className="py-3.5 px-4">Harga Tambahan (Rp)</th>
                <th className="py-3.5 px-4 text-center">Status Stok</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredOptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 text-sm">
                    {isLoading ? "Memuat data opsi upgrade..." : "Belum ada paket upgrade yang sesuai."}
                  </td>
                </tr>
              ) : (
                filteredOptions.map((opt) => (
                  <tr
                    key={opt.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-850/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      {opt.category === "RAM" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800">
                          <Cpu className="w-3.5 h-3.5" /> RAM
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200/60 dark:border-blue-800">
                          <HardDrive className="w-3.5 h-3.5" /> SSD
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                      {opt.name}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                      {opt.slot_type}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {formatRupiah(opt.price)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <Switch
                          checked={opt.is_active}
                          onCheckedChange={() =>
                            handleToggleStatus(opt.id, opt.is_active, opt.name)
                          }
                        />
                        <span
                          className={`text-xs font-semibold ${
                            opt.is_active
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-500 dark:text-red-400"
                          }`}
                        >
                          {opt.is_active ? "Tersedia" : "Habis"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(opt)}
                          className="h-8 w-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Edit Paket"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(opt.id)}
                          className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                          title="Hapus Paket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl sm:rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              <span>
                {editingOption ? "Edit Opsi Custom Upgrade" : "Tambah Opsi Upgrade Baru"}
              </span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Category Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Kategori Komponen</Label>
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  const cat = (val as "RAM" | "SSD") || "RAM";
                  setValue("category", cat);
                  if (cat === "RAM") {
                    setValue("slot_type", "SO-DIMM DDR5");
                  } else {
                    setValue("slot_type", "M.2 NVMe PCIe 4.0");
                  }
                }}
              >
                <SelectTrigger className="rounded-xl h-10 text-xs">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="RAM">RAM (Memory SO-DIMM)</SelectItem>
                  <SelectItem value="SSD">SSD (Storage NVMe M.2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Package Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Nama Paket Upgrade</Label>
              <Input
                {...register("name")}
                placeholder={
                  selectedCategory === "RAM"
                    ? "+16GB DDR5 5600MHz"
                    : "+1TB SSD NVMe Gen 4"
                }
                className="rounded-xl h-10 text-xs"
              />
              {errors.name && (
                <p className="text-[11px] text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Slot Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tipe Slot / Spesifikasi Singkat</Label>
              <Input
                {...register("slot_type")}
                placeholder={
                  selectedCategory === "RAM"
                    ? "SO-DIMM DDR5"
                    : "M.2 NVMe PCIe 4.0"
                }
                className="rounded-xl h-10 text-xs"
              />
              {errors.slot_type && (
                <p className="text-[11px] text-red-500">{errors.slot_type.message}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Harga Tambahan (Rp)</Label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="550000"
                className="rounded-xl h-10 text-xs font-mono"
              />
              {errors.price && (
                <p className="text-[11px] text-red-500">{errors.price.message}</p>
              )}
            </div>

            {/* Status Switch */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
              <div>
                <div className="text-xs font-semibold">Status Ketersediaan</div>
                <div className="text-[11px] text-neutral-500">
                  {isActive ? "Tersedia untuk dipilih pengunjung" : "Stok habis / dinonaktifkan"}
                </div>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl text-xs h-9 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold"
              >
                {isSubmitting ? "Menyimpan..." : editingOption ? "Simpan Perubahan" : "Tambah Paket"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={Boolean(deletingId)} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className="rounded-2xl sm:rounded-3xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Hapus Opsi Upgrade?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-neutral-500">
              Tindakan ini akan menghapus opsi upgrade dari daftar pilihan pengunjung.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl text-xs bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
