"use client";

import React, { useEffect, useState } from "react";
import Image from "@/components/ui/smart-image";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/lib/services/catalog";
import { formatRupiah } from "@/lib/utils";
import { Product } from "@/types/database";
import { Package, Laptop, Cpu, HardDrive, Monitor, Keyboard } from "lucide-react";

interface CommandSearchProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandSearch({ open: controlledOpen, onOpenChange }: CommandSearchProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = (val: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(val);
    } else {
      setInternalOpen(val);
    }
  };

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data || []);
    });
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    window.addEventListener("keydown", down);
    window.addEventListener("alathea-open-command-search", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("alathea-open-command-search", handleCustomOpen);
    };
  }, [isOpen, isControlled]);

  const handleSelectProduct = (slug: string) => {
    setOpen(false);
    router.push(`/products/${slug}`);
  };

  const getCategoryIcon = (slug?: string) => {
    switch (slug) {
      case "laptop":
        return <Laptop className="w-3.5 h-3.5 text-[#111111] dark:text-zinc-200" />;
      case "pc-rakitan":
        return <Cpu className="w-3.5 h-3.5 text-[#111111] dark:text-zinc-200" />;
      case "komponen-pc":
        return <HardDrive className="w-3.5 h-3.5 text-[#111111] dark:text-zinc-200" />;
      case "monitor":
        return <Monitor className="w-3.5 h-3.5 text-[#111111] dark:text-zinc-200" />;
      case "aksesoris":
        return <Keyboard className="w-3.5 h-3.5 text-[#111111] dark:text-zinc-200" />;
      default:
        return <Package className="w-3.5 h-3.5 text-[#111111] dark:text-zinc-200" />;
    }
  };

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setOpen}
      title="Cari Katalog Hardware"
      description="Cari laptop, processor, GPU, monitor, atau PC rakitan..."
      className="glass-panel max-w-2xl rounded-[28px]! border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden p-2 font-jakarta"
    >
      <CommandInput
        placeholder="Ketik nama produk, brand (ASUS, Corsair, AMD), atau SKU..."
        className="font-jakarta text-sm h-11"
      />
      <CommandList className="max-h-[380px] p-2 overflow-y-auto font-jakarta">
        <CommandEmpty className="py-8 text-center text-sm text-[#676B74] dark:text-zinc-400">
          <Package className="w-8 h-8 mx-auto mb-2 text-[#8D939E] dark:text-zinc-500" />
          Tidak ada produk yang cocok dengan pencarian.
        </CommandEmpty>

        <CommandGroup heading="Produk Hardware Tersedia">
          {products.map((p) => {
            const price = p.discount_price || p.price;
            return (
              <CommandItem
                key={p.id}
                value={`${p.name} ${p.brand} ${p.sku} ${p.category?.name || ""}`}
                onSelect={() => handleSelectProduct(p.slug)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors group mb-1.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-700/60 shrink-0 overflow-hidden relative flex items-center justify-center">
                    {p.images?.[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      getCategoryIcon(p.category?.slug)
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-bold text-[#141414] dark:text-zinc-300">
                        {p.brand}
                      </span>
                      <span className="text-[10px] font-mono text-[#8D939E] dark:text-zinc-400">
                        {p.sku}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 h-4 bg-zinc-100 dark:bg-zinc-800 text-[#141414] dark:text-zinc-300 border-none"
                      >
                        {p.stock_status === "available"
                          ? "Ready"
                          : p.stock_status === "pre_order"
                          ? "PO"
                          : "Habis"}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-[#111111] dark:text-white truncate max-w-[280px] sm:max-w-[360px]">
                      {p.name}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span className="font-mono text-xs font-bold text-[#111111] dark:text-white block">
                    {formatRupiah(price)}
                  </span>
                  {p.discount_price && (
                    <span className="font-mono text-[10px] text-[#8D939E] line-through block">
                      {formatRupiah(p.price)}
                    </span>
                  )}
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function openCommandSearch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("alathea-open-command-search"));
  }
}
