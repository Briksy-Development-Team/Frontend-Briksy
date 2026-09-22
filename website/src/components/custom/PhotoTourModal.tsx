import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Share, Heart, Play } from 'lucide-react';
import ModalWrapper from '../wrapper/ModalWrapper';

interface GalleryImage {
  id?: string;
  src?: string;
  type?: 'image' | 'video';
  videoSrc?: string;
  videoUrl?: string;
}

type Media = GalleryImage;

export function PhotoTourModal({
  media = [],
  initialIndex = 0,
  onClose,
  title = "Photo tour",
  subtitle = "Our Property Glims",
}: {
  media?: Media[];
  initialIndex?: number;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}) {
  const [active, setActive] = useState(initialIndex);
  const listRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const list = listRef.current!;
    const strip = stripRef.current!;

    // open on the photo that was clicked
    list.children[initialIndex]?.scrollIntoView({ block: 'start' });


    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = Number((e.target as HTMLElement).dataset.index);
        setActive(i);
        strip.children[i]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      }),
      { root: list, rootMargin: '-50% 0px -50% 0px' }
    );
    Array.from(list.children).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [media, initialIndex]);

  const goTo = (i: number) =>
    listRef.current?.children[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <ModalWrapper isOpen>
      <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
        <div
          className="w-full max-w-7xl h-full bg-[#F5F1EB]    overflow-hidden flex flex-col font-helvetica shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative px-6 py-5 flex items-center justify-between shrink-0 border-b border-[#EBE5D9]/50">
            <button type="button" aria-label="Close" onClick={onClose} className="w-10 h-10 flex items-center justify-center text-primary-brown hover:bg-black/5 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <h3 className="absolute left-1/2 -translate-x-1/2 text-[1.125rem] font-bold text-primary-brown">{title}</h3>
            <div className="flex items-center gap-4 text-[0.875rem] font-medium text-primary-brown">
              <button className="flex items-center gap-2 hover:opacity-70"><Share size={18} /><span className="hidden sm:inline">Share</span></button>
              <button className="flex items-center gap-2 hover:opacity-70"><Heart size={18} /><span className="hidden sm:inline">Like</span></button>
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
                <img src={m.src} alt="" className="w-full h-full object-cover" />
                {m.videoUrl && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                    <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Title stays put, photos scroll up/down */}
          <div className="flex-1 min-h-0 flex gap-8 justify-between px-[3%] pt-4">
            <h2 className="hidden md:block w-1/3 shrink-0 text-[1.5rem] lg:text-[2rem] font-medium text-primary-brown leading-tight">
              {subtitle}
            </h2>

            <div ref={listRef} className=" w-[50%] overflow-y-auto overscroll-contain pb-16 flex flex-col gap-8 md:gap-12 items-center md:items-start">
              {media.map((m, i) => (
                <div key={i} data-index={i} className="w-full h-[350px]  shrink-0 rounded-[1.5rem] md:rounded-[1rem] overflow-hidden bg-black/5 shadow-sm">
                  {m.videoUrl
                    ? <video src={m.videoUrl} poster={m.src} controls playsInline preload="none" className="w-full h-full object-cover bg-black" />
                    : <img src={m.src} alt="Property media" className="w-full h-full object-cover" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}