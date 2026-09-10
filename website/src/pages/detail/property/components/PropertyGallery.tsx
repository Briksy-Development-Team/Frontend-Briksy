import { List, Play, X } from 'lucide-react';
import { useState } from 'react';

interface GalleryImage {
  src?: string;
  type?: 'image' | 'video';
  videoSrc?: string; // playable video url, used when type === 'video'
}

// Distinct placeholder colors for each of the 5 boxes when no image data is present
const PLACEHOLDER_COLORS = ['#c8cfc4', '#b8c4b4', '#d0cdc0', '#c4cfc9', '#cbc4af'];

export const PropertyGallery = ({ images = [] }: { images?: GalleryImage[] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // images[0] = hero, images[1..4] = the 2x2 grid tiles
  const hero = images[0];
  const tiles = [images[1], images[2], images[3], images[4]];

  return (
    <>
      <div className="flex gap-2 h-[480px] rounded-2xl">
        {/* Hero image */}
        <div
          className="flex-1 min-w-0 h-full rounded-xl overflow-hidden relative cursor-pointer"
          style={!hero?.src ? { backgroundColor: PLACEHOLDER_COLORS[0] } : undefined}
          onClick={() => setModalOpen(true)}
        >
          {hero?.src && (
            <img src={hero.src} className="w-full h-full object-cover" alt="" />
          )}
        </div>

        {/* 2x2 tile grid */}
        <div className="hidden md:flex flex-wrap gap-2 content-start w-[488px]">
          {tiles.map((tile, idx) => {
            const isLast = idx === tiles.length - 1;
            const isVideo = tile?.type === 'video';
            const hasSrc = Boolean(tile?.src);

            return (
              <div
                key={idx}
                className="relative w-[240px] h-[236px] rounded-xl overflow-hidden cursor-pointer"
                style={{ backgroundColor: PLACEHOLDER_COLORS[idx + 1] }}
                onClick={() => {
                  if (isVideo) {
                    setActiveVideo(tile?.videoSrc ?? tile?.src ?? null);
                  } else {
                    setModalOpen(true);
                  }
                }}
              >
                {hasSrc && (
                  <img src={tile!.src} className="w-full h-full object-cover" alt="" />
                )}

                {isVideo && (
                  <button
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveVideo(tile?.videoSrc ?? tile?.src ?? null);
                    }}
                  >
                    <span className="flex items-center justify-center w-[45px] h-[45px] rounded-full bg-white/90 shadow-sm">
                      <Play size={20} className="text-primary-brown ml-0.5" fill="currentColor" />
                    </span>
                  </button>
                )}

                {isLast && (
                  <button
                    className="absolute bottom-4 right-4 bg-white shadow-sm rounded-lg px-3.5 py-2.5 text-[14px] font-medium text-primary-brown flex items-center gap-1.5 tracking-[0.42px] hover:bg-white/90 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpen(true);
                    }}
                  >
                    <List size={24} /> All photos
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Video lightbox */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setActiveVideo(null)}
          >
            <X size={22} />
          </button>
          <video
            src={activeVideo}
            controls
            autoPlay
            className="max-w-5xl max-h-[85vh] rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* All photos modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setModalOpen(false)}
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#EBE5D9] flex items-center justify-between">
              <h3 className="text-[1.125rem] font-bold text-primary-brown">
                All photos · {images.length} photos
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-xl overflow-hidden relative"
                    style={{ backgroundColor: PLACEHOLDER_COLORS[idx % PLACEHOLDER_COLORS.length] }}
                  >
                    {img.src && (
                      <img src={img.src} className="w-full h-full object-cover" alt="" />
                    )}
                    {img.type === 'video' && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90">
                          <Play size={16} className="text-primary-brown ml-0.5" fill="currentColor" />
                        </span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};