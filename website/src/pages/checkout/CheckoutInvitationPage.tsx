import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { createDirectCheckout, getPublicPlans, type PublicAddon, type PublicPlan } from '../../api/subscription/plan.api';
import { getCheckoutInvitation, payCheckoutInvitation } from '../../api/checkoutInvitation.api';
import { getStoredAuth } from '../../auth/auth.storage';

type CheckoutProduct = {
  id: string; name: string; description?: string | null; monthly_price: number; yearly_price: number | null; currency: string;
  billing_cycle: 'monthly' | 'yearly'; features?: { name: string; enabled: boolean; value?: number | null }[]; addons?: PublicAddon[];
};
const emptyForm = { name: '', email: '', phone: '', company_name: '', business_type: 'organisation', abn_number: '', address: '', state: '', postcode: '', password: '', password_confirmation: '' };

const toProduct = (plan: PublicPlan): CheckoutProduct => ({
  ...plan,
  monthly_price: plan.monthly_price ?? 0,
  yearly_price: plan.yearly_price ?? null,
  currency: plan.currency ?? 'AUD',
  billing_cycle: 'monthly',
});

const CheckoutInvitationPage = () => {
  const { token = '' } = useParams();
  const [searchParams] = useSearchParams();
  const direct = !token;
  const [product, setProduct] = useState<CheckoutProduct | null>(null);
  const [availablePlans, setAvailablePlans] = useState<PublicPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});
  const auth = getStoredAuth();
  const [form, setForm] = useState({ ...emptyForm, name: auth?.user?.name ?? '', email: auth?.user?.email ?? '' });

  useEffect(() => {
    setError(null);
    if (token) {
      void getCheckoutInvitation(token).then((data) => {
        setProduct({ ...data.plan, billing_cycle: data.plan.billing_cycle === 'yearly' ? 'yearly' : 'monthly' });
        setForm((current) => ({ ...current, name: current.name || data.customer.name || '', email: current.email || data.customer.email || '', phone: data.customer.phone || '', company_name: data.customer.company_name || '' }));
      }).catch((reason: any) => setError(reason?.response?.data?.message ?? 'This checkout link is not available.'));
      return;
    }
    const planId = searchParams.get('plan');
    if (!planId) { setError('Please select a plan before opening checkout.'); return; }
    void getPublicPlans().then((plans) => {
      const plan = plans.find((item) => item.id === planId);
      if (!plan) { setError('This plan is not available for online checkout.'); return; }
      setAvailablePlans(plans.filter((item) => item.plan_family === plan.plan_family));
      setProduct(toProduct(plan));
    }).catch((reason: any) => setError(reason?.response?.data?.message ?? 'Unable to load this plan.'));
  }, [searchParams, token]);

  const selectedAddonItems = useMemo(() => Object.entries(selectedAddons).filter(([, quantity]) => quantity > 0), [selectedAddons]);
  const amount = product ? (billingCycle === 'yearly' ? (product.yearly_price ?? product.monthly_price * 12) : product.monthly_price) : 0;
  const addonTotal = product?.addons?.reduce((total, addon) => { const quantity = selectedAddons[addon.id] ?? 0; const price = billingCycle === 'yearly' ? (addon.yearly_price ?? addon.monthly_price ?? addon.one_time_price ?? 0) : (addon.monthly_price ?? addon.one_time_price ?? 0); return total + price * quantity; }, 0) ?? 0;

  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!product) return; setSubmitting(true); setError(null);
    try {
      if (direct) {
        const result = await createDirectCheckout({ ...form, plan_id: product.id, billing_cycle: billingCycle, addons: selectedAddonItems.map(([addon_id, quantity]) => ({ addon_id, quantity })) });
        window.location.assign(result.checkout_url);
      } else {
        const result = await payCheckoutInvitation(token, form); window.location.assign(result.checkout_url);
      }
    } catch (reason: any) { setError(reason?.response?.data?.message ?? 'Unable to start checkout. Please try again.'); } finally { setSubmitting(false); }
  };

  if (searchParams.get('cancelled')) return <State title="Checkout cancelled" message="No payment was taken. You can return to the plan while it is still available." />;
  if (error) return <State title="Checkout unavailable" message={error} />;
  if (!product) return <State title="Loading checkout" message="Please wait..." />;

  const features = (product.features ?? []).filter((feature) => feature.enabled).slice(0, 8);
  return <main className="min-h-screen bg-[#F8F4EE] px-4 pb-20 pt-28 font-helvetica text-primary-brown"><div className="mx-auto max-w-6xl">
    <header className="mb-10 text-center"><p className="text-xs font-medium uppercase tracking-[0.28em] text-primary-light-brown">Briksy secure checkout</p><h1 className="mt-3 text-3xl font-medium md:text-4xl">Complete your {product.name} plan</h1><p className="mx-auto mt-3 max-w-xl text-sm text-primary-light-brown">Enter your business details, choose any add-ons, and continue securely to Stripe.</p></header>
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <section className="h-fit rounded-3xl border border-[#EDE8E4] bg-white p-7 shadow-sm"><p className="text-xs font-medium uppercase tracking-[0.22em] text-primary-light-brown">Your Briksy plan</p>{direct && <select aria-label="Choose plan" className="mt-3 w-full rounded-xl border border-[#EDE8E4] bg-white px-3 py-2 text-2xl font-medium text-primary-brown outline-none" value={product.id} onChange={(event) => { const next = availablePlans.find((plan) => plan.id === event.target.value); if (next) { setProduct(toProduct(next)); setSelectedAddons({}); } }}>{availablePlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select>}{!direct && <h2 className="mt-3 text-3xl font-medium">{product.name}</h2>}<p className="mt-3 text-sm leading-6 text-primary-light-brown">{product.description}</p><div className="mt-7 border-t border-[#F0EBE6] pt-6"><span className="text-3xl font-semibold">{product.currency} {amount.toLocaleString()}</span><span className="ml-2 text-sm text-primary-light-brown">/{billingCycle}</span>{addonTotal > 0 && <p className="mt-2 text-xs text-primary-light-brown">Includes {product.currency} {addonTotal.toLocaleString()} in add-ons</p>}</div><ul className="mt-7 space-y-3 text-sm">{features.map((feature) => <li key={feature.name} className="flex gap-2"><span>✓</span><span>{feature.name}{feature.value ? ` — up to ${feature.value}` : ''}</span></li>)}</ul>{direct && product.addons && product.addons.length > 0 && <fieldset className="mt-7 border-t border-[#F0EBE6] pt-6"><legend className="text-lg font-medium">Add-ons</legend><p className="mt-1 text-sm text-primary-light-brown">Add optional features to your plan.</p><div className="mt-4 space-y-2">{product.addons.map((addon) => { const quantity = selectedAddons[addon.id] ?? 0; const price = billingCycle === 'yearly' ? (addon.yearly_price ?? addon.monthly_price ?? addon.one_time_price ?? 0) : (addon.monthly_price ?? addon.one_time_price ?? 0); return <label key={addon.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#EDE8E4] p-3"><span className="flex items-center gap-2"><input type="checkbox" checked={quantity > 0} onChange={(event) => setSelectedAddons({ ...selectedAddons, [addon.id]: event.target.checked ? 1 : 0 })} className="h-4 w-4 accent-[#352411]" /><span className="text-sm">{addon.name}</span></span><span className="whitespace-nowrap text-xs text-primary-light-brown">{product.currency} {price.toLocaleString()}</span></label>})}</div></fieldset>}</section>
      <form onSubmit={submit} className="rounded-3xl border border-[#EDE8E4] bg-white p-6 shadow-sm md:p-8"><div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-medium">Account and business details</h2><p className="mt-2 text-sm text-primary-light-brown">These details are used to verify your business and create your Briksy account.</p></div><span className="rounded-full bg-[#F8F4EE] px-3 py-1 text-xs text-primary-light-brown">Secure</span></div>
        {direct && <div className="mt-6 flex rounded-xl bg-[#F8F4EE] p-1"><button type="button" className={`flex-1 rounded-lg py-2 text-sm ${billingCycle === 'monthly' ? 'bg-white shadow-sm' : 'text-primary-light-brown'}`} onClick={() => setBillingCycle('monthly')}>Monthly</button><button type="button" className={`flex-1 rounded-lg py-2 text-sm ${billingCycle === 'yearly' ? 'bg-white shadow-sm' : 'text-primary-light-brown'}`} onClick={() => setBillingCycle('yearly')}>Yearly</button></div>}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">{([['name','Full name'],['email','Email'],['phone','Phone number'],['company_name','Company / organization'],['abn_number','ABN'],['address','Address'],['state','State'],['postcode','Postcode']] as const).map(([key, label]) => <label key={key} className="block"><span className="mb-1.5 block text-xs font-medium text-primary-light-brown">{label} <span className="text-red-500">*</span></span><input required type={key === 'email' ? 'email' : 'text'} className="w-full rounded-xl border border-[#EDE8E4] px-4 py-3 text-sm outline-none transition focus:border-primary-brown" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></label>)}</div>
        <label className="mt-4 block"><span className="mb-1.5 block text-xs font-medium text-primary-light-brown">Business type</span><select className="w-full rounded-xl border border-[#EDE8E4] bg-white px-4 py-3 text-sm" value={form.business_type} onChange={(event) => setForm({ ...form, business_type: event.target.value })}><option value="organisation">Organisation</option><option value="company">Company</option><option value="solo_trader">Sole trader</option></select></label>
        {direct && product.addons && product.addons.length > 0 && <fieldset className="hidden mt-7 border-t border-[#F0EBE6] pt-6"><legend className="text-lg font-medium">Add more features</legend><p className="mt-1 text-sm text-primary-light-brown">Optional add-ons can be included with your plan.</p><div className="mt-4 space-y-3">{product.addons.map((addon) => { const quantity = selectedAddons[addon.id] ?? 0; const price = billingCycle === 'yearly' ? (addon.yearly_price ?? addon.monthly_price ?? addon.one_time_price ?? 0) : (addon.monthly_price ?? addon.one_time_price ?? 0); return <label key={addon.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#EDE8E4] p-4"><span className="flex items-center gap-3"><input type="checkbox" checked={quantity > 0} onChange={(event) => setSelectedAddons({ ...selectedAddons, [addon.id]: event.target.checked ? 1 : 0 })} className="h-4 w-4 accent-[#352411]" /><span><span className="block text-sm font-medium">{addon.name}</span><span className="block text-xs text-primary-light-brown">{addon.description}</span></span></span><span className="whitespace-nowrap text-sm">{product.currency} {price.toLocaleString()}{addon.pricing_type !== 'one_time' ? `/${billingCycle === 'yearly' ? 'year' : 'month'}` : ''}</span></label>})}</div></fieldset>}
        <div className="mt-4 grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-medium text-primary-light-brown">Password</span><input required={!auth?.user} type="password" minLength={8} className="w-full rounded-xl border border-[#EDE8E4] px-4 py-3 text-sm outline-none" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label><label><span className="mb-1.5 block text-xs font-medium text-primary-light-brown">Confirm password</span><input required={!auth?.user} type="password" minLength={8} className="w-full rounded-xl border border-[#EDE8E4] px-4 py-3 text-sm outline-none" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} /></label></div>
        {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={submitting} className="mt-7 w-full rounded-full bg-primary-brown py-3.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">{submitting ? 'Preparing secure checkout...' : 'Continue to Stripe checkout'}</button><p className="mt-3 text-center text-xs text-primary-light-brown">Your payment details are handled securely by Stripe.</p>
      </form>
    </div>
  </div></main>;
};

const State = ({ title, message }: { title: string; message: string }) => <main className="flex min-h-screen items-center justify-center bg-[#F8F4EE] px-4 font-helvetica text-primary-brown"><div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-medium">{title}</h1><p className="mt-3 text-sm text-primary-light-brown">{message}</p></div></main>;

export default CheckoutInvitationPage;
