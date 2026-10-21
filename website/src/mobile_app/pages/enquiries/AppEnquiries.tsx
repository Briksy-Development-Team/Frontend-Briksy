import { Clock, Mail, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSeekerInquiries, type InquiryItem } from "../../../api/seeker/seeker.api";

const labels: Record<string, string> = {
  inspection: "Booking an inspection",
  property_information: "Property information",
  price_sale_information: "Price / sale information",
  contract_section_32: "Contract / Section 32",
  making_an_offer: "Making an offer",
  other: "Other",
};

type Item = InquiryItem & { name: string; latest: string };

const statusGroup = (status: string) => status === "closed" || status === "expired" || status === "paid" ? "closed" : status === "new" ? "awaiting" : "active";

export default function AppEnquiries() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getSeekerInquiries().then((response) => {
      const data = Array.isArray(response.data) ? response.data : [];
      setItems(data.map((item) => ({ ...item, name: item.organization?.name || item.property?.title || "Briksy provider", latest: item.latest_update?.message || item.message || item.subject })));
    }).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const groups = [
    ["active", "Active"],
    ["awaiting", "Awaiting reply"],
    ["closed", "Closed"],
  ] as const;

  return <div className="min-h-screen bg-[#F8F4EE] px-4 pb-28 pt-2 font-helvetica md:px-0">
    <div className="mx-auto max-w-4xl">
      <h1 className="pb-5 text-xl font-medium text-[#342511]">Enquiries</h1>
      {loading ? <p className="text-sm text-[#7C5F42]">Loading enquiries…</p> : items.length === 0 ? <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#7C5F42]">You have no enquiries yet.</div> : groups.map(([key, title]) => {
        const group = items.filter((item) => statusGroup(item.status) === key);
        return group.length ? <section key={key} className="mb-7"><h2 className="mb-3 text-sm font-medium text-[#342511]">{title}</h2><div className="space-y-2">{group.map((item) => <button key={item.id} type="button" onClick={() => setSelected(item)} className="flex w-full items-start gap-3 rounded-2xl bg-white p-4 text-left shadow-sm hover:shadow-md"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE8E4] text-[#7C5F42]"><Mail size={18} /></span><span className="min-w-0 flex-1"><span className="block font-medium text-[#342511]">{item.name}</span><span className="mt-1 block truncate text-sm text-[#7C5F42]">{item.latest}</span><span className="mt-2 flex items-center gap-1 text-xs text-[#9B8067]"><Clock size={12} />{item.created_at ? new Date(item.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) : ""}</span></span><span className="rounded-full bg-[#F8F4EE] px-2 py-1 text-xs text-[#7C5F42]">{item.status.replaceAll("_", " ")}</span></button>)}</div></section> : null;
      })}
    </div>
    {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 md:items-center md:p-6"><div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 md:rounded-3xl"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-medium text-[#342511]">{selected.subject}</h2><p className="text-sm text-[#7C5F42]">{selected.name}</p></div><button type="button" onClick={() => setSelected(null)} aria-label="Close"><X /></button></div><div className="space-y-4 text-sm text-[#342511]"><p>{selected.message || "No message provided."}</p><div><p className="mb-1 font-medium text-[#7C5F42]">Interested in</p><p>{selected.interested_in?.map((value) => labels[value] || value).join(", ") || "Not provided"}</p></div>{selected.organization?.contact?.phone && <a className="flex items-center gap-2" href={`tel:${selected.organization.contact.phone}`}><Phone size={16} />{selected.organization.contact.phone}</a>}</div></div></div>}
  </div>;
}
