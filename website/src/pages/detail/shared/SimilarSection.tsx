import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SwiperScroll from "../../../components/swiper/SwiperScroll";
import PropertyGridCard from "../../../components/cards/property/PropertyGridCard";
import BuilderGridCard from "../../../components/cards/builder/BuilderGridCard";
import TraderGridCard from "../../../components/cards/trader/TraderGridCard";
import { getProperties } from "../../../api/property/property.api";
import { getOrganizations } from "../../../api/seeker/organization.api";
import {
  propertyToCard,
  organizationToBuilder,
  organizationToTrader,
} from "../../../api/public.mappers";

export type SimilarType = "property" | "agent" | "builder" | "trader";

export interface SimilarSectionProps<T = any> {
  /** The listing type to fetch similar items for (property, agent, builder, trader) */
  type?: SimilarType;
  /** Current entity ID to exclude from similar results */
  currentId?: string | number;
  /** Custom heading text. Defaults to "Similar Properties/Agents/Builders/Professionals" based on type */
  title?: string;
  /** Link for "View All". Defaults to /buy, /agents, /builders, /professionals based on type */
  viewAllHref?: string;
  /** Optional custom items to bypass internal fetch */
  items?: T[];
  /** Optional custom renderer for each slide item */
  renderItem?: (item: T, index: number) => ReactNode;
  /** Additional container styling */
  className?: string;
}

const DEFAULTS: Record<SimilarType, { title: string; href: string }> = {
  property: { title: "Similar Properties", href: "/buy" },
  agent: { title: "Similar Agents", href: "/agents" },
  builder: { title: "Similar Builders", href: "/builders" },
  trader: { title: "Similar Professionals", href: "/professionals" },
};

/**
 * ponytail: Dynamic shared "Similar" carousel section for all detail pages.
 * Handles self-fetching or accepts custom items/renderer.
 */
export default function SimilarSection<T = any>({
  type = "property",
  currentId,
  title,
  viewAllHref,
  items: propItems,
  renderItem,
  className = "",
}: SimilarSectionProps<T>) {
  const [fetchedItems, setFetchedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If items were passed directly as props, no need to fetch
    if (propItems !== undefined) return;

    let active = true;
    setLoading(true);

    const load = async () => {
      try {
        if (type === "property") {
          const res = await getProperties({ per_page: 8 });
          if (!active) return;
          const mapped = (res.data || [])
            .filter((p) => String(p.id) !== String(currentId))
            .map(propertyToCard);
          setFetchedItems(mapped);
          return;
        }

        if (type === "agent") {
          let orgs: any[] = [];
          try {
            const res = await getOrganizations({ type: "real-estate-agent", verified_only: 1, per_page: 8 });
            orgs = res.data || [];
          } catch {
            // fallback
          }
          if (orgs.length === 0) {
            const all = await getOrganizations({ verified_only: 1, per_page: 12 });
            orgs = (all.data || []).filter((o) => o.type?.module === "Agents" || o.type?.slug?.includes("agent"));
          }
          if (!active) return;
          const mapped = orgs
            .filter((o) => String(o.id) !== String(currentId) && o.slug !== String(currentId))
            .map((o) => ({ ...organizationToBuilder(o), profileType: "agent" as const }));
          setFetchedItems(mapped);
          return;
        }

        if (type === "builder") {
          let orgs: any[] = [];
          try {
            const res = await getOrganizations({ type: "builders", verified_only: 1, per_page: 8 });
            orgs = res.data || [];
          } catch {
            // fallback
          }
          if (orgs.length === 0) {
            const all = await getOrganizations({ verified_only: 1, per_page: 12 });
            orgs = (all.data || []).filter((o) => o.type?.module === "Builders" || o.type?.slug?.includes("builder"));
          }
          if (!active) return;
          const mapped = orgs
            .filter((o) => String(o.id) !== String(currentId) && o.slug !== String(currentId))
            .map(organizationToBuilder);
          setFetchedItems(mapped);
          return;
        }

        if (type === "trader") {
          let orgs: any[] = [];
          try {
            const res = await getOrganizations({ type: "trades-professionals", verified_only: 1, per_page: 8 });
            orgs = res.data || [];
          } catch {
            // fallback
          }
          if (orgs.length === 0) {
            const all = await getOrganizations({ verified_only: 1, per_page: 12 });
            orgs = (all.data || []).filter((o) => o.type?.module === "Services" || o.type?.slug?.includes("trade"));
          }
          if (!active) return;
          const mapped = orgs
            .filter((o) => String(o.id) !== String(currentId) && o.slug !== String(currentId))
            .map(organizationToTrader);
          setFetchedItems(mapped);
          return;
        }
      } catch (err) {
        console.error("Failed to load similar listings:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [type, currentId, propItems]);

  const items = propItems ?? fetchedItems;

  if (!loading && items.length === 0) {
    return null;
  }

  const defaultMeta = DEFAULTS[type] ?? DEFAULTS.property;
  const heading = title ?? defaultMeta.title;
  const linkHref = viewAllHref ?? defaultMeta.href;

  const defaultRenderer = (item: any) => {
    switch (type) {
      case "property":
        return <PropertyGridCard item={item} />;
      case "builder":
      case "agent":
        return <BuilderGridCard item={item} />;
      case "trader":
        return <TraderGridCard item={item} />;
      default:
        return <PropertyGridCard item={item} />;
    }
  };

  return (
    <div className={`mt-10 flex flex-col gap-6 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] md:text-[30px] font-medium leading-[36px] tracking-[-0.03em] text-primary-brown">
          {heading}
        </h2>
        {linkHref && (
          <Link
            to={linkHref}
            className="text-[14px] md:text-[16px] font-medium text-[#8B6F54] hover:text-[#562F00] flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowUpRight size={18} />
          </Link>
        )}
      </div>

      <SwiperScroll
        items={items}
        spaceBetween={16}
        className="!ml-0"
        renderItem={renderItem ?? defaultRenderer}
      />
    </div>
  );
}
