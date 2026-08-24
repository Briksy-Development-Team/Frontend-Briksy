import { Link } from "react-router-dom";
import { Heart, MapPin, Star, ArrowRight } from "lucide-react";
import type { Trader } from "../../../types/trader";
import Approves from "../../../assets/logo/apprrove.svg";

type Props = {
  item: Trader;
};

const BuilderGridCard = ({ item }: Props) => {
  return (
    <Link
      to={`/builder/${item.id}`}
      className="block rounded-[20px] w-full h-[25rem] pb-[6px] border border-transparent transition-colors duration-200 overflow-hidden mx-auto md:w-auto text-primary-brown bg-white hover:border-primary"
    >
      <div className="relative h-[35%] bg-[#bed6d7] rounded-t-[20px] overflow-hidden mb-[-36px]">
        <img
          loading="lazy"
          src={item.bannerImage}
          alt={item.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <button className="absolute right-4 top-3 flex items-center justify-center">
          <Heart
            size={24}
            className={
              item.isFavourite
                ? "fill-primary-brown text-primary-brown"
                : "fill-white text-primary-brown"
            }
          />
        </button>
      </div>

      
      <div className="relative flex items-end justify-between px-4">
        <div className="flex w-fit flex-col items-center">
          <img
            loading="lazy"
            src={item.avatar}
            alt={item.name}
            className="mb-[-24px] h-[78px] w-[78px] rounded-full object-cover"
          />
          <div className="relative h-8 w-8 rounded-full border border-[#f8f4ee] bg-[#e2cbb3] overflow-hidden">
            <img
              loading="lazy"
              src={Approves}
              alt="Verified"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex items-end gap-1.5 py-2.5">
          <Star size={20} className="fill-[#e2cbb3] text-[#e2cbb3]" />
          <span className="text-[1rem] leading-6 font-bold text-primary-brown">
            {item.rating}
          </span>
          <span className="text-[1rem] leading-6 text-primary-brown">
            ( {item.reviews.toLocaleString()} )
          </span>
        </div>
      </div>

      <div className="px-4">
        <div className="mt-1.5">
          <h3 className="text-[1rem] leading-6 font-bold text-primary-brown">
            {item.name}
          </h3>

          {item.tagLine && (
            <p className="mt-1.5 text-[0.875rem] leading-5 tracking-[0.03em] text-primary-brown">
              {item.tagLine}
            </p>
          )}

          <div className="mt-1.5 flex items-center gap-1.5">
            <MapPin size={20} className="text-primary-brown" />
            <p className="text-[0.875rem] leading-5 tracking-[0.03em] text-primary-brown">
              {item.location}
            </p>
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="flex h-[26px] items-center rounded-[14px] border border-white/50 bg-[#ede8e4] px-[10.5px] py-[6.5px] text-[0.75rem] leading-[1.5] text-[#222]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3 h-px bg-[#ede8e4]" />

          <div className="flex items-center justify-between py-3">
            <span className="text-[1rem] leading-6 text-primary-brown">
              View Profile
            </span>
            <ArrowRight size={20} className="text-primary-brown" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BuilderGridCard;