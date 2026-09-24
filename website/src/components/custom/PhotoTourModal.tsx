import { useRef, useState } from 'react';
import { ChevronLeft, Share, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Mousewheel } from 'swiper/modules';
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
const getVideoSrc = (m: Media) => m.videoUrl ?? m.videoSrc ?? '';

// ── Video player card ─────────────────────────────────────────────────────────
function VideoCard({ m }: { m: Media }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = ref.current;
    if (!vid) return;
    if (vid.paused) { vid.play(); setPlaying(true); }
    else { vid.pause(); setPlaying(false); }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = ref.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  };

  return (
    <div className="relative w-full h-full bg-black group" onClick={toggle}>
      <video
        ref={ref}
        src={getVideoSrc(m)}
        poster={m.src}
        playsInline
        preload="metadata"
        onEnded={() => setPlaying(false)}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Central play/pause overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}>
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
          {playing
            ? <Pause size={28} className="text-white" fill="currentColor" />
            : <Play size={28} className="text-white ml-1" fill="currentColor" />}
        </span>
      </div>

      {/* Mute button corner */}
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
  subtitle = 'Our Property Glims',
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
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <ModalWrapper isOpen>
      <div
        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <div
          className="w-full max-w-7xl h-full bg-[#F5F1EB] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Header ── */}
          <div className="relative px-6 py-5 flex items-center justify-between shrink-0 border-b border-[#EBE5D9]/50">
            <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center text-primary-brown hover:bg-black/5 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <h3 className="absolute left-1/2 -translate-x-1/2 text-[1.125rem] font-bold text-primary-brown">{title}</h3>
            <div className="flex items-center gap-4 text-primary-brown text-[0.875rem] font-medium">
              <button type="button" className="flex items-center gap-2 hover:opacity-70 transition">
                <Share size={18} /> Share
              </button>
              <FavoriteButton
                variant="inline"
                showText={true}
                iconSize={18}
                className="hover:opacity-70 transition text-primary-brown"
                targetId={targetId}
                targetType="property"
                initialIsFavourite={initialIsFavourite}
              />
            </div>
          </div>

          {/* Horizontal thumbnails (scrolls left/right) */}
          <div ref={stripRef} className="flex gap-4 overflow-x-auto px-[3%] pt-4 pb-6 shrink-0">
            {media.map((m, i) => (
              <button
                type="button"
                key={i}
                aria-label={`Go to ${m.videoUrl ? 'video' : 'photo'} ${i + 1}`}
                onClick={() => goTo(i)}
                className={`relative w-[100px] h-[100px] shrink-0 rounded-[1rem] overflow-hidden border-[3px] transition-all ${active === i ? 'border-primary-brown shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
              >
                {m.videoUrl ? <video src={m.videoUrl} muted playsInline preload="metadata" className="w-full h-full object-cover" /> : <img src={m.src} alt="" className="w-full h-full object-cover" />}
                {m.videoUrl && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                    <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Main viewer (Swiper — vertical, drag/touch/mousewheel) ── */}
          <div className="flex-1 min-h-0 flex gap-8 justify-between px-[3%] pt-2 overflow-hidden">
            <h2 className="hidden md:block w-1/3 shrink-0 text-[1.5rem] lg:text-[2rem] font-medium text-primary-brown leading-tight pt-2">
              {subtitle}
            </h2>

            <div className="flex-1 md:flex-none md:w-[55%] min-h-0 pb-2">
              <Swiper
                modules={[Thumbs, Mousewheel, FreeMode]}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                direction="vertical"
                mousewheel
                freeMode
                initialSlide={initialIndex}
                spaceBetween={24}
                slidesPerView="auto"
                className="h-full"
              >
                {media.map((m, i) => (
                  <SwiperSlide key={i} style={{ height: 'auto' }}>
                    <div className="w-full h-[320px] md:h-[380px] rounded-[1.25rem] overflow-hidden bg-black/5 shadow-sm">
                      {isVideo(m)
                        ? <VideoCard m={m} />
                        : <img src={m.src} alt="Property media" className="w-full h-full object-cover" />}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .thumbs-swiper .swiper-slide {
          opacity: 0.55;
          transition: opacity 0.2s;
        }

        .thumbs-swiper .swiper-slide-thumb-active {
          opacity: 1;
        }
      `}</style>
    </ModalWrapper>
  );
}