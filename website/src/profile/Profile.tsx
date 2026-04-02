import { useState } from "react";
import { profileData } from "../data/profileDummydata";
import { ProfileData } from "../types/profile.types";
import StatCard from "./components/StatCard";
import PropertyCard from "./components/PropertyCard";
import VisitCard from "./components/VisitCard";
import EnquiryCard from "./components/EnquiryCard";
import {
    Heart,
    Eye,
    Calendar,
    MessageSquare,
    MapPin,
    Mail,
    Phone,
    Pencil,
    ChevronDown,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

interface ProfilePageProps {
    dark: boolean
}

const formatDate = (d: string): string =>
    new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

const TABS = ["Favourites", "Viewed", "Visits", "Enquiries"];

const extractPrice = (priceString: string): number =>
    parseInt(priceString.replace(/[₹,]/g, ""), 10);

export default function Profile({ dark }: ProfilePageProps) {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [locationFilter, setLocationFilter] = useState<string>("all");
    const [priceRangeFilter, setPriceRangeFilter] = useState<string>("all");
    const { user } = useAuth();

    const { seeker, stats, favouriteProperties, viewedProperties, scheduledVisits, enquiries }: ProfileData = profileData;
    const profileSeeker = {
        ...seeker,
        name: user?.name ?? seeker.name,
        email: user?.email ?? seeker.email,
    };

    const statItems = [
        { label: "Favourites", value: stats.favourites, icon: <Heart size={14} fill="currentColor" /> },
        { label: "Viewed", value: stats.viewed, icon: <Eye size={14} /> },
        { label: "Scheduled Visits", value: stats.scheduledVisits, icon: <Calendar size={14} /> },
        { label: "Enquiries", value: stats.enquiries, icon: <MessageSquare size={14} /> },
    ];

    const uniqueLocations = Array.from(
        new Set([...favouriteProperties, ...viewedProperties].map(p => p.location))
    ).sort();

    const filterProperties = (properties: typeof favouriteProperties) => {
        return properties.filter(property => {
            const locationMatch = locationFilter === "all" || property.location === locationFilter;
            let priceMatch = true;

            if (priceRangeFilter !== "all") {
                const price = extractPrice(property.price);
                priceMatch = priceRangeFilter === "0-50" ? price < 5000000 :
                    priceRangeFilter === "50-100" ? price >= 5000000 && price < 10000000 :
                        priceRangeFilter === "100-150" ? price >= 10000000 && price < 15000000 :
                            price >= 15000000;
            }

            return locationMatch && priceMatch;
        });
    };

    const filteredFavourites = filterProperties(favouriteProperties);
    const filteredViewed = filterProperties(viewedProperties);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        if (index > 1) {
            setLocationFilter("all");
            setPriceRangeFilter("all");
        }
    };

    const FilterDropdown = ({ value, onChange, options }: any) => (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`
                    appearance-none px-3 py-1.5 pr-8 rounded-lg text-xs font-medium 
                    border cursor-pointer transition-all duration-200
                    ${dark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
                    }
                `}
            >
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown
                size={14}
                className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? "text-zinc-500" : "text-zinc-400"
                    }`}
            />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className={`
                relative rounded-3xl overflow-hidden mb-6 border 
                ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}
            `}>
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 p-8">
                    <div className="relative flex-shrink-0">
                        <div className={`p-1 rounded-full ${dark ? "bg-white" : "bg-black"}`}>
                            <img
                                src={seeker.avatar}
                                alt={profileSeeker.name}
                                className="w-24 h-24 rounded-full object-cover block"
                            />
                        </div>
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black" />
                    </div>

                    <div className="flex-1">
                        <p className={`text-xs font-semibold tracking-widest uppercase mb-1 ${dark ? "text-zinc-500" : "text-zinc-400"
                            }`}>
                            Property Seeker
                        </p>
                        <h1 className={`text-3xl font-bold tracking-tight mb-3 ${dark ? "text-white" : "text-black"
                            }`}>
                            {profileSeeker.name}
                        </h1>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <span className={`text-sm flex items-center gap-1.5 ${dark ? "text-zinc-400" : "text-zinc-500"
                                }`}>
                                <Mail size={13} className="opacity-50" /> {profileSeeker.email}
                            </span>
                            <span className={`text-sm flex items-center gap-1.5 ${dark ? "text-zinc-400" : "text-zinc-500"
                                }`}>
                                <Phone size={13} className="opacity-50" /> {seeker.phone}
                            </span>
                            <span className={`text-sm flex items-center gap-1.5 ${dark ? "text-zinc-400" : "text-zinc-500"
                                }`}>
                                <MapPin size={12} className="opacity-60" /> {seeker.city}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <button className={`
                            flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl 
                            border transition-all duration-200
                            ${dark
                                ? "border-zinc-700 text-zinc-300 hover:border-white hover:text-white bg-zinc-800"
                                : "border-zinc-300 text-zinc-600 hover:border-black hover:text-black bg-zinc-50"
                            }
                        `}>
                            <Pencil size={14} /> Edit Profile
                        </button>
                        <p className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
                            Member since {formatDate(seeker.joinedDate)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statItems.map((stat, i) => (
                    <StatCard
                        key={stat.label}
                        {...stat}
                        active={activeTab === i}
                        dark={dark}
                        onClick={() => handleTabChange(i)}
                    />
                ))}
            </div>

            <div className={`
                flex gap-1 p-1 rounded-2xl mb-6 w-fit border 
                ${dark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200"}
            `}>
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(i)}
                        className={`
                            px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 
                            cursor-pointer border-none
                            ${activeTab === i
                                ? dark
                                    ? "bg-white text-black shadow-lg"
                                    : "bg-black text-white shadow-lg"
                                : dark
                                    ? "text-zinc-500 hover:text-zinc-300 bg-transparent"
                                    : "text-zinc-400 hover:text-zinc-700 bg-transparent"
                            }
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {(activeTab === 0 || activeTab === 1) && (
                <div className="flex flex-wrap gap-2 mb-5">
                    <FilterDropdown
                        value={locationFilter}
                        onChange={setLocationFilter}
                        options={[
                            { value: "all", label: "All Locations" },
                            ...uniqueLocations.map(l => ({ value: l, label: l }))
                        ]}
                    />
                    <FilterDropdown
                        value={priceRangeFilter}
                        onChange={setPriceRangeFilter}
                        options={[
                            { value: "all", label: "All Prices" },
                            { value: "0-50", label: "Under ₹50L" },
                            { value: "50-100", label: "₹50L - ₹1Cr" },
                            { value: "100-150", label: "₹1Cr - ₹1.5Cr" },
                            { value: "150+", label: "Above ₹1.5Cr" }
                        ]}
                    />
                    {(locationFilter !== "all" || priceRangeFilter !== "all") && (
                        <button
                            onClick={() => {
                                setLocationFilter("all");
                                setPriceRangeFilter("all");
                            }}
                            className={`
                                px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 
                                ${dark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"}
                            `}
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}

            <div key={activeTab} style={{ animation: "fadeUp 0.3s ease" }}>
                {activeTab === 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredFavourites.length > 0 ? (
                            filteredFavourites.map((p) => (
                                <PropertyCard key={p.id} property={p} dark={dark} badge="Saved" />
                            ))
                        ) : (
                            <p className={`col-span-full text-center py-12 ${dark ? "text-zinc-500" : "text-zinc-400"
                                }`}>
                                No properties match your filters
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredViewed.length > 0 ? (
                            filteredViewed.map((p) => (
                                <PropertyCard key={p.id} property={p} dark={dark} badge="Viewed" />
                            ))
                        ) : (
                            <p className={`col-span-full text-center py-12 ${dark ? "text-zinc-500" : "text-zinc-400"
                                }`}>
                                No properties match your filters
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 2 && (
                    <div className="flex flex-col gap-4 max-w-2xl">
                        {scheduledVisits.map((v) => (
                            <VisitCard key={v.id} visit={v} dark={dark} />
                        ))}
                    </div>
                )}

                {activeTab === 3 && (
                    <div className="flex flex-col gap-4 max-w-2xl">
                        {enquiries.map((e) => (
                            <EnquiryCard key={e.id} enquiry={e} dark={dark} />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
