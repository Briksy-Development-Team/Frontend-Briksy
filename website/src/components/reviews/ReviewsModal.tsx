import { Star, X } from 'lucide-react';
import ModalWrapper from '../wrapper/ModalWrapper';

type ReviewsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  name?: string;
};

export default function ReviewsModal({ isOpen, onClose, data, name }: ReviewsModalProps) {
  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl h-[85vh] bg-white rounded-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
            <h3 className="text-[1.25rem] font-medium text-primary-brown">
              {name ? `${name}'s reviews` : 'Reviews'}
            </h3>
            <button
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-primary-brown transition-colors"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="flex flex-col gap-8">
              {data.list.map((review: any) => (
                <div key={review.id} className="flex gap-4 border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                  <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full object-cover shrink-0 bg-white-100" />
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="font-medium text-primary-brown text-[0.875rem]">{review.author}</div>
                        <div className="text-[0.75rem] text-primary-light-brown">{review.context}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={12} className={star <= review.rating ? "fill-[#F97316] text-[#F97316]" : "fill-white-100 text-white-100"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[1rem] text-primary-brown leading-relaxed italic">
                      "{review.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
