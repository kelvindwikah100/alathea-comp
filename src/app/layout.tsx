import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CompareProvider } from "@/context/compare-context";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

export const metadata: Metadata = {
  title: {
    default: "Alathea Comp — Katalog Komputer, Laptop & Rakit PC Modern",
    template: "%s | Alathea Comp",
  },
  description:
    "Katalog modern perangkat keras komputer, laptop gaming, komponen PC rakitan, monitor, dan aksesoris IT berkualitas tinggi dengan konsultasi WhatsApp langsung.",
  keywords: [
    "Alathea Comp",
    "katalog komputer",
    "laptop gaming",
    "rakit PC",
    "komponen PC",
    "GPU",
    "prosesor",
    "monitor gaming",
    "hardware IT",
  ],
  authors: [{ name: "Alathea Comp" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://alatheacomp.id",
    siteName: "Alathea Comp",
    title: "Alathea Comp — Katalog Komputer, Laptop & Rakit PC Modern",
    description:
      "Katalog modern perangkat keras komputer, laptop, komponen PC, dan aksesoris IT berkualitas tinggi dengan konsultasi WhatsApp langsung.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alathea Comp — Katalog Komputer, Laptop & Rakit PC Modern",
    description:
      "Katalog modern perangkat keras komputer, laptop, komponen PC, dan aksesoris IT berkualitas tinggi.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className="h-full antialiased font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <CompareProvider>
              <CartProvider>
                {children}
                <CartDrawer />
                <Toaster position="top-right" richColors />
              </CartProvider>
            </CompareProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
