import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";

export default function BillingCancelPage() {
  return (
    <Content>
      <PageHeader title="Billing Cancelled" subtitle="Checkout was cancelled" />
      <div className="alert alert-warning">No payment was taken. You can choose a plan again from billing.</div>
    </Content>
  );
}
