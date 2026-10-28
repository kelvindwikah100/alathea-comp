"use client";

import { SaleTransaction, SalesSummary, TransactionStatus } from "@/types/sales";
import { formatIDR } from "@/lib/utils";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SALES_STORAGE_KEY = "alathea_sales_records";

export const INITIAL_SALES_RECORDS: SaleTransaction[] = [
  {
    id: "TRX-2026-1001",
    invoice_number: "INV/20261024/001",
    date: "2026-10-24T09:15:00.000Z",
    customer_name: "Budi Santoso",
    customer_phone: "081288992211",
    customer_email: "budi.santoso@gmail.com",
    items: [
      {
        product_name: "Apple MacBook Pro 16 M4 Max",
        category: "Laptop",
        quantity: 1,
        unit_price: 52999000,
        upgrade_spec: "Custom Upgrade: RAM 64GB Unified + SSD 2TB",
        subtotal: 52999000,
      },
    ],
    total_amount: 52999000,
    payment_method: "Transfer Bank (BCA)",
    status: "completed",
    notes: "Pengiriman via kurir instant showroom Jakarta",
    created_at: "2026-10-24T09:15:00.000Z",
  },
  {
    id: "TRX-2026-1002",
    invoice_number: "INV/20261023/002",
    date: "2026-10-23T14:30:00.000Z",
    customer_name: "Rian Hendrawan",
    customer_phone: "081377884455",
    customer_email: "rian.hendrawan@techindo.co.id",
    items: [
      {
        product_name: "ASUS ROG Zephyrus G16 (2024)",
        category: "Laptop",
        quantity: 1,
        unit_price: 36499000,
        upgrade_spec: "RAM 32GB DDR5 + SSD 2TB NVMe",
        subtotal: 36499000,
      },
      {
        product_name: "Logitech G Pro X Superlight 2",
        category: "Aksesoris",
        quantity: 1,
        unit_price: 2199000,
        subtotal: 2199000,
      },
    ],
    total_amount: 38698000,
    payment_method: "Kartu Kredit",
    status: "completed",
    notes: "Packing kayu & asuransi ekspedisi",
    created_at: "2026-10-23T14:30:00.000Z",
  },
  {
    id: "TRX-2026-1003",
    invoice_number: "INV/20261022/003",
    date: "2026-10-22T11:20:00.000Z",
    customer_name: "Amanda Putri",
    customer_phone: "081900112233",
    customer_email: "amanda.design@studio.com",
    items: [
      {
        product_name: "Lenovo Legion Pro 7i Gen 9",
        category: "Laptop",
        quantity: 1,
        unit_price: 42999000,
        upgrade_spec: "Dual SSD 4TB RAID 0",
        subtotal: 42999000,
      },
    ],
    total_amount: 42999000,
    payment_method: "Transfer Bank (Mandiri)",
    status: "completed",
    notes: "Instalasi software 3D rendering selesai",
    created_at: "2026-10-22T11:20:00.000Z",
  },
  {
    id: "TRX-2026-1004",
    invoice_number: "INV/20261021/004",
    date: "2026-10-21T16:45:00.000Z",
    customer_name: "Dimas Anggara",
    customer_phone: "085611223344",
    items: [
      {
        product_name: "Custom Workstation PC Ryzen 9 7950X",
        category: "PC Rakitan",
        quantity: 1,
        unit_price: 38500000,
        upgrade_spec: "RTX 4080 Super + RAM 64GB DDR5 6000MHz",
        subtotal: 38500000,
      },
    ],
    total_amount: 38500000,
    payment_method: "Transfer Bank (BCA)",
    status: "completed",
    notes: "Ambil langsung di Showroom Alathea",
    created_at: "2026-10-21T16:45:00.000Z",
  },
  {
    id: "TRX-2026-1005",
    invoice_number: "INV/20261020/005",
    date: "2026-10-20T10:10:00.000Z",
    customer_name: "Jessica Tan",
    customer_phone: "081199887766",
    customer_email: "jessica.tan@gmail.com",
    items: [
      {
        product_name: "Apple MacBook Air 15 M3",
        category: "Laptop",
        quantity: 2,
        unit_price: 21499000,
        subtotal: 42998000,
      },
    ],
    total_amount: 42998000,
    payment_method: "QRIS",
    status: "completed",
    notes: "Pengadaan kantor 2 unit",
    created_at: "2026-10-20T10:10:00.000Z",
  },
  {
    id: "TRX-2026-1006",
    invoice_number: "INV/20261019/006",
    date: "2026-10-19T13:00:00.000Z",
    customer_name: "Farhan Maulana",
    customer_phone: "087788990011",
    items: [
      {
        product_name: "ASUS TUF Gaming A15",
        category: "Laptop",
        quantity: 1,
        unit_price: 18999000,
        upgrade_spec: "Upgrade RAM 16GB DDR5",
        subtotal: 18999000,
      },
    ],
    total_amount: 18999000,
    payment_method: "Transfer Bank (BCA)",
    status: "completed",
    notes: "Pembayaran terverifikasi otomatis",
    created_at: "2026-10-19T13:00:00.000Z",
  },
  {
    id: "TRX-2026-1007",
    invoice_number: "INV/20261018/007",
    date: "2026-10-18T15:20:00.000Z",
    customer_name: "Eko Prasetyo",
    customer_phone: "081233445566",
    items: [
      {
        product_name: "LG UltraGear 27GR95QE OLED",
        category: "Monitor",
        quantity: 1,
        unit_price: 14200000,
        subtotal: 14200000,
      },
      {
        product_name: "Custom Upgrade RAM Corsair Vengeance 32GB",
        category: "Komponen",
        quantity: 1,
        unit_price: 1850000,
        subtotal: 1850000,
      },
    ],
    total_amount: 16050000,
    payment_method: "Transfer Bank (Mandiri)",
    status: "completed",
    notes: "Klaim garansi resmi 3 tahun disertakan",
    created_at: "2026-10-18T15:20:00.000Z",
  },
  {
    id: "TRX-2026-1008",
    invoice_number: "INV/20261024/008",
    date: "2026-10-24T10:45:00.000Z",
    customer_name: "Kurniawan Wicaksono",
    customer_phone: "085712345678",
    items: [
      {
        product_name: "Apple MacBook Pro 14 M4 Pro",
        category: "Laptop",
        quantity: 1,
        unit_price: 34999000,
        upgrade_spec: "Space Black, RAM 24GB",
        subtotal: 34999000,
      },
    ],
    total_amount: 34999000,
    payment_method: "Transfer Bank (BCA)",
    status: "processing",
    notes: "Menunggu konfirmasi packing & pengiriman kurir",
    created_at: "2026-10-24T10:45:00.000Z",
  },
  {
    id: "TRX-2026-1009",
    invoice_number: "INV/20261015/009",
    date: "2026-10-15T09:30:00.000Z",
    customer_name: "Denny Wahyudi",
    customer_phone: "081999888777",
    items: [
      {
        product_name: "Kingston Fury Renegade 2TB NVMe PCIe 4.0",
        category: "Komponen",
        quantity: 2,
        unit_price: 2450000,
        subtotal: 4900000,
      },
    ],
    total_amount: 4900000,
    payment_method: "QRIS",
    status: "completed",
    notes: "Pengiriman Reguler JNE YES",
    created_at: "2026-10-15T09:30:00.000Z",
  },
  {
    id: "TRX-2026-1010",
    invoice_number: "INV/20261012/010",
    date: "2026-10-12T17:00:00.000Z",
    customer_name: "Sarah Wijaya",
    customer_phone: "081277665544",
    items: [
      {
        product_name: "Razer Blade 16 (OLED Dual-Mode)",
        category: "Laptop",
        quantity: 1,
        unit_price: 48999000,
        upgrade_spec: "SSD 4TB Samsung 990 Pro",
        subtotal: 48999000,
      },
    ],
    total_amount: 48999000,
    payment_method: "Kartu Kredit",
    status: "completed",
    notes: "Cicilan 0% 12 Bulan",
    created_at: "2026-10-12T17:00:00.000Z",
  },
];

