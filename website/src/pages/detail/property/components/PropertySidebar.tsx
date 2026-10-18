import {
  RealEstateSidebar,
  AuctionSidebar as SharedAuctionSidebar,
  CommercialSidebar,
  NeedHelpCard,
  RealEstateAboveCard,
  AuctionAboveCard,
} from "../../shared/DetailSidebar";

export {
  RealEstateSidebar,
  SharedAuctionSidebar as AuctionSidebar,
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
  auctionDate,
  auctionTime,
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
      <SharedAuctionSidebar
        venueAddress={venueAddress || address || sidebar.location}
        auctionDate={auctionDate || "Saturday, 17 October 2026"}
        auctionTime={auctionTime || "11:00 AM"}
        organizationName={organizationName || sidebar.builderName}
        buttonText="Send a enquiry"
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

