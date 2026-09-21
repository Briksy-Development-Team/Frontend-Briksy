import { List, Play, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface GalleryImage { id?: string; src?: string; type?: 'image' | 'video'; videoSrc?: string; }
type GalleryImageInput = GalleryImage | string;
const PLACEHOLDER_COLORS = ['#c8cfc4', '#b8c4b4', '#d0cdc0', '#c4cfc9', '#cbc4af'];

export const PropertyGallery = ({ images = [] }: { images?: GalleryImageInput[] }) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const galleryImages = useMemo(() => images.map((image) => typeof image === 'string' ? { src: image } : image)
    .filter((image, index, all) => image.src && all.findIndex((candidate) => candidate.id ? candidate.id === image.id : candidate.src === image.src) === index), [images]);

  useEffect(() => {
    if (!galleryOpen && activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [galleryOpen, activeIndex]);

  useEffect(() => {
    if (!galleryOpen && activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setActiveIndex(null); setGalleryOpen(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [galleryOpen, activeIndex]);

  if (!galleryImages.length) return <div className="rounded-2xl border border-[#EBE5D9] bg-[#faf9f5] px-6 py-16 text-center text-primary-brown">No images or videos uploaded.</div>;

  const openMedia = (index: number) => { setGalleryOpen(false); setActiveIndex(index); };
  const hero = galleryImages[0];
  const tiles = [galleryImages[1], galleryImages[2], galleryImages[3], galleryImages[4]];
  const photoCount = galleryImages.filter((image) => image.type !== 'video').length;
  const activeMedia = activeIndex === null ? null : galleryImages[activeIndex];
  const MediaPreview = ({ media, className = '' }: { media: GalleryImage; className?: string }) => media.type === 'video'
    ? <video src={media.videoSrc ?? media.src} className={className} controls playsInline preload="metadata" />
    : <img src={media.src} className={className} alt="Property media" />;

  return <>
    <div className="flex gap-2 h-[480px] rounded-2xl">
      <button type="button" aria-label="Open property media" className="flex-1 min-w-0 h-full rounded-xl overflow-hidden relative cursor-pointer text-left" style={{ backgroundColor: PLACEHOLDER_COLORS[0] }} onClick={() => openMedia(0)}>
        <MediaPreview media={hero} className="w-full h-full object-cover" />
        {hero.type === 'video' && <span className="absolute inset-0 flex items-center justify-center"><span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90"><Play size={20} className="text-primary-brown ml-0.5" fill="currentColor" /></span></span>}
      </button>
      <div className="hidden md:flex flex-wrap gap-2 content-start w-[488px]">
        {tiles.map((tile, idx) => tile && <button type="button" key={tile.id ?? tile.src ?? idx} aria-label={`Open property ${tile.type === 'video' ? 'video' : 'image'}`} className="relative w-[240px] h-[236px] rounded-xl overflow-hidden cursor-pointer text-left" style={{ backgroundColor: PLACEHOLDER_COLORS[idx + 1] }} onClick={() => idx === tiles.length - 1 ? setGalleryOpen(true) : openMedia(idx + 1)}>
          <MediaPreview media={tile} className="w-full h-full object-cover" />
          {tile.type === 'video' && <span className="absolute inset-0 flex items-center justify-center"><span className="flex items-center justify-center w-[45px] h-[45px] rounded-full bg-white/90 shadow-sm"><Play size={20} className="text-primary-brown ml-0.5" fill="currentColor" /></span></span>}
          {idx === tiles.length - 1 && <span className="absolute bottom-4 right-4 bg-white shadow-sm rounded-lg px-3.5 py-2.5 text-[14px] font-medium text-primary-brown flex items-center gap-1.5"><List size={24} /> All photos</span>}
        </button>)}
      </div>
    </div>
    <button type="button" className="mt-3 md:hidden inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-primary-brown shadow-sm" onClick={() => setGalleryOpen(true)}><List size={18} /> All photos</button>
    {galleryImages.length < 5 && <button type="button" className="mt-3 hidden md:inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-primary-brown shadow-sm" onClick={() => setGalleryOpen(true)}><List size={18} /> All photos</button>}

    {galleryOpen && <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-6" onClick={() => setGalleryOpen(false)}>
      <div className="w-full max-w-5xl h-[92vh] max-h-[92vh] bg-white rounded-2xl overflow-hidden flex flex-col" onClick={(event) => event.stopPropagation()}>
        <div className="px-5 py-4 border-b border-[#EBE5D9] flex items-center justify-between shrink-0"><h3 className="text-[1.125rem] font-bold text-primary-brown">All media · {photoCount} photos, {galleryImages.length - photoCount} videos</h3><button type="button" aria-label="Close" className="w-9 h-9 flex items-center justify-center text-primary-brown hover:bg-[#f5f1eb] rounded-full" onClick={() => setGalleryOpen(false)}><X size={22} /></button></div>
        <div className="flex-1 min-h-0 overflow-y-scroll overscroll-contain p-5" style={{ scrollbarWidth: "thin", scrollbarColor: "#8B6F54 #F1ECE4" }}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {galleryImages.map((media, index) => <button type="button" key={media.id ?? media.src ?? index} aria-label={`Open ${media.type === 'video' ? 'video' : 'image'} ${index + 1}`} className="aspect-square rounded-xl overflow-hidden relative text-left" style={{ backgroundColor: PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length] }} onClick={() => openMedia(index)}><MediaPreview media={media} className="w-full h-full object-cover" />{media.type === 'video' && <span className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90"><Play size={16} className="text-primary-brown ml-0.5" fill="currentColor" /></span></span>}</button>)}
          </div>
          <p className="mt-4 text-center text-xs text-primary-light-brown">Scroll to view all media</p>
        </div>
      </div>
    </div>}

    {activeMedia && <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4" onClick={() => setActiveIndex(null)}><button type="button" aria-label="Close" className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full" onClick={() => setActiveIndex(null)}><X size={24} /></button><div className="max-w-6xl max-h-[90vh] w-full flex items-center justify-center" onClick={(event) => event.stopPropagation()}><MediaPreview media={activeMedia} className="max-w-full max-h-[85vh] rounded-xl object-contain" /></div></div>}
  </>;
};
