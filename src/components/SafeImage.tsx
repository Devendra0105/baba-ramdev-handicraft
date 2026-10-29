import { useState, type ImgHTMLAttributes } from "react";
import fallback from "@/assets/silver_sword.jpg";

/** <img> that swaps to a brand fallback image if the source fails to load. */
export function SafeImage({ src, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  return <img {...rest} src={failed ? fallback : src} onError={() => setFailed(true)} />;
}
