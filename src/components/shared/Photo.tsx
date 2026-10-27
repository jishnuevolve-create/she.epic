"use client";
import Image from "next/image";
import { useState } from "react";
export function Photo({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 700px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="photo-fallback" role="img" aria-label={alt}>
      Photograph unavailable
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
