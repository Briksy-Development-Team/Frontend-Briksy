import OrganizationPage from "../user management/user/OrganizationPage";

export default function BriksyExclusiveOrganizationsPage() {
  return (
    <OrganizationPage
      title="Briksy Exclusive Organisations"
      subtitle="Organisations with an active Briksy Exclusive add-on"
      businessTypes={["organisation", "company", "solo_trader"]}
      addonFeature="briksy_exclusive"
    />
  );
}
