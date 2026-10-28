"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Product } from "@/types/database";

const COMPARE_STORAGE_KEY = "alathea_compare_products";
const MAX_COMPARE_LIMIT = 3;

interface CompareContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved compare list from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareProducts(parsed.slice(0, MAX_COMPARE_LIMIT));
        }
      }
    } catch (e) {
      console.warn("Failed to read compare list from localStorage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync state to localStorage whenever changed
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareProducts));
    } catch (e) {
      console.warn("Failed to persist compare list to localStorage:", e);
    }
  }, [compareProducts, isInitialized]);

  const isInCompare = (productId: string) => {
    return compareProducts.some((p) => p.id === productId);
  };

  const addToCompare = (product: Product): boolean => {
    if (isInCompare(product.id)) {
      toast.info(`"${product.name}" sudah ada dalam daftar perbandingan`);
      return false;
    }

    if (compareProducts.length >= MAX_COMPARE_LIMIT) {
      toast.warning("Maksimal 3 produk untuk dibandingkan sekaligus. Hapus salah satu produk terlebih dahulu.");
      return false;
    }

    const next = [...compareProducts, product];
    setCompareProducts(next);
    toast.success(`"${product.name}" ditambahkan ke perbandingan (${next.length}/3)`);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    const match = compareProducts.find((p) => p.id === productId);
    const next = compareProducts.filter((p) => p.id !== productId);
    setCompareProducts(next);
    if (match) {
      toast.info(`"${match.name}" dihapus dari perbandingan`);
    }
  };

  const clearCompare = () => {
    if (compareProducts.length === 0) return;
    setCompareProducts([]);
    toast.info("Daftar perbandingan telah dikosongkan");
  };

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
