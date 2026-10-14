type AuctionCalendarDetails = {
  date?: string;
  time?: string;
  venue?: string;
  auctioneer?: string;
  description?: string;
};

const escapeIcs = (value: string) => value
  .replace(/\\/g, "\\\\")
  .replace(/;/g, "\\;")
  .replace(/,/g, "\\,")
  .replace(/\r?\n/g, "\\n");

const toIcsDateTime = (date: string, time?: string) => {
  const rawTime = (time || "09:00:00").trim();
  const twelveHourMatch = rawTime.match(/^(\d{1,2}):(\d{2})(?:\s*:\s*(\d{2}))?\s*(AM|PM)$/i);
  let hours: string;
  let minutes: string;
  let seconds: string;

  if (twelveHourMatch) {
    let hour = Number(twelveHourMatch[1]);
    const meridiem = twelveHourMatch[4].toUpperCase();
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    hours = String(hour).padStart(2, "0");
    minutes = twelveHourMatch[2];
    seconds = twelveHourMatch[3] || "00";
  } else {
    const normalizedTime = rawTime.split(":");
    hours = (normalizedTime[0] || "09").padStart(2, "0");
    minutes = (normalizedTime[1] || "00").padStart(2, "0");
    seconds = (normalizedTime[2] || "00").slice(0, 2).padStart(2, "0");
  }

  return `${date.replaceAll("-", "")}T${hours}${minutes}${seconds}`;
};

export const downloadAuctionCalendarEvent = ({
  propertyId,
  propertyTitle,
  address,
  details,
}: {
  propertyId: string;
  propertyTitle: string;
  address: string;
  details: AuctionCalendarDetails;
}) => {
  if (!details.date) return false;

  const start = toIcsDateTime(details.date, details.time);
  const venue = details.venue || address;
  const description = [
    `Auction for ${propertyTitle}`,
    details.auctioneer ? `Auctioneer: ${details.auctioneer}` : "",
    details.description || "",
    `Property: ${window.location.origin}/auction/${propertyId}`,
  ].filter(Boolean).join("\\n");
  const uid = `auction-${propertyId}@briksy`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Briksy//Property Auctions//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDateTime(new Date().toISOString().slice(0, 10), new Date().toISOString().slice(11, 19))}Z`,
    `DTSTART;TZID=Australia/Melbourne:${start}`,
    "DURATION:PT1H",
    `SUMMARY:${escapeIcs(`Auction: ${propertyTitle}`)}`,
    `LOCATION:${escapeIcs(venue)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Auction reminder - 1 week",
    "TRIGGER:-P7D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Auction reminder - 3 days",
    "TRIGGER:-P3D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Auction reminder - 1 day",
    "TRIGGER:-P1D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Auction starts today",
    "TRIGGER:-PT0S",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${propertyTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "auction"}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return true;
};
