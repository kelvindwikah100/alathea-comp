import Image from "next/image";

import logoLight from "../../../public/brand/alathea-logo.png";
import logoDark from "../../../public/brand/alathea-logo-dark.png";
import mark from "../../../public/brand/alathea-mark.png";
import markDark from "../../../public/brand/alathea-mark-dark.png";

interface BrandLogoProps {
  /** Size via height, e.g. "h-10". Width follows the logo's aspect ratio. */
  className?: string;
  priority?: boolean;
}

/** Full Alathea Comp logo: dark in light mode, white in dark mode. */
export function BrandLogo({ className = "h-10", priority }: BrandLogoProps) {
  return (
    <span className="inline-flex shrink-0">
      <Image
        src={logoLight}
        alt="Alathea Comp – Computer & Accessories Supplier"
        priority={priority}
        className={`${className} w-auto dark:hidden`}
      />
      <Image
        src={logoDark}
        alt="Alathea Comp – Computer & Accessories Supplier"
        priority={priority}
        className={`${className} w-auto hidden dark:block`}
      />
    </span>
  );
}

/** "Alc" monogram for tight spaces (mobile bars, icon tiles). */
export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className="inline-flex shrink-0">
      <Image src={mark} alt="Alathea Comp" className={`${className} object-contain dark:hidden`} />
      <Image src={markDark} alt="Alathea Comp" className={`${className} object-contain hidden dark:block`} />
    </span>
  );
}
