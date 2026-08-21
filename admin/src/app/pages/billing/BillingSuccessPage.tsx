import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { fetchBillingCurrentSubscriptionApi, verifyBillingCheckoutSessionApi } from "../../services/features/billing/billing.api";
import type { BillingCheckoutVerificationResponse, CompanySubscription } from "../../services/features/billing/billing.types";

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString() : "N/A");

const formatMoney = (amount?: number | null, currency?: string | null) => {
  if (amount === null || amount === undefined) return "N/A";

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: (currency ?? "AUD").toUpperCase(),
    }).format(amount);
  } catch {
    return `${currency ?? "AUD"} ${amount.toFixed(2)}`;
  }
};

export default function BillingSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<CompanySubscription | null>(null);
  const [stripeDetails, setStripeDetails] = useState<BillingCheckoutVerificationResponse["stripe_details"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("Verifying your payment...");

  const checkoutSessionId = useMemo(() => searchParams.get("session_id"), [searchParams]);

  useEffect(() => {
    let active = true;
    const storageKey = checkoutSessionId ? `billing-checkout-verified:${checkoutSessionId}` : "billing-checkout-current";

    const run = async () => {
      try {
        const alreadyVerified = checkoutSessionId ? sessionStorage.getItem(storageKey) === "true" : false;
        if (checkoutSessionId && alreadyVerified) {
          const current = await fetchBillingCurrentSubscriptionApi();
          if (!active) return;
          setSubscription(current);
          setMessage("Payment confirmed. Your subscription data has already been refreshed.");
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        if (checkoutSessionId) {
          const verification = await verifyBillingCheckoutSessionApi(checkoutSessionId);
          if (!active) return;

          setSubscription(verification.subscription ?? null);
          setStripeDetails(verification.stripe_details ?? null);
          setMessage(
            verification.checkout_status === "complete"
              ? "Payment confirmed. Your subscription has been refreshed."
              : "Payment is still syncing. Stripe may take a moment to finalize the subscription.",
          );
          sessionStorage.setItem(storageKey, "true");
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          const current = await fetchBillingCurrentSubscriptionApi();
          if (!active) return;

          setSubscription(current);
          setStripeDetails(null);
          setMessage("Payment completed. Your subscription data has been refreshed.");
        }
      } catch (error) {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "Unable to verify your payment right now.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [checkoutSessionId]);

  const planName = subscription?.plan?.name ?? "Unknown";
  const amount =
    subscription?.amount ??
    (subscription?.plan
      ? subscription.billing_cycle === "yearly"
        ? subscription.plan.yearly_price ?? subscription.plan.monthly_price ?? null
        : subscription.plan.monthly_price ?? subscription.plan.yearly_price ?? null
      : null);
  const billingPeriod = subscription?.billing_cycle ? subscription.billing_cycle.charAt(0).toUpperCase() + subscription.billing_cycle.slice(1) : "N/A";

  return (
    <Content>
      <PageHeader title="Billing Success" subtitle="Stripe checkout completed" />
      <div className="card">
        <div className="card-body p-8">
          <div className="d-flex align-items-start gap-4">
            <div className="symbol symbol-50px symbol-circle bg-light-success text-success">
              <i className="bi bi-check2-circle fs-2hx" />
            </div>
            <div className="flex-grow-1">
              <h3 className="fw-bold mb-2">{loading ? "Confirming payment..." : "Subscription updated"}</h3>
              <p className="text-muted mb-4">{message}</p>

              {subscription ? (
                <div className="border rounded-4 p-4 mb-4 bg-light">
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Plan</div>
                      <div className="fw-semibold">{planName}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Amount</div>
                      <div className="fw-semibold">{formatMoney(amount, subscription.currency)}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Billing Period</div>
                      <div className="fw-semibold">{billingPeriod}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Next Renewal</div>
                      <div className="fw-semibold">{formatDate(subscription.current_period_end)}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Invoice Number</div>
                      <div className="fw-semibold">{subscription.latest_invoice_id ?? "Unavailable"}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Subscription Status</div>
                      <div className="fw-semibold text-capitalize">{subscription.status}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Subscription ID</div>
                      <div className="fw-semibold text-break">{stripeDetails?.subscription_id ?? subscription.stripe_subscription_id ?? "Unavailable"}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Customer ID</div>
                      <div className="fw-semibold text-break">{stripeDetails?.customer_id ?? subscription.stripe_customer_id ?? "Unavailable"}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Invoice</div>
                      {stripeDetails?.invoice_download_url ? (
                        <a className="fw-semibold" href={stripeDetails.invoice_download_url} target="_blank" rel="noreferrer">
                          Download invoice
                        </a>
                      ) : (
                        <div className="fw-semibold text-break">{stripeDetails?.invoice_id ?? subscription.latest_invoice_id ?? "Unavailable"}</div>
                      )}
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Payment Method</div>
                      <div className="fw-semibold">{stripeDetails?.payment_method ?? "Unavailable"}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-muted fs-8">Transaction Timestamp</div>
                      <div className="fw-semibold">{stripeDetails?.transaction_timestamp ? new Date(stripeDetails.transaction_timestamp).toLocaleString() : "Unavailable"}</div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="d-flex flex-wrap gap-3">
                <button type="button" className="btn btn-primary" onClick={() => navigate("/admin/billing")}>
                  Go to Billing
                </button>
                <button type="button" className="btn btn-light" onClick={() => navigate("/admin/dashboard")}>
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
}
