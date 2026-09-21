import Placeholderproperty from "../../../assets/profile/placeholderproperty.svg";
import { useEffect, useState } from "react";
import { getSeekerFavorites, type FavoriteItem, type FavoriteType } from "../../../api/seeker/seeker.api";

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
            {items.length > 0 ? <div className="grid gap-4 md:grid-cols-2">{items.map((item) => <div key={item.id} className="rounded-xl border border-[#eadfd2] p-4"><p className="font-medium text-primary-brown">{(item.target as any)?.title || (item.target as any)?.name || "Saved item"}</p><p className="text-xs text-primary-light-brown mt-1">{(item.target as any)?.description || (item.target as any)?.address || ""}</p></div>)}</div> : <>
            <img src={Placeholderproperty} alt="" />
            <p>No saved searches yet</p>
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
                    Saved searches
                </h1>

                <p className="text-[0.75rem] text-primary-light-brown">
                    We'll tell you when something new matches.
                </p>
            </div>

            <div className="space-y-[2.5rem]">
                <SavedSection title="Properties" items={favorites.property} />
                <SavedSection title="Services" items={favorites.service} />
                <SavedSection title="Professionals / Builders" items={favorites.organization} />
            </div>

        </div>
    );
};

export default Mysavedata;
