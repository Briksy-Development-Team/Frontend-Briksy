import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Property } from "../../../types/property";
import Mappin from "../../../assets/icons/location.svg";

type Props = {
  item: Property;
};

const PropertyListCard = ({ item }: Props) => (
  <Link to={`/property/${item.id}`} className="flex items-center font-helvetica gap-3 hover:border hover:border-primary px-2 py-2 lg:gap-4 bg-white border border-[#E7E7E4] rounded-[1.25rem]">
    <div className="relative w-[108px] aspect-4/5 shrink-0 overflow-hidden rounded-2xl">
      <img loading="lazy"
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover"
      />
      <span className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[0.625rem] font-medium">
        {item.badge}
      </span>
    </div>

    <div className="flex  w-[70%] flex-col  items-start">
      <h3 className="line-clamp-2 text-[0.9375rem] text-primary-brown lg:text-[1rem] font-bold ">
        {item.title}
      </h3>

      <div className=" flex items-center gap-1 text-[0.875rem] lg:text-[1rem]">
        <img loading="lazy" src={Mappin} alt="" />
        <span className="text-primary-brown">{item.address}</span>
      </div>

      <p className=" text-[1rem] text-primary-brown font-bold">
        ${item.price.toLocaleString()}
      </p>

      <p className="text-[0.875rem] text-primary-brown">
        {item.beds} Bed&nbsp;&nbsp;•&nbsp;&nbsp;{item.baths} Bath&nbsp;&nbsp;•&nbsp;&nbsp;{item.sqm} sqm
      </p>

      <div className="w-full my-2 border-t border-primary-light-brown/70" />

      <div className=" flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <img loading="lazy"
            src={item.posterAvatar}
            alt={item.posterName}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="text-[0.875rem] text-primary-brown">
            Listed by <span className="font-bold">{item.posterName}</span>
          </span>
        </div>
        <ArrowRight size={18} className="text-primary-light-brown/70" />
      </div>
    </div>
  </Link>
);

export default PropertyListCard;
