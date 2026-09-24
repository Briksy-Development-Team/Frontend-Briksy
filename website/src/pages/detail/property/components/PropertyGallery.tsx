import { List, Play } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PhotoTourModal, type Media } from '../../../../components/custom/PhotoTourModal';

type ImageInput = string | { src?: string; type?: 'image' | 'video'; videoSrc?: string };

const COLORS = ['#c8cfc4', '#b8c4b4', '#d0cdc0', '#c4cfc9', '#cbc4af'];

const Thumb = ({ m, size = 48 }: { m: Media; size?: number }) => (
  <>
    <img src={m.src} alt="Property media" className="w-full h-full object-cover" />
    {m.videoUrl && (
      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="flex items-center justify-center rounded-full bg-white/90 shadow-sm" style={{ width: size, height: size }}>
          <Play size={size / 2.4} className="text-primary-brown ml-0.5" fill="currentColor" />
        </span>
      </span>
    )}
  </>
);

export const PropertyGallery = ({ images = [] }: { images?: ImageInput[] }) => {
  const [tour, setTour] = useState<number | null>(null);


  const media = useMemo(() => {
    const all = images
      .map((i) => typeof i === 'string'
        ? { src: i }
        : { src: i.src, videoUrl: i.type === 'video' ? (i.videoSrc ?? i.src) : undefined })
      .filter((m): m is { src: string; videoUrl?: string } => !!m.src);

    const video = all.find((m) => m.videoUrl);
    const photos = all.filter((m) => !m.videoUrl);
    if (video) photos.splice(Math.min(3, photos.length), 0, video);
    return photos;
  }, [images]);

  const tiles = [1, 2, 3, 4].map((i) => media[i]);

  return <>
    <div className="flex gap-2 h-[300px] md:h-[300px]  xl:h-[480px] -mx-[5%] md:mx-0 md:rounded-2xl overflow-hidden md:overflow-visible">
      {/* Hero: the only box on mobile */}
      <div className="relative flex-1 min-w-0 h-full md:rounded-xl overflow-hidden" style={{ backgroundColor: COLORS[0] }}>
        <button type="button" aria-label="Open property media" className="relative block w-full h-full" onClick={() => media[0] && setTour(0)}>
          {media[0] && <Thumb m={media[0]} size={64} />}
        </button>
        <button
          type="button"
          onClick={() => setTour(0)}
          className="absolute bottom-4 right-4 md:hidden inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2.5 text-[14px] font-medium text-primary-brown shadow-md"
        >
          <List size={20} /> All photos
        </button>
      </div>

      {/* Desktop only: 4 tiles, video in the 3rd */}
      <div className="hidden md:grid grid-cols-2 gap-2 content-start w-[300px] lg:w-[500px] xl:w-[488px]">
        {tiles.map((tile, i) => {
          const isLast = i === 3;
          return (
            <button
              type="button"
              key={i}
              aria-label={`Open property media ${i + 1}`}
              className="relative w-[150px] lg:w-[250px]  xl:w-[240px] h-[145px] xl:h-[236px] rounded-xl overflow-hidden"
              style={{ backgroundColor: COLORS[i + 1] }}
              onClick={() => (isLast ? setTour(0) : tile && setTour(i + 1))}
            >
              {tile && <Thumb m={tile} />}
              {isLast && (
                <span className="absolute bottom-4 right-4 bg-white shadow-sm rounded-lg px-3.5 py-2.5 text-[14px] font-medium text-primary-brown flex items-center gap-1.5">
                  <List size={24} /> All photos
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>

    {tour !== null && <PhotoTourModal media={media} initialIndex={tour} onClose={() => setTour(null)} />}
  </>;
};