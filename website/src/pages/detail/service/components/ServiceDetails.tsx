import { Play, X } from 'lucide-react';
import { useState } from 'react';

export function ServiceAbout({ about, showTitle = true }: { about: any; showTitle?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {showTitle && (
        <h2 className="text-[1.25rem] font-bold text-primary-brown">About</h2>
      )}
      <div className="text-[0.875rem] text-primary-brown leading-relaxed">
        {about.description}
      </div>
    </div>
  );
}

export function ServiceRecentWork({ recentWork }: { recentWork: any }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[1.25rem] font-bold text-primary-brown">Recent work</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="text-[0.8125rem] text-primary-light-brown hover:text-primary-brown font-medium transition-colors"
        >
          Show all {recentWork.totalPhotos} photos and {recentWork.totalVideos} videos
        </button>
      </div>

      
      <div className="flex gap-3 h-[280px] md:h-[340px]">
        
        <div
          className="flex-1 rounded-[1rem] overflow-hidden cursor-pointer bg-white-100"
          onClick={() => setModalOpen(true)}
        >
          <img src={recentWork.items[0].src} alt="Recent work" className="w-full h-full object-cover" />
        </div>

        
        <div className="flex-1 flex flex-col gap-3 h-full">
          
          <div
            className="flex-1 rounded-[1rem] overflow-hidden cursor-pointer relative bg-[#1a1a1a]"
            onClick={() => setModalOpen(true)}
          >
            <img
              src={recentWork.items[1].src}
              alt="Video thumbnail"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md">
                <Play className="fill-primary-brown text-primary-brown translate-x-[2px]" size={18} />
              </div>
              <span className="text-white text-[0.75rem] font-medium">{recentWork.items[1].duration}</span>
            </div>
          </div>

          
          <div
            className="flex-1 rounded-[1rem] overflow-hidden cursor-pointer bg-white-100"
            onClick={() => setModalOpen(true)}
          >
            <img src={recentWork.items[2].src} alt="Recent work" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      
      <div className="flex gap-4">
        <div className="flex-1">
          {recentWork.items[0].title && (
            <>
              <p className="text-[0.875rem] font-semibold text-primary-brown">{recentWork.items[0].title}</p>
              <p className="text-[0.75rem] text-primary-light-brown mt-0.5">{recentWork.items[0].subtitle}</p>
            </>
          )}
        </div>
        <div className="flex-1">
          {recentWork.items[1].title && (
            <>
              <p className="text-[0.875rem] font-semibold text-primary-brown">{recentWork.items[1].title}</p>
              <p className="text-[0.75rem] text-primary-light-brown mt-0.5">{recentWork.items[1].subtitle}</p>
            </>
          )}
        </div>
      </div>

      
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setModalOpen(false)}
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-[1.125rem] font-bold text-primary-brown">
                Recent work · {recentWork.totalPhotos} photos and {recentWork.totalVideos} videos
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {recentWork.items.map((item: any, idx: number) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden relative bg-white-100">
                    <img
                      src={item.src}
                      className={`w-full h-full object-cover ${item.type === 'video' ? 'opacity-40' : ''}`}
                      alt=""
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Play className="fill-primary-brown text-primary-brown translate-x-[2px]" size={20} />
                        </div>
                      </div>
                    )}
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-[0.75rem] font-medium">{item.title}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {Array.from({ length: Math.max(0, 9 - recentWork.items.length) }).map((_, i) => (
                  <div key={`ph-${i}`} className="aspect-square rounded-xl bg-gray-50" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ServiceList({ servicesData, name }: { servicesData: any; name: string }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[1.5rem] font-medium text-primary-brown">What {name} does</h2>

      
      <div className="flex flex-wrap gap-2">
        {servicesData.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="rounded-full bg-[#E2CBB3] text-primary-brown px-4 py-1.5 text-[0.75rem] font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      
      {servicesData.offer && (
        <div className="bg-[#E2CBB3] rounded-[1rem] px-5 py-4 flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="text-[0.875rem] font-bold text-primary-brown">{servicesData.offer.title}</span>
            <span className="bg-white rounded-full px-2.5 py-0.5 text-[0.75rem]  text-primary-brown  tracking-wide border border-primary-light-brown/60">
              Offer
            </span>
          </div>
          <p className="text-[0.75rem] text-primary-light-brown leading-snug">{servicesData.offer.subtitle}</p>
        </div>
      )}

      
      <div className="flex flex-col w-full border border-gray-50 rounded-[1rem] overflow-hidden bg-white">
        {servicesData.list.map((s: any, i: number) => (
          <div
            key={s.id}
            className={`flex items-start justify-between px-5 py-4 ${
              i !== servicesData.list.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <div className="flex-1 pr-4">
              <p className="text-[0.875rem] font-medium text-primary-brown leading-snug">{s.title}</p>
              <p className="text-[0.75rem] text-primary-light-brown mt-0.5 leading-snug">{s.description}</p>
            </div>
            <div className="text-[0.875rem] font-medium text-primary-brown whitespace-nowrap shrink-0">
              {s.price}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[0.75rem] text-primary-light-brown">
        Prices are indicative starting points supplied by the business. Confirm on your quote.
      </p>
    </div>
  );
}

export function ServiceLocation({ location, name }: { location: any; name: string }) {
  return (
    <div className="flex flex-col gap-5  rounded-[1.5rem] p-6 md:p-8">
      <div className='space-y-3'>
        <h2 className="text-[1.5rem] font-bold text-primary-brown">Where {name} works</h2>
        <p className="text-[0.75rem] text-primary-light-brown mt-1">{location.description}</p>
      </div>

      
      <div className="w-full h-[240px] rounded-[1rem] overflow-hidden border border-gray-50">
        <iframe
          src={location.mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Service area map"
        />
      </div>

      
      <div>
        <h3 className="text-[0.875rem] font-semibold text-primary-brown mb-3">Suburbs served</h3>
        <div className="flex flex-wrap gap-2">
          {location.suburbs.map((suburb: string) => (
            <span
              key={suburb}
              className="text-[0.75rem] text-primary-brown border border-primary-light-brown/50 rounded-full px-3.5 py-1 "
            >
              {suburb}
            </span>
          ))}
          <span className="text-[0.75rem] text-primary-light-brown border border-primary-light-brown/50 rounded-full px-3.5 py-1">
            +{location.moreCount} more
          </span>
        </div>
      </div>
    </div>
  );
}
