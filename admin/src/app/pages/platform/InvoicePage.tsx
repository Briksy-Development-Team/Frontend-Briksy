import { useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import Pagination from "../../modules/apps/shared_table/entity-list/components/Pagination";
import { useServerListing } from "../../modules/apps/shared_table/hooks/useServerListing";
import { useListingSummary, type ListingSummary } from "../../modules/apps/shared_table/hooks/useListingSummary";
import type { CompanySubscription } from "../../services/features/billing/billing.types";

type InvoiceFilters = {
  search: string;
  organization_id: string;
  plan_id: string;
  status: string;
  billing_cycle: string;
};

const initialFilters: InvoiceFilters = {
  search: "",
  organization_id: "",
  plan_id: "",
  status: "",
  billing_cycle: "",
};

const formatMoney = (value: number | null | undefined, currency = "AUD") =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const invoiceSummary: ListingSummary = {
  endpoint: "/super-admin/subscriptions",
  resetKeys: ["organization_id", "plan_id", "status", "billing_cycle"],
};

const InvoicePage = () => {
  const [filters, setFilters] = useState<InvoiceFilters>(initialFilters);
  const { rows: items, total, params, setParams, loading, error } =
    useServerListing<CompanySubscription>(invoiceSummary.endpoint, { sort: "created_at", direction: "desc" });
  const allInvoices = useListingSummary(invoiceSummary, params, items, "invoices")?.[0];

  const apply = ({ search, ...values }: InvoiceFilters) => {
    const activeFilters = Object.fromEntries(Object.entries(values).filter(([, value]) => value.trim() !== ""));
    setParams((current) => ({ ...current, search, filters: activeFilters, page: 1 }));
  };

  const resetCounts = () => {
    const next = { ...initialFilters, search: params.search };
    setFilters(next);
    apply(next);
  };

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + (item.amount ?? 0), 0),
    [items],
  );

  return (
    <Content>
      <PageHeader
        title="Invoices"
        subtitle="Stripe invoice records synced into the superadmin area for audit and support."
      />

      <div className="card">
        <div className="card-body">
          <div className="row g-3 mb-5">
            <div className="col-md-4">
              <input
                className="form-control form-control-solid"
                placeholder="Search company, plan, or invoice"
                value={filters.search}
                onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control form-control-solid"
                placeholder="Company ID"
                value={filters.organization_id}
                onChange={(e) => setFilters((current) => ({ ...current, organization_id: e.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control form-control-solid"
                placeholder="Plan ID"
                value={filters.plan_id}
                onChange={(e) => setFilters((current) => ({ ...current, plan_id: e.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control form-control-solid"
                placeholder="Status"
                value={filters.status}
                onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <input
                className="form-control form-control-solid"
                placeholder="Billing cycle"
                value={filters.billing_cycle}
                onChange={(e) => setFilters((current) => ({ ...current, billing_cycle: e.target.value }))}
              />
            </div>
            <div className="col-12 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setFilters(initialFilters);
                  apply(initialFilters);
                }}
              >
                Reset
              </button>
              <button type="button" className="btn btn-primary" onClick={() => apply(filters)}>
                Apply Filters
              </button>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-4 mb-5">
            <button
              type="button"
              className={`briksy-summary-card rounded px-4 py-3 gap-0 ${allInvoices?.active ? "briksy-summary-card--active" : ""}`}
              aria-pressed={Boolean(allInvoices?.active)}
              onClick={resetCounts}
            >
              <span className="text-muted fs-7">All invoices</span>
              <span className="fw-bold fs-4">{allInvoices?.count}</span>
            </button>
            <div className="border rounded px-4 py-3">
              <div className="text-muted fs-7">Page amount</div>
              <div className="fw-bold fs-4">{formatMoney(totalAmount)}</div>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? <div className="alert alert-light">Loading invoices...</div> : null}

          <div className="table-responsive">
            <table className="table align-middle table-row-bordered table-row-gray-100">
              <thead>
                <tr className="text-muted fs-7 text-uppercase">
                  <th>Invoice</th>
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Cycle</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Period End</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const invoiceId = item.latest_invoice_id ?? item.stripe_checkout_session_id ?? item.id;
                  const stripeInvoiceUrl = invoiceId ? `https://dashboard.stripe.com/invoices/${invoiceId}` : null;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-semibold">{invoiceId}</div>
                        <div className="text-muted fs-7">{item.stripe_subscription_id ?? "No Stripe subscription"}</div>
                      </td>
                      <td>{item.company?.name ?? item.organization_id}</td>
                      <td>{item.plan?.name ?? "-"}</td>
                      <td>{item.billing_cycle}</td>
                      <td>{formatMoney(item.amount, item.currency)}</td>
                      <td>
                        <span className={`badge badge-light-${item.payment_status === "paid" ? "success" : item.payment_status === "unpaid" ? "warning" : "secondary"}`}>
                          {item.payment_status ?? item.status}
                        </span>
                      </td>
                      <td>{item.current_period_end ? new Date(item.current_period_end).toLocaleDateString() : "-"}</td>
                      <td>
                        {stripeInvoiceUrl ? (
                          <a className="btn btn-sm btn-light-primary" href={stripeInvoiceUrl} target="_blank" rel="noreferrer">
                            Open Stripe
                          </a>
                        ) : (
                          <span className="text-muted">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            entityName="invoices"
            page={params.page}
            per_page={params.per_page}
            total={total}
            maxPageSize={100}
            onChange={(page) => setParams((current) => ({ ...current, page }))}
            onPageSizeChange={(per_page) => setParams((current) => ({ ...current, per_page, page: 1 }))}
          />
        </div>
      </div>
    </Content>
  );
};

export default InvoicePage;
