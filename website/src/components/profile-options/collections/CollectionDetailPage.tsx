import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel } from "swiper/modules";
import {
  getCollectionItems,
  getCollections,
  removeItemFromCollection,
  type CollectionItem,
  type SeekerCollection,
} from "../../../api/seeker/collections.api";
import { organizationToTrader, propertyToCard } from "../../../api/public.mappers";
import PropertyGridCard from "../../cards/property/PropertyGridCard";
import TraderGridCard from "../../cards/trader/TraderGridCard";
import type { PublicOrganization } from "../../../api/seeker/organization.api";
import type { PublicProperty } from "../../../api/property/property.api";
import PlaceholderProperty from "../../../assets/profile/placeholderproperty.svg";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<SeekerCollection | null>(null);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    void Promise.all([getCollections(), getCollectionItems(id)])
      .then(([collections, itemPage]) => {
        if (!active) return;
        setCollection((collections.data ?? []).find((c) => c.id === id) ?? null);
        setItems(itemPage.data ?? []);
      })
      .catch(() => { if (active) setError("Unable to load this Collection."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const remove = async (item: CollectionItem) => {
    if (!id || !item.target || !item.type) return;
    await removeItemFromCollection(id, item.type, item.target.id);
    setItems((cur) => cur.filter((i) => i.id !== item.id));
  };

  if (loading) return (
    <div className="py-16 text-center text-primary-light-brown">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-brown border-t-transparent mb-3" />
      <p className="text-sm">Loading Collection...</p>
    </div>
  );
  if (error) return <p className="text-red-700 font-medium">{error}</p>;
  if (!collection) return <p className="text-primary-light-brown">This Collection was not found.</p>;

  const properties = items.filter((i) => i.type === "property");
  const organizationForItem = (item: CollectionItem): PublicOrganization | null => {
    if (item.type === "organization") return item.target as PublicOrganization | null;
    return ((item.target as { organization?: PublicOrganization | null } | null)?.organization) ?? null;
  };

  const isBuilderOrganization = (item: CollectionItem): boolean => {
    const organization = organizationForItem(item);
    return Boolean(
      item.type === "organization"
      && organization
      && (organization.type?.module === "Builders" || organization.type?.slug === "builders"),
    );
  };

  const professionals = items.filter((item) =>
    (item.type === "organization" || item.type === "service") && !isBuilderOrganization(item),
  );
  const builders = items.filter(isBuilderOrganization);

  // Count summary for header  e.g. "06 properties, 02 traders"
  const parts: string[] = [];
  if (properties.length) parts.push(`${String(properties.length).padStart(2, "0")} ${properties.length === 1 ? "property" : "properties"}`);
  if (professionals.length) parts.push(`${String(professionals.length).padStart(2, "0")} ${professionals.length === 1 ? "trader" : "traders"}`);

  return (
    <div className="w-full space-y-8">
      {/* Header — centered name, back arrow left */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          aria-label="Back to Collections"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#F0EBE5] text-primary-brown transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-1.5 text-center min-w-0">
          <h1 className="text-xl font-medium text-primary-brown leading-7 tracking-tight truncate max-w-[16rem] md:max-w-none">
            {collection.name}
          </h1>
          {parts.length > 0 && (
            <p className="text-sm text-[#6B7280] leading-5 tracking-wide">
              {parts.join(", ")}
            </p>
          )}
        </div>

        {/* Spacer keeps heading centered */}
        <div className="w-9 shrink-0" />
      </div>

      {/* Sections */}
      <div className="space-y-8">
        <Section
          title="Real Estate"
          items={properties}
          renderCard={(item) => (
            <div className="relative group">
              <PropertyGridCard item={propertyToCard(item.target as PublicProperty)} />
              <RemoveBtn onClick={() => void remove(item)} />
            </div>
          )}
        />

        <Section
          title="Professionals"
          items={professionals}
          renderCard={(item) => (
            <div className="relative group">
              {organizationForItem(item) && <TraderGridCard item={organizationToTrader(organizationForItem(item)!)} />}
              <RemoveBtn onClick={() => void remove(item)} />
            </div>
          )}
        />

        {builders.length > 0 && (
          <Section
            title="Builders / Org."
            items={builders}
            renderCard={(item) => (
              <div className="relative group">
                <TraderGridCard item={organizationToTrader(item.target as PublicOrganization)} />
                <RemoveBtn onClick={() => void remove(item)} />
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Remove from Collection"
      onClick={onClick}
      className="absolute bottom-[4.5rem] right-3 z-10 rounded-full bg-white/90 p-1.5 text-primary-brown shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
    >
      <X size={15} />
    </button>
  );
}

function Section({
  title,
  items,
  renderCard,
}: {
  title: string;
  items: CollectionItem[];
  renderCard: (item: CollectionItem) => React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {/* Section head */}
      <div className="pb-[14px]">
        <h2 className="text-xl font-medium text-primary-brown leading-7 tracking-tight">
          {title}{items.length > 0 ? ` (${String(items.length).padStart(2, "0")})` : ""}
        </h2>
      </div>

      {items.length === 0 ? (
        /* Empty state card — matches Figma exactly */
        <div className="w-full rounded-2xl border border-[#EDE8E4] bg-white">
          <div className="flex flex-col items-center gap-4 py-[72px] px-10 text-center">
            <img src={PlaceholderProperty} alt="" className="w-[216px]" />
            <h3 className="text-2xl font-medium text-primary-brown leading-8 tracking-tight">
              No saved searches yet
            </h3>
            <p className="text-base text-[#7C5F42] leading-7 max-w-[440px]">
              Run a search, then hit Save. We'll email you when a new verified professional or listing matches what you're after.
            </p>
            <div className="flex gap-3 pt-1.5 flex-wrap justify-center">
              <Link
                to="/professionals"
                className="rounded-full bg-primary-brown text-white px-[26px] py-[14px] text-sm font-medium hover:bg-primary-brown/90 transition-colors"
              >
                Find a professional
              </Link>
              <Link
                to="/buy"
                className="rounded-full border border-[#EDE8E4] bg-white text-primary-brown px-[26px] py-[14px] text-sm font-medium hover:bg-[#F8F4EE] transition-colors"
              >
                Browse properties
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <Swiper
          modules={[Mousewheel]}
          spaceBetween={12}
          slidesPerView="auto"
          watchOverflow={false}
          grabCursor
          mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
          slidesOffsetBefore={0}
          slidesOffsetAfter={0}
          className="!ml-0 [overscroll-behavior-x:contain] touch-pan-y"
        >
          {items.map((item) => {
            if (!item.target || !item.type) return null;
            return (
              <SwiperSlide key={item.id} className="!w-[19.4375rem]">
                {renderCard(item)}
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}
