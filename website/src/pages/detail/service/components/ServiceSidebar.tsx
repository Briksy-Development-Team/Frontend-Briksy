import { Star, Share } from "lucide-react";
import FavoriteButton from "../../../../components/custom/FavoriteButton";
import { SafeImage } from "../../../../components/custom/SafeImage";
import Verify from "../../../../assets/icons/verify.svg";

export function ServiceSidebar({
  service,
  price,
  onEnquiry,
}: {
  service: {
    id?: string;
    favoriteType?: "service" | "organization";
    bannerImage?: string;
    avatar: string;
    name: string;
    registration: string;
    rating: number;
    reviewsCount: number;
    address?: string | null;
  };
  price?: number | null;
  onEnquiry?: () => void;
}) {
  const priceDisplay = price ? `$${(price / 1000).toFixed(0)}k` : null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Verified badge */}
      <div
        className="w-full bg-white rounded-xl py-3 px-9 flex justify-center items-center gap-2.5"
        style={{ boxShadow: "0px 0px 13px 0px rgba(0, 0, 0, 0.12)" }}
      >
        <img src={Verify} alt="" />
        <span className="font-medium text-[0.875rem] text-primary-brown">Verified by Briksy</span>
      </div>

      {/* Profile card — banner + avatar */}
      <div className="relative w-full rounded-xl overflow-visible pb-8">
        {/* Banner */}
        <div
          className="w-full h-[180px] rounded-xl overflow-hidden"
          style={{ background: "#E2CBB3" }}
        >
          <SafeImage
            src={service.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Avatar — absolute overlapping */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "118px" }}
        >
          <div
            className="w-[120px] h-[120px] rounded-full overflow-hidden border-[5px] border-white bg-white"
            style={{
              boxShadow:
                "0px 13px 39px 0px rgba(0,0,0,0.10), 0px 0px 0px 1.6px rgba(0,0,0,0.02)",
            }}
          >
            <SafeImage
              src={service.avatar}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Name / info — centered below avatar */}
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div className="flex flex-col gap-[0.8125rem]">
          <h1 className="text-[1.25rem] font-medium text-primary-brown mt-8 leading-tight">
            {service.name}
          </h1>
          <p className="text-[0.875rem] text-primary-brown">{service.registration}</p>
        </div>

        {service.rating > 0 && (
          <div className="flex items-center gap-1 text-[0.875rem] text-primary-brown">
            <Star size={16} className="fill-[#F05537] text-[#F05537]" />
            <span className="font-medium">{service.rating}</span>
            <span className="font-medium">({service.reviewsCount} reviews)</span>
          </div>
        )}
        {service.address && (
          <p className="text-[0.875rem] text-primary-light-brown">{service.address}</p>
        )}
        <div className="flex items-center gap-x-4 text-primary-light-brown mt-2">
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Share size={14} />
          </button>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <FavoriteButton
              variant="inline"
              showText={false}
              iconSize={14}
              targetId={service.id}
              targetType={service.favoriteType ?? "service"}
              className="text-primary-light-brown hover:text-primary-brown transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Enquiry card — price + button only (Figma: traders sidebar) */}
      <div className="w-full bg-white rounded-2xl border border-[#EDE8E4] flex flex-col gap-3.5 p-[26px]">
        {priceDisplay && (
          <div className="flex items-baseline gap-1.5">
            <span className="text-[1.5rem] font-medium leading-8 tracking-[-0.006em] text-primary-brown">
              From {priceDisplay}
            </span>
            <span className="text-[0.75rem] font-normal text-black">fixed price</span>
          </div>
        )}

        <button
          onClick={onEnquiry}
          className="w-full h-10 rounded-full bg-primary-brown text-white py-[0.5rem] px-[1.5rem] font-medium text-[0.875rem] hover:opacity-90 transition-opacity"
        >
          {`Contact ${service.name.split(" ")[0] || service.name}`}
        </button>
      </div>
    </div>
  );
}
