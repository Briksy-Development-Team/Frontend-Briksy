import { List, Play } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PhotoTourModal, type Media } from '../../../../components/custom/PhotoTourModal';
import GallerySkeleton from '../../../../components/skeletons/GallerySkeleton';

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

export const PropertyGallery = ({
  images = [],
  floorplan,
  isLoading = false,
}: {
  images?: ImageInput[];
  floorplan?: string | null;
  isLoading?: boolean;
}) => {
  const [tour, setTour] = useState<boolean>(false);

  // Separate photos and videos for the tabbed modal
  const { photos, videos, heroMedia } = useMemo(() => {
    const all = images
      .map((i) =>
        typeof i === 'string'
          ? { src: i }
          : { src: i.src, videoUrl: i.type === 'video' ? (i.videoSrc ?? i.src) : undefined }
      )
      .filter((m): m is { src: string; videoUrl?: string } => !!m.src);

    const photos = all.filter((m) => !m.videoUrl);
    const videos = all.filter((m) => !!m.videoUrl);

    // Hero strip: first photo + up to 4 tiles (mix photos then video)
    const heroMedia: Media[] = [...photos];
    if (videos[0]) heroMedia.splice(Math.min(3, heroMedia.length), 0, videos[0]);

    return { photos, videos, heroMedia };
  }, [images]);

  if (isLoading) {
    return <GallerySkeleton />;
  }

  const tiles = [1, 2, 3, 4].map((i) => heroMedia[i]);

  return (
    <>
      <div className="flex gap-2 h-[300px] md:h-[300px] xl:h-[480px] -mx-[5%] md:mx-0 md:rounded-2xl overflow-hidden md:overflow-visible">
        {/* Hero: the only box on mobile */}
        <div className="relative flex-1 min-w-0 h-full md:rounded-xl overflow-hidden" style={{ backgroundColor: COLORS[0] }}>
          <button type="button" aria-label="Open property media" className="relative block w-full h-full" onClick={() => heroMedia[0] && setTour(true)}>
            {heroMedia[0] && <Thumb m={heroMedia[0]} size={64} />}
          </button>
          <button
            type="button"
            onClick={() => setTour(true)}
            className="absolute bottom-4 right-4 md:hidden inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2.5 text-[14px] font-medium text-primary-brown shadow-md"
          >
            <List size={20} /> All photos
          </button>
        </div>

        {/* Desktop only: 4 tiles */}
        <div className="hidden md:grid grid-cols-2 gap-2 content-start w-[300px] lg:w-[500px] xl:w-[488px]">
          {tiles.map((tile, i) => {
            const isLast = i === 3;
            const isVid = tile && !!tile.videoUrl;
            return (
              <button
                type="button"
                key={i}
                aria-label={`Open property media ${i + 1}`}
                className="relative w-[150px] lg:w-[250px] xl:w-[240px] h-[145px] xl:h-[236px] rounded-xl overflow-hidden"
                style={{ backgroundColor: COLORS[i + 1] }}
                onClick={() => setTour(true)}
              >
                {tile && <Thumb m={tile} />}
                {isVid && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow">
                      <Play size={16} className="text-primary-brown ml-0.5" fill="currentColor" />
                    </span>
                  </span>
                )}
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

      {tour && (
        <PhotoTourModal
          photos={photos}
          videos={videos}
          floorplan={floorplan}
          onClose={() => setTour(false)}
        />
      )}
    </>
  );
};
