import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Trader } from "../../../types/trader";
import Approves from "../../../assets/logo/apprrove.svg";
import Mappin from "../../../assets/icons/location.svg";

type Props = {
  item: Trader;
};

const TraderListCard = ({ item }: Props) => (
  <Link to={`/service/${item.id}`} className="flex items-center gap-3 px-4 py-4 lg:gap-4 border text-primary-brown bg-white border-[#E7E7E4] hover:border hover:border-primary rounded-[1.25rem]">
    <div className="relative shrink-0">
      <img loading="lazy"
        src={item.avatar}
        alt={item.name}
        className="  h-16 w-16 lg:h-24 lg:w-24 rounded-full object-cover"
      />
      <img loading="lazy"
        src={Approves}
        alt="Verified"
        className="absolute -bottom-6 left-1/2 h-16 w-16 -translate-x-1/2"
      />
    </div>

    <div className="min-w-0 flex-1">
      <h3 className="text-[1rem] font-bold ">{item.name}</h3>
      <p className="mt-0.5 text-[1rem] ">
        {item.tagLine} {item.role}
      </p>
      <div className=" flex items-center gap-1 text-[0.875rem] lg:text-[1rem]">
        <img loading="lazy" src={Mappin} alt="" />
        <span className="text-primary-brown">{item.location}</span>
      </div>
      <div className="mt-1 flex items-center gap-1 text-[1rem] ">
        <Star size={11} fill="currentColor" className="text-primary-brown" />
        <span>{item.rating}</span>
        <span>({item.reviews.toLocaleString()} reviews)</span>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1">
        {item.tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="rounded-full border px-2 py-0.5 text-[0.75rem] border-[#E6E6E6] bg-primary-brown  text-[#E7E7E4]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </Link>
);

export default TraderListCard;
