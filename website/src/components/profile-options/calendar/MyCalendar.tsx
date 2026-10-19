import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { getAuctionCalendarEvents, type AuctionCalendarEvent } from "../../../api/seeker/calendar.api";
import { getProperties, type PublicProperty } from "../../../api/property/property.api";
import type { CalendarEvent, DesktopCategory } from "../../../types/calendar";
import EventGridCard from "../../cards/event/EventGridCard";
import EventListCard from "../../cards/event/EventListCard";

import imageFour from "../../../assets/dummy/imagefour.png";
import defaultAvatar from "../../../assets/agent/reviewer_avatar.png";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DESKTOP_FILTERS: DesktopCategory[] = [
  "Property Visits",
  "Open Homes",
  "Auctions",
  "Enquiries",
  "Reminders",
];

const MOBILE_FILTERS = ["All", "Visit", "Open House", "Auction", "Meeting"] as const;

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function auctionDateTime(property: PublicProperty): Date | null {
  const date = property.auction_details?.date;
  if (!date) return null;
  const time = property.auction_details?.time?.slice(0, 5) || "00:00";
  const parsed = new Date(`${date}T${time}:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function auctionTimeLabel(property: PublicProperty): string {
  const time = property.auction_details?.time;
  if (!time) return "Time to be confirmed";
  const parsed = new Date(`2000-01-01T${time.slice(0, 5)}:00`);
  return Number.isNaN(parsed.getTime())
    ? time
    : parsed.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
}

function propertyPreviewImage(property: PublicProperty): string {
  return property.images?.find((image) => image.is_primary)?.url
    || property.images?.find((image) => image.url)?.url
    || property.media?.find((media) => media.type === "image" && media.is_primary)?.url
    || property.media?.find((media) => media.type === "image")?.url
    || imageFour;
}

function getCalendarMatrix(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();

  const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();

  const cells: { date: Date; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    cells.push({
      date: new Date(year, monthIndex - 1, d),
      dayNum: d,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: new Date(year, monthIndex, d),
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to fill complete grid
  const remaining = (7 - (cells.length % 7)) % 7;
  const targetTotal = cells.length + remaining < 35 ? 35 : cells.length + remaining;
  const needed = targetTotal - cells.length;
  for (let d = 1; d <= needed; d++) {
    cells.push({
      date: new Date(year, monthIndex + 1, d),
      dayNum: d,
      isCurrentMonth: false,
    });
  }

  return cells;
}

export default function MyCalendar() {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [desktopFilters, setDesktopFilters] = useState<DesktopCategory[]>([]);
  const [mobileFilter, setMobileFilter] = useState<string>("All");
  const [apiEvents, setApiEvents] = useState<AuctionCalendarEvent[]>([]);
  const [auctionProperties, setAuctionProperties] = useState<PublicProperty[]>([]);

  useEffect(() => {
    getAuctionCalendarEvents()
      .then((res) => setApiEvents(res ?? []))
      .catch(() => {});

    getProperties({ auction_only: true, verified_only: 1, per_page: 100 })
      .then((res) => {
        const listings = (res.data ?? []).filter((property) => property.is_auction && auctionDateTime(property));
        setAuctionProperties(listings);
      })
      .catch(() => {});
  }, []);

  const calendarCells = useMemo(
    () => getCalendarMatrix(month.getFullYear(), month.getMonth()),
    [month]
  );

  const auctionDateKeys = useMemo(() => {
    const keys = new Set<string>();
    auctionProperties.forEach((property) => {
      const date = auctionDateTime(property);
      if (date) keys.add(dateKey(date));
    });
    apiEvents.forEach((event) => {
      const date = new Date(event.starts_at);
      if (!Number.isNaN(date.getTime())) keys.add(dateKey(date));
    });
    return keys;
  }, [auctionProperties, apiEvents]);

  const allEventsForSelectedDate = useMemo(() => {
    const registeredAuctionIds = new Set(apiEvents.map((event) => event.property_listing_id));

    // Map user-added calendar events for this day.
    const fromApi: CalendarEvent[] = apiEvents
      .filter((ev) => {
        const d = new Date(ev.starts_at);
        return isSameDay(d, selectedDate);
      })
      .map((ev): CalendarEvent => {
        const d = new Date(ev.starts_at);
        const relatedProperty = auctionProperties.find((property) => property.id === ev.property_listing_id);
        return {
          id: ev.id,
          day: d.getDate(),
          type: "Auction",
          desktopCategory: "Auctions",
          title: ev.property?.title || ev.title.replace("Auction: ", "") || "Property Auction",
          time: d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }),
          location: ev.venue || ev.property?.address || "Australia",
          image: relatedProperty ? propertyPreviewImage(relatedProperty) : imageFour,
          listedBy: "Briksy Auction",
          listedByAvatar: defaultAvatar,
        };
      });

    // Also show published auction listings even before the user adds them to
    // their personal reminder calendar.
    const fromAuctionListings: CalendarEvent[] = auctionProperties
      .filter((property) => !registeredAuctionIds.has(property.id))
      .map((property): CalendarEvent => {
        const date = auctionDateTime(property)!;
        return {
          id: `auction-listing-${property.id}`,
          day: date.getDate(),
          type: "Auction",
          desktopCategory: "Auctions",
          title: property.title,
          time: auctionTimeLabel(property),
          location: property.auction_details?.venue || property.full_address || property.address || "Australia",
          image: propertyPreviewImage(property),
          listedBy: property.organization?.name || "Briksy Auction",
          listedByAvatar: property.organization?.logo_url || defaultAvatar,
          isFavourite: Boolean(property.is_favourite),
        };
      })
      .filter((event) => {
        const property = auctionProperties.find((item) => `auction-listing-${item.id}` === event.id);
        const date = property ? auctionDateTime(property) : null;
        return Boolean(date && isSameDay(date, selectedDate));
      });

    return [...fromApi, ...fromAuctionListings];
  }, [selectedDate, apiEvents, auctionProperties]);

  // Desktop filtering
  const filteredDesktopEvents = useMemo(() => {
    if (desktopFilters.length === 0) return allEventsForSelectedDate;
    return allEventsForSelectedDate.filter((ev) => desktopFilters.includes(ev.desktopCategory));
  }, [allEventsForSelectedDate, desktopFilters]);

  // Mobile filtering
  const filteredMobileEvents = useMemo(() => {
    if (mobileFilter === "All") return allEventsForSelectedDate;
    return allEventsForSelectedDate.filter((ev) => {
      if (mobileFilter === "Open House") return ev.type === "Open House" || ev.type === "Open Home";
      if (mobileFilter === "Visit") return ev.type === "Visit";
      if (mobileFilter === "Auction") return ev.type === "Auction";
      if (mobileFilter === "Meeting") return ev.type === "Meeting" || ev.desktopCategory === "Enquiries";
      return true;
    });
  }, [allEventsForSelectedDate, mobileFilter]);

  return (
    <div className="w-full">
      {/* Mobile View (< lg) */}
      <div className="flex flex-col gap-5 lg:hidden">
        {/* Calendar Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#EDE8E4] shadow-sm">
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-base text-[#342511]">
              {monthNames[month.getMonth()]}{" "}
              <span className="font-bold text-lg">{month.getFullYear()}</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="p-1 rounded-full text-[#342511] hover:bg-[#F8F4EE] transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="p-1 rounded-full text-[#342511] hover:bg-[#F8F4EE] transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Grid of days */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell, idx) => {
              const isSelected = isSameDay(cell.date, selectedDate);
              const hasAuction = auctionDateKeys.has(dateKey(cell.date));
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedDate(cell.date);
                    if (!cell.isCurrentMonth) {
                      setMonth(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                    }
                  }}
                    className={`relative h-9 rounded-lg text-xs flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#342511] text-white font-medium shadow-sm"
                      : cell.isCurrentMonth
                      ? "bg-white text-[#342511] border border-[#EDE8E4] hover:border-[#342511]"
                      : "text-[#C4B7A6] bg-transparent hover:bg-[#F8F4EE]/50"
                  }`}
                >
                  {cell.dayNum}
                  {hasAuction && (
                    <span
                      aria-label="Auction date"
                      className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#8B5E34]"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {MOBILE_FILTERS.map((filter) => {
            const active = mobileFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setMobileFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-[#342511] text-white shadow-sm"
                    : "bg-white text-[#342511] border border-[#EDE8E4] hover:bg-[#F8F4EE]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Event List */}
        <div className="space-y-3">
          <h3 className="text-base font-medium text-[#342511]">
            Events on {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
          </h3>
          <div className="flex flex-col gap-3">
            {filteredMobileEvents.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-[#EDE8E4] text-center text-xs text-[#7C5F42]">
                No events on this day.
              </div>
            ) : (
              filteredMobileEvents.map((event) => (
                <EventListCard key={event.id} item={event} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Desktop View (>= lg) */}
      <div className="hidden lg:block">
        <div className="mb-6">
          <h1 className="text-[1.875rem] font-medium text-[#342511]">My Calendar</h1>
          <p className="mt-1 text-sm text-[#7C5F42]">Your property visits, enquiries and reminders.</p>
        </div>

        <div className="flex items-start gap-8">
          {/* Left Column: Calendar + Filter Events */}
          <div className="w-[320px] lg:w-[350px] shrink-0">
            {/* Calendar Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#EDE8E4] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base text-[#342511]">
                  {monthNames[month.getMonth()]}{" "}
                  <span className="font-bold text-lg">{month.getFullYear()}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                    className="p-1.5 rounded-full text-[#342511] hover:bg-[#F8F4EE] transition-colors"
                    aria-label="Previous Month"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                    className="p-1.5 rounded-full text-[#342511] hover:bg-[#F8F4EE] transition-colors"
                    aria-label="Next Month"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Grid of days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarCells.map((cell, idx) => {
                  const isSelected = isSameDay(cell.date, selectedDate);
                  const hasAuction = auctionDateKeys.has(dateKey(cell.date));
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedDate(cell.date);
                        if (!cell.isCurrentMonth) {
                          setMonth(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                        }
                      }}
                      className={`relative h-9 rounded-xl text-xs font-medium flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#342511] text-white font-medium shadow-sm"
                          : cell.isCurrentMonth
                          ? "bg-white text-[#342511] border border-[#EDE8E4] hover:border-[#342511]"
                          : "text-[#C4B7A6] bg-transparent hover:bg-[#F8F4EE]/50"
                      }`}
                    >
                      {cell.dayNum}
                    {hasAuction && (
                      <span
                        aria-label="Auction date"
                        className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#8B5E34]"}`}
                      />
                    )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Events */}
            <div className="mt-6">
              <h3 className="text-base font-medium text-[#342511] mb-3">Filter Events</h3>
              <div className="space-y-2.5">
                {DESKTOP_FILTERS.map((filter) => {
                  const checked = desktopFilters.includes(filter);
                  return (
                    <label
                      key={filter}
                      onClick={() => {
                        setDesktopFilters((prev) =>
                          checked ? prev.filter((f) => f !== filter) : [...prev, filter]
                        );
                      }}
                      className="flex items-center gap-3 cursor-pointer select-none group"
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          checked
                            ? "bg-[#342511] border-[#342511] text-white"
                            : "bg-white border-[#EDE8E4] group-hover:border-[#342511]"
                        }`}
                      >
                        {checked && <Check size={13} strokeWidth={3} />}
                      </div>
                      <span className="text-sm text-[#342511] group-hover:text-primary-brown transition-colors">
                        {filter}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Events */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-medium text-[#342511] mb-4">
              Events On {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
            </h2>
            <div className="space-y-4 max-h-[calc(100vh-230px)] overflow-y-auto pr-2">
              {filteredDesktopEvents.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-[#EDE8E4] text-center text-[#7C5F42]">
                  <p className="text-sm font-medium">No events found for this selection.</p>
                </div>
              ) : (
                filteredDesktopEvents.map((event) => (
                  <EventGridCard key={event.id} item={event} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
