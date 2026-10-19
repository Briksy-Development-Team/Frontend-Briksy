export type EventType = "Open Home" | "Open House" | "Visit" | "Auction" | "Meeting";
export type DesktopCategory = "Property Visits" | "Open Homes" | "Auctions" | "Enquiries" | "Reminders";

export interface CalendarEvent {
  id: string;
  day: number;
  type: EventType;
  desktopCategory: DesktopCategory;
  title: string;
  time: string;
  location: string;
  image: string;
  listedBy: string;
  listedByAvatar: string;
  isFavourite?: boolean;
}
