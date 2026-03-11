import { MapPin } from "lucide-react";
import { ScheduledVisit } from "../../types/profile.types";

interface VisitCardProps {
    visit: ScheduledVisit;
    dark: boolean;
}

const formatDay = (d: string): string =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric" });

const formatMonth = (d: string): string =>
    new Date(d).toLocaleDateString("en-IN", { month: "short" });

const VisitCard = ({ visit, dark }: VisitCardProps) => (
    <div className={`
    flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 hover:translate-x-1
    ${dark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600" : "bg-white border-zinc-200 hover:border-zinc-400"}
  `}>
        <div className={`
      flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center
      ${dark ? "bg-white text-black" : "bg-black text-white"}
    `}>
            <span className="text-2xl font-bold leading-none">{formatDay(visit.date)}</span>
            <span className="text-xs font-medium uppercase tracking-widest opacity-70">{formatMonth(visit.date)}</span>
        </div>

        <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-base leading-tight mb-1 ${dark ? "text-white" : "text-black"}`}>
                {visit.propertyTitle}
            </h3>
            <p className={`text-xs flex items-center gap-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                <MapPin size={12} className="opacity-60" />
                {visit.location}
            </p>
        </div>

        <div className={`
      flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-xl border
      ${dark ? "border-zinc-700 text-zinc-300 bg-zinc-800" : "border-zinc-200 text-zinc-600 bg-zinc-50"}
    `}>
            {visit.time}
        </div>
    </div>
);

export default VisitCard;