import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";

export default function BillingSuccessPage() {
  return (
    <Content>
      <PageHeader title="Billing Success" subtitle="Stripe checkout completed" />
      <div className="alert alert-success">Your checkout completed. Refresh this page after webhook processing if the subscription state is still syncing.</div>
    </Content>
  );
}
