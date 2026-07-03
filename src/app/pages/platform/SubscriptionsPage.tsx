import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { fetchSuperAdminSubscriptionsApi } from "../../services/features/billing/billing.api";
import type { CompanySubscription } from "../../services/features/billing/billing.types";

export default function SubscriptionsPage() {
  const [items, setItems] = useState<CompanySubscription[]>([]);
  const [filters, setFilters] = useState({ organization_id: "", plan_id: "", status: "", billing_cycle: "" });

  const load = async (nextFilters = filters) => {
    const params = Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value));
    setItems(await fetchSuperAdminSubscriptionsApi(params));
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <Content>
      <PageHeader title="Subscriptions" subtitle="View all company subscriptions" />
      <div className="card">
        <div className="card-body">
          <div className="row g-3 mb-5">
            <div className="col-md-3">
              <input className="form-control form-control-solid" placeholder="Company ID" value={filters.organization_id} onChange={(e) => setFilters((current) => ({ ...current, organization_id: e.target.value }))} />
            </div>
            <div className="col-md-3">
              <input className="form-control form-control-solid" placeholder="Plan ID" value={filters.plan_id} onChange={(e) => setFilters((current) => ({ ...current, plan_id: e.target.value }))} />
            </div>
            <div className="col-md-3">
              <input className="form-control form-control-solid" placeholder="Status" value={filters.status} onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value }))} />
            </div>
            <div className="col-md-3">
              <input className="form-control form-control-solid" placeholder="Billing Cycle" value={filters.billing_cycle} onChange={(e) => setFilters((current) => ({ ...current, billing_cycle: e.target.value }))} />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-light me-2" onClick={() => { const next = { organization_id: "", plan_id: "", status: "", billing_cycle: "" }; setFilters(next); void load(next); }}>Reset</button>
              <button className="btn btn-primary" onClick={() => void load()}>Apply Filters</button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table align-middle table-row-bordered">
              <thead>
                <tr className="text-muted fs-7 text-uppercase">
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Cycle</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Period End</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.company?.name ?? item.organization_id}</td>
                    <td>{item.plan?.name ?? "-"}</td>
                    <td>{item.billing_cycle}</td>
                    <td>{item.currency} {item.amount ?? 0}</td>
                    <td>{item.status}</td>
                    <td>{item.current_period_end ? new Date(item.current_period_end).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Content>
  );
}
