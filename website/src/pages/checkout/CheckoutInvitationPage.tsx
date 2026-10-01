import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getCheckoutInvitation, payCheckoutInvitation, type CheckoutInvitation } from '../../api/checkoutInvitation.api';
import { getStoredAuth } from '../../auth/auth.storage';

const CheckoutInvitationPage = () => {
  const { token = '' } = useParams();
  const [searchParams] = useSearchParams();
  const [invitation, setInvitation] = useState<CheckoutInvitation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const auth = getStoredAuth();
  const [form, setForm] = useState({ name: auth?.user?.name ?? '', email: auth?.user?.email ?? '', phone: '', company_name: '', business_type: 'organisation', abn_number: '', address: '', state: '', postcode: '', password: '', password_confirmation: '' });

  useEffect(() => {
    if (!token) return;
    void getCheckoutInvitation(token).then((data) => {
      setInvitation(data);
      setForm((current) => ({ ...current, name: current.name || data.customer.name || '', email: current.email || data.customer.email || '', phone: data.customer.phone || '', company_name: data.customer.company_name || '' }));
    }).catch((reason: any) => setError(reason?.response?.data?.message ?? 'This checkout link is not available.'));
  }, [token]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await payCheckoutInvitation(token, form);
      window.location.assign(result.checkout_url);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? 'Unable to start checkout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (searchParams.get('cancelled')) return <State title="Checkout cancelled" message="No payment was taken. You can return to this link while it is still active." />;
  if (error) return <State title="Checkout unavailable" message={error} />;
  if (!invitation) return <State title="Loading checkout" message="Please wait..." />;

  const amount = invitation.plan.billing_cycle === 'yearly' ? invitation.plan.yearly_price : invitation.plan.monthly_price;
  return <main className="min-h-screen bg-[#F8F4EE] px-4 py-12 font-helvetica text-primary-brown"><div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_1.2fr]">
    <section className="rounded-2xl bg-white p-7 shadow-sm"><p className="text-sm uppercase tracking-widest text-primary-light-brown">Your Briksy plan</p><h1 className="mt-3 text-3xl font-medium">{invitation.plan.name}</h1><p className="mt-3 text-sm text-primary-light-brown">{invitation.plan.description}</p><div className="mt-8 text-3xl font-semibold">{invitation.plan.currency} {amount?.toLocaleString()} <span className="text-sm font-normal">/{invitation.plan.billing_cycle}</span></div><p className="mt-4 text-xs text-primary-light-brown">Checkout link expires {new Date(invitation.expires_at).toLocaleString()}.</p><ul className="mt-7 space-y-2 text-sm">{(invitation.plan.features ?? []).filter((feature) => feature.enabled).slice(0, 8).map((feature) => <li key={feature.name}>✓ {feature.name}{feature.value ? ` — up to ${feature.value}` : ''}</li>)}</ul></section>
    <form onSubmit={submit} className="rounded-2xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-medium">Account and business details</h2><p className="mt-2 text-sm text-primary-light-brown">Complete your details before secure Stripe checkout.</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{([['name','Full name'],['email','Email'],['phone','Phone number'],['company_name','Company / organization'],['abn_number','ABN'],['address','Address'],['state','State'],['postcode','Postcode']] as const).map(([key,label]) => <input key={key} required={['name','email','phone','company_name'].includes(key)} type={key === 'email' ? 'email' : 'text'} placeholder={label} className="rounded-xl border border-[#EDE8E4] px-4 py-3 text-sm outline-none" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />)}</div><select className="mt-4 w-full rounded-xl border border-[#EDE8E4] px-4 py-3 text-sm" value={form.business_type} onChange={(event) => setForm({ ...form, business_type: event.target.value })}><option value="organisation">Organisation</option><option value="company">Company</option><option value="solo_trader">Sole trader</option></select><div className="mt-4 grid gap-4 sm:grid-cols-2"><input type="password" placeholder="Password (new accounts)" className="rounded-xl border border-[#EDE8E4] px-4 py-3 text-sm outline-none" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><input type="password" placeholder="Confirm password" className="rounded-xl border border-[#EDE8E4] px-4 py-3 text-sm outline-none" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} /></div>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={submitting} className="mt-6 w-full rounded-full bg-primary-brown py-3 text-sm text-white">{submitting ? 'Preparing secure checkout...' : 'Continue to Stripe checkout'}</button><p className="mt-3 text-center text-xs text-primary-light-brown">The plan and amount are fixed by Briksy for this invitation.</p></form>
  </div></main>;
};

const State = ({ title, message }: { title: string; message: string }) => <main className="flex min-h-screen items-center justify-center bg-[#F8F4EE] px-4 font-helvetica text-primary-brown"><div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-medium">{title}</h1><p className="mt-3 text-sm text-primary-light-brown">{message}</p></div></main>;

export default CheckoutInvitationPage;
