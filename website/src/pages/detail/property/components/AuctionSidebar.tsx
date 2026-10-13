import Verify from "../../../../assets/icons/verify.svg";

export interface AuctionSidebarProps {
  sidebar?: {
    builderName?: string;
    location?: string;
    price?: number;
  };
  venueAddress?: string;
  auctionDate?: string;
  auctionTime?: string;
  onEnquiry?: () => void;
  showVerifiedBadge?: boolean;
}

export function AuctionSidebar({
  sidebar,
  venueAddress,
  auctionDate = "Saturday, 17 October 2026",
  auctionTime = "11:00 AM",
  onEnquiry,
  showVerifiedBadge = true,
}: AuctionSidebarProps) {
  const displayAddress =
    venueAddress ||
    (sidebar?.builderName && sidebar?.location
      ? `${sidebar.builderName}, ${sidebar.location}`
      : sidebar?.location ||
        (sidebar?.builderName
          ? `${sidebar.builderName}, 1234 Elm Street, Richmond, VIC 3121, Australia`
          : "Sunrise Property Group, 1234 Elm Street, Richmond, VIC 3121, Australia"));

  const footerText = sidebar?.builderName
    ? `Enquiries go directly to ${sidebar.builderName}. BRIKSY never charges buyers.`
    : "Enquiries go directly to Harkaway Homes. BRIKSY never charges buyers.";

  return (
    <div className="flex flex-col gap-4 w-full">
      {showVerifiedBadge && (
        <div
          className="w-full bg-white rounded-xl py-3 px-9 flex justify-center items-center gap-2.5"
          style={{ boxShadow: "0px 0px 13px 0px rgba(0, 0, 0, 0.12)" }}
        >
          <img src={Verify} alt="" />
          <span className="font-medium text-[0.875rem] text-primary-brown">
            Verified by Briksy
          </span>
        </div>
      )}

      <div className="w-full bg-white rounded-2xl border border-[#EDE8E4] flex flex-col gap-3.5 p-[26px]">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[1.25rem] font-medium leading-7 text-primary-brown">
            Auction details
          </span>
        </div>

        <div className="w-full rounded-[10px] border border-[#E7E7E4] p-3 flex flex-col gap-1.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.75rem] leading-[1.5em] text-[#98928E]">
              Venue Address
            </span>
            <span className="text-[0.875rem] font-medium leading-5 text-black">
              {displayAddress}
            </span>
          </div>

          <div className="w-full h-px bg-[#E7E7E4] my-0.5" />

          <div className="flex flex-col gap-0.5">
            <span className="text-[0.75rem] leading-[1.5em] text-[#98928E]">
              Date
            </span>
            <span className="text-[0.875rem] font-medium leading-5 text-black">
              {auctionDate}
            </span>
          </div>

          <div className="w-full h-px bg-[#E7E7E4] my-0.5" />

          <div className="flex flex-col gap-0.5">
            <span className="text-[0.75rem] leading-[1.5em] text-[#98928E]">
              Starting Time
            </span>
            <span className="text-[0.875rem] font-medium leading-5 text-black">
              {auctionTime}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEnquiry}
          className="w-full h-10 rounded-full bg-primary-brown text-white py-2 px-6 font-medium text-[0.875rem] hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer"
        >
          Send an enquiry
        </button>

        <p className="text-[0.875rem] text-black leading-5">
          {footerText}
        </p>
      </div>
    </div>
  );
}

export default AuctionSidebar;
