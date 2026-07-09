import { useNavigate } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";

export default function BillingCancelPage() {
  const navigate = useNavigate();

  return (
    <Content>
      <PageHeader title="Billing Cancelled" subtitle="Checkout was cancelled" />
      <div className="card">
        <div className="card-body p-8">
          <div className="alert alert-warning mb-5">
            No payment was taken. You can choose a plan again from billing.
          </div>
          <button type="button" className="btn btn-primary" onClick={() => navigate("/admin/billing")}>
            Return to Billing
          </button>
        </div>
      </div>
    </Content>
  );
}
