import OrganizationPage from "../user management/user/OrganizationPage";

export default function BriksyExclusiveOrganizationsPage() {
  return (
    <OrganizationPage
      title="Promotional Add-on Organisations"
      subtitle="Organisations with an active promotional add-on"
      businessTypes={["organisation", "company", "solo_trader"]}
      addonFeature="briksy_exclusive"
    />
  );
}
