import { Star, ChevronLeft, MapPin, ShieldCheck, Share } from "lucide-react";
import FavoriteButton from "../../../../components/custom/FavoriteButton";
import ServicePlaceholder from "../../../../assets/place holder/serviceholder.svg";
import type { PublicOrganization } from "../../../../api/seeker/organization.api";

const circleBtn =
  "w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-brown";

export function ServiceMobileHeader({ organization: org }: { organization: PublicOrganization }) {
  return (
    <div className="w-full md:hidden mb-8">
      {/* Banner */}
      <div
        className="relative h-[300px] -mx-[3%] bg-[#E2CBB3]"
        style={{ width: "calc(100% + 6%)" }}
      >
        {org.banner_url && (
          <img src={org.banner_url} alt="Banner" className="w-full h-full object-cover" />
        )}
        <div className="absolute top-4 inset-x-0 px-[3%] flex justify-between">
          <button onClick={() => window.history.back()} className={circleBtn}>
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3 pointer-events-auto">
            <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-brown hover:bg-gray-50">
              <Share size={18} />
            </button>
            <FavoriteButton
              variant="icon-only"
              showText={false}
              iconSize={18}
              className={circleBtn}
              targetId={org.id}
              targetType="organization"
              initialIsFavourite={Boolean(org.is_favourite)}
            />
          </div>

        </div>
      </div>

  <img
        src={org.logo_url || ServicePlaceholder}
        alt={org.name}
        className="relative -mt-16 ml-4 w-[120px] h-[120px] rounded-full object-cover border-[5px] border-white bg-white shadow-xl"
      />

      {/* Info */}
      <div className="px-4 mt-4 flex flex-col gap-2 text-primary-brown">
        <h1 className="text-xl font-bold">{org.name}</h1>
        <p className="text-sm">{org.type?.name}</p>

        <div className="flex items-center gap-1 text-sm">
          <Star size={14} className="fill-[#F05537] text-[#F05537]" />
          <b>{org.rating}</b>
          <span className="text-[#8C8370]">({org.reviews_count})</span>
        </div>

        <p className="flex items-center gap-2 text-sm text-[#8C8370]">
          <MapPin size={16} className="shrink-0" />
          <span className="truncate">{org.address}</span>
        </p>

        <span className="self-start flex items-center gap-2 px-4 py-2 rounded-full border text-sm">
          <ShieldCheck size={20} /> Verified by Briksy
        </span>
      </div>
    </div>
  );
}