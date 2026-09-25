import { useRef, useState } from 'react';
import { ArrowLeft, Share, Play, Pause, Volume2, VolumeX } from 'lucide-react';
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

// ── Main modal ────────────────────────────────────────────────────────────────
export function PhotoTourModal({
  media = [],
  initialIndex = 0,
  onClose,
  title = 'Photo tour',
  targetId,
  initialIsFavourite = false,
}: {
  media?: Media[];
  initialIndex?: number;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  targetId?: string | number;
  initialIsFavourite?: boolean;
}) {
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(initialIndex);

  // Thumbnail thumb size — smaller on mobile
  const thumbW = typeof window !== 'undefined' && window.innerWidth < 640 ? 76 : 110;
  const thumbH = typeof window !== 'undefined' && window.innerWidth < 640 ? 56 : 79;

  const goTo = (index: number) => {
    mainSwiper?.slideTo(index);
    setActive(index);
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
          <div className="grid grid-cols-3 items-center px-4 sm:px-6 py-3 sm:py-5 shrink-0 border-b border-black/5">
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
                className="hidden sm:flex items-center gap-2 h-10 px-1.5 rounded-lg hover:bg-black/5 transition"
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

          {/* ── Body: main viewer + thumbnails ── */}
          <div className="flex-1 min-h-0 flex flex-col px-3 sm:px-[3%] pt-3 pb-4 gap-3">

            {/* Main image/video slider */}
            {/* NOTE: Swiper slidesPerView="auto" REQUIRES inline width on slides — Tailwind responsive classes are ignored */}
            <div className="flex-1 min-h-0">
              <Swiper
                modules={[Mousewheel, Thumbs]}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                mousewheel={{ forceToAxis: true }}
                slidesPerView="auto"
                spaceBetween={12}
                initialSlide={initialIndex}
                onSwiper={setMainSwiper}
                onSlideChange={(s) => setActive(s.activeIndex)}
                className="h-full w-full"
                style={{ touchAction: 'pan-y' }}
              >
                {media.map((m, i) => (
                  <SwiperSlide
                    key={i}
                    // Must use inline style — Tailwind w-[] is ignored by Swiper's layout engine
                    style={{ width: '85%', height: '100%' }}
                  >
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
                {media.map((m, i) => (
                  <SwiperSlide
                    key={i}
                    style={{ width: thumbW, height: thumbH }}
                  >
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

          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}