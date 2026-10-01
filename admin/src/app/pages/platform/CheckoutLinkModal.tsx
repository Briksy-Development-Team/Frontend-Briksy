import { useEffect, useState } from "react";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { fetchPlansApi } from "../../services/features/subscriptions/plan.api";
import type { Plan } from "../../services/features/subscriptions/plan.types";
import { createCheckoutInvitationApi, type CheckoutInvitation } from "../../services/features/inquiries/checkout-invitation.api";

export const CheckoutLinkModal = ({ inquiry, onClose }: { inquiry: any; onClose: () => void }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planFamily, setPlanFamily] = useState("");
  const [planId, setPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [result, setResult] = useState<CheckoutInvitation | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchPlansApi().then(({ plans: values }) => {
      const activePlans = values.filter((plan) => plan.is_active !== false);
      setPlans(activePlans);
      const firstFamily = activePlans.find((plan) => plan.plan_family)?.plan_family ?? "";
      setPlanFamily(firstFamily);
      setPlanId(activePlans.find((plan) => plan.plan_family === firstFamily)?.id ?? "");
    }).catch(() => setError("Unable to load plans."));
  }, []);

  const familyLabel = (family?: string) => ({
    builders: "Builders",
    property_owner: "Real Estate",
    buyers_agent: "Buyer Agent",
    trades_professional: "Trades & Professional",
  }[family ?? ""] ?? family ?? "Other");

  const familyPlans = plans.filter((plan) => plan.plan_family === planFamily);

  const create = async () => {
    setSaving(true); setError(null);
    try { setResult(await createCheckoutInvitationApi(inquiry.id, planId, billingCycle)); } catch (reason: any) { setError(reason?.response?.data?.message ?? "Unable to create checkout link."); } finally { setSaving(false); }
  };

  const copyLink = async () => {
    if (!result?.checkout_url) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(result.checkout_url);
      } else {
        const input = document.createElement("textarea");
        input.value = result.checkout_url;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.focus();
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (result) return <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.6)" }}><div className="modal-dialog modal-dialog-centered"><div className="modal-content"><div className="modal-header"><h2 className="fw-bolder">Checkout link created</h2><button className="btn btn-sm" onClick={onClose}>×</button></div><div className="modal-body"><p className="mb-2">{result.customer?.name} · {result.customer?.email}</p><p className="mb-2">{result.plan?.name} · {result.plan?.billing_cycle}</p><p className="small text-muted">Expires {result.expires_at ? new Date(result.expires_at).toLocaleString() : "in 72 hours"}</p><div className={`alert ${result.email_sent ? "alert-success" : "alert-warning"} mt-4 mb-3`}>{result.email_sent ? "Checkout link emailed to the customer." : "Checkout link created, but email delivery failed. Copy the link below and share it manually."}</div><label className="form-label">Share this checkout link</label><div className="input-group"><input readOnly className="form-control" value={result.checkout_url} /><button type="button" className="btn btn-primary" onClick={() => void copyLink()}>{copied ? "Copied" : "Copy Checkout Link"}</button></div>{copied && <div className="text-success small mt-2">Checkout link copied to your clipboard.</div>}</div><div className="modal-footer"><button className="btn btn-primary" onClick={onClose}>Done</button></div></div></div></div>;

  return <ModalShell title="Create Checkout Link" onClose={() => { if (!result) onClose(); }} onSubmit={create} closeOnSubmit={false} isSubmitting={saving} isValid={Boolean(planId)}><p className="text-muted">Create a secure checkout link for {inquiry.seeker_name || inquiry.company_name || "this customer"}. The link expires after exactly 72 hours.</p><label className="form-label">Customer category</label><select className="form-select mb-5" value={planFamily} onChange={(event) => { const family = event.target.value; setPlanFamily(family); setPlanId(plans.find((plan) => plan.plan_family === family)?.id ?? ""); }}>{Array.from(new Set(plans.map((plan) => plan.plan_family).filter(Boolean))).map((family) => <option key={family} value={family}>{familyLabel(family)}</option>)}</select><label className="form-label">Plan</label><select className="form-select mb-5" value={planId} onChange={(event) => setPlanId(event.target.value)}>{familyPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select><label className="form-label">Billing cycle</label><select className="form-select" value={billingCycle} onChange={(event) => setBillingCycle(event.target.value)}><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>{error && <div className="alert alert-danger mt-4 mb-0">{error}</div>}</ModalShell>;
};
