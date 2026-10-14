import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { getAuctionCalendarEvents, removeAuctionCalendarEvent, type AuctionCalendarEvent } from "../../../api/seeker/calendar.api";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MyCalendar() {
  const [month, setMonth] = useState(() => new Date());
  const [events, setEvents] = useState<AuctionCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuctionCalendarEvents().then(setEvents).finally(() => setLoading(false));
  }, []);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return Array.from({ length: first.getDay() + last.getDate() }, (_, index) => {
      if (index < first.getDay()) return null;
      return new Date(month.getFullYear(), month.getMonth(), index - first.getDay() + 1);
    });
  }, [month]);

  const eventForDay = (day: Date) => events.filter((event) => {
    const date = new Date(event.starts_at);
    return date.getFullYear() === day.getFullYear() && date.getMonth() === day.getMonth() && date.getDate() === day.getDate();
  });

  const removeEvent = async (event: AuctionCalendarEvent) => {
    await removeAuctionCalendarEvent(event.id);
    setEvents((current) => current.filter((item) => item.id !== event.id));
  };

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-medium text-primary-brown"><CalendarDays size={22} /> My Briksy calendar</h2>
          <p className="mt-1 text-sm text-primary-light-brown">Your registered property auctions and reminders.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-full p-2 text-primary-brown hover:bg-[#F8F4EE]" aria-label="Previous month"><ChevronLeft size={18} /></button>
          <span className="min-w-32 text-center text-sm font-medium text-primary-brown">{month.toLocaleDateString("en-AU", { month: "long", year: "numeric" })}</span>
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-full p-2 text-primary-brown hover:bg-[#F8F4EE]" aria-label="Next month"><ChevronRight size={18} /></button>
        </div>
      </div>

      {loading ? <p className="py-12 text-center text-sm text-primary-light-brown">Loading calendar...</p> : (
        <>
          <div className="grid grid-cols-7 border-b border-[#E7E7E4] pb-2 text-center text-xs font-medium text-primary-light-brown">
            {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
          </div>
          <div className="grid grid-cols-7 border-l border-t border-[#E7E7E4]">
            {days.map((day, index) => {
              const dayEvents = day ? eventForDay(day) : [];
              return <div key={day?.toISOString() ?? `empty-${index}`} className="min-h-24 border-b border-r border-[#E7E7E4] p-1.5 md:min-h-28 md:p-2">
                {day && <><span className={`text-xs ${day.toDateString() === new Date().toDateString() ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary-brown text-white" : "text-primary-brown"}`}>{day.getDate()}</span>
                  <div className="mt-1 space-y-1">{dayEvents.map((event) => <div key={event.id} className="rounded-lg bg-[#F8F4EE] p-1.5 text-[10px] leading-3 text-primary-brown md:text-xs md:leading-4"><div className="font-medium">{event.title.replace("Auction: ", "")}</div><div>{new Date(event.starts_at).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })}</div><button type="button" onClick={() => void removeEvent(event)} className="mt-1 flex items-center gap-1 text-[10px] text-red-700"><Trash2 size={11} /> Remove</button></div>)}</div>
                </>}
              </div>;
            })}
          </div>
          {!events.length && <p className="py-6 text-center text-sm text-primary-light-brown">No auction events added yet.</p>}
        </>
      )}
    </section>
  );
}
