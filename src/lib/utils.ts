import { Product } from "@/types/database";

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
 */
export function generateWhatsAppLink(
  product: Product,
  currentUrl?: string
): string {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const cleanNumber = rawNumber.replace(/[^0-9]/g, "");

  const finalPrice = product.discount_price && product.discount_price < product.price
    ? product.discount_price
    : product.price;

  let message = `Halo Admin Alathea Comp, saya tertarik untuk konsultasi dan memesan produk berikut:

*${product.name}*
SKU: ${product.sku}
Harga: ${formatRupiah(finalPrice)}`;

  if (currentUrl) {
    message += `\nLink Produk: ${currentUrl}`;
  }

  message += `\n\nApakah stok unit ini tersedia di toko? Terima kasih!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
