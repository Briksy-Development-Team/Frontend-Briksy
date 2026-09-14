import { DetailSidebar } from "../../shared/DetailSidebar";

export const PropertySidebar = ({
  sidebar,
  onEnquiry,
}: {
  sidebar: { price?: number; builderName?: string };
  onEnquiry?: () => void;
}) => (
  <DetailSidebar
    price={sidebar.price ? `$${(sidebar.price / 1000).toFixed(0)}k` : "Contact"}
    priceLabel={sidebar.price ? "fixed price" : undefined}
    description="Free consultation and site assessment. Typically replies within one business day."
    onEnquiry={onEnquiry}
    footerText={sidebar.builderName ? `Enquiries go directly to ${sidebar.builderName}. BRIKSY never charges buyers.` : "BRIKSY never charges buyers."}
  />
);
