import { Star, Share } from "lucide-react";
import FavoriteButton from "../../../../components/custom/FavoriteButton";
import { SafeImage } from "../../../../components/custom/SafeImage";
import {
  VerifiedBadge,
  TraderAboveCard,
  NeedHelpCard,
} from "../../shared/DetailSidebar";

export function ServiceSidebar({
  service,
  price,
  onEnquiry,
  showNeedHelp = true,
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
  showNeedHelp?: boolean;
}) {
  const priceDisplay = price ? `$${(price / 1000).toFixed(0)}k` : "$850k";

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Profile card — banner + avatar (Figma: top of trader profile) */}
      <div className="relative w-full rounded-2xl overflow-visible pb-6 bg-white border border-[#EDE8E4] p-3 shadow-xs">
        {/* Banner */}
        <div
          className="w-full h-[140px] rounded-xl overflow-hidden"
          style={{ background: "#E2CBB3" }}
        >
          <SafeImage
            src={service.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Avatar — overlapping banner */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "85px" }}
        >
          <div
            className="w-[100px] h-[100px] rounded-full overflow-hidden border-[4px] border-white bg-white"
            style={{
              boxShadow:
                "0px 10px 25px 0px rgba(0,0,0,0.12)",
            }}
          >
            <SafeImage
              src={service.avatar}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info below avatar */}
        <div className="flex flex-col items-center gap-2 text-center px-4 pt-14">
          <h1 className="text-[1.25rem] font-medium text-primary-brown leading-tight">
            {service.name}
          </h1>
          <p className="text-[0.875rem] text-primary-light-brown">
            {service.registration}
          </p>

          {service.rating > 0 && (
            <div className="flex items-center gap-1.5 text-[0.875rem] text-primary-brown">
              <Star size={15} className="fill-[#F05537] text-[#F05537]" />
              <span className="font-medium">{service.rating}</span>
              <span className="text-[#8A837C]">({service.reviewsCount} reviews)</span>
            </div>
          )}

          {service.address && (
            <p className="text-[0.8125rem] text-primary-light-brown line-clamp-2">
              {service.address}
            </p>
          )}

          <div className="flex items-center gap-x-3 text-primary-light-brown mt-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#EDE8E4] flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Share size={14} />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#EDE8E4] flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
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
      </div>

      {/* Verified badge */}
      <VerifiedBadge />

      {/* Trader above card — dynamic price + button */}
      <TraderAboveCard
        price={priceDisplay}
        buttonText={
          service.name
            ? `Contact ${service.name.split(" ")[0] || service.name}`
            : "Send a enquiry"
        }
        onEnquiry={onEnquiry}
      />

      {/* Need Help card */}
      {showNeedHelp && <NeedHelpCard />}
    </div>
  );
}
