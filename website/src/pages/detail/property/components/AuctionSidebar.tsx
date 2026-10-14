import Verify from "../../../../assets/icons/verify.svg";
import { CalendarPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { createInquiry } from "../../../../api/seeker/inquiry.api";
import { addAuctionCalendarEvent } from "../../../../api/seeker/calendar.api";
import { useAuth } from "../../../../auth/AuthContext";

export interface AuctionSidebarProps {
  sidebar?: {
    builderName?: string;
    location?: string;
    price?: number;
  };
  venueAddress?: string;
  auctionDate?: string;
  auctionTime?: string;
  propertyId?: string;
  propertyTitle?: string;
  organizationId?: string;
  onEnquiry?: () => void;
  showVerifiedBadge?: boolean;
}

export function AuctionSidebar({
  sidebar,
  venueAddress,
  auctionDate = "2026-10-17",
  auctionTime = "11:00",
  propertyId,
  propertyTitle = "Property auction",
  organizationId,
  onEnquiry,
  showVerifiedBadge = true,
}: AuctionSidebarProps) {
  const { isAuthenticated, isSeeker, user } = useAuth();
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationSubmitting, setRegistrationSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registration, setRegistration] = useState({ name: "", email: "", phone: "" });
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
  const canAddToCalendar = Boolean(organizationId && propertyId && auctionDate && /^\d{4}-\d{2}-\d{2}$/.test(auctionDate));
  const displayDate = /^\d{4}-\d{2}-\d{2}$/.test(auctionDate)
    ? new Date(`${auctionDate}T00:00:00`).toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : auctionDate;
  const displayTime = /^\d{2}:\d{2}/.test(auctionTime)
    ? new Date(`2000-01-01T${auctionTime.slice(0, 5)}:00`).toLocaleTimeString("en-AU", {
        hour: "numeric",
        minute: "2-digit",
      })
    : auctionTime;
  const registerForAuction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!organizationId || !propertyId) return;
    if (!isAuthenticated || !isSeeker) {
      setRegistrationError("Please sign in as a seeker before registering for an auction.");
      return;
    }

    setRegistrationSubmitting(true);
    setRegistrationError(null);
    try {
      const seekerName = user?.name || registration.name;
      const seekerEmail = user?.email || registration.email;
      const seekerPhone = user?.mobile_number || registration.phone;
      if (!seekerName || !seekerEmail || !seekerPhone) {
        setRegistrationError("Please add a contact number to your profile before registering.");
        return;
      }
      await createInquiry({
        organization_id: organizationId,
        property_listing_id: propertyId,
        lead_source: "auction_registration",
        subject: `Auction registration - ${propertyTitle}`,
        interested_in: ["property_information"],
        message: `Registered for the auction on ${displayDate} at ${displayTime}. Venue: ${displayAddress}`,
        seeker_name: seekerName,
        seeker_email: seekerEmail,
        seeker_phone: seekerPhone,
      });
      await addAuctionCalendarEvent({
        property_listing_id: propertyId,
        starts_at: new Date(`${auctionDate} ${auctionTime}`).toISOString(),
        venue: displayAddress,
      });
      setCalendarAdded(true);
      setRegistrationOpen(false);
    } catch (reason: any) {
      setRegistrationError(reason?.response?.data?.message || "Unable to register for this auction. Please try again.");
    } finally {
      setRegistrationSubmitting(false);
    }
  };

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
              {displayDate}
            </span>
          </div>

          <div className="w-full h-px bg-[#E7E7E4] my-0.5" />

          <div className="flex flex-col gap-0.5">
            <span className="text-[0.75rem] leading-[1.5em] text-[#98928E]">
              Starting Time
            </span>
            <span className="text-[0.875rem] font-medium leading-5 text-black">
              {displayTime}
            </span>
          </div>
        </div>

        {canAddToCalendar && (
          <div className="rounded-xl border border-[#E7DED0] bg-[#FCFAF7] p-3">
            <button
              type="button"
              onClick={() => setRegistrationOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-primary-brown px-4 py-2.5 text-sm font-medium text-primary-brown hover:bg-primary-brown hover:text-white"
            >
              <CalendarPlus size={16} />
              {calendarAdded ? "Auction added to calendar" : "Add to calendar"}
            </button>
            <p className="mt-2 text-center text-xs leading-4 text-primary-light-brown">
              Reminders: 1 week, 3 days, 1 day and on auction day.
            </p>
          </div>
        )}

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

      {registrationOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-xl font-medium text-primary-brown">Register for this auction</h2>
              <p className="mt-1 text-sm text-primary-light-brown">Add the auction to your Briksy calendar and receive reminders.</p>
              {!isAuthenticated || !isSeeker ? <p className="mt-2 text-sm text-amber-700">Please sign in as a seeker before registering so this event can be saved to your profile calendar.</p> : null}
            </div>
            <form onSubmit={registerForAuction} className="space-y-4">
              {isAuthenticated && isSeeker ? (
                <div className="rounded-xl bg-[#F8F4EE] px-4 py-3 text-sm text-primary-brown">
                  Registering as <strong>{user?.name}</strong> ({user?.email}).
                  {user?.mobile_number ? <span className="block text-xs text-primary-light-brown">Contact: {user.mobile_number}</span> : <span className="block pt-1 text-xs text-amber-700">Add a contact number to your profile to continue.</span>}
                </div>
              ) : (
                <>
                  <input required value={registration.name} onChange={(event) => setRegistration({ ...registration, name: event.target.value })} className="w-full rounded-xl border border-[#E7E7E4] px-4 py-3 text-sm" placeholder="Full name" />
                  <input required type="email" value={registration.email} onChange={(event) => setRegistration({ ...registration, email: event.target.value })} className="w-full rounded-xl border border-[#E7E7E4] px-4 py-3 text-sm" placeholder="Email address" />
                  <input required type="tel" value={registration.phone} onChange={(event) => setRegistration({ ...registration, phone: event.target.value })} className="w-full rounded-xl border border-[#E7E7E4] px-4 py-3 text-sm" placeholder="Contact number" />
                </>
              )}
              {registrationError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{registrationError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setRegistrationOpen(false)} className="flex-1 rounded-full border border-primary-brown px-4 py-3 text-sm text-primary-brown">Cancel</button>
                <button type="submit" disabled={registrationSubmitting} className="flex-1 rounded-full bg-primary-brown px-4 py-3 text-sm text-white disabled:opacity-60">{registrationSubmitting ? "Registering..." : "Register & add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuctionSidebar;
