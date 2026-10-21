import { SwiperSection, type SwiperSectionProps, type SubCategory } from "../../components/swiper";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import { getOrganizations, type PublicOrganization } from "../../api/seeker/organization.api";
import { getProperties, type PublicProperty } from "../../api/property/property.api";
import { organizationToBuilder, organizationToTrader, propertyToCard } from "../../api/public.mappers";
import { useAgentTypes, useServiceCategories } from "../../hooks/useTaxonomy";

export type { SubCategory, SwiperSectionProps as HomeListSwiperProps };
export const HomeListSwiper = SwiperSection;

// ─── Pre-configured section components for Home page ─────────────────────────

export const BuilderListSection = () => (
  <SwiperSection<PublicOrganization>
    className="-mt-10 md:mt-0"
    title="Featured Builders"
    subtitle="Trusted builders"
    viewAllHref="/builders"
    fetchItems={() => getOrganizations({ type: "builders", verified_only: 1 }).then((r) => r.data)}
    renderItem={(item) => <BuilderGridCard item={organizationToBuilder(item)} />}
  />
);

export const PropertyListSection = () => (
  <SwiperSection<PublicProperty>
    title="Featured Properties"
    subtitle="Trusted agencies and builders"
    viewAllHref="/buy"
    fetchItems={() => getProperties({ verified_only: 1, sort: "rating" }).then((r) => (r.data || []).slice(0, 5))}
    renderItem={(item) => <PropertyGridCard item={propertyToCard(item)} />}
  />
);

export const AgentListSection = () => {
  const { data: agentTypes = [] } = useAgentTypes();

  const fetchAgents = async (category?: SubCategory) => {
    let orgs: PublicOrganization[] = [];
    try {
      const res = await getOrganizations({
        type: category?.slug || "real-estate-agent",
        verified_only: 1,
      });
      orgs = res.data || [];
    } catch {
      // fallback if specific type endpoint fails
    }
    if (orgs.length === 0) {
      const all = await getOrganizations({ verified_only: 1 });
      orgs = (all.data || []).filter((o) =>
        category?.slug
          ? o.type?.slug === category.slug || o.type?.name?.toLowerCase().includes(category.label.toLowerCase())
          : o.type?.module === "Agents" || o.type?.slug?.includes("agent")
      );
    }
    return orgs;
  };

  return (
    <SwiperSection<PublicOrganization>
      title="Featured Agents"
      subtitle="Top-rated property agents and buyer advocates"
      viewAllHref="/agents"
      categories={agentTypes}
      fetchItems={fetchAgents}
      renderItem={(item) => (
        <BuilderGridCard
          item={{
            ...organizationToBuilder(item),
            profileType: "agent",
          }}
        />
      )}
    />
  );
};

export const ServiceListSection = () => {
  const { data: categories = [] } = useServiceCategories();

  return (
    <SwiperSection<PublicOrganization>
      title="Trades & Professionals"
      subtitle="Verified solo traders and specialists"
      viewAllHref="/professionals"
      categories={categories}
      fetchItems={(category) =>
        getOrganizations({
          type: "trades-professionals",
          service_slug: category?.slug,
          verified_only: 1,
        }).then((r) => r.data)
      }
      renderItem={(item) => <TraderGridCard item={organizationToTrader(item)} />}
    />
  );
};

export default SwiperSection;
