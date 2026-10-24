import { useRef, useState } from 'react';
import { ArrowLeft, Share, Play, Pause, Volume2, VolumeX, ImageIcon, Video, LayoutTemplate } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

import ModalWrapper from '../wrapper/ModalWrapper';
import FavoriteButton from './FavoriteButton';

interface GalleryImage {
  id?: string;
  src?: string;
  type?: 'image' | 'video';
  videoSrc?: string;
  videoUrl?: string;
}

export type Media = GalleryImage;

type Tab = 'photos' | 'videos' | 'floorplans';

const isVideo = (m: Media) => !!(m.videoUrl || m.videoSrc || m.type === 'video');

const getVideoSrc = (m: Media) => {
  const url = m.videoUrl ?? m.videoSrc ?? '';
  return url ? `${url}#t=0.1` : url;
};

// ── Video player card ─────────────────────────────────────────────────────────
function VideoCard({ m }: { m: Media }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = ref.current;
    if (!video) return;
    if (video.paused) { video.play(); setPlaying(true); }
    else { video.pause(); setPlaying(false); }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="relative w-full h-full bg-black group" onClick={toggle}>
      <video
        ref={ref}
        src={getVideoSrc(m)}
        poster={m.src}
        playsInline
        preload="metadata"
        draggable={false}
        onEnded={() => setPlaying(false)}
        className="w-full h-full object-cover cursor-pointer"
      />

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
          playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
          {playing
            ? <Pause size={28} className="text-white" fill="currentColor" />
            : <Play size={28} className="text-white ml-1" fill="currentColor" />
          }
        </span>
      </div>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="absolute bottom-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition z-10"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}

// ── Not available state ───────────────────────────────────────────────────────
function NotAvailable({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-primary-brown/40 select-none">
      <span className="text-4xl font-light">—</span>
      <span className="text-sm font-medium">{label} not available</span>
    </div>
  );
}

