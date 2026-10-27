"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { Film } from "../types";
export function FilmPlayer({ film, title }: { film: Film; title: string }) {
  const [open, setOpen] = useState(false);
  const valid =
    film.provider === "local"
      ? film.source.startsWith("/videos/") && !film.source.includes("..")
      : /^[a-zA-Z0-9_-]+$/.test(film.source);
  if (!valid) return <p>Film unavailable.</p>;
  const src =
    film.provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${film.source}?autoplay=1`
      : `https://player.vimeo.com/video/${film.source}?autoplay=1`;
  return (
    <>
      <button className="button button-secondary" onClick={() => setOpen(true)}>
        <Play size={16} />
        Watch {title}
      </button>
      {open && (
        <Modal title={title} onClose={() => setOpen(false)}>
          {film.provider === "local" ? (
            <video
              className="video-frame"
              src={film.source}
              controls
              autoPlay
              playsInline
              aria-label={title}
            />
          ) : (
            <iframe
              className="video-frame"
              src={src}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </Modal>
      )}
    </>
  );
}
