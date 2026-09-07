import { DetailSidebar } from "../../shared/DetailSidebar";

export function BuilderSidebar({ price }: { price: number }) {
  return (
    <DetailSidebar
      price={`$${price / 1000}k`}
      priceLabel="fixed price"
      description="Free consultation and site assessment. Typically replies within one business day."
      footerText="Enquiries go directly to Harkaway Homes. BRIKSY never charges buyers."
    />
  );
}