// ── Media viewer (swiper + thumbs) ────────────────────────────────────────────
function MediaViewer({ items }: { items: Media[] }) {
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(0);

  const thumbW = typeof window !== 'undefined' && window.innerWidth < 640 ? 76 : 110;
  const thumbH = typeof window !== 'undefined' && window.innerWidth < 640 ? 56 : 79;

  const goTo = (index: number) => {
    mainSwiper?.slideTo(index);
    setActive(index);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* Main slider */}
      <div className="flex-1 min-h-0">
        <Swiper
          modules={[Mousewheel, Thumbs]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          mousewheel={{ forceToAxis: true }}
          slidesPerView="auto"
          spaceBetween={12}
          initialSlide={0}
          onSwiper={setMainSwiper}
          onSlideChange={(s) => setActive(s.activeIndex)}
          className="h-full w-full"
          style={{ touchAction: 'pan-y' }}
        >
          {items.map((m, i) => (
            <SwiperSlide key={i} style={{ width: '85%', height: '100%' }}>
              <div className="w-full h-full rounded-xl sm:rounded-[1.25rem] overflow-hidden bg-black/5 shadow-sm">
                {isVideo(m)
                  ? <VideoCard m={m} />
                  : <img src={m.src} alt="Property media" draggable={false} className="w-full h-full object-cover" />
                }
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div className="shrink-0">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Mousewheel, Thumbs]}
            freeMode
            watchSlidesProgress
            mousewheel={{ forceToAxis: true }}
            slidesPerView="auto"
            spaceBetween={8}
          >
            {items.map((m, i) => (
              <SwiperSlide key={i} style={{ width: thumbW, height: thumbH }}>
                <button
                  type="button"
                  aria-label={`Go to ${isVideo(m) ? 'video' : 'photo'} ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`relative w-full h-full rounded-md overflow-hidden border-2 transition-colors ${
                    active === i ? 'border-primary-brown' : 'border-transparent'
                  }`}
                >
                  {isVideo(m) ? (
                    <video
                      src={getVideoSrc(m)}
                      muted
                      playsInline
                      preload="metadata"
                      draggable={false}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={m.src} alt="" draggable={false} className="w-full h-full object-cover" />
                  )}

                  {active !== i && (
                    <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                  )}

                  {isVideo(m) && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                    </span>
                  )}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

// ── Floorplan viewer ──────────────────────────────────────────────────────────
function FloorplanViewer({ src }: { src: string }) {
  return (
    <div className="flex-1 min-h-0 flex items-center justify-center">
      <div className="w-full h-full rounded-xl sm:rounded-[1.25rem] overflow-hidden bg-[#F8F4EE]">
        <img src={src} alt="Floor plan" draggable={false} className="w-full h-full object-contain" />
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export function PhotoTourModal({
  // New tabbed props
  photos,
  videos,
  floorplan,
  // Legacy fallback (ServiceDetails uses this)
  media,
  initialIndex = 0,
  onClose,
  title = 'Photo tour',
  targetId,
  initialIsFavourite = false,
}: {
  photos?: Media[];
  videos?: Media[];
  floorplan?: string | null;
  /** @deprecated pass photos/videos/floorplan instead */
  media?: Media[];
  initialIndex?: number;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  targetId?: string | number;
  initialIsFavourite?: boolean;
}) {
  // If the new tabbed props aren't provided, fall back to the legacy media array
  const useLegacy = !photos && !videos && !floorplan;
  const resolvedPhotos = useLegacy
    ? (media ?? []).filter((m) => !isVideo(m))
    : (photos ?? []);
  const resolvedVideos = useLegacy
    ? (media ?? []).filter((m) => isVideo(m))
    : (videos ?? []);
  const resolvedFloorplan = floorplan ?? null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'photos', label: 'Photos', icon: <ImageIcon size={15} />, count: resolvedPhotos.length },
    { id: 'videos', label: 'Videos', icon: <Video size={15} />, count: resolvedVideos.length },
    { id: 'floorplans', label: 'Floor Plans', icon: <LayoutTemplate size={15} />, count: resolvedFloorplan ? 1 : 0 },
  ];

  // Default to the first tab that has content, or 'photos'
  const defaultTab: Tab = (() => {
    if (resolvedPhotos.length > 0) return 'photos';
    if (resolvedVideos.length > 0) return 'videos';
    return 'photos';
  })();

  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  const handleShare = async () => {
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <ModalWrapper isOpen>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-2 sm:p-4 lg:p-6"
        onClick={onClose}
      >
        {/* Modal card */}
        <div
          className="
            relative w-full max-w-7xl bg-[#F8F4EE] rounded-2xl shadow-2xl
            flex flex-col overflow-hidden
            h-[92svh] sm:h-[90svh] lg:h-[88svh]
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="grid grid-cols-3 items-center px-4 sm:px-6 py-3 sm:py-4 shrink-0 border-b border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-primary-brown hover:bg-black/5 rounded-full justify-self-start"
            >
              <ArrowLeft size={20} />
            </button>

            <h3 className="text-base sm:text-[1.125rem] font-medium text-primary-brown text-center truncate">
              {title}
            </h3>

            <div className="flex items-center gap-1 sm:gap-1.5 text-primary-brown text-sm justify-self-end">
              <button
                type="button"
                onClick={() => void handleShare()}
                aria-label="Share"
                className="flex items-center gap-2 h-10 px-1.5 rounded-lg hover:bg-black/5 transition"
              >
                <Share size={20} />
                <span className="hidden md:inline">Share</span>
              </button>

              <FavoriteButton
                variant="inline"
                showText
                iconSize={20}
                className="flex items-center gap-2 h-10 px-1.5 rounded-lg hover:bg-black/5 transition text-primary-brown"
                targetId={targetId}
                targetType="property"
                initialIsFavourite={initialIsFavourite}
              />
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="shrink-0 flex justify-center px-4 pt-3 pb-1">
            <div className="inline-flex items-center rounded-full border border-[#E7E1D8] bg-white p-1 gap-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                    activeTab === tab.id
                      ? 'bg-primary-brown text-white'
                      : 'text-primary-brown hover:bg-black/5'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count === 0 && (
                    <span className={`text-xs ${activeTab === tab.id ? 'text-white/60' : 'text-primary-brown/40'}`}>
                      —
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Body ── */}
          <div className="flex-1 min-h-0 flex flex-col px-3 sm:px-[3%] pt-3 pb-4 gap-3">
            {activeTab === 'photos' && (
              resolvedPhotos.length > 0
                ? <MediaViewer key="photos" items={resolvedPhotos} />
                : <NotAvailable label="Photos" />
            )}

            {activeTab === 'videos' && (
              resolvedVideos.length > 0
                ? <MediaViewer key="videos" items={resolvedVideos} />
                : <NotAvailable label="Videos" />
            )}

            {activeTab === 'floorplans' && (
              resolvedFloorplan
                ? <FloorplanViewer src={resolvedFloorplan} />
                : <NotAvailable label="Floor plans" />
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}