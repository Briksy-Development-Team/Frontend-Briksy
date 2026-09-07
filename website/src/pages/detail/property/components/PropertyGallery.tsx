import { List, X } from 'lucide-react';
import { useState } from 'react';

export const PropertyGallery = ({ images }: { images: string[] }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[400px] md:h-[500px] relative cursor-pointer" 
        onClick={() => setModalOpen(true)}
      >
        <div className="col-span-1 lg:col-span-2 h-full">
          <img src={images[0]} className="w-full h-full object-cover" alt="" />
        </div>
        
        <div className="hidden lg:flex flex-col gap-2 h-full">
          <img src={images[1]} className="flex-1 w-full h-[246px] object-cover" alt="" />
          <img src={images[2] || images[1]} className="flex-1 w-full h-[246px] object-cover" alt="" />
        </div>
        
        <div className="hidden md:flex flex-col gap-2 h-full relative">
          <img src={images[3] || images[1]} className="flex-1 w-full h-[246px] object-cover" alt="" />
          <div className="relative flex-1 w-full h-[246px]">
            <img src={images[4] || images[2] || images[1]} className="w-full h-full object-cover" alt="" />
            <button 
              className="absolute bottom-4 right-4 bg-white border border-[#EBE5D9] shadow-sm rounded-xl px-4 py-2 text-[0.875rem] font-medium text-primary-brown flex items-center gap-2 hover:bg-white-50 transition"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
            >
              <List size={16} /> All photos
            </button>
          </div>
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
            <div className="px-6 py-4 border-b border-[#EBE5D9] flex items-center justify-between">
              <h3 className="text-[1.125rem] font-bold text-primary-brown">
                All photos · {images.length} photos
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((src: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden relative bg-gray-100">
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt=""
                    />
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
