import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PortfolioImage } from "@/lib/portfolio";

export function GalleryLightbox({ images }: { images: PortfolioImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const close = () => setActive(null);
  const step = (delta: number) => setActive((current) => current === null ? null : (current + delta + images.length) % images.length);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [active, images.length]);

  return (
    <>
      <div className="masonry-gallery">
        {images.map((image, index) => (
          <button className="gallery-item" key={image.src} onClick={() => setActive(index)} aria-label={`Open image ${index + 1} of ${images.length}`}>
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading={index < 2 ? "eager" : "lazy"} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
          </button>
        ))}
      </div>
      {active !== null && images[active] ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Artwork viewer" onClick={close}>
          <Button variant="ghost" size="icon" className="lightbox-close" onClick={close} aria-label="Close viewer"><X /></Button>
          <Button variant="ghost" size="icon" className="lightbox-prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous image"><ChevronLeft /></Button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={images[active].src} alt={images[active].alt} width={images[active].width} height={images[active].height} />
            <figcaption>{active + 1} / {images.length}</figcaption>
          </figure>
          <Button variant="ghost" size="icon" className="lightbox-next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next image"><ChevronRight /></Button>
        </div>
      ) : null}
    </>
  );
}
