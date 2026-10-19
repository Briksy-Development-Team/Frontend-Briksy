import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Verify from "../../../assets/icons/verify.svg";

export interface NeedHelpItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

const DEFAULT_NEED_HELP_ITEMS: NeedHelpItem[] = [
  { label: "Find a Buyer's Agent", href: "/agents" },
  { label: "Find a Mortgage Broker", href: "/professionals?category=broker" },
  { label: "Find a Conveyancer", href: "/professionals?category=conveyancer" },
];

/**
 * Top "Verified by Briksy" badge
 */
export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full bg-white rounded-xl py-3 px-6 flex justify-center items-center gap-2.5 ${className}`}
      style={{ boxShadow: "0px 0px 13px 0px rgba(0, 0, 0, 0.12)" }}
    >
      <img src={Verify} alt="Verified by Briksy" className="w-[51px] h-[34px] object-contain" />
      <span className="font-medium text-[0.875rem] text-[#342511]">Verified by Briksy</span>
    </div>
  );
}

/**
 * Dynamic "Need Help with ?" card (Figma node 4503-6446)
 */
export function NeedHelpCard({
  title = "Need Help with ?",
  items = DEFAULT_NEED_HELP_ITEMS,
  className = "",
}: {
  title?: string;
  items?: NeedHelpItem[];
  className?: string;
}) {
  const navigate = useNavigate();

  const handleClick = (item: NeedHelpItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <div className="px-1.5">
        <h3 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#222222]">
          {title}
        </h3>
      </div>

      <div className="w-full bg-white rounded-[14px] border border-[#EDE8E4] overflow-hidden shadow-xs">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            <button
              type="button"
              onClick={() => handleClick(item)}
              className="w-full p-4 flex items-center justify-between text-left transition-colors hover:bg-[#F8F4EE] active:bg-[#EDE8E4]/50 cursor-pointer"
            >
              <span className="text-[14px] font-medium leading-[20px] text-[#342511]">
                {item.label}
              </span>
              <ChevronRight size={18} className="text-[#342511] shrink-0" />
            </button>
            {index < items.length - 1 && <div className="h-[1px] bg-[#EDE8E4] w-full" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 1. REAL ESTATE & COMMERCIAL - Above Part (Figma node 4503-6432)
 */
export interface RealEstateAboveProps {
  statusTag?: string;
  statusDate?: string;
  price?: string | number;
  priceLabel?: string;
  address?: string;
  organizationName?: string;
  buttonText?: string;
  onEnquiry?: () => void;
  className?: string;
}

export function RealEstateAboveCard({
  statusTag,
  statusDate,
  price,
  priceLabel,
  address,
  organizationName,
  buttonText = "Send a enquiry",
  onEnquiry,
  className = "",
}: RealEstateAboveProps) {
  const formattedPrice =
    typeof price === "number"
      ? `$${price.toLocaleString()}`
      : price || undefined;

  const disclaimerOrg = organizationName || "Harkaway Homes";

  return (
    <div
      className={`w-full bg-white rounded-[16px] border border-[#EDE8E4] p-5 flex flex-col gap-3 shadow-xs ${className}`}
    >
      <div className="flex flex-col gap-3">
        {/* Status tag and date */}
        {(statusTag || statusDate) && (
          <div className="flex items-center justify-between gap-2">
            {statusTag && (
              <span className="inline-flex items-center px-3 h-[26px] rounded-[14px] bg-[#EDE8E4] text-[#222222] text-[13px] font-medium uppercase tracking-wide">
                {statusTag}
              </span>
            )}
            {statusDate && (
              <span className="text-[14px] text-black font-normal">{statusDate}</span>
            )}
          </div>
        )}

        {/* Price */}
        {formattedPrice && (
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-medium leading-[32px] tracking-[-0.006em] text-[#342511]">
              {formattedPrice}
            </span>
            {priceLabel && (
              <span className="text-[14px] font-normal text-black">{priceLabel}</span>
            )}
          </div>
        )}

        {/* Address */}
        {address && (
          <p className="text-[14px] font-normal leading-[20px] text-black line-clamp-3">
            {address}
          </p>
        )}
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={onEnquiry}
        className="w-full h-10 rounded-full bg-[#342511] text-[#F8F4EE] text-[14px] font-normal hover:bg-[#251a0b] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center mt-1"
      >
        {buttonText}
      </button>

      {/* Disclaimer */}
      <p className="text-[13px] font-normal leading-[19px] text-black">
        Enquiries go directly to {disclaimerOrg}. BRIKSY never charges buyers.
      </p>
    </div>
  );
}

