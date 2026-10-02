// Pricing.tsx — /subs route
import { useEffect, useMemo, useState } from 'react';
import { getPublicPlans, type PublicPlan } from '../../../api/subscription/plan.api';
import { ALL_TABS, type CellValue, type FeatureSection, type Plan, type TabData } from './data/subscription.data';
import SubscriptionTabs from './components/SubscriptionTabs';
import PricingCards from './components/PricingCards';
import FeatureTable from './components/FeatureTable';
import { createPricingInquiry } from '../../../api/subscription/plan.api';
import { getStoredAuth } from '../../../auth/auth.storage';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [activeTabId, setActiveTabId] = useState(ALL_TABS[0].id);
  const [publicPlans, setPublicPlans] = useState<PublicPlan[]>([]);
  const [plansLoaded, setPlansLoaded] = useState(false);
  const [contactPlan, setContactPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company_name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    void getPublicPlans().then((plans) => {
      if (active) {
        setPublicPlans(plans);
        setPlansLoaded(true);
      }
    }).catch(() => {
      // Keep the designed fallback content if the public catalogue is unavailable.
      if (active) setPlansLoaded(true);
    });
    return () => { active = false; };
  }, []);

  const openContact = (plan: Plan) => {
    navigate(`/checkout?plan=${encodeURIComponent(plan.id)}`);
    const auth = getStoredAuth();
    setContactPlan(plan);
    setSubmitted(false);
    setForm((current) => ({ ...current, name: auth?.user?.name ?? current.name, email: auth?.user?.email ?? current.email }));
  };

  const submitInquiry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!contactPlan) return;
    setSubmitting(true);
    try {
      await createPricingInquiry({ ...form, plan_id: contactPlan.id });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

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
        <PricingCards plans={activeTab.plans} stats={activeTab.stats} onContact={openContact} isLoading={!plansLoaded} />
      </section>

      <section className="px-[4%] md:px-[5%] pb-20">
      <FeatureTable plans={activeTab.plans} sections={activeTab.sections} />
      </section>

      {contactPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setContactPlan(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            {submitted ? (
              <div className="py-8 text-center"><h2 className="text-2xl font-medium">Thanks!</h2><p className="mt-3 text-sm text-primary-light-brown">Our team will contact you shortly.</p><button className="mt-6 rounded-full bg-primary-brown px-6 py-2 text-white" onClick={() => setContactPlan(null)}>Close</button></div>
            ) : (
              <form onSubmit={submitInquiry} className="space-y-4">
                <div><h2 className="text-2xl font-medium">Contact us about {contactPlan.name}</h2><p className="mt-1 text-sm text-primary-light-brown">Tell us a little about your requirements.</p></div>
                {([['name', 'Full name'], ['email', 'Email'], ['phone', 'Phone number'], ['company_name', 'Company / organization']] as const).map(([key, label]) => <input key={key} required className="w-full rounded-xl border border-[#EDE8E4] px-4 py-3 text-sm outline-none" placeholder={label} type={key === 'email' ? 'email' : 'text'} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />)}
                <textarea required rows={4} className="w-full rounded-xl border border-[#EDE8E4] px-4 py-3 text-sm outline-none" placeholder="Message / requirements" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
                <div className="flex justify-end gap-3"><button type="button" className="rounded-full border border-[#EDE8E4] px-5 py-2 text-sm" onClick={() => setContactPlan(null)}>Cancel</button><button disabled={submitting} className="rounded-full bg-primary-brown px-5 py-2 text-sm text-white">{submitting ? 'Sending...' : 'Send inquiry'}</button></div>
              </form>
            )}
          </div>
        </div>
      )}

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
    ctaLabel: plan.show_price === false ? 'Contact Us' : `Get ${plan.name}`,
    contactSales: plan.show_price === false,
    popular: Boolean(plan.popular),
    badge: plan.popular ? 'Most Popular' : undefined,
    highlights: plan.features.filter((feature) => feature.enabled).slice(0, 5).map((feature) => feature.value ? `${feature.name}: up to ${feature.value}` : feature.name),
    addons: plan.addons,
  }));

  return { ...tab, plans: mappedPlans, sections };
};
