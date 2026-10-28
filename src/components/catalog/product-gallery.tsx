"use client";

import React, { useState } from "react";
import Image from "@/components/ui/smart-image";
import { Package, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ProductGalleryProps {
  images?: string[];
  productName: string;
}

export function ProductGallery({ images = [], productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const validImages = images.length > 0 ? images : [];
  const currentImage = validImages[selectedIndex] || validImages[0] || null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-4 font-jakarta">
      {/* Main Image Stage */}
      <div
        onClick={() => currentImage && setIsLightboxOpen(true)}
        className="group relative aspect-square sm:aspect-[4/3] rounded-[28px] overflow-hidden cursor-zoom-in transition-all duration-300 frost-card"
      >
        <div className="absolute inset-3 rounded-[22px] bg-white dark:bg-[#18191D] border border-white dark:border-zinc-800 overflow-hidden flex items-center justify-center shadow-inner">
          {currentImage ? (
            <div
              key={selectedIndex}
              className="relative w-full h-full animate-in fade-in zoom-in-95 duration-400 ease-out"
            >
              <Image
                src={currentImage}
                alt={`${productName} view ${selectedIndex + 1}`}
                fill
                priority
                className="object-cover rounded-[18px] group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          ) : (
            <Package className="w-16 h-16 text-zinc-400" />
          )}

          {/* Zoom hint icon overlay */}
          <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4" />
          </div>

          {/* Prev/Next arrows on main image if multiple images */}
          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xs flex items-center justify-center text-[#111111] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xs flex items-center justify-center text-[#111111] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-[16px] overflow-hidden transition-all duration-300 ease-out cursor-pointer shrink-0 bg-white dark:bg-zinc-900 group ${
                selectedIndex === idx
                  ? "ring-2 ring-[#111111] dark:ring-white border-2 border-white dark:border-zinc-900 scale-100 shadow-md"
                  : "border border-zinc-200/80 dark:border-zinc-800 opacity-60 hover:opacity-100 hover:scale-105"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl p-2 bg-black/90 border-none shadow-2xl rounded-2xl overflow-hidden flex flex-col items-center justify-center">
          <DialogTitle className="sr-only">Pratinjau Foto {productName}</DialogTitle>
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[80vh] flex items-center justify-center">
            {currentImage && (
              <Image
                src={currentImage}
                alt={productName}
                fill
                className="object-contain"
                sizes="100vw"
              />
            )}
            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md cursor-pointer transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md cursor-pointer transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          <p className="text-xs text-zinc-400 py-2">
            {selectedIndex + 1} dari {validImages.length} foto • {productName}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
