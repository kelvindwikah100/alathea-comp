export type TransactionStatus = "completed" | "processing" | "cancelled";

export type PaymentMethod =
  | "Transfer Bank (BCA)"
  | "Transfer Bank (Mandiri)"
  | "QRIS"
  | "Kartu Kredit"
  | "Tunai / Showroom";

export interface SaleItem {
  product_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  upgrade_spec?: string;
  subtotal: number;
}

export interface SaleTransaction {
  id: string;
  invoice_number: string;
  date: string; // ISO date string
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: SaleItem[];
  total_amount: number;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  notes?: string;
  created_at: string;
}

export interface SalesSummary {
  totalRevenue: number;
  totalTransactions: number;
  completedTransactions: number;
  processingTransactions: number;
  cancelledTransactions: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  chartData: {
    label: string;
    revenue: number;
    units: number;
  }[];
}
