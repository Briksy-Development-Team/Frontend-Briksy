import { useEffect, useState } from "react";
import { X, Bookmark } from "lucide-react";
import { Link, useParams } from "react-router-dom";
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

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
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
        setCollection(
          (collections.data ?? []).find((item) => item.id === id) ?? null,
        );
        setItems(itemPage.data ?? []);
      })
      .catch(() => {
        if (active) setError("Unable to load this Collection.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const remove = async (item: CollectionItem) => {
    if (!id || !item.target || !item.type) return;
    await removeItemFromCollection(id, item.type, item.target.id);
    setItems((current) =>
      current.filter((currentItem) => currentItem.id !== item.id),
    );
  };

  if (loading)
    return (
      <div className="py-16 text-center text-primary-light-brown">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-brown border-t-transparent mb-3" />
        <p className="text-sm">Loading Collection...</p>
      </div>
    );
  if (error) return <p className="text-red-700 font-medium">{error}</p>;
  if (!collection)
    return (
      <p className="text-primary-light-brown">This Collection was not found.</p>
    );

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.875rem] font-medium text-primary-brown tracking-tight">
            {collection.name}
          </h1>
          <p className="mt-1 text-sm text-primary-light-brown font-medium">
            {items.length} {items.length === 1 ? "saved item" : "saved items"}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center text-primary-light-brown border border-[#EDE8E4]/80 shadow-sm max-w-md mx-auto">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F4EE] text-primary-brown mb-4">
            <Bookmark size={26} />
          </div>
          <h3 className="text-base font-medium text-primary-brown mb-1">
            This collection is empty
          </h3>
          <p className="text-xs text-primary-light-brown mb-5">
            Explore listings across Briksy and save them to this collection.
          </p>
          <Link
            to="/result?type=all"
            className="inline-block rounded-full bg-primary-brown px-6 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-primary-brown/90 transition-colors"
          >
            Browse properties
          </Link>
        </div>
      ) : (
        <Swiper
          modules={[Mousewheel]}
          spaceBetween={14}
          slidesPerView="auto"
          watchOverflow={false}
          grabCursor
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          slidesOffsetBefore={0}
          slidesOffsetAfter={0}
          className="!ml-0 [overscroll-behavior-x:contain] touch-pan-y"
        >
          {items.map((item) => {
            if (!item.target || !item.type) return null;
            return (
              <SwiperSlide key={item.id} className="!w-[19.4375rem]">
                <div className="relative group">
                  {item.type === "property" ? (
                    <PropertyGridCard
                      item={propertyToCard(item.target as PublicProperty)}
                    />
                  ) : item.type === "organization" ? (
                    <TraderGridCard
                      item={organizationToTrader(
                        item.target as PublicOrganization,
                      )}
                    />
                  ) : (
                    <div className="rounded-2xl bg-white p-6 text-primary-brown">
                      Saved service
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label="Remove from Collection"
                    title="Remove from Collection"
                    onClick={() => void remove(item)}
                    className="absolute bottom-20 right-4 z-10 rounded-full bg-white/90 p-2 text-primary-brown shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}
