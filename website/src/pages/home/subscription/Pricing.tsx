// Pricing.tsx — /subs route
import { useEffect, useMemo, useState } from 'react';
import { getPublicPlans, type PublicPlan } from '../../../api/subscription/plan.api';
import { ALL_TABS, type CellValue, type FeatureSection, type Plan, type TabData } from './data/subscription.data';
import SubscriptionTabs from './components/SubscriptionTabs';
import PricingCards from './components/PricingCards';
import FeatureTable from './components/FeatureTable';

const Pricing = () => {
  const [activeTabId, setActiveTabId] = useState(ALL_TABS[0].id);
  const [publicPlans, setPublicPlans] = useState<PublicPlan[]>([]);

  useEffect(() => {
    let active = true;
    void getPublicPlans().then((plans) => {
      if (active) setPublicPlans(plans);
    }).catch(() => {
      // Keep the designed fallback content if the public catalogue is unavailable.
    });
    return () => { active = false; };
  }, []);

  const tabs = useMemo(() => ALL_TABS.map((tab) => buildLiveTab(tab, publicPlans)), [publicPlans]);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  return (
    <main className="min-h-screen md:mt-20 font-helvetica text-primary-brown font-helvetica">

      <section className="pt-12 pb-8 px-[5%] text-center">
        <h1 className="text-[2rem] md:text-[3rem] font-normal tracking-tight leading-tight text-primary-brown">
          Pricing for professionals and businesses
        </h1>
      </section>

      <section className="px-[5%] pb-8">
        <SubscriptionTabs
          tabs={tabs}
          activeId={activeTabId}
          onChange={setActiveTabId}
        />
      </section>

      <section
        key={activeTabId}
        className="px-[5%] pb-12 animate-fade-in"
      >
        <PricingCards plans={activeTab.plans} stats={activeTab.stats} />
      </section>

      <section className="px-[4%] md:px-[5%] pb-20">
        <FeatureTable plans={activeTab.plans} sections={activeTab.sections} />
      </section>

    </main>
  );
};

export default Pricing;

const familyByTab: Record<string, string> = {
  properties: 'property_owner',
  builder: 'builders',
  agents: 'buyers_agent',
  traders: 'trades_professional',
  commercial: 'commercial',
};

const toFeatureValue = (feature: PublicPlan['features'][number]): CellValue => {
  if (!feature.enabled) return '—';
  if (feature.value !== null && feature.value !== undefined && feature.value > 0) return `Up to ${feature.value}`;
  return true;
};

const buildLiveTab = (tab: TabData, plans: PublicPlan[]): TabData => {
  const livePlans = plans.filter((plan) => plan.plan_family === familyByTab[tab.id]);
  if (!livePlans.length) return tab;

  const featureNames = Array.from(new Set(livePlans.flatMap((plan) => plan.features.map((feature) => feature.name))));
  const sections: FeatureSection[] = featureNames.length
    ? [{
        title: 'Plan Features',
        rows: featureNames.map((name) => ({
          label: name,
          values: livePlans.map((plan) => toFeatureValue(plan.features.find((feature) => feature.name === name) ?? { name, enabled: false, value: null })),
        })),
      }]
    : tab.sections;

  const mappedPlans: Plan[] = livePlans.map((plan, index) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description ?? tab.plans[index]?.description ?? 'A plan built for your business.',
    price: plan.show_price === false ? null : (plan.monthly_price ?? plan.yearly_price ?? null),
    ctaLabel: `Get ${plan.name}`,
    popular: Boolean(plan.popular),
    badge: plan.popular ? 'Most Popular' : undefined,
    highlights: plan.features.filter((feature) => feature.enabled).slice(0, 5).map((feature) => feature.value ? `${feature.name}: up to ${feature.value}` : feature.name),
  }));

  return { ...tab, plans: mappedPlans, sections };
};
