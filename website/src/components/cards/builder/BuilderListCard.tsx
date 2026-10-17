import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Builder } from "../../../types/builder";
import Approves from "../../../assets/logo/apprrove.svg";
import Mappin from "../../../assets/icons/location.svg";
import { SafeImage } from "../../custom/SafeImage";

type Props = {
  item: Builder;
};

// Mobile: one line cut with "..."  |  md and above: show full text
const clip = "truncate md:overflow-visible md:text-clip md:whitespace-normal";

const BuilderListCard = ({ item }: Props) => (
  <Link to={`/${item.profileType === "agent" ? "agent" : "builder"}/${item.id}`} className="flex items-center gap-3 px-4 py-4 lg:gap-4 hover:border hover:border-primary text-primary-brown bg-white border border-[#E7E7E4] rounded-[1.25rem]">
    <div className="relative shrink-0">
      <SafeImage loading="lazy"
        src={item.avatar}
        alt={item.name}
        className="h-16 w-16 lg:h-24 lg:w-24 rounded-full border-4 border-white object-cover"
      />

      <img loading="lazy"
        src={Approves}
        alt="Verified"
        className="absolute -bottom-3 left-1/2 h-8 w-8 -translate-x-1/2"
      />
    </div>

    <div className="min-w-0 flex-1">
      <h3 className={`text-[1rem] font-medium ${clip}`}>{item.name}</h3>
      <div className="flex items-center gap-1 text-[0.875rem] lg:text-[1rem]">
        <img loading="lazy" src={Mappin} alt="" className="shrink-0" />
        <span className={`min-w-0 ${clip}`}>{item.location}</span>
      </div>

      {/* Mobile: one row only, tags that don't fit are hidden | md+: wrap normally */}
      <div className="mt-1.5 flex flex-wrap gap-1 max-h-7 overflow-hidden md:max-h-none md:overflow-visible">
        {(item.tags ?? []).map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.75rem] border-[#E6E6E6] bg-[#EBE5DC] text-primary-brown md:bg-primary-brown md:text-[#E7E7E4]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-[0.75rem]">
        <div className="flex items-center gap-1">
          <Star size={11} fill="currentColor" className="text-[#FF8200]" />
          <span className="font-bold text-[1rem]">{item.rating ?? 0}</span>
          <span className="text-[1rem]">
            ({(item.reviews ?? 0).toLocaleString()}
            <span className="hidden md:inline"> reviews</span>)
          </span>
        </div>
        <span className="shrink-0 text-[0.875rem]">Est.{item.establishedYear || "N/A"}</span>
      </div>
    </div>
  </Link>
);

export default BuilderListCard;