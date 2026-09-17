import { DetailSidebar } from "../../shared/DetailSidebar";

export function BuilderSidebar({ price, name, onEnquiry }: { price?: number; name?: string; onEnquiry?: () => void }) {
  return (
    <DetailSidebar
      price={price ? `$${price / 1000}k` : "Contact"}
      priceLabel={price ? "fixed price" : undefined}
      description="Free consultation and site assessment. Typically replies within one business day."
      footerText={name ? `Enquiries go directly to ${name}. BRIKSY never charges buyers.` : "BRIKSY never charges buyers."}
      onEnquiry={onEnquiry}
    />
  );
}
