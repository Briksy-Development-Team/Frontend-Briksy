import { Clock, MapPin, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "../../../types/calendar";

type Props = {
  item: CalendarEvent;
  onClick?: () => void;
};

const EventListCard = ({ item, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-3 border border-[#EDE8E4] flex items-center gap-3.5 shadow-sm hover:border-primary-brown transition-colors cursor-pointer"
    >
      <img
        src={item.image}
        alt=""
        className="w-[72px] h-[72px] rounded-xl object-cover shrink-0 bg-[#EBE5DC]"
      />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="self-start bg-[#F8F4EE] text-[#342511] text-[10px] font-medium px-2 py-0.5 rounded-md">
          {item.type}
        </span>
        <h4 className="text-sm font-medium text-[#342511] truncate">
          {item.title}
        </h4>
        <div className="flex items-center gap-1 text-[11px] text-[#7C5F42]">
          <Clock size={12} className="shrink-0 text-[#8B6F54]" />
          <span>{item.time}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#7C5F42] truncate">
          <MapPin size={12} className="shrink-0 text-[#8B6F54]" />
          <span className="truncate">{item.location}</span>
        </div>
      </div>
      <ChevronRight size={18} className="text-[#8B6F54] shrink-0 ml-1" />
    </div>
  );
};

export default EventListCard;
