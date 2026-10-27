"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Photo } from "@/components/shared/Photo";
export function LightboxGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const touch = useRef(0);
  const move = useCallback(
    (direction: number) =>
      setIndex((current) =>
        current === null ? null : (current + direction + images.length) % images.length,
      ),
    [images.length],
  );
  useEffect(() => {
    if (index === null) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, move]);
  return (
    <>
      <div className="gallery-grid">
        {images.map((photo, i) => (
          <button
            key={photo.src + i}
            className="gallery-photo"
            aria-label={`Open photograph: ${photo.alt}`}
            onClick={() => setIndex(i)}
          >
            <Photo {...photo} />
          </button>
        ))}
      </div>
      {index !== null && (
        <Modal title="Photo gallery" onClose={() => setIndex(null)}>
          <div
            onTouchStart={(event) => (touch.current = event.touches[0].clientX)}
            onTouchEnd={(event) => {
              const delta = event.changedTouches[0].clientX - touch.current;
              if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1);
            }}
          >
            <div className="lightbox-image">
              <Photo {...images[index]} sizes="90vw" />
            </div>
            <div className="lightbox-controls">
              <button className="icon-button" aria-label="Previous photo" onClick={() => move(-1)}>
                <ChevronLeft />
              </button>
              <span aria-live="polite">
                {index + 1} / {images.length}
              </span>
              <button className="icon-button" aria-label="Next photo" onClick={() => move(1)}>
                <ChevronRight />
              </button>
            </div>
            <p>{images[index].alt}</p>
          </div>
        </Modal>
      )}
    </>
  );
}
