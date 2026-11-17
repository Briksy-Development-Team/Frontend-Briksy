import { useEffect, useRef, useState } from "react";
import type { GallerySectionConfig } from "../../core/DetailTypes";
import "./GalleryWidget.css";

type MediaTab = "photos" | "videos" | "floorplans";
type Props<T> = { config: GallerySectionConfig<T>; data: T };

const toUrls = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item : (item as { url?: string })?.url))
      .filter((u): u is string => Boolean(u));
  }
  if (typeof value === "string") return [value];
  const url = (value as { url?: string } | null | undefined)?.url;
  return url ? [url] : [];
};

export default function GalleryWidget<T>({ config, data }: Props<T>) {
  const raw =
    typeof config.imagesAccessor === "function"
      ? config.imagesAccessor(data)
      : (data[config.imagesAccessor as keyof T] as unknown);
  const items = toUrls(raw);
  const isVideo = config.mediaType === "video";

  const record = data as Record<string, unknown>;
  const photos = isVideo ? toUrls(record?.images) : items;
  const videos = isVideo ? items : toUrls(record?.videos);
  const floorPlans = toUrls(record?.floorplan ?? record?.floor_plans ?? record?.floorplans);
  const hasFloorPlanField = Boolean(record && ("floorplan" in record || floorPlans.length > 0));

  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<MediaTab>(isVideo ? "videos" : "photos");
  const [activeIdx, setActiveIdx] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const tabItems = tab === "photos" ? photos : tab === "videos" ? videos : floorPlans;
  const currentUrl = tabItems[activeIdx] ?? tabItems[0] ?? null;

  // Safari fallback for <dialog closedby="any">
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;
    const onClick = (e: MouseEvent) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        dialog.close();
      }
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, []);

  const pauseOtherVideos = (keepIdx: number) => {
    stageRef.current?.querySelectorAll("video").forEach((v, i) => {
      if (i !== keepIdx) v.pause();
    });
  };

  const scrollToSlide = (idx: number, smooth = true) => {
    const clamped = Math.max(0, Math.min(idx, tabItems.length - 1));
    setActiveIdx(clamped);
    pauseOtherVideos(clamped);
    const slide = stageRef.current?.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "start", block: "nearest" });
  };

  const handleStageScroll = () => {
    const stage = stageRef.current;
    const first = stage?.children[0] as HTMLElement | undefined;
    if (!stage || !first || tabItems.length < 2) return;
    const step = first.offsetWidth + 16;
    const idx = Math.max(0, Math.min(tabItems.length - 1, Math.round(stage.scrollLeft / step)));
    if (idx !== activeIdx) {
      setActiveIdx(idx);
      pauseOtherVideos(idx);
    }
  };

  const openModal = (idx: number) => {
    setTab(isVideo ? "videos" : "photos");
    setActiveIdx(idx);
    setIsOpen(true);
    if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
    requestAnimationFrame(() => scrollToSlide(idx, false));
  };

  const switchTab = (next: MediaTab) => {
    setTab(next);
    setActiveIdx(0);
    if (stageRef.current) stageRef.current.scrollLeft = 0;
  };

  const tabs: Array<{ id: MediaTab; label: string; count: number; icon: JSX.Element }> = [
    {
      id: "photos",
      label: "Photos",
      count: photos.length,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m21 16-5-5L5 20" />
        </svg>
      ),
    },
    {
      id: "videos",
      label: "Videos",
      count: videos.length,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="2" y="6" width="14" height="12" rx="2" />
          <path d="m16 10 6-3v10l-6-3" />
        </svg>
      ),
    },
    ...(hasFloorPlanField
      ? [
          {
            id: "floorplans" as const,
            label: "Floor Plans",
            count: floorPlans.length,
            icon: (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 12h10M13 3v18M13 15h8" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold text-gray-900">{config.title}</span>
        </h3>
      </div>
      <div className="card-body pt-4 pb-6">
        {items.length === 0 ? (
          <div className="text-center text-muted py-4">No {isVideo ? "videos" : "images"} available.</div>
        ) : (
          <div className="row g-5">
            {items.map((url, idx) => (
              <div key={`${url}-${idx}`} className="col-4 col-md-3 col-xl-2">
                <button
                  type="button"
                  onClick={() => openModal(idx)}
                  aria-label={`Open ${isVideo ? "video" : "image"} ${idx + 1}`}
                  className="gm-grid-thumb"
                >
                  {isVideo ? (
                    <>
                      <video src={url} preload="metadata" muted playsInline />
                      <span className="gm-play-badge" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>
                      </span>
                    </>
                  ) : (
                    <img src={url} alt={`${config.title} ${idx + 1}`} loading="lazy" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        className="gm-dialog"
        aria-label={config.title}
        onClose={() => {
          if (dialogRef.current) dialogRef.current.returnValue = "";
          setIsOpen(false);
        }}
        onKeyDown={(e) => {
          if (tabItems.length < 2) return;
          if (e.key === "ArrowRight") { e.preventDefault(); scrollToSlide(activeIdx + 1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); scrollToSlide(activeIdx - 1); }
        }}
        {...({ closedby: "any" } as Record<string, string>)}
      >
        <div className="gm-header">
          <form method="dialog" className="m-0">
            <button type="submit" autoFocus className="gm-icon-btn" aria-label="Back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          </form>

          <div className="gm-tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => switchTab(t.id)}
                className={`gm-tab ${tab === t.id ? "gm-tab--active" : ""}`}
              >
                {t.icon}
                <span>{t.label}</span>
                {tab === t.id && <span className="gm-count">{t.count}</span>}
              </button>
            ))}
          </div>

          <div className="d-flex justify-content-end">
            {currentUrl && (
              <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="gm-icon-btn" aria-label="Open media in new tab" title="Open in new tab">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {isOpen &&
          (tabItems.length === 0 ? (
            <div className="gm-empty">
              No {tab === "floorplans" ? "floor plans" : tab} available.
            </div>
          ) : (
            <>
              <div ref={stageRef} className="gm-stage" onScroll={handleStageScroll}>
                {tabItems.map((url, idx) => (
                  <div
                    key={`${tab}-${url}-${idx}`}
                    className={`gm-slide ${tabItems.length === 1 ? "gm-slide--single" : ""} ${idx !== activeIdx ? "gm-slide--peek" : ""} ${tab === "floorplans" ? "gm-slide--contain" : ""}`}
                    onClick={() => idx !== activeIdx && scrollToSlide(idx)}
                  >
                    {tab === "videos" ? (
                      <video src={url} controls playsInline autoPlay={idx === activeIdx} />
                    ) : (
                      <img src={url} alt={`${tab} ${idx + 1}`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="gm-thumbs">
                {tabItems.map((url, idx) => (
                  <button
                    key={`thumb-${tab}-${url}-${idx}`}
                    type="button"
                    onClick={() => scrollToSlide(idx)}
                    className={`gm-thumb ${idx === activeIdx ? "gm-thumb--active" : ""}`}
                    aria-label={`Select item ${idx + 1}`}
                  >
                    {tab === "videos" ? (
                      <video src={url} preload="metadata" muted playsInline />
                    ) : (
                      <img src={url} alt="" />
                    )}
                  </button>
                ))}
              </div>
            </>
          ))}
      </dialog>
    </div>
  );
}
