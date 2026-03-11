import { MapPin } from "lucide-react";
import { Property } from "../../types/profile.types";

interface PropertyCardProps {
    property: Property;
    dark: boolean;
    badge: string;
}

const PropertyCard = ({ property, dark, badge }: PropertyCardProps) => (
    <div className={`
    rounded-2xl overflow-hidden border transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl
    ${dark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600" : "bg-white border-zinc-200 hover:border-zinc-400"}
  `}>
        <div className="relative h-44 overflow-hidden">
            <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className={`
        absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full tracking-wide
        ${dark ? "bg-white text-black" : "bg-black text-white"}
      `}>
                {badge}
            </span>
        </div>

        <div className="p-4">
            <h3 className={`font-semibold text-base mb-1 leading-tight ${dark ? "text-white" : "text-black"}`}>
                {property.title}
            </h3>
            <p className={`text-xs mb-3 flex items-center gap-1 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                <MapPin size={12} className="opacity-60" />
                {property.location}
            </p>
            <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${dark ? "text-white" : "text-black"}`}>
                    {property.price}
                </span>
                <button className={`
          text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200
          ${dark
                        ? "bg-zinc-800 text-zinc-300 hover:bg-white hover:text-black"
                        : "bg-zinc-100 text-zinc-600 hover:bg-black hover:text-white"
                    }
        `}>
                    View
                </button>
            </div>
        </div>
    </div>
);

export default PropertyCard;