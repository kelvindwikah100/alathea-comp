import { Product, SelectedUpgradePlan } from "@/types/database";

export { cn } from "cn";

/**
 * Format currency into standard Indonesian Rupiah
 * e.g., 15499000 -> "Rp 15.499.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rp 0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount).replace(/\u00A0/g, " ");
}

export const formatIDR = formatRupiah;

/**
 * Generate a clean URL-friendly slug from a text string
 * e.g., "ASUS ROG Zephyrus G16 (2025)" -> "asus-rog-zephyrus-g16-2025"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate the discount percentage given regular price and discounted price
 * Returns number from 1 to 99, or null if no discount
 */
export function calculateDiscountPercentage(
  price: number,
  discountPrice?: number | null
): number | null {
  if (!discountPrice || discountPrice >= price || price <= 0) {
    return null;
  }
  const discount = Math.round(((price - discountPrice) / price) * 100);
  return discount > 0 ? discount : null;
}

/**
 * Generate a direct WhatsApp consultation / order click-to-chat URL
 * Supports optional Custom Upgrade Plan (RAM & SSD)
 */
export function generateWhatsAppLink(
  product: Product,
  currentUrl?: string,
  upgradePlan?: SelectedUpgradePlan
): string {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848";
  const cleanNumber = rawNumber.replace(/[^0-9]/g, "");

  const basePrice = product.discount_price && product.discount_price < product.price
    ? product.discount_price
    : product.price;

  const ramExtra = upgradePlan?.ram?.price || 0;
  const ssdExtra = upgradePlan?.ssd?.price || 0;
  const totalExtra = ramExtra + ssdExtra;
  const finalPrice = basePrice + totalExtra;

  let message = `Halo Admin Alathea Comp, saya tertarik untuk konsultasi dan memesan produk berikut:

*${product.name}*
SKU: ${product.sku}
Harga Unit: ${formatRupiah(basePrice)}`;

  if (upgradePlan && (upgradePlan.ram || upgradePlan.ssd)) {
    message += `\n\n*Paket Custom Upgrade Terpilih:*`;
    if (upgradePlan.ram) {
      message += `\n- RAM: ${upgradePlan.ram.name} (${upgradePlan.ram.slot_type}) -> +${formatRupiah(upgradePlan.ram.price)}`;
    }
    if (upgradePlan.ssd) {
      message += `\n- Storage SSD: ${upgradePlan.ssd.name} (${upgradePlan.ssd.slot_type}) -> +${formatRupiah(upgradePlan.ssd.price)}`;
    }
    message += `\n*Total Estimasi (Unit + Upgrade): ${formatRupiah(finalPrice)}*`;
    message += `\n_(Pemasangan resmi oleh teknisi Alathea Comp & garansi resmi tetap aktif)_`;
  }

  if (currentUrl) {
    message += `\n\nLink Produk: ${currentUrl}`;
  }

  message += `\n\nApakah stok unit dan paket upgrade ini tersedia di toko? Terima kasih!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}


/**
 * Text + dot colors for a stock badge. Returns null for pre-order,
 * so callers keep their default (neutral) badge colors.
 */
export function getStockBadgeColors(
  status: string
): { text: string; dot: string } | null {
  if (status === "available") return { text: "text-emerald-600", dot: "bg-emerald-500" };
  if (status === "out_of_stock") return { text: "text-red-600", dot: "bg-red-500" };
  return null;
}
