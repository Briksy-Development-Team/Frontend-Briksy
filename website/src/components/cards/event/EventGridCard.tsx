import { useState } from "react";
import { Heart, MapPin, ArrowRight } from "lucide-react";
import type { CalendarEvent } from "../../../types/calendar";

type Props = {
  item: CalendarEvent;
  onFavouriteToggle?: (id: string) => void;
};

const EventGridCard = ({ item, onFavouriteToggle }: Props) => {
  const [fav, setFav] = useState(Boolean(item.isFavourite));

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav(!fav);
    onFavouriteToggle?.(item.id);
  };

  return (
    <div className="bg-white rounded-[20px] border border-[#EDE8E4] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-[207px] w-full overflow-hidden bg-[#EBE5DC]">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#222222] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
          {item.type}
        </span>
        <button
          type="button"
          onClick={handleFav}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#342511] hover:bg-white transition-colors"
          aria-label="Favourite"
        >
          <Heart size={16} className={fav ? "fill-[#342511] text-[#342511]" : "text-[#342511]"} />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-base font-bold text-[#342511] leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-[#342511] font-normal">
          {item.time}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-[#7C5F42]">
          <MapPin size={13} className="shrink-0 text-[#8B6F54]" />
          <span>{item.location}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#EDE8E4] mt-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={item.listedByAvatar}
              alt=""
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
            <span className="text-xs text-[#342511] truncate">
              Listed by <span className="font-medium">{item.listedBy}</span>
            </span>
          </div>
          <ArrowRight size={16} className="text-[#8B6F54] shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default EventGridCard;
