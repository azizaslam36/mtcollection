"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];
  const isExternal = activeImage?.startsWith("http");

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-mist">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={title}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            unoptimized={isExternal}
            className="object-cover"
            priority
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2">
          {images.map((img, index) => {
            const thumbExternal = img.startsWith("http");
            return (
              <button
                key={img + index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-pressed={index === activeIndex}
                className={cn(
                  "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-tag border-2 bg-mist transition-colors",
                  index === activeIndex ? "border-marigold" : "border-transparent"
                )}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="64px"
                  unoptimized={thumbExternal}
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
