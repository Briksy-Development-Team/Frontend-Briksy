import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Builder } from "../../../types/builder";
import Approves from "../../../assets/logo/apprrove.svg";
import Mappin from "../../../assets/icons/location.svg"

type Props = {
  item: Builder;
};

const BuilderListCard = ({ item }: Props) => (
  <Link to={`/builder/${item.id}`} className="flex items-center gap-3 relative px-4 py-4 lg:gap-4 hover:border hover:border-primary text-primary-brown bg-white border border-[#E7E7E4] rounded-[1.25rem]">
    <div className="relative shrink-0">
      <img loading="lazy"
        src={item.avatar}
        alt={item.name}
        className=" h-16 w-16 lg:h-24 lg:w-24 rounded-full border-4 border-white object-cover"
      />

      <img loading="lazy"
        src={Approves}
        alt="Verified"
        className="absolute -bottom-6 left-1/2 h-16 w-16 -translate-x-1/2"
      />
    </div>

    <div className="min-w-0 flex-1">
      <h3 className="text-[1rem] font-semibold ">{item.name}</h3>
      <div className=" flex items-center gap-1 text-[0.875rem] lg:text-[1rem]">
        <img loading="lazy" src={Mappin} alt="" />
        <span className="text-primary-brown">{item.location}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {item.tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="rounded-full border  px-2 py-0.5 text-[0.75rem] border-[#E6E6E6] bg-primary-brown  text-[#E7E7E4]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between text-[0.75rem] text-gray-100">
        <div className="flex items-center gap-1">
          <Star size={11} fill="currentColor" className="text-[#FF8200]" />
          <span className="font-bold text-[1rem]">{item.rating}</span>
          <span className="text-[1rem]">({item.reviews.toLocaleString()} reviews)</span>
        </div>
        <span className="text-[0.875rem]">Est.{item.establishedYear}</span>
      </div>
    </div>

    <button
      className="mt-1    absolute right-4 top-4 shrink-0"
      aria-label={
        item.isFavourite ? "Remove from favourites" : "Add to favourites"
      }
    >

    </button>
  </Link>
);

export default BuilderListCard;
