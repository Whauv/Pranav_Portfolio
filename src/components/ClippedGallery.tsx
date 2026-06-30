import { useCallback, useEffect, useState, type CSSProperties } from "react";

const CLIP_PATHS = [
  "polygon(25% 5%, 75% 5%, 95% 25%, 95% 75%, 75% 95%, 25% 95%, 5% 75%, 5% 25%)",
  "polygon(15% 0%, 85% 5%, 100% 50%, 80% 100%, 10% 95%, 0% 45%)",
  "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
  "polygon(50% 0%, 100% 35%, 85% 100%, 15% 100%, 0% 35%)",
  "polygon(20% 0%, 80% 8%, 100% 40%, 90% 90%, 50% 100%, 5% 80%, 0% 30%)",
  "polygon(10% 25%, 35% 0%, 75% 5%, 100% 35%, 95% 75%, 65% 100%, 20% 95%, 0% 60%)",
] as const;

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, src: "", alt: "About photo 1", caption: "Building things" },
  { id: 2, src: "", alt: "About photo 2", caption: "Designing experiences" },
  { id: 3, src: "", alt: "About photo 3", caption: "Late night coding" },
  { id: 4, src: "", alt: "About photo 4", caption: "Creative process" },
  { id: 5, src: "", alt: "About photo 5", caption: "The workspace" },
  { id: 6, src: "", alt: "About photo 6", caption: "In the zone" },
];

export function ClippedGallery() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const openPopup = useCallback((item: GalleryItem) => {
    setActiveItem(item);
    document.body.style.overflow = "hidden";
  }, []);

  const closePopup = useCallback(() => {
    setActiveItem(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => () => {
    document.body.style.overflow = "";
  }, []);

  return (
    <>
      <div className="clipped-gallery">
        {GALLERY_ITEMS.map((item, i) => (
          <button
            key={item.id}
            className="clipped-gallery-item"
            onClick={() => openPopup(item)}
            data-cursor="hover"
            aria-label={`View: ${item.alt}`}
            style={{ "--clip": CLIP_PATHS[i % CLIP_PATHS.length] } as CSSProperties}
          >
            <div className="clipped-gallery-media">
              {item.src ? (
                <img src={item.src} alt={item.alt} loading="lazy" />
              ) : (
                <div className="clipped-gallery-placeholder">
                  <span className="placeholder-icon">🖼</span>
                  <span className="placeholder-num">{String(i + 1).padStart(2, "0")}</span>
                </div>
              )}
            </div>
            {item.caption ? <span className="clipped-gallery-caption">{item.caption}</span> : null}
          </button>
        ))}
      </div>

      {activeItem ? (
        <div
          className="clipped-popup-backdrop"
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.alt}
        >
          <div className="clipped-popup-content" onClick={(e) => e.stopPropagation()}>
            {activeItem.src ? (
              <img src={activeItem.src} alt={activeItem.alt} className="clipped-popup-img" />
            ) : (
              <div className="clipped-popup-placeholder">
                <span>🖼</span>
                <p>Image placeholder</p>
              </div>
            )}
            {activeItem.caption ? <p className="clipped-popup-caption">{activeItem.caption}</p> : null}
            <button
              className="clipped-popup-close"
              onClick={closePopup}
              aria-label="Close"
              data-cursor="hover"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
