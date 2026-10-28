import type { Metadata } from "next";
import { AboutContent } from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "Tentang Alathea Comp",
  description:
    "Pusat katalog laptop resmi, MacBook, dan perangkat hardware terkurasi dengan garansi resmi serta layanan Custom Upgrade profesional.",
};

export default function TentangPage() {
  return <AboutContent />;
}
