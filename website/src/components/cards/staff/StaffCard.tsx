import { Star, ArrowRight } from "lucide-react";
import Approves from "../../../assets/logo/apprrove.svg";
import Mappin from "../../../assets/icons/location.svg";

export default function StaffCard({ member }: { member: any }) {
  return (
    <div className="rounded-[1.5rem] w-full border border-transparent overflow-hidden text-primary-brown bg-white hover:border-primary-light-brown/60 transition-colors pb-6 shadow-sm border-gray-50">
      <div className="relative h-32 w-full bg-white-100">
        <img loading="lazy"
          src={member.banner}
          alt="Banner"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative px-6">
        <div className="-mt-10 relative w-fit mb-4">
          <img loading="lazy"
            src={member.avatar}
            alt={member.name}
            className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm bg-white"
          />
          <img loading="lazy"
            src={Approves}
            alt="Verified"
            className="absolute -bottom-2 -right-1 h-8 w-8"
          />
        </div>

        <div className="flex justify-end -mt-16 mb-6">
          <div className="flex items-center gap-1 text-[0.875rem]">
            <Star size={14} className="fill-primary-light-brown/50 text-primary-light-brown/50" />
            <span className="font-bold">{member.rating}</span>
            <span className="text-primary-light-brown">({member.reviewsCount})</span>
          </div>
        </div>

        <h3 className="text-[1.125rem] font-bold text-primary-brown">
          {member.name}
        </h3>
        <p className="text-[0.875rem] text-gray-100 mt-1">{member.role}</p>
        
        <div className="flex items-center gap-1 mt-2 text-[0.875rem] text-primary-brown">
          <img loading="lazy" src={Mappin} alt="" className="w-3.5 h-3.5" />
          <span>{member.location}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {member.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full border border-white-100 bg-white-50 text-primary-brown px-3 py-1.5 text-[0.75rem] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <button className="mt-6 flex items-center gap-2 text-[0.875rem] font-medium text-primary-light-brown hover:text-primary-brown transition-colors">
          View Profile <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
