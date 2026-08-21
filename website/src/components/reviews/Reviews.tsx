import { Star } from 'lucide-react';

export default function Reviews({ data, name }: { data: any; name?: string }) {
  const stars = [5, 4, 3, 2, 1];
  
  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl">
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.25rem] font-bold text-primary-brown">
          {name ? `${name}'s reviews` : 'Ratings and reviews'}
        </h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          {name
            ? 'Reviews can only be left by customers who enquired through BRIKSY.'
            : 'Read the latest reviews for the team at Harkaway Homes.'}
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl flex flex-col md:flex-row items-center gap-10 border border-gray-50 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="text-[3.5rem] font-bold text-primary-brown leading-none">{data.overall}</div>
          <div className="flex items-center gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={16} className={star <= Math.round(data.overall) ? "fill-[#F97316] text-[#F97316]" : "fill-white-100 text-white-100"} />
            ))}
          </div>
          <div className="text-[0.75rem] text-primary-light-brown mt-3">{data.count} reviews</div>
        </div>
        
        <div className="flex-1 flex flex-col gap-3 w-full">
          {stars.map((star) => (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[0.75rem] text-primary-light-brown w-6">
                {star}<Star size={10} className="fill-current" />
              </div>
              <div className="flex-1 h-2 bg-white-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-light-brown rounded-full"
                  style={{ width: `${data.distribution[star]}%` }}
                />
              </div>
              <div className="text-[0.75rem] text-primary-light-brown w-8 text-right">
                {data.distribution[star]}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 mt-4">
        {data.list.map((review: any) => (
          <div key={review.id} className="flex gap-4 border-b border-gray-50 pb-8 last:border-0 last:pb-0">
            <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full object-cover shrink-0 bg-white-100" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-primary-brown text-[0.875rem]">{review.author}</div>
                  <div className="text-[0.75rem] text-primary-light-brown">{review.context}</div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={12} className={star <= review.rating ? "fill-[#F97316] text-[#F97316]" : "fill-white-100 text-white-100"} />
                  ))}
                </div>
              </div>
              <p className="text-[0.875rem] text-primary-brown leading-relaxed italic">
                "{review.text}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button className="bg-white border border-white-100 text-primary-brown py-2 px-5 rounded-lg font-medium text-[0.875rem] hover:bg-white-50 transition-colors">
          Show all {data.count} reviews
        </button>
      </div>
    </div>
  );
}
