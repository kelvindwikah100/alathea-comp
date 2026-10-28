"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  FileSpreadsheet,
  FileDown,
  Plus,
  Search,
  Filter,
  DollarSign,
  PackageCheck,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Trash2,
  Printer,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowUpRight,
  Receipt,
  Download,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  SaleTransaction,
  SalesSummary,
  TransactionStatus,
  PaymentMethod,
} from "@/types/sales";
import {
  getSalesTransactions,
  addSaleTransaction,
  updateTransactionStatus,
  getSalesSummary,
  exportSalesToExcel,
  exportSalesToPDF,
} from "@/lib/services/sales";
import { formatIDR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminSalesPage() {
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SaleTransaction | null>(null);

  // New Transaction Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Laptop");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState<number>(25000000);
  const [upgradeSpec, setUpgradeSpec] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Transfer Bank (BCA)");
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("completed");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const data = getSalesTransactions();
    setTransactions(data);
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Search
      const matchesSearch =
        t.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.items.some((i) =>
          i.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Status
      const matchesStatus =
        statusFilter === "all" ? true : t.status === statusFilter;

      // Date Filter
      let matchesDate = true;
      if (dateFilter === "today") {
        const todayStr = new Date().toISOString().slice(0, 10);
        matchesDate = t.date.slice(0, 10) === todayStr;
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(t.date) >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        matchesDate = new Date(t.date) >= monthAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [transactions, searchQuery, statusFilter, dateFilter]);

  // Sales Summary
  const summary = useMemo(() => {
    return getSalesSummary(filteredTransactions);
  }, [filteredTransactions]);

  // Export Handlers
  const handleExportExcel = () => {
    try {
      exportSalesToExcel(filteredTransactions);
      toast.success("File Excel Berhasil Diunduh", {
        description: `${filteredTransactions.length} baris data penjualan diekspor ke format .xlsx`,
      });
    } catch (err) {
      toast.error("Gagal mengekspor file Excel");
    }
  };

  const handleExportPDF = () => {
    try {
      exportSalesToPDF(filteredTransactions);
      toast.success("Laporan PDF Berhasil Diunduh", {
        description: "Dokumen resmi penjualan dan omset siap dicetak atau disimpan.",
      });
    } catch (err) {
      toast.error("Gagal mengekspor laporan PDF");
    }
  };

  // Status Change Handler
  const handleStatusChange = (id: string, newStatus: TransactionStatus) => {
    const updated = updateTransactionStatus(id, newStatus);
    setTransactions(updated);
    toast.success("Status Transaksi Diperbarui", {
      description: `Status diubah menjadi: ${
        newStatus === "completed"
          ? "Selesai"
          : newStatus === "processing"
          ? "Dalam Proses"
          : "Dibatalkan"
      }`,
    });
  };

  // Add Transaction Submit
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !productName || unitPrice <= 0) {
      toast.error("Nama pelanggan, nama produk, dan harga satuan wajib diisi.");
      return;
    }

    const subtotal = unitPrice * quantity;
    const newTx = addSaleTransaction({
      date: new Date().toISOString(),
      customer_name: customerName,
      customer_phone: customerPhone || "081234567890",
      customer_email: customerEmail || undefined,
      items: [
        {
          product_name: productName,
          category,
          quantity,
          unit_price: unitPrice,
          upgrade_spec: upgradeSpec || undefined,
          subtotal,
        },
      ],
      total_amount: subtotal,
      payment_method: paymentMethod,
      status: transactionStatus,
      notes: notes || undefined,
    });

    loadTransactions();
    setIsAddModalOpen(false);

    // Reset Form
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setProductName("");
    setQuantity(1);
    setUnitPrice(25000000);
    setUpgradeSpec("");
    setNotes("");

    toast.success("Transaksi Penjualan Berhasil Dicatat!", {
      description: `Invoice: ${newTx.invoice_number} | Total: ${formatIDR(subtotal)}`,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="text-[11px] font-mono uppercase bg-neutral-200/60 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
            >
              Revenue & Financial
            </Badge>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              Alathea POS v2.0
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Laporan Penjualan & Penghasilan
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Pantau ringkasan omset penjualan laptop, analisis tren transaksi, dan unduh rekapitulasi Excel / PDF.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download Excel Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleExportExcel}
            className="h-9 rounded-xl text-xs font-semibold border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Unduh Excel (.xlsx)</span>
          </Button>

          {/* Download PDF Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleExportPDF}
            className="h-9 rounded-xl text-xs font-semibold border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 gap-1.5 shadow-xs"
          >
            <FileDown className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <span>Unduh PDF (.pdf)</span>
          </Button>

          {/* Add Sale Button */}
          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 rounded-xl clay-button text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Penjualan Baru</span>
          </Button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Omset */}
        <div className="clay-card rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Omset / Pendapatan
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {formatIDR(summary.totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.8% pertumbuhan bulan ini</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Transaksi Selesai */}
        <div className="clay-card rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Transaksi Selesai
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {summary.completedTransactions}{" "}
              <span className="text-xs text-neutral-500 font-normal">
                / {summary.totalTransactions} Total
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-neutral-500">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
              <span>{summary.processingTransactions} dalam proses pengiriman</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Unit Terjual */}
        <div className="clay-card rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Hardware Terjual
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {summary.totalUnitsSold}{" "}
              <span className="text-xs text-neutral-500 font-normal">Unit</span>
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-500">
              Laptop premium, PC rakitan & modul RAM/SSD
            </p>
          </div>
        </div>

        {/* KPI 4: Average Order Value */}
        <div className="clay-card rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Rata-rata Nilai Pesanan
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {formatIDR(summary.averageOrderValue)}
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-500">
              Nilai per keranjang transaksi pelanggan
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="clay-card rounded-2xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-950 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Grafik Tren Omset Penjualan (IDR)
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Dihitung dari seluruh transaksi berstatus selesai pada periode aktif.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-mono self-start sm:self-auto">
            Realtime Analytics
          </Badge>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111111" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#111111" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#888888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
                tick={{ fontSize: 10, fill: "#888888" }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-semibold">{data.label}</p>
                        <p className="text-emerald-400 dark:text-emerald-600 font-mono font-bold">
                          Omset: {formatIDR(data.revenue)}
                        </p>
                        <p className="text-neutral-400 dark:text-neutral-600 text-[11px]">
                          Volume: {data.units} unit hardware
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#111111"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="clay-card rounded-2xl p-4 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Cari transaksi berdasarkan invoice, nama pelanggan, atau nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-300/80 dark:border-neutral-800 text-xs">
            <span className="text-[11px] font-medium text-neutral-500 pl-2">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-neutral-800 dark:text-neutral-200 text-xs font-medium outline-hidden pr-2 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="completed">Selesai</option>
              <option value="processing">Dalam Proses</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-300/80 dark:border-neutral-800 text-xs">
            <span className="text-[11px] font-medium text-neutral-500 pl-2">Periode:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-neutral-800 dark:text-neutral-200 text-xs font-medium outline-hidden pr-2 cursor-pointer"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="clay-card rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Daftar Rekapitulasi Transaksi Penjualan
            </h3>
            <Badge variant="outline" className="text-[11px] font-mono">
              {filteredTransactions.length} Data
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/70 text-neutral-600 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">No. Invoice & Tanggal</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Item & Custom Upgrade</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total Transaksi</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-sm">Tidak ada data transaksi yang cocok</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Coba sesuaikan kata kunci pencarian atau reset filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50 transition-colors"
                  >
                    {/* Invoice & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 block">
                        {tx.invoice_number}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(tx.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                        {tx.customer_name}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {tx.customer_phone}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {tx.items.map((item, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="font-medium text-neutral-800 dark:text-neutral-200">
                            {item.product_name}{" "}
                            <span className="text-neutral-500">({item.quantity}x)</span>
                          </span>
                          {item.upgrade_spec && (
                            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                              ✦ {item.upgrade_spec}
                            </p>
                          )}
                        </div>
                      ))}
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <span className="text-neutral-700 dark:text-neutral-300 block font-medium">
                        {tx.payment_method}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <select
                        value={tx.status}
                        onChange={(e) =>
                          handleStatusChange(tx.id, e.target.value as TransactionStatus)
                        }
                        className={`text-[11px] font-medium rounded-lg px-2 py-1 border cursor-pointer outline-hidden transition-all ${
                          tx.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            : tx.status === "processing"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                        }`}
                      >
                        <option value="completed">✓ Selesai</option>
                        <option value="processing">◷ Dalam Proses</option>
                        <option value="cancelled">✕ Dibatalkan</option>
                      </select>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                        {formatIDR(tx.total_amount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedInvoice(tx)}
                        className="h-8 w-8 p-0 rounded-xl hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
                        title="Lihat Invoice & Cetak"
                      >
                        <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Catat Transaksi Penjualan Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="clay-card rounded-2xl p-6 max-w-lg w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-950 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Catat Transaksi Penjualan Baru
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Rekam invoice hardware ke dalam sistem pembukuan Alathea.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Nama Pelanggan *</Label>
                  <Input
                    placeholder="Contoh: Hendra Kusuma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Nomor WhatsApp *</Label>
                  <Input
                    placeholder="Contoh: 081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    className="h-9 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Nama Produk Hardware *</Label>
                <Input
                  placeholder="Contoh: Apple MacBook Pro 16 M4 Max"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              {/* Category & Quantity & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Kategori</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-3 text-xs"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="PC Rakitan">PC Rakitan</option>
                    <option value="Komponen">Komponen</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Aksesoris">Aksesoris</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Kuantitas</Label>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Harga Satuan (Rp) *</Label>
                  <Input
                    type="number"
                    min={1000}
                    step={1}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="h-9 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Upgrade Spec */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">
                  Rincian Custom Upgrade (Opsional)
                </Label>
                <Input
                  placeholder="Contoh: Upgrade RAM 32GB DDR5 + SSD 2TB NVMe"
                  value={upgradeSpec}
                  onChange={(e) => setUpgradeSpec(e.target.value)}
                  className="h-9 rounded-xl text-xs"
                />
              </div>

              {/* Payment & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Metode Pembayaran</Label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-3 text-xs"
                  >
                    <option value="Transfer Bank (BCA)">Transfer Bank (BCA)</option>
                    <option value="Transfer Bank (Mandiri)">Transfer Bank (Mandiri)</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Kartu Kredit">Kartu Kredit</option>
                    <option value="Tunai / Showroom">Tunai / Showroom</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Status Awal</Label>
                  <select
                    value={transactionStatus}
                    onChange={(e) => setTransactionStatus(e.target.value as TransactionStatus)}
                    className="w-full h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-3 text-xs"
                  >
                    <option value="completed">Selesai (Lunas)</option>
                    <option value="processing">Dalam Proses (DP / Packing)</option>
                  </select>
                </div>
              </div>

              {/* Calculation Preview */}
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-500 font-medium">Total Estimasi:</span>
                <span className="font-mono font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {formatIDR(unitPrice * quantity)}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 rounded-xl text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="h-9 rounded-xl clay-button text-xs font-semibold gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Simpan Transaksi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail Invoice & Print Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="clay-card rounded-2xl p-6 sm:p-8 max-w-2xl w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Invoice Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
                  Official Invoice
                </span>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {selectedInvoice.invoice_number}
                </h3>
              </div>
              <div className="text-right">
                <Badge
                  className={`text-xs font-mono ${
                    selectedInvoice.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {selectedInvoice.status === "completed" ? "Lunas (Selesai)" : "Dalam Proses"}
                </Badge>
                <p className="text-[10px] text-neutral-400 font-mono mt-1">
                  ID: {selectedInvoice.id}
                </p>
              </div>
            </div>

            {/* Customer & Merchant Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                  Diterbitkan Oleh:
                </span>
                <p className="font-bold text-neutral-900 dark:text-neutral-100">Alathea Comp Store</p>
                <p className="text-neutral-500">Jl. Raya Teknologi No. 88, Jakarta</p>
                <p className="text-neutral-500">WhatsApp: 0812-3456-7890</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">
                  Ditagihkan Kepada:
                </span>
                <p className="font-bold text-neutral-900 dark:text-neutral-100">
                  {selectedInvoice.customer_name}
                </p>
                <p className="text-neutral-500 font-mono">{selectedInvoice.customer_phone}</p>
                <p className="text-neutral-500">
                  Tanggal:{" "}
                  {new Date(selectedInvoice.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase font-semibold text-neutral-500">
                  <tr>
                    <th className="p-3">Produk & Spesifikasi</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Harga Satuan</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {selectedInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <span className="font-semibold block">{it.product_name}</span>
                        {it.upgrade_spec && (
                          <span className="text-[11px] text-amber-600 font-mono block">
                            ✦ {it.upgrade_spec}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono">{it.quantity}</td>
                      <td className="p-3 text-right font-mono">{formatIDR(it.unit_price)}</td>
                      <td className="p-3 text-right font-mono font-bold">
                        {formatIDR(it.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-neutral-50 dark:bg-neutral-900 font-bold border-t border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <td colSpan={3} className="p-3 text-right">
                      Total Tagihan:
                    </td>
                    <td className="p-3 text-right font-mono text-sm text-neutral-900 dark:text-neutral-100">
                      {formatIDR(selectedInvoice.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment & Notes */}
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs flex justify-between items-center">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block">
                  Metode Pembayaran:
                </span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {selectedInvoice.payment_method}
                </span>
              </div>
              {selectedInvoice.notes && (
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase block">Catatan:</span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {selectedInvoice.notes}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedInvoice(null)}
                className="h-9 rounded-xl text-xs"
              >
                Tutup
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    exportSalesToPDF([selectedInvoice], `Invoice-${selectedInvoice.invoice_number.replace(/\//g, "-")}.pdf`);
                    toast.success("Invoice PDF berhasil diunduh!");
                  }}
                  className="h-9 rounded-xl text-xs gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5" /> Unduh Invoice PDF
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => window.print()}
                  className="h-9 rounded-xl clay-button text-xs gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak Langsung
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