export const CommercialAboveCard = RealEstateAboveCard;

/**
 * 2. AUCTION - Above Part (Figma node 4322-24361)
 */
export interface AuctionAboveProps {
  title?: string;
  venueAddress?: string;
  auctionDate?: string;
  auctionTime?: string;
  auctioneer?: string;
  auctionContact?: string;
  auctionDescription?: string;
  organizationName?: string;
  buttonText?: string;
  onEnquiry?: () => void;
  className?: string;
}

export function AuctionAboveCard({
  title = "Auction details",
  venueAddress,
  auctionDate,
  auctionTime,
  auctioneer,
  auctionContact,
  auctionDescription,
  organizationName,
  buttonText = "Send a enquiry",
  onEnquiry,
  className = "",
}: AuctionAboveProps) {
  const disclaimerOrg = organizationName || "Harkaway Homes";

  return (
    <div
      className={`w-full bg-white rounded-[16px] border border-[#EDE8E4] p-5 flex flex-col gap-3 shadow-xs ${className}`}
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#342511]">
          {title}
        </h3>

        {/* Inset auction details box */}
        <div className="border border-[#E7E7E4] rounded-[10px] p-3 flex flex-col gap-1.5">
          {venueAddress && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-normal text-[#98928E]">Venue Address</span>
              <span className="text-[14px] font-medium text-black leading-tight">
                {venueAddress}
              </span>
            </div>
          )}

          {venueAddress && (auctionDate || auctionTime) && (
            <div className="h-[1px] bg-[#E7E7E4] w-full my-0.5" />
          )}

          {auctionDate && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-normal text-[#98928E]">Date</span>
              <span className="text-[14px] font-medium text-black leading-tight">
                {auctionDate}
              </span>
            </div>
          )}

          {auctionDate && auctionTime && (
            <div className="h-[1px] bg-[#E7E7E4] w-full my-0.5" />
          )}

          {auctionTime && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-normal text-[#98928E]">Starting Time</span>
              <span className="text-[14px] font-medium text-black leading-tight">
                {auctionTime}
              </span>
            </div>
          )}

          {auctioneer && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-normal text-[#98928E]">Auctioneer</span>
              <span className="text-[14px] font-medium text-black leading-tight">{auctioneer}</span>
            </div>
          )}

          {auctionContact && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-normal text-[#98928E]">Auction Contact</span>
              <span className="text-[14px] font-medium text-black leading-tight">{auctionContact}</span>
            </div>
          )}
        </div>

        {auctionDescription && (
          <p className="text-[13px] leading-[19px] text-[#342511]">{auctionDescription}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onEnquiry}
        className="w-full h-10 rounded-full bg-[#342511] text-[#F8F4EE] text-[14px] font-normal hover:bg-[#251a0b] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center mt-1"
      >
        {buttonText}
      </button>

      <p className="text-[13px] font-normal leading-[19px] text-black">
        Enquiries go directly to {disclaimerOrg}. BRIKSY never charges buyers.
      </p>
    </div>
  );
}

/**
 * 3. BUILDER - Above Part (Figma node 4503-6879)
 */
export interface BuilderAboveProps {
  title?: string;
  address?: string | null;
  time?: string | null;
  phone?: string | null;
  website?: string | null;
  organizationName?: string;
  primaryButtonText?: string;
  onPrimaryAction?: () => void;
  onEnquiry?: () => void;
  onCall?: () => void;
  className?: string;
}

export function BuilderAboveCard({
  title = "Contact Details",
  address,
  time,
  phone,
  website,
  organizationName,
  primaryButtonText = "Request a free consultation",
  onPrimaryAction,
  onEnquiry,
  onCall,
  className = "",
}: BuilderAboveProps) {
  const disclaimerOrg = organizationName || "Harkaway Homes";

  return (
    <div
      className={`w-full bg-white rounded-[16px] border border-[#EDE8E4] p-5 flex flex-col gap-3 shadow-xs ${className}`}
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#342511]">
          {title}
        </h3>

        {/* Inset contact box */}
        <div className="border border-[#E7E7E4] rounded-[10px] p-3 flex flex-col gap-1.5">
          {address && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-normal text-[#8B6F54]">Address</span>
              <span className="text-[14px] font-medium text-black leading-tight">{address}</span>
            </div>
          )}

          {address && (time || phone || website) && (
            <div className="h-[1px] bg-[#E7E7E4] w-full my-0.5" />
          )}

          {time && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-normal text-[#8B6F54]">Time</span>
              <span className="text-[14px] font-medium text-black leading-tight">{time}</span>
            </div>
          )}

          {time && (phone || website) && <div className="h-[1px] bg-[#E7E7E4] w-full my-0.5" />}

          {phone && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-normal text-[#8B6F54]">Contact Details</span>
              <span className="text-[14px] font-medium text-black leading-tight">{phone}</span>
            </div>
          )}

          {phone && website && <div className="h-[1px] bg-[#E7E7E4] w-full my-0.5" />}

          {website && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-normal text-[#8B6F54]">Website</span>
              <span className="text-[14px] font-medium text-black leading-tight">{website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-1">
        <button
          type="button"
          onClick={onPrimaryAction || onEnquiry}
          className="w-full h-10 rounded-full bg-[#342511] text-[#F8F4EE] text-[14px] font-medium hover:bg-[#251a0b] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
        >
          {primaryButtonText}
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEnquiry}
            className="flex-1 h-10 rounded-full border border-[#EDE8E4] bg-white text-[#342511] text-[14px] font-medium hover:bg-neutral-50 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
          >
            Enquiry
          </button>
          <button
            type="button"
            onClick={onCall || onEnquiry}
            className="flex-1 h-10 rounded-full border border-[#EDE8E4] bg-white text-[#342511] text-[14px] font-medium hover:bg-neutral-50 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
          >
            Call Agency
          </button>
        </div>
      </div>

      <p className="text-[13px] font-normal leading-[19px] text-black">
        Enquiries go directly to {disclaimerOrg}. BRIKSY never charges buyers.
      </p>
    </div>
  );
}

/**
 * 4. TRADER / SERVICE - Above Part (Figma node 4322-25715)
 */
export interface TraderAboveProps {
  price?: string | number | null;
  pricePrefix?: string;
  priceLabel?: string;
  buttonText?: string;
  onEnquiry?: () => void;
  className?: string;
}

export function TraderAboveCard({
  price = "$850k",
  pricePrefix = "From ",
  priceLabel = "fixed price",
  buttonText = "Send a enquiry",
  onEnquiry,
  className = "",
}: TraderAboveProps) {
  const formattedPrice =
    typeof price === "number"
      ? `$${(price / 1000).toFixed(0)}k`
      : price || "$850k";

  return (
    <div
      className={`w-full bg-white rounded-[16px] border border-[#EDE8E4] p-[26px] flex flex-col gap-3.5 shadow-xs ${className}`}
    >
      <div className="flex items-baseline gap-1.5">
        <span className="text-[14px] font-medium text-[#342511]">{pricePrefix}</span>
        <span className="text-[24px] font-medium leading-[32px] tracking-[-0.006em] text-[#342511]">
          {formattedPrice}
        </span>
        {priceLabel && (
          <span className="text-[14px] font-normal text-black ml-1">{priceLabel}</span>
        )}
      </div>

      <button
        type="button"
        onClick={onEnquiry}
        className="w-full h-10 rounded-full bg-[#342511] text-[#F8F4EE] text-[14px] font-normal hover:bg-[#251a0b] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
      >
        {buttonText}
      </button>
    </div>
  );
}

/**
 * 5. AGENT - Above Part (Figma node 4359-2102)
 */
export interface AgentAboveProps {
  primaryButtonText?: string;
  onPrimaryAction?: () => void;
  onEnquiry?: () => void;
  onCall?: () => void;
  className?: string;
}

export function AgentAboveCard({
  primaryButtonText = "Request a free appraisal",
  onPrimaryAction,
  onEnquiry,
  onCall,
  className = "",
}: AgentAboveProps) {
  return (
    <div
      className={`w-full bg-white rounded-[16px] border border-[#EDE8E4] p-6 flex flex-col gap-3.5 shadow-xs ${className}`}
    >
      <button
        type="button"
        onClick={onPrimaryAction || onEnquiry}
        className="w-full h-10 rounded-full bg-[#342511] text-[#F8F4EE] text-[14px] font-medium hover:bg-[#251a0b] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
      >
        {primaryButtonText}
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onEnquiry}
          className="flex-1 h-10 rounded-full border border-[#EDE8E4] bg-white text-[#342511] text-[14px] font-medium hover:bg-neutral-50 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
        >
          Enquiry
        </button>
        <button
          type="button"
          onClick={onCall || onEnquiry}
          className="flex-1 h-10 rounded-full border border-[#EDE8E4] bg-white text-[#342511] text-[14px] font-medium hover:bg-neutral-50 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center"
        >
          Call Agency
        </button>
      </div>
    </div>
  );
}

/**
 * COMPLETE SIDEBARS (combining VerifiedBadge + AboveCard + NeedHelpCard)
 */

export function RealEstateSidebar({
  showVerifiedBadge = true,
  showNeedHelp = true,
  needHelpItems,
  ...props
}: RealEstateAboveProps & {
  showVerifiedBadge?: boolean;
  showNeedHelp?: boolean;
  needHelpItems?: NeedHelpItem[];
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {showVerifiedBadge && <VerifiedBadge />}
      <RealEstateAboveCard {...props} />
      {showNeedHelp && <NeedHelpCard items={needHelpItems} />}
    </div>
  );
}

export const CommercialSidebar = RealEstateSidebar;

export function AuctionSidebar({
  showVerifiedBadge = true,
  showNeedHelp = true,
  needHelpItems,
  ...props
}: AuctionAboveProps & {
  showVerifiedBadge?: boolean;
  showNeedHelp?: boolean;
  needHelpItems?: NeedHelpItem[];
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {showVerifiedBadge && <VerifiedBadge />}
      <AuctionAboveCard {...props} />
      {showNeedHelp && <NeedHelpCard items={needHelpItems} />}
    </div>
  );
}

export function BuilderSidebar({
  showVerifiedBadge = true,
  showNeedHelp = true,
  needHelpItems,
  ...props
}: BuilderAboveProps & {
  showVerifiedBadge?: boolean;
  showNeedHelp?: boolean;
  needHelpItems?: NeedHelpItem[];
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {showVerifiedBadge && <VerifiedBadge />}
      <BuilderAboveCard {...props} />
      {showNeedHelp && <NeedHelpCard items={needHelpItems} />}
    </div>
  );
}

export function TraderSidebar({
  showVerifiedBadge = true,
  showNeedHelp = false,
  needHelpItems,
  ...props
}: TraderAboveProps & {
  showVerifiedBadge?: boolean;
  showNeedHelp?: boolean;
  needHelpItems?: NeedHelpItem[];
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {showVerifiedBadge && <VerifiedBadge />}
      <TraderAboveCard {...props} />
      {showNeedHelp && <NeedHelpCard items={needHelpItems} />}
    </div>
  );
}

export const ServiceSidebar = TraderSidebar;

export function AgentSidebar({
  showVerifiedBadge = true,
  showNeedHelp = true,
  needHelpItems,
  ...props
}: AgentAboveProps & {
  showVerifiedBadge?: boolean;
  showNeedHelp?: boolean;
  needHelpItems?: NeedHelpItem[];
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {showVerifiedBadge && <VerifiedBadge />}
      <AgentAboveCard {...props} />
      {showNeedHelp && <NeedHelpCard items={needHelpItems} />}
    </div>
  );
}

/**
 * Backward compatibility wrapper
 */
export function DetailSidebar(props: any) {
  return <RealEstateSidebar {...props} />;
}

export default DetailSidebar;
