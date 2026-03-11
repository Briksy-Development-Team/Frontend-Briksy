import { MapPin } from "lucide-react";
import { Enquiry } from "../../types/profile.types";

interface EnquiryCardProps {
    enquiry: Enquiry;
    dark: boolean;
}

const formatDate = (d: string): string =>
    new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

const EnquiryCard = ({ enquiry, dark }: EnquiryCardProps) => (
    <div className={`
    p-5 rounded-2xl border transition-all duration-300
    ${dark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600" : "bg-white border-zinc-200 hover:border-zinc-400"}
  `}>
        <div className="flex items-start justify-between gap-4 mb-4">
            <div>
                <h3 className={`font-semibold text-base leading-tight mb-1 ${dark ? "text-white" : "text-black"}`}>
                    {enquiry.propertyTitle}
                </h3>
                <p className={`text-xs flex items-center gap-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                    <MapPin size={12} className="opacity-60" />
                    {enquiry.location}
                </p>
            </div>
            <span className={`
        flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg
        ${dark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-500"}
      `}>
                {formatDate(enquiry.date)}
            </span>
        </div>

        <div className={`
      text-sm leading-relaxed px-4 py-3 rounded-xl border-l-2
      ${dark ? "bg-zinc-800 text-zinc-300 border-l-white" : "bg-zinc-50 text-zinc-600 border-l-black"}
    `}>
            {enquiry.message}
        </div>
    </div>
);

export default EnquiryCard;