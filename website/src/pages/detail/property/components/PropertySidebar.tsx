
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Calendar,
  ChevronRight,
  Handshake,
  Landmark,
  Mail,
  Star,
} from "lucide-react";
import { SafeImage } from "../../../../components/custom/SafeImage";
import AgentAvatar from "../../../../assets/agent/agent_avatar.png";
// import BusinessPlaceholder from "../../../../assets/place holder/bussinessholder.svg";
import Approves from "../../../../assets/logo/apprrove.svg";
import ExistingAuctionSidebar from "./AuctionSidebar";

// Backward-compatibility exports
export { ExistingAuctionSidebar as AuctionSidebar };

const DEFAULT_INSPECTIONS = [
  { date: "Sat, Oct 2026", time: "10:00am -10:30pm" },
  { date: "Wed, Oct 2026", time: "10:00am -10:30pm" },
];

const NEED_HELP_LINKS = [
  {
    label: "Find a Buyer's Agent",
    href: "/agents?tab=buyers-agent",
    icon: <Building2 size={17} className="text-primary-brown shrink-0" />,
  },
  {
    label: "Find a Mortgage Broker",
    href: "/professionals?tab=mortgage-brokers&service_slug=mortgage-brokers",
    icon: <Landmark size={17} className="text-primary-brown shrink-0" />,
  },
  {
    label: "Find a Conveyancer",
    href: "/professionals?tab=conveyancers&service_slug=conveyancers",
    icon: <Handshake size={17} className="text-primary-brown shrink-0" />,
  },
];

export interface PropertySidebarProps {
  sidebar?: { price?: number; builderName?: string; location?: string };
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
  organizationName?: string;
  organizationLogo?: string;
  organizationCategory?: string;
  agent?: {
    name?: string | null;
    role?: string | null;
    avatar?: string | null;
    phone?: string | null;
    verified?: string | null;
    agency?: string | null;
  } | null;
  creator?: {
    id?: string;
    name?: string;
    email?: string | null;
    mobile_number?: string | null;
  } | null;
  rating?: number | null;
  reviewsCount?: number | null;
  onEnquiry?: () => void;
}

