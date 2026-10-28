import NextImage, { type ImageProps } from "next/image";

// Keep in sync with images.remotePatterns in next.config.ts.
const OPTIMIZED_HOSTS = [/^images\.unsplash\.com$/, /\.supabase\.co$/];

/**
 * True when Next can optimize this src: local paths and the hosts allowed in
 * next.config.ts. Anything else (data: URLs, links pasted by admins from other
 * sites) is loaded by the browser as-is, so an unknown host never crashes the page.
 */
export function canOptimizeImage(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return true; // static import
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZED_HOSTS.some((re) => re.test(url.hostname));
  } catch {
    return false;
  }
}

/** Drop-in replacement for next/image that accepts images from any host. */
export default function Image({ unoptimized, ...props }: ImageProps) {
  return <NextImage {...props} unoptimized={unoptimized ?? !canOptimizeImage(props.src)} />;
}
