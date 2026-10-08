import { DetailSidebar } from "../../shared/DetailSidebar";

export const PropertySidebar = ({
  sidebar,
  onEnquiry,
}: {
  sidebar: { price?: string; builderName?: string };
  onEnquiry?: () => void;
}) => (
  <DetailSidebar
    price={sidebar.price || "Contact"}
    description="Free consultation and site assessment. Typically replies within one business day."
    onEnquiry={onEnquiry}
    footerText={sidebar.builderName ? `Enquiries go directly to ${sidebar.builderName}. BRIKSY never charges buyers.` : "BRIKSY never charges buyers."}
  />
);
