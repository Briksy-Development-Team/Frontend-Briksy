import Placeholderproperty from "../../../assets/profile/placeholderproperty.svg";
import { useEffect, useState } from "react";
import { getSeekerFavorites, type FavoriteItem, type FavoriteType } from "../../../api/seeker/seeker.api";

type SavedTarget = {
    title?: string | null;
    name?: string | null;
    description?: string | null;
    address?: string | null;
    floor_area?: number | string | null;
    floor_area_unit?: string | null;
    land_area?: number | string | null;
    land_area_unit?: string | null;
    carpet_area?: number | string | null;
    carpet_area_unit?: string | null;
    features?: Array<{ name: string; quantity?: number | string | null }>;
};

interface SavedSectionProps {
  title: string;
  items: FavoriteItem[];
}

const SavedSection = ({ title, items }: SavedSectionProps) => (
    <div className="space-y-2 ">
        <div>
            <p className="text-[1.25rem] font-medium text-primary-brown">
                {title}
            </p>
        </div>
        <div className="bg-white w-full flex flex-col py-[2rem] md:py-[2.5rem] px-[1.5rem] md:px-[2.5rem] space-y-[1rem] rounded-[1rem]">
            {items.length > 0 ? <div className="grid gap-4 md:grid-cols-2">{items.map((item) => { const target = item.target as SavedTarget | null; const areas = [target?.floor_area && `Floor ${target.floor_area} ${target.floor_area_unit || 'sqm'}`, target?.land_area && `Land ${target.land_area} ${target.land_area_unit || 'sqm'}`, target?.carpet_area && `Carpet ${target.carpet_area} ${target.carpet_area_unit || 'sqm'}`].filter(Boolean).join(' · '); const amenities = (target?.features || []).filter((feature) => feature.quantity == null || Number(feature.quantity) > 0).map((feature) => feature.quantity == null ? feature.name : `${feature.quantity} ${feature.name}`).join(' · '); return <div key={item.id} className="rounded-xl border border-[#eadfd2] p-4"><p className="font-medium text-primary-brown">{target?.title || target?.name || "Saved item"}</p><p className="text-xs text-primary-light-brown mt-1">{target?.description || target?.address || ""}</p>{areas ? <p className="text-xs text-primary-light-brown mt-2">{areas}</p> : null}{amenities ? <p className="text-xs text-primary-light-brown mt-1">{amenities}</p> : null}</div>})}</div> : <>
            <img src={Placeholderproperty} alt="" />
            <p>No liked items yet</p>
            <p className="md:w-[40%] mx-auto text-center text-[0.75rem] md:text-1rem">
                Run a search, then hit Save. We'll email you when a new verified
                professional or listing matches what you're after.
            </p>
            <span className="space-x-[0.75rem] space-y-3 flex flex-col md:flex-row  w-full justify-center">
                <button className="rounded-[62.4375rem] bg-primary-brown px-[1.6rem] py-2 md:py-[0.875rem] text-[0.750rem] md:text-[0.875rem] text-white font-medium">
                    Find a professional
                </button>
                <button className="rounded-[62.4375rem] border border-gray-400 px-[1.6rem] py-2 md:py-[0.875rem]  text-[0.750rem] md:text-[0.875rem] text-primary-brown font-medium">
                    Browse properties
                </button>
            </span>
            </>}
        </div>
    </div>
);

const Mysavedata = () => {
    const [favorites, setFavorites] = useState<Record<FavoriteType, FavoriteItem[]>>({ property: [], organization: [], service: [] });

    useEffect(() => {
        void Promise.all((['property', 'organization', 'service'] as FavoriteType[]).map(async (type) => {
            try { const response = await getSeekerFavorites(type); setFavorites((current) => ({ ...current, [type]: response.data ?? [] })); } catch { /* auth/API errors leave the section empty */ }
        }));
    }, []);

    return (
        <div className="w-full space-y-[2.5rem]">

            <div className="space-y-1">
                <h1 className="text-[1.875rem] hidden md:flex font-medium text-primary-brown">
                    Like searches
                </h1>

                <p className="text-[0.75rem] text-primary-light-brown">
                    Your liked properties, services, and professionals appear here.
                </p>
            </div>

            <div className="space-y-[2.5rem]">
                <SavedSection title="Real Estate" items={favorites.property} />
                <SavedSection title="Services" items={favorites.service} />
                <SavedSection title="Professionals / Builders" items={favorites.organization} />
            </div>

        </div>
    );
};

export default Mysavedata;