export const PropertySidebar = ({
  sidebar,
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
  organizationName,
  agent,
  creator,
  rating,
  reviewsCount,
  onEnquiry,
}: PropertySidebarProps) => {
  const navigate = useNavigate();

  // If Auction, preserve the specialized Auction Sidebar
  if (isAuction) {
    return (
      <ExistingAuctionSidebar
        sidebar={sidebar ?? {}}
        venueAddress={auctionVenue || venueAddress || sidebar?.location}
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

  // Resolving Agent details with Figma defaults
  const agentName = agent?.name || creator?.name || "James Carter";
  const agentRole = agent?.role || "Senior Sales Agent";
  const agencyName = organizationName || agent?.agency || "Carter Real Estate";
  const agentAvatar = agent?.avatar || AgentAvatar;
  const agentPhone = agent?.phone || creator?.mobile_number;
  const displayRating = rating && rating > 0 ? rating : 4.5;
  const displayReviews = reviewsCount && reviewsCount > 0 ? reviewsCount : 123;

  // Resolving Agency details with Figma defaults
  // const agencyTitle = organizationName || "Sunrise Property Group";
  // const agencyTag = organizationCategory || "Property Management";
  // const agencyLogoSrc = organizationLogo || BusinessPlaceholder;

  const handleCall = () => {
    if (agentPhone) {
      window.location.href = `tel:${agentPhone}`;
    } else if (onEnquiry) {
      onEnquiry();
    }
  };

  const handleViewProfile = () => {
    if (organizationId) {
      navigate(`/builder/${organizationId}`);
    } else {
      navigate("/agents");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full font-helvetica text-primary-brown">
      {/* ─── 1. LISTED AGENT ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 w-full">
        <span className="text-[0.875rem] font-bold uppercase tracking-wider text-primary-brown px-1">
          Listed Agent
        </span>
        <div className="w-full bg-white rounded-2xl border border-white-100 p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-white-100 bg-[#F8F4EE]">
                <SafeImage
                  src={agentAvatar}
                  alt={agentName}
                  className="h-full w-full object-cover"
                />
              </div>
              <img
                loading="lazy"
                src={Approves}
                alt="Verified"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 w-6 sm:h-7 sm:w-7 drop-shadow-2xs"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <h3 className="text-[18px] sm:text-[1.5rem] font-medium text-primary-brown leading-tight truncate">
                {agentName}
              </h3>
              <p className="text-[0.875rem] text-primary-light-brown truncate mt-0.5">
                {agentRole}
              </p>
              <p className="text-[0.875rem] font-medium text-primary-light-brown truncate">
                {agencyName}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[0.875rem] font-medium text-primary-brown">
                <Star size={14} className="fill-[#EAA43A] text-[#EAA43A]" />
                <span className="font-semibold">{displayRating}</span>
                <span className="text-primary-brown ">({displayReviews} reviews)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onEnquiry}
            className="w-full h-10 rounded-full bg-primary-brown text-white-50 text-[0.875rem] font-medium flex items-center justify-center gap-2  transition shadow-2xs cursor-pointer"
          >
            <Mail size={16} />
            <span>Get In touch</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCall}
              className="flex-1 h-9 rounded-full border border-white-100 bg-white text-primary-brown text-[0.875rem] font-medium hover:bg-white-50 transition flex items-center justify-center cursor-pointer"
            >
              Call
            </button>
            <button
              type="button"
              onClick={handleViewProfile}
              className="flex-1 h-9 rounded-full border border-white-100 bg-white text-primary-brown text-[0.875rem] font-medium hover:bg-white-50 transition flex items-center justify-center cursor-pointer"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. LISTED BY AGENCY ────────────────────────────────────────── */}
      {/* <div className="flex flex-col gap-2 w-full">
        <span className="text-[0.875rem] font-bold uppercase tracking-wider text-primary-brown px-1">
          Listed by Agency
        </span>
        <div
          onClick={handleViewProfile}
          className="w-full bg-white rounded-2xl border border-white-100 p-4 shadow-xs flex items-center gap-3.5 hover:border-primary-brown/30 transition cursor-pointer"
        >
          <div className="relative shrink-0 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white-100 bg-[#F8F4EE]">
              <SafeImage
                src={agencyLogoSrc}
                alt={agencyTitle}
                className="h-full w-full object-cover"
              />
            </div>
            <img
              loading="lazy"
              src={Approves}
              alt="Verified"
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-5 w-5 drop-shadow-2xs"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-[1rem] font-semibold text-primary-brown leading-tight truncate">
              {agencyTitle}
            </h4>
            <p className="text-[0.875rem] text-primary-brown truncate mt-0.5">
              {agencyTag}
            </p>
          </div>
        </div>
      </div> */}

      {/* ─── 3. INSPECTION TIME ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 w-full">
        <span className="text-[0.875rem] font-bold uppercase tracking-wider text-primary-brown px-1">
          Inspection Time
        </span>
        <div className="w-full bg-white rounded-2xl border border-white-100 overflow-hidden shadow-xs flex flex-col">
          {DEFAULT_INSPECTIONS.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2.5 text-primary-brown">
                  <Calendar size={17} className="text-primary-brown shrink-0" />
                  <span className="text-[0.875rem] font-medium text-primary-brown">
                    {item.date}
                  </span>
                </div>
                <span className="text-[13px] text-primary-brown">{item.time}</span>
              </div>
              <div className="h-[1px] bg-white-100/80 w-full" />
            </div>
          ))}

          <button
            type="button"
            onClick={onEnquiry}
            className="w-full p-4 flex items-center justify-between text-left bg-primary-brown transition cursor-pointer"
          >
            <span className="text-[0.875rem] font-medium text-white">
              View Inspection Time
            </span>
            <ChevronRight size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* ─── 4. NEED HELP WITH ? ────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 w-full">
        <span className="text-[0.875rem] font-bold uppercase tracking-wider text-primary-brown px-1">
          Need Help with ?
        </span>
        <div className="w-full bg-white rounded-2xl border border-white-100 overflow-hidden shadow-xs flex flex-col">
          {NEED_HELP_LINKS.map((item, idx) => (
            <div key={idx}>
              <button
                type="button"
                onClick={() => navigate(item.href)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-primary-brown">
                  {item.icon}
                  <span className="text-[0.875rem] font-medium text-primary-brown">
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={16} className="text-primary-brown" />
              </button>
              {idx < NEED_HELP_LINKS.length - 1 && (
                <div className="h-[1px] bg-white-100/80 w-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
