import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Trader } from "../../../types/trader";
import Approves from "../../../assets/logo/apprrove.svg";
import Mappin from "../../../assets/icons/location.svg";
import { SafeImage } from "../../custom/SafeImage";

type Props = {
  item: Trader;
};

const clip = "truncate md:overflow-visible md:text-clip";

const TraderListCard = ({ item }: Props) => (
  <Link to={`/service/${item.id}`} className="flex items-center gap-3 p-2 lg:gap-4 overflow-hidden border text-primary-brown bg-white border-[#E7E7E4] hover:border hover:border-primary rounded-[1.25rem]">
    <div className="relative shrink-0">
      <SafeImage loading="lazy"
        src={item.avatar}
        alt={item.name}
        className="h-16 w-16 lg:h-24 lg:w-24 rounded-full object-cover"
      />
      <img loading="lazy"
        src={Approves}
        alt="Verified"
        className="absolute -bottom-6 left-1/2 h-8 w-8 -translate-x-1/2"
      />
    </div>

    <div className="min-w-0 flex-1">
      <h3 className={`text-[0.875rem] font-medium ${clip}`}>{item.name}</h3>
      <p className={`mt-0.5 text-[0.75rem] ${clip}`}>
        {item.tagLine} {item.role}
      </p>
      <div className="flex items-center gap-1 text-[0.875rem]">
        <img loading="lazy" src={Mappin} alt="" />
        <span className={`min-w-0 ${clip}`}>{item.location}</span>
      </div>
      <div className="mt-1 flex items-center gap-1 text-[0.75rem]">
        <Star size={11} fill="currentColor" />
        <span>{item.rating ?? 0}</span>
        <span>
          ({(item.reviews ?? 0).toLocaleString()}
          <span className="hidden md:inline"> reviews</span>)
        </span>
      </div>

      <div className="mt-1.5 flex  gap-1 flex-wrap">
        {(item.tags ?? []).slice(0, 2).map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="min-w-0  md:overflow-visible   rounded-full border px-2 py-0.5 text-[0.65rem] border-[#E6E6E6] bg-[#EBE5DC] text-primary-brown md:bg-primary-brown md:text-[#E7E7E4]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </Link>
);

export default TraderListCard;