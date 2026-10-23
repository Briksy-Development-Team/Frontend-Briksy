import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SwiperScroll from "../../swiper/SwiperScroll";
import {
  getCollectionItems,
  getCollections,
  removeItemFromCollection,
  type CollectionItem,
  type SeekerCollection,
} from "../../../api/seeker/collections.api";
import ResultsSkeleton from "../../skeletons/ResultsSkeleton";
import { organizationToBuilder, organizationToTrader, propertyToCard } from "../../../api/public.mappers";
import PropertyGridCard from "../../cards/property/PropertyGridCard";
import PropertyListCard from "../../cards/property/PropertyListCard";
import TraderGridCard from "../../cards/trader/TraderGridCard";
import TraderListCard from "../../cards/trader/TraderListCard";
import BuilderGridCard from "../../cards/builder/BuilderGridCard";
import BuilderListCard from "../../cards/builder/BuilderListCard";
import type { PublicOrganization } from "../../../api/seeker/organization.api";
import type { PublicProperty } from "../../../api/property/property.api";
import PlaceholderProperty from "../../../assets/profile/placeholderproperty.svg";

export default function CollectionDetailPage({ showBack = true }: { showBack?: boolean }) {
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

  if (loading) return <ResultsSkeleton count={8} showHeader={false} />;
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
    <div className="w-full max-w-[1530px] mx-auto space-y-8">
      {/* Header — centered name, back arrow left (optional) */}
      <div className="flex items-center justify-between gap-4">
        {showBack ? (
          <button
            type="button"
            aria-label="Back to Collections"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#F0EBE5] text-primary-brown transition-colors shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div className="w-9 shrink-0" />
        )}

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
          onRemove={(item) => void remove(item)}
          renderListCard={(item) => (
            <PropertyListCard item={propertyToCard(item.target as PublicProperty)} />
          )}
          renderGridCard={(item) => (
            <PropertyGridCard item={propertyToCard(item.target as PublicProperty)} />
          )}
        />

        <Section
          title="Professionals"
          items={professionals}
          onRemove={(item) => void remove(item)}
          renderListCard={(item) => {
            const org = organizationForItem(item);
            return org ? <TraderListCard item={organizationToTrader(org)} /> : null;
          }}
          renderGridCard={(item) => {
            const org = organizationForItem(item);
            return org ? <TraderGridCard item={organizationToTrader(org)} /> : null;
          }}
        />

        {builders.length > 0 && (
          <Section
            title="Builders / Org."
            items={builders}
            onRemove={(item) => void remove(item)}
            renderListCard={(item) => (
              <BuilderListCard item={organizationToBuilder(item.target as PublicOrganization)} />
            )}
            renderGridCard={(item) => (
              <BuilderGridCard item={organizationToBuilder(item.target as PublicOrganization)} />
            )}
          />
        )}
      </div>
    </div>
  );
}

function RemoveBtn({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label="Remove from Collection"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`absolute z-10 rounded-full bg-white/90 p-1.5 text-primary-brown shadow-md hover:bg-red-50 hover:text-red-600 transition-all ${
        className ?? "bottom-[4.5rem] right-3 opacity-0 group-hover:opacity-100"
      }`}
    >
      <X size={15} />
    </button>
  );
}

function Section({
  title,
  items,
  renderGridCard,
  renderListCard,
  onRemove,
}: {
  title: string;
  items: CollectionItem[];
  renderGridCard: (item: CollectionItem) => React.ReactNode;
  renderListCard: (item: CollectionItem) => React.ReactNode;
  onRemove: (item: CollectionItem) => void;
}) {
  const validItems = items.filter((item) => item.target && item.type);

  return (
    <div className="space-y-3">
      {/* Section head */}
      <div className="pb-[14px]">
        <h2 className="text-xl font-medium text-primary-brown leading-7 tracking-tight">
          {title}{validItems.length > 0 ? ` (${String(validItems.length).padStart(2, "0")})` : ""}
        </h2>
      </div>

      {validItems.length === 0 ? (
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
        <>
          {/* Under sm: Vertical stack of list cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {validItems.map((item) => (
              <div key={item.id} className="relative group">
                {renderListCard(item)}
                <RemoveBtn
                  onClick={() => onRemove(item)}
                  className="top-2.5 right-2.5 opacity-90 active:opacity-100"
                />
              </div>
            ))}
          </div>

          {/* sm and above: SwiperScroll with grid cards */}
          <div className="hidden sm:block">
            <SwiperScroll
              items={validItems}
              spaceBetween={12}
              className="!ml-0"
              renderItem={(item: any) => (
                <div className="relative group">
                  {renderGridCard(item)}
                  <RemoveBtn onClick={() => onRemove(item)} />
                </div>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}