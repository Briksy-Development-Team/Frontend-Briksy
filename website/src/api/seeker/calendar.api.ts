import api from "../clients.api";

export type AuctionCalendarEvent = {
  id: string;
  property_listing_id: string;
  title: string;
  starts_at: string;
  venue?: string | null;
  reminders: string[];
  property?: { title?: string; address?: string | null } | null;
};

export const getAuctionCalendarEvents = async (): Promise<AuctionCalendarEvent[]> => {
  const response = await api.get<{ data: AuctionCalendarEvent[] }>("/seeker/calendar/auction-events");
  return response.data.data ?? [];
};

export const addAuctionCalendarEvent = async (payload: {
  property_listing_id: string;
  starts_at: string;
  venue?: string;
}): Promise<AuctionCalendarEvent> => {
  const response = await api.post<{ data: AuctionCalendarEvent }>("/seeker/calendar/auction-events", payload);
  return response.data.data;
};

export const removeAuctionCalendarEvent = async (id: string): Promise<void> => {
  await api.delete(`/seeker/calendar/auction-events/${id}`);
};
