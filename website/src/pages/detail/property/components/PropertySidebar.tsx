import { DetailSidebar } from "../../shared/DetailSidebar";
import { AuctionSidebar } from "./AuctionSidebar";

export { AuctionSidebar };

type ListingPurpose = "new_home" | "SELL" | "RENT" | "BOTH" | "sale" | "rent" | "land" | "AUCTION" | "auction" | string | undefined | null;

function getPriceLabel(listingPurpose: ListingPurpose): string {
  const p = listingPurpose?.toUpperCase();
  switch (p) {
    case "RENT":
      return "per week";
    case "SELL":
    case "BOTH":
    default:
      return "fixed price";
  }
}

function getDescription(listingPurpose: ListingPurpose): string {
  const p = listingPurpose?.toUpperCase();
  switch (p) {
    case "RENT":
      return "Free inspection available. Typically replies within one business day.";
    default:
      return "Free consultation and site assessment · Typically replies within one business day";
  }
}

function getButtonText(listingPurpose: ListingPurpose): string {
  const p = listingPurpose?.toUpperCase();
  switch (p) {
    case "RENT":
      return "Book an Inspection";
    default:
      return "Send an Enquiry";
  }
}

export const PropertySidebar = ({
  sidebar,
  listingPurpose,
  isAuction,
  venueAddress,
  auctionDate,
  auctionTime,
  propertyId,
  propertyTitle,
  organizationId,
  onEnquiry,
}: {
  sidebar: { price?: number; builderName?: string; location?: string };
  listingPurpose?: ListingPurpose;
  isAuction?: boolean;
  venueAddress?: string;
  auctionDate?: string;
  auctionTime?: string;
  propertyId?: string;
  propertyTitle?: string;
  organizationId?: string;
  onEnquiry?: () => void;
}) => {
  if (isAuction) {
    return (
      <AuctionSidebar
        sidebar={sidebar}
        venueAddress={venueAddress}
        auctionDate={auctionDate}
        auctionTime={auctionTime}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        organizationId={organizationId}
        onEnquiry={onEnquiry}
      />
    );
  }
  const priceLabel = getPriceLabel(listingPurpose);
  const description = getDescription(listingPurpose);
  const buttonText = getButtonText(listingPurpose);

  const priceDisplay = sidebar.price
    ? `$${(sidebar.price / 1000).toFixed(0)}k`
    : undefined;

  return (
    <DetailSidebar
      price={priceDisplay}
      priceLabel={priceDisplay ? priceLabel : undefined}
      description={description}
      buttonText={buttonText}
      onEnquiry={onEnquiry}
      footerText={
        sidebar.builderName
          ? `Enquiries go directly to ${sidebar.builderName}. BRIKSY never charges buyers.`
          : "BRIKSY never charges buyers."
      }
    />
  );
};
