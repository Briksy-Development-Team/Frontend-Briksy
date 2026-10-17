import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SEARCH_CATEGORIES } from "../../../constants/searchCategories";
import { getOrganizations } from "../../../api/seeker/organization.api";
import { getProperties } from "../../../api/property/property.api";
import {
  organizationToBuilder,
  organizationToTrader,
  propertyToCard,
} from "../../../api/public.mappers";
import { serviceSlugForLabel } from "../../../constants/serviceCategories";
import type { FilterTab } from "../../../components/filter/filterTypes";
import TraderListCard from "../../../components/cards/trader/TraderListCard";
import BuilderListCard from "../../../components/cards/builder/BuilderListCard";
import PropertyListCard from "../../../components/cards/property/PropertyListCard";

const CATEGORIES = SEARCH_CATEGORIES.filter((c) => c.id !== "address");

const SEE_ALL: Record<string, string> = {
  "real-estate": "/buy",
  traders: "/professionals",
  builders: "/builders",
  agents: "/agents",
  commercial: "/commercials",
  auction: "/auctions",
};

export default function AppPopularNearYou({
  initialCategoryId = "real-estate",
  maxItems = 6,
}: {
  initialCategoryId?: string;
  maxItems?: number;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId);
  const [activeSubTab, setActiveSubTab] = useState<FilterTab | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId) ?? CATEGORIES[0];

  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
    setActiveSubTab(null);
  };

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const catId = activeCategory.id;
    const subTab = activeSubTab;

    const fetchData = async () => {
      try {
        if (catId === "real-estate") {
          const purpose = subTab === "Buy" ? "sell" : subTab === "Rent" ? "rent" : undefined;
          const status = subTab === "Sold" ? "SOLD" : undefined;
          const res = await getProperties({
            verified_only: 1,
            sort: "rating",
            purpose,
            transaction_status: status,
          }).catch(() => getProperties({ sort: "rating" }));

          if (!isCancelled) {
            setItems((res.data || []).map(propertyToCard));
          }
        } else if (catId === "commercial") {
          const status = subTab && ["Buy", "Lease", "Sold", "Leased"].includes(subTab)
            ? (subTab.toUpperCase() as "BUY" | "LEASE" | "SOLD" | "LEASED")
            : undefined;
          const res = await getProperties({
            category: "commercial",
            transaction_status: status,
            verified_only: 1,
          }).catch(() => getProperties({ category: "commercial" }))
            .catch(() => getProperties({}));

          if (!isCancelled) {
            setItems((res.data || []).map(propertyToCard));
          }
        } else if (catId === "auction") {
          const res = await getProperties({ auction_only: 1, verified_only: 1 })
            .catch(() => getProperties({ auction_only: 1 }))
            .catch(() => getProperties({}));

          if (!isCancelled) {
            setItems((res.data || []).map(propertyToCard));
          }
        } else if (catId === "agents") {
          const agentType =
            subTab === "Buyer Agents"
              ? "buyers-agent"
              : subTab === "Real Estate Agents"
              ? "real-estate-agent"
              : undefined;

          const res = await getOrganizations({
            type: agentType || "agents",
            verified_only: 1,
          }).catch(() => getOrganizations({ type: "agents" }))
            .catch(() => getOrganizations({}));

          if (!isCancelled) {
            setItems(
              (res.data || []).map((o) => {
                const trader = organizationToTrader(o);
                return {
                  ...trader,
                  role: o.type?.name || "Agent",
                  reviews: o.reviews_count || trader.reviews || 0,
                  tags: trader.tags || [],
                };
              })
            );
          }
        } else if (catId === "traders") {
          const slug = subTab ? serviceSlugForLabel(subTab) : undefined;
          const res = await getOrganizations({
            type: "trades-professionals",
            service_slug: slug,
            verified_only: 1,
          }).catch(() => getOrganizations({ type: "trades-professionals" }))
            .catch(() => getOrganizations({}));

          if (!isCancelled) {
            setItems(
              (res.data || []).map((o) => {
                const trader = organizationToTrader(o);
                return {
                  ...trader,
                  reviews: o.reviews_count || trader.reviews || 0,
                  tags: trader.tags || [],
                };
              })
            );
          }
        } else if (catId === "builders") {
          const res = await getOrganizations({
            type: "builders",
            verified_only: 1,
          }).catch(() => getOrganizations({ type: "builders" }))
            .catch(() => getOrganizations({}));

          if (!isCancelled) {
            setItems(
              (res.data || []).map((o) => {
                const builder = organizationToBuilder(o);
                return {
                  ...builder,
                  reviews: o.reviews_count || builder.reviews || 0,
                  tags: builder.tags || [],
                };
              })
            );
          }
        } else {
          // Other categories default to builder cards
          const res = await getOrganizations({ verified_only: 1 })
            .catch(() => getOrganizations({}));

          if (!isCancelled) {
            setItems((res.data || []).map(organizationToBuilder));
          }
        }
      } catch (err) {
        console.error("Failed to load category data:", err);
        if (!isCancelled) {
          setItems([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [activeCategory.id, activeSubTab]);

  const renderCard = (item: any) => {
    const catId = activeCategory.id;

    if (catId === "real-estate" || catId === "commercial" || catId === "auction") {
      return <PropertyListCard key={item.id} item={item} />;
    }

    if (catId === "agents" || catId === "traders") {
      return <TraderListCard key={item.id} item={item} />;
    }

    return <BuilderListCard key={item.id} item={item} />;
  };

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[1.25rem] font-medium text-primary-brown tracking-tight">
          Popular near you
        </h2>
        <Link
          to={SEE_ALL[activeCategory.id] ?? "/buy"}
          className="text-[0.875rem] text-primary-light-brown hover:text-primary-brown flex items-center gap-1 transition-colors"
        >
          See all
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 py-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`flex-1 shrink-0 py-2 px-5 text-[0.875rem] font-medium rounded-full whitespace-nowrap transition-all cursor-pointer ${
              cat.id === activeCategoryId
                ? "bg-white text-primary-brown shadow-xs"
                : "text-primary-light-brown hover:text-primary-brown"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Subcategory tabs */}
      {activeCategory.propTypes && activeCategory.propTypes.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5 -mx-4 px-4">
          {activeCategory.propTypes.map((prop) => {
            const isAll = prop.id === "all";
            const isSelected = isAll ? !activeSubTab : activeSubTab === prop.label;
            return (
              <button
                key={prop.id}
                type="button"
                onClick={() => setActiveSubTab(isAll ? null : (prop.label as FilterTab))}
                className={`py-1 px-3 text-[11px] rounded-full whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary-light-brown text-white font-medium"
                    : "bg-[#EBE5DC] text-primary-light-brown hover:bg-[#dfd7cc]"
                }`}
              >
                {prop.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Cards list */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center gap-2 text-primary-light-brown">
            <Loader2 size={24} className="animate-spin text-primary-light-brown" />
            <span className="text-xs">Loading {activeCategory.label.toLowerCase()}...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-xs text-primary-light-brown bg-white/40 rounded-2xl border border-[#EDE8E4] p-4">
            No {activeCategory.label.toLowerCase()} found near you currently.
          </div>
        ) : (
          items.slice(0, maxItems).map((item) => renderCard(item))
        )}
      </div>
    </section>
  );
}