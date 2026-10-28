"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Product, SelectedUpgradePlan } from "@/types/database";
import { formatRupiah } from "@/lib/utils";

const CART_TOAST_DURATION = 2500;

export interface CartItem {
  id: string; // unique item id
  product: Product;
  quantity: number;
  selectedUpgrade?: SelectedUpgradePlan | null;
  unitPrice: number;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (
    product: Product,
    quantity?: number,
    selectedUpgrade?: SelectedUpgradePlan | null
  ) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  getWhatsAppCheckoutUrl: () => string;
}

const CART_STORAGE_KEY = "alathea_cart_items";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Failed to persist cart to localStorage:", e);
    }
  }, [cartItems, isInitialized]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  const generateItemId = (
    productId: string,
    upgradePlan?: SelectedUpgradePlan | null
  ) => {
    const ramKey = upgradePlan?.ram ? `_ram:${upgradePlan.ram.id}` : "";
    const ssdKey = upgradePlan?.ssd ? `_ssd:${upgradePlan.ssd.id}` : "";
    return `${productId}${ramKey}${ssdKey}`;
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedUpgrade: SelectedUpgradePlan | null = null
  ) => {
    if (product.stock_status === "out_of_stock") {
      toast.error("Stok Habis", {
        description: `${product.name} sedang tidak tersedia dan tidak bisa ditambahkan ke keranjang.`,
        id: "cart-toast",
        duration: CART_TOAST_DURATION,
      });
      return;
    }

    const basePrice = product.discount_price || product.price;
    const upgradeCost =
      (selectedUpgrade?.ram?.price || 0) + (selectedUpgrade?.ssd?.price || 0);
    const unitPrice = basePrice + upgradeCost;

    const itemId = generateItemId(product.id, selectedUpgrade);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: itemId,
            product,
            quantity,
            selectedUpgrade,
            unitPrice,
          },
        ];
      }
    });

    toast.success(`"${product.name}" ditambahkan ke keranjang`, {
      description: selectedUpgrade?.ram || selectedUpgrade?.ssd
        ? "Termasuk konfigurasi Custom Upgrade resmi."
        : "Unit original segel resmi.",
      // Same id: a new add replaces the current toast instead of stacking another one.
      id: "cart-toast",
      duration: CART_TOAST_DURATION,
      action: {
        label: "Buka Keranjang",
        onClick: () => setIsCartOpen(true),
      },
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    const target = cartItems.find((i) => i.id === itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    if (target) {
      toast.info(`"${target.product.name}" dihapus dari keranjang`);
    }
  };

  const clearCart = () => {
    if (cartItems.length === 0) return;
    setCartItems([]);
    toast.info("Keranjang belanja telah dikosongkan");
  };

  const getWhatsAppCheckoutUrl = () => {
    const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281280009848";
    const phoneNumber = rawNumber.replace(/[^0-9]/g, "");
    if (cartItems.length === 0) {
      return `https://wa.me/${phoneNumber}?text=Halo%20Admin%20Alathea%20Comp%2C%20saya%20ingin%20konsultasi%20pemesanan%20laptop.`;
    }

    let message = `Halo Admin Alathea Comp, saya ingin memesan produk dari keranjang belanja katalog:\n\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   • Brand: ${item.product.brand} (SKU: ${item.product.sku})\n`;
      message += `   • Jumlah: ${item.quantity} unit\n`;
      message += `   • Harga Satuan: ${formatRupiah(item.unitPrice)}\n`;

      if (item.selectedUpgrade?.ram || item.selectedUpgrade?.ssd) {
        message += `   • *Paket Custom Upgrade:*\n`;
        if (item.selectedUpgrade.ram) {
          message += `     - RAM: ${item.selectedUpgrade.ram.name} (+${formatRupiah(item.selectedUpgrade.ram.price)})\n`;
        }
        if (item.selectedUpgrade.ssd) {
          message += `     - SSD: ${item.selectedUpgrade.ssd.name} (+${formatRupiah(item.selectedUpgrade.ssd.price)})\n`;
        }
      }
      message += `   • Subtotal: ${formatRupiah(item.unitPrice * item.quantity)}\n\n`;
    });

    message += `------------------------------------\n`;
    message += `*Total Estimasi Pembelian:* ${formatRupiah(totalPrice)}\n`;
    message += `*Jumlah Barang:* ${totalItems} item\n`;
    message += `*Jaminan:* 100% Garansi Resmi Distributor Tetap Aktif\n\n`;
    message += `Mohon info ketersediaan stok, opsi pengiriman packing kayu, dan nomor rekening resmi Alathea Comp. Terima kasih!`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        getWhatsAppCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
