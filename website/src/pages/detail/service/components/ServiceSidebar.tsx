import { Star, Share } from "lucide-react";
import FavoriteButton from "../../../../components/custom/FavoriteButton";
import { DetailSidebar } from "../../shared/DetailSidebar";

export function ServiceSidebar({
  contact,
  service,
}: {
  contact: { price: number; rateType?: string };
  service: {
    bannerImage?: string;
    avatar: string;
    name: string;
    registration: string;
    rating: number;
    reviewsCount: number;
  };
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Profile card — banner + overlapping avatar */}
      <div className="relative w-full rounded-xl overflow-visible pb-[70px]">
        {/* Banner */}
        <div
          className="w-full h-[204px] rounded-xl overflow-hidden"
          style={{ background: "#E2CBB3" }}
        >
          {service.bannerImage && (
            <img src={service.bannerImage} alt="Banner" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Avatar — absolute overlapping */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "118px" }}
        >
          <div
            className="w-[139px] h-[139px] rounded-full overflow-hidden border-[5px] border-white bg-white"
            style={{ boxShadow: "0px 13px 39px 0px rgba(0,0,0,0.10), 0px 0px 0px 1.6px rgba(0,0,0,0.02)" }}
          >
            <img src={service.avatar} alt={service.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Name / info — centered below avatar */}
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div className="flex flex-col gap-[0.8125rem]">
          <h1 className="text-[1.875rem] font-medium text-primary-brown leading-tight">{service.name}</h1>
          <p className="text-[1rem] text-primary-brown">{service.registration}</p>
        </div>

        <div className="flex items-center gap-1 text-[0.875rem] text-primary-brown">
          <Star size={16} className="fill-[#F05537] text-[#F05537]" />
          <span className="font-medium">{service.rating}</span>
          <span className="font-medium">({service.reviewsCount} reviews)</span>
        </div>

        <div className="flex items-center gap-4 text-primary-light-brown mt-2">
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Share size={18} />
          </button>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FavoriteButton variant="inline" showText={false} iconSize={18} className="text-primary-light-brown hover:text-primary-brown transition-colors" />
          </div>
        </div>
      </div>

      {/* Enquiry sidebar — no description/footer for traders */}
      <DetailSidebar
        price={`$${contact.price}`}
        priceLabel="/hour"
        buttonText={`Contact ${service.name.split(" ")[0]}`}
      />
    </div>
  );
}