/**
 * Mengambil seluruh data transaksi penjualan
 */
export function getSalesTransactions(): SaleTransaction[] {
  if (typeof window === "undefined") {
    return INITIAL_SALES_RECORDS;
  }

  try {
    const raw = localStorage.getItem(SALES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(INITIAL_SALES_RECORDS));
      return INITIAL_SALES_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SALES_RECORDS;
  }
}

/**
 * Menyimpan data transaksi baru
 */
export function addSaleTransaction(
  transactionData: Omit<SaleTransaction, "id" | "invoice_number" | "created_at">
): SaleTransaction {
  const current = getSalesTransactions();
  const dateObj = new Date();
  const dateStr = dateObj.toISOString().slice(0, 10).replace(/-/g, "");
  const nextNum = (current.length + 1).toString().padStart(3, "0");

  const newRecord: SaleTransaction = {
    ...transactionData,
    id: `TRX-${dateObj.getFullYear()}-${1000 + current.length + 1}`,
    invoice_number: `INV/${dateStr}/${nextNum}`,
    created_at: dateObj.toISOString(),
  };

  const updated = [newRecord, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(updated));
  }
  return newRecord;
}

/**
 * Mengubah status transaksi
 */
export function updateTransactionStatus(
  id: string,
  newStatus: TransactionStatus
): SaleTransaction[] {
  const current = getSalesTransactions();
  const updated = current.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
  if (typeof window !== "undefined") {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

/**
 * Menghitung ringkasan omset & statistik penjualan
 */
export function getSalesSummary(transactions: SaleTransaction[]): SalesSummary {
  let totalRevenue = 0;
  let totalUnitsSold = 0;
  let completedTransactions = 0;
  let processingTransactions = 0;
  let cancelledTransactions = 0;

  transactions.forEach((tx) => {
    if (tx.status === "completed") {
      totalRevenue += tx.total_amount;
      completedTransactions++;
      tx.items.forEach((item) => {
        totalUnitsSold += item.quantity;
      });
    } else if (tx.status === "processing") {
      processingTransactions++;
    } else if (tx.status === "cancelled") {
      cancelledTransactions++;
    }
  });

  const averageOrderValue =
    completedTransactions > 0 ? Math.round(totalRevenue / completedTransactions) : 0;

  // Grup data 7 hari terakhir / kronologis untuk grafik
  const dateMap: Record<string, { revenue: number; units: number }> = {};

  // Urutkan dari tanggal lama ke baru untuk chart
  const sorted = [...transactions]
    .filter((t) => t.status === "completed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  sorted.forEach((t) => {
    const d = new Date(t.date);
    const dayLabel = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    if (!dateMap[dayLabel]) {
      dateMap[dayLabel] = { revenue: 0, units: 0 };
    }
    dateMap[dayLabel].revenue += t.total_amount;
    t.items.forEach((item) => {
      dateMap[dayLabel].units += item.quantity;
    });
  });

  const chartData = Object.entries(dateMap).map(([label, val]) => ({
    label,
    revenue: val.revenue,
    units: val.units,
  }));

  return {
    totalRevenue,
    totalTransactions: transactions.length,
    completedTransactions,
    processingTransactions,
    cancelledTransactions,
    totalUnitsSold,
    averageOrderValue,
    chartData,
  };
}

/**
 * Ekspor Data Penjualan ke Excel (.xlsx)
 */
export function exportSalesToExcel(
  transactions: SaleTransaction[],
  fileName = "Laporan-Penjualan-Alathea-Comp.xlsx"
) {
  // Format baris untuk spreadsheet
  const rows = transactions.map((t, index) => {
    const itemsSummary = t.items
      .map(
        (i) =>
          `${i.product_name} (${i.quantity}x)${i.upgrade_spec ? ` [${i.upgrade_spec}]` : ""}`
      )
      .join(" + ");

    return {
      No: index + 1,
      "ID Transaksi": t.id,
      "No Invoice": t.invoice_number,
      Tanggal: new Date(t.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      Pelanggan: t.customer_name,
      WhatsApp: t.customer_phone,
      "Detail Produk / Upgrade": itemsSummary,
      "Metode Pembayaran": t.payment_method,
      Status:
        t.status === "completed"
          ? "Selesai"
          : t.status === "processing"
          ? "Dalam Proses"
          : "Dibatalkan",
      "Total Nominal (IDR)": t.total_amount,
      Catatan: t.notes || "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Atur lebar kolom
  worksheet["!cols"] = [
    { wch: 5 }, // No
    { wch: 16 }, // ID Transaksi
    { wch: 20 }, // No Invoice
    { wch: 24 }, // Tanggal
    { wch: 20 }, // Pelanggan
    { wch: 15 }, // WhatsApp
    { wch: 45 }, // Detail Produk
    { wch: 22 }, // Metode Pembayaran
    { wch: 14 }, // Status
    { wch: 20 }, // Total Nominal
    { wch: 30 }, // Catatan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Penjualan");

  // Tambahkan Sheet Ringkasan Eksekutif
  const summary = getSalesSummary(transactions);
  const summaryRows = [
    { Metrik: "Nama Toko", Nilai: "Alathea Comp (Hardware & Laptop Catalog)" },
    {
      Metrik: "Tanggal Ekspor",
      Nilai: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    { Metrik: "Total Transaksi", Nilai: summary.totalTransactions },
    { Metrik: "Transaksi Sukses", Nilai: summary.completedTransactions },
    { Metrik: "Transaksi Diproses", Nilai: summary.processingTransactions },
    { Metrik: "Unit Terjual", Nilai: `${summary.totalUnitsSold} Unit` },
    { Metrik: "Total Omset / Pendapatan", Nilai: formatIDR(summary.totalRevenue) },
    { Metrik: "Rata-rata Nilai Pesanan (AOV)", Nilai: formatIDR(summary.averageOrderValue) },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet["!cols"] = [{ wch: 30 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan Finansial");

  XLSX.writeFile(workbook, fileName);
}

/**
 * Ekspor Data Penjualan ke PDF (.pdf) dengan tata letak laporan formal & rapi
 */
export function exportSalesToPDF(
  transactions: SaleTransaction[],
  fileName = "Laporan-Penjualan-Alathea-Comp.pdf"
) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const summary = getSalesSummary(transactions);

  // 1. Header Perusahaan
  doc.setFillColor(17, 17, 17); // Dark Charcoal
  doc.rect(0, 0, 297, 24, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("ALATHEA COMP — LAPORAN RESMI PENJUALAN & OMSET", 14, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text(
    `Dicetak pada: ${new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })} WIB`,
    230,
    15
  );

  // 2. Kotak Ringkasan Finansial (KPI)
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(14, 28, 269, 20, 2, 2, "F");
  doc.setDrawColor(220, 224, 230);
  doc.roundedRect(14, 28, 269, 20, 2, 2, "D");

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.text("TOTAL PENDAPATAN (OMSET)", 20, 35);
  doc.text("TRANSAKSI SUKSES", 90, 35);
  doc.text("HARDWARE TERJUAL", 160, 35);
  doc.text("RATA-RATA NILAI TRANSAKSI", 225, 35);

  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(formatIDR(summary.totalRevenue), 20, 43);
  doc.text(`${summary.completedTransactions} Transaksi`, 90, 43);
  doc.text(`${summary.totalUnitsSold} Unit`, 160, 43);
  doc.text(formatIDR(summary.averageOrderValue), 225, 43);

  // 3. Tabel Data Transaksi (AutoTable)
  const tableData = transactions.map((t, idx) => {
    const itemNames = t.items
      .map(
        (i) =>
          `${i.product_name} (${i.quantity}x)${i.upgrade_spec ? ` [${i.upgrade_spec}]` : ""}`
      )
      .join("\n");

    const statusLabel =
      t.status === "completed"
        ? "Selesai"
        : t.status === "processing"
        ? "Proses"
        : "Batal";

    return [
      idx + 1,
      t.invoice_number,
      new Date(t.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      t.customer_name,
      itemNames,
      t.payment_method,
      statusLabel,
      formatIDR(t.total_amount),
    ];
  });

  autoTable(doc, {
    startY: 53,
    head: [
      [
        "No",
        "No Invoice",
        "Tanggal",
        "Pelanggan",
        "Rincian Produk & Upgrade",
        "Metode Bayar",
        "Status",
        "Total",
      ],
    ],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [40, 40, 40],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 32, fontStyle: "bold" },
      2: { cellWidth: 24 },
      3: { cellWidth: 35 },
      4: { cellWidth: 85 },
      5: { cellWidth: 35 },
      6: { cellWidth: 20, halign: "center" },
      7: { cellWidth: 28, halign: "right", fontStyle: "bold" },
    },
    foot: [
      [
        "",
        "",
        "",
        "",
        "TOTAL KESELURUHAN OMSET BERSIH:",
        "",
        `${summary.completedTransactions} Unit Selesai`,
        formatIDR(summary.totalRevenue),
      ],
    ],
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [17, 17, 17],
      fontSize: 8,
      fontStyle: "bold",
    },
  });

  // Footer Dokumen
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Alathea Comp Indonesia — Dokumen Rahasia Internal Manajemen • Halaman ${i} dari ${pageCount}`,
      14,
      200
    );
  }

  doc.save(fileName);
}
