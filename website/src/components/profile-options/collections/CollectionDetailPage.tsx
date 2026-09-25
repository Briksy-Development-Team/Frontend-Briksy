import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCollectionItems, getCollections, removeItemFromCollection, type CollectionItem, type SeekerCollection } from "../../../api/seeker/collections.api";
import { organizationToTrader, propertyToCard } from "../../../api/public.mappers";
import PropertyGridCard from "../../cards/property/PropertyGridCard";
import TraderGridCard from "../../cards/trader/TraderGridCard";
import type { PublicOrganization } from "../../../api/seeker/organization.api";
import type { PublicProperty } from "../../../api/property/property.api";

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
    void Promise.all([getCollections(), getCollectionItems(id)]).then(([collections, itemPage]) => {
      if (!active) return;
      setCollection((collections.data ?? []).find((item) => item.id === id) ?? null);
      setItems(itemPage.data ?? []);
    }).catch(() => { if (active) setError("Unable to load this Collection."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const remove = async (item: CollectionItem) => {
    if (!id || !item.target || !item.type) return;
    await removeItemFromCollection(id, item.type, item.target.id);
    setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
  };

  if (loading) return <p className="text-primary-light-brown">Loading Collection...</p>;
  if (error) return <p className="text-red-700">{error}</p>;
  if (!collection) return <p className="text-primary-light-brown">This Collection was not found.</p>;

  return <div className="w-full space-y-6">
    <button type="button" onClick={() => navigate("/profile/collections")} className="flex items-center gap-2 text-sm text-primary-brown"><ArrowLeft size={17} /> Collections</button>
    <div><h1 className="text-[1.875rem] font-medium text-primary-brown">{collection.name}</h1><p className="mt-1 text-sm text-primary-light-brown">{items.length} {items.length === 1 ? "saved item" : "saved items"}</p></div>
    {items.length === 0 ? <div className="rounded-2xl bg-white p-12 text-center text-primary-light-brown"><p>This collection is empty.</p><Link to="/professionals" className="mt-4 inline-block rounded-full bg-primary-brown px-5 py-2 text-sm text-white">Browse listings</Link></div> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => {
      if (!item.target || !item.type) return null;
      return <div key={item.id} className="relative">{item.type === "property" ? <PropertyGridCard item={propertyToCard(item.target as PublicProperty)} /> : item.type === "organization" ? <TraderGridCard item={organizationToTrader(item.target as PublicOrganization)} /> : <div className="rounded-2xl bg-white p-6 text-primary-brown">Saved service</div>}<button type="button" aria-label="Remove from Collection" title="Remove from Collection" onClick={() => void remove(item)} className="absolute bottom-20 right-4 z-10 rounded-full bg-white/95 p-2 text-primary-brown shadow"><X size={16} /></button></div>;
    })}</div>}
  </div>;
}
