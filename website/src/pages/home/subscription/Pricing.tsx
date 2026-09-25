// Pricing.tsx — /subs route
import { useState } from 'react';
import { ALL_TABS } from './data/subscription.data';
import SubscriptionTabs from './components/SubscriptionTabs';
import PricingCards from './components/PricingCards';
import FeatureTable from './components/FeatureTable';

const Pricing = () => {
  const [activeTabId, setActiveTabId] = useState(ALL_TABS[0].id);

  const activeTab = ALL_TABS.find((t) => t.id === activeTabId) ?? ALL_TABS[0];

  return (
    <main className="min-h-screen md:mt-20 font-helvetica text-primary-brown font-helvetica">

      <section className="pt-12 pb-8 px-[5%] text-center">
        <h1 className="text-[2rem] md:text-[3rem] font-normal tracking-tight leading-tight text-primary-brown">
          Pricing for professionals and businesses
        </h1>
      </section>

      <section className="px-[5%] pb-8">
        <SubscriptionTabs
          tabs={ALL_TABS}
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
