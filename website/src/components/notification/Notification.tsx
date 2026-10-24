import { ArrowLeft, Bell, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Placeholderproperty from "../../assets/profile/placeholderproperty.svg";
import { getSeekerNotifications, markAllSeekerNotificationsRead, markSeekerNotificationRead, type SeekerNotification } from "../../api/seeker/seeker.api";
import ListSkeleton from "../skeletons/ListSkeleton";

const formatTime = (value: string | null) => value ? new Date(value).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" }) : "";

const Notification = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<SeekerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    getSeekerNotifications({ per_page: 50 }).then((response) => setItems(Array.isArray(response.data) ? response.data : [])).catch(() => setItems([])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);
  const open = async (item: SeekerNotification) => {
    if (!item.read_at) {
      await markSeekerNotificationRead(item.id).catch(() => undefined);
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, read_at: new Date().toISOString() } : entry));
    }
    if (item.action_url) navigate(item.action_url);
  };
  const markAll = async () => {
    await markAllSeekerNotificationsRead().catch(() => undefined);
    setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
  };
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 md:py-20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3"><button type="button" onClick={() => navigate(-1)} aria-label="Back" className="md:hidden"><ArrowLeft size={20} /></button><h1 className="text-2xl font-medium text-primary-brown">Notifications</h1></div>
        {items.some((item) => !item.read_at) && <button type="button" onClick={markAll} className="flex items-center gap-1 text-sm text-primary-light-brown hover:text-primary-brown"><Check size={16} /> Mark all as read</button>}
      </div>
      {loading ? (
        <ListSkeleton count={5} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center"><Bell className="mb-4 text-primary-light-brown" size={34} /><h2 className="font-medium text-primary-brown">No notifications yet</h2><p className="mt-2 max-w-sm text-sm text-primary-light-brown">We’ll let you know about enquiry updates, saved-search matches and auction reminders.</p></div>
      ) : (
        <div className="space-y-3">{items.map((item) => <button key={item.id} type="button" onClick={() => open(item)} className={`relative flex w-full items-start gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition hover:shadow-md ${item.read_at ? "" : "ring-1 ring-[#E86749]/20"}`}><img src={item.image_url || Placeholderproperty} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" onError={(event) => { event.currentTarget.src = Placeholderproperty; }} /><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-primary-brown">{item.title || "Briksy update"}</span><span className="mt-1 block text-sm text-primary-light-brown">{item.message}</span><span className="mt-2 block text-xs text-primary-light-brown/80">{formatTime(item.created_at)}</span></span>{!item.read_at && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#E86749]" aria-label="Unread" />}</button>)}</div>
      )}
    </div>
  );
};
export default Notification;
