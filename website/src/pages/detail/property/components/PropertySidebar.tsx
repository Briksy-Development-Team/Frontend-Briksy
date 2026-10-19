import {
  RealEstateSidebar,
  CommercialSidebar,
  NeedHelpCard,
  RealEstateAboveCard,
  AuctionAboveCard,
} from "../../shared/DetailSidebar";
import ExistingAuctionSidebar from "./AuctionSidebar";

export {
  RealEstateSidebar,
  ExistingAuctionSidebar as AuctionSidebar,
  CommercialSidebar,
  NeedHelpCard,
  RealEstateAboveCard,
  AuctionAboveCard,
};

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

function getButtonText(listingPurpose: ListingPurpose): string {
  const p = listingPurpose?.toUpperCase();
  switch (p) {
    case "RENT":
      return "Book an Inspection";
    default:
      return "Send a enquiry";
  }
}

export const PropertySidebar = ({
  sidebar,
  listingPurpose,
  isAuction,
  venueAddress,
  auctionVenue,
  auctionDate,
  auctionTime,
  auctioneer,
  auctionContact,
  auctionDescription,
  propertyId,
  propertyTitle,
  organizationId,
  statusTag,
  statusDate,
  address,
  organizationName,
  onEnquiry,
}: {
  sidebar: { price?: number; builderName?: string; location?: string };
  listingPurpose?: ListingPurpose;
  isAuction?: boolean;
  venueAddress?: string;
  auctionVenue?: string;
  auctionDate?: string;
  auctionTime?: string;
  auctioneer?: string;
  auctionContact?: string;
  auctionDescription?: string;
  propertyId?: string;
  propertyTitle?: string;
  organizationId?: string;
  statusTag?: string;
  statusDate?: string;
  address?: string;
  organizationName?: string;
  onEnquiry?: () => void;
}) => {
  if (isAuction) {
    return (
      <ExistingAuctionSidebar
        sidebar={sidebar}
        venueAddress={auctionVenue || venueAddress || address || sidebar.location}
        auctionVenue={auctionVenue}
        auctionDate={auctionDate}
        auctionTime={auctionTime}
        auctioneer={auctioneer}
        auctionContact={auctionContact}
        auctionDescription={auctionDescription}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        organizationId={organizationId}
        onEnquiry={onEnquiry}
      />
    );
  }

  const priceLabel = getPriceLabel(listingPurpose);
  const buttonText = getButtonText(listingPurpose);

  const priceDisplay = sidebar.price
    ? `$${sidebar.price.toLocaleString()}`
    : undefined;

  return (
    <RealEstateSidebar
      price={priceDisplay}
      priceLabel={priceDisplay ? priceLabel : undefined}
      statusTag={statusTag}
      statusDate={statusDate}
      address={address || sidebar.location}
      organizationName={organizationName || sidebar.builderName}
      buttonText={buttonText}
      onEnquiry={onEnquiry}
      showNeedHelp={true}
    />
  );
};

