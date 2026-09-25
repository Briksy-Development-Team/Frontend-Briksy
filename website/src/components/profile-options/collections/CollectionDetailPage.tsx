import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCollectionProperties, getCollections, removePropertyFromCollection, type SeekerCollection } from "../../../api/seeker/collections.api";
import { propertyToCard } from "../../../api/public.mappers";
import PropertyGridCard from "../../cards/property/PropertyGridCard";
import type { PublicProperty } from "../../../api/property/property.api";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<SeekerCollection | null>(null);
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    void Promise.all([getCollections(), getCollectionProperties(id)]).then(([collections, propertyPage]) => {
      if (!active) return;
      setCollection((collections.data ?? []).find((item) => item.id === id) ?? null);
      setProperties(propertyPage.data ?? []);
    }).catch(() => { if (active) setError("Unable to load this Collection."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const remove = async (propertyId: string) => {
    if (!id) return;
    await removePropertyFromCollection(id, propertyId);
    setProperties((items) => items.filter((item) => item.id !== propertyId));
  };

  if (loading) return <p className="text-primary-light-brown">Loading Collection...</p>;
  if (error) return <p className="text-red-700">{error}</p>;
  if (!collection) return <p className="text-primary-light-brown">This Collection was not found.</p>;

  return <div className="w-full space-y-6"><button type="button" onClick={() => navigate("/profile/collections")} className="flex items-center gap-2 text-sm text-primary-brown"><ArrowLeft size={17} /> Collections</button><div><h1 className="text-[1.875rem] font-medium text-primary-brown">{collection.name}</h1><p className="mt-1 text-sm text-primary-light-brown">{properties.length} {properties.length === 1 ? "property" : "properties"}</p></div>{properties.length === 0 ? <div className="rounded-2xl bg-white p-12 text-center text-primary-light-brown"><p>This collection is empty.</p><Link to="/buy" className="mt-4 inline-block rounded-full bg-primary-brown px-5 py-2 text-sm text-white">Browse properties</Link></div> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{properties.map((property) => <div key={property.id} className="relative"><PropertyGridCard item={propertyToCard(property)} /><button type="button" aria-label="Remove from Collection" title="Remove from Collection" onClick={() => void remove(property.id)} className="absolute bottom-20 right-4 z-10 rounded-full bg-white/95 p-2 text-primary-brown shadow"><X size={16} /></button></div>)}</div>}</div>;
}
