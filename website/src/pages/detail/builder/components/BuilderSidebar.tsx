import { BuilderSidebar as SharedBuilderSidebar, BuilderAboveCard, NeedHelpCard } from "../../shared/DetailSidebar";

export { BuilderAboveCard, NeedHelpCard };

type Props = {
  name?: string;
  address?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  website?: string | null;
  operatingHours?: string | null;
  isAgent?: boolean;
  isBuyerAgent?: boolean;
  onEnquiry?: () => void;
  onCall?: () => void;
};

export function BuilderSidebar({
  name,
  address,
  contactPhone,
  website,
  operatingHours,
  onEnquiry,
  onCall,
}: Props) {
  return (
    <SharedBuilderSidebar
      title="Contact Details"
      address={address}
      time={operatingHours || "Mon-Sat, 12:00AM-12:00AM"}
      phone={contactPhone || undefined}
      website={website || undefined}
      organizationName={name}
      primaryButtonText="Request a free consultation"
      onPrimaryAction={onEnquiry}
      onEnquiry={onEnquiry}
      onCall={onCall}
      showNeedHelp={true}
    />
  );
}
