import { useState, useEffect } from "react";
import { Mail, X, Send, CheckCircle2, Clock, Phone, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tradePersonImg from "../../../assets/mobile_app/enquiries/trade_person.png";
import { getSeekerInquiries, type InquiryItem } from "../../../api/seeker/seeker.api";

export interface EnquiryItemData {
  id: string;
  name: string;
  message: string;
  time: string;
  isUnread?: boolean;
  avatarType?: "image" | "mail" | "diamond";
  avatarBg?: string;
  avatarImage?: string;
  section: "active" | "awaiting" | "closed";
  statusText?: string;
  fullMessage?: string;
  phone?: string;
  email?: string;
  slug?: string;
}

const DEFAULT_ENQUIRIES: EnquiryItemData[] = [
  {
    id: "doyle-electrical",
    name: "Doyle Electrical",
    message: "Quote: $480 fixed for the switchboard upgrade. Valid 14 days.",
    time: "2h",
    isUnread: true,
    avatarType: "image",
    avatarImage: tradePersonImg,
    section: "active",
    statusText: "Quote Received",
    fullMessage:
      "Hi there, thanks for reaching out. We have reviewed your property details and can offer a fixed price of $480 for the switchboard upgrade including compliance certificate. This quote is valid for 14 days.",
    phone: "+61 3 9000 1234",
    email: "contact@doyleelectrical.com.au",
  },
  {
    id: "harkaway-homes",
    name: "Harkaway Homes",
    message: "Thursday 10am works for the site visit — see you then.",
    time: "5h",
    isUnread: true,
    avatarType: "image",
    avatarImage: tradePersonImg,
    section: "active",
    statusText: "Site Visit Confirmed",
    fullMessage:
      "Thursday 10am works for the site visit — see you then. Please let us know if you need to adjust the time or have gate access requirements.",
    phone: "+61 3 9876 5432",
    email: "enquiries@harkawayhomes.com.au",
  },
  {
    id: "marchetti-tiling",
    name: "Marchetti Tiling",
    message: "Thanks for the photos. I'll send a quote by Friday.",
    time: "9h",
    isUnread: false,
    avatarType: "image",
    avatarImage: tradePersonImg,
    section: "active",
    statusText: "Preparing Quote",
    fullMessage:
      "Thanks for sending over the photos and measurements. We are calculating the materials and labor and will send through a full itemized quote by Friday afternoon.",
    phone: "+61 4 1234 5678",
    email: "info@marchettitiling.com.au",
  },
  {
    id: "nakamura-landscaping",
    name: "Nakamura Landscaping",
    message: "You: Do you service Yarraville?",
    time: "Tue",
    isUnread: false,
    avatarType: "image",
    avatarImage: tradePersonImg,
    section: "awaiting",
    statusText: "Awaiting Provider Reply",
    fullMessage:
      "Sent enquiry: Hi Nakamura Landscaping team, do you currently take on residential projects and service Yarraville for native garden design?",
  },
  {
    id: "southbank-plumbing",
    name: "Southbank Plumbing",
    message: "You: Is next Monday possible?",
    time: "Mon",
    isUnread: false,
    avatarType: "image",
    avatarImage: tradePersonImg,
    section: "awaiting",
    statusText: "Awaiting Provider Reply",
    fullMessage:
      "Sent enquiry: Hello, we need water heater maintenance. Is next Monday morning possible for a technician to visit?",
  },
  {
    id: "sunrise-property-group",
    name: "Sunrise Property Group",
    message: "You: Is the Richmond townhouse still available?",
    time: "Mon",
    isUnread: false,
    avatarType: "image",
    avatarImage: tradePersonImg,
    section: "awaiting",
    statusText: "Awaiting Agent Reply",
    fullMessage:
      "Sent enquiry: Hi Sunrise team, I saw the 3-bedroom townhouse in Richmond listed. Is it still available for inspection this Saturday?",
  },
  {
    id: "kalorama-electrical",
    name: "Kalorama Electrical",
    message: "Enquiry closed — you chose another provider.",
    time: "2 Aug",
    isUnread: false,
    avatarType: "mail",
    avatarBg: "#F8F4EE",
    section: "closed",
    statusText: "Closed",
    fullMessage:
      "This enquiry has been closed because another electrical contractor was selected for the work. Thank you for using Briksy.",
  },
  {
    id: "apex-property-group",
    name: "Apex Property Group",
    message: "Inspection completed. Thanks for visiting.",
    time: "28 Jul",
    isUnread: false,
    avatarType: "diamond",
    avatarBg: "#E2CBB3",
    section: "closed",
    statusText: "Completed",
    fullMessage:
      "Private inspection was completed on 28 July. Thank you for inspecting with Apex Property Group. Feel free to contact our agent if you have further interest in making an offer.",
  },
];

export default function AppEnquiries() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<EnquiryItemData[]>(DEFAULT_ENQUIRIES);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItemData | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    // Attempt to fetch any active enquiries from the API
    let isMounted = true;
    getSeekerInquiries()
      .then((res) => {
        if (!isMounted) return;
        const apiData = res.data;
        if (Array.isArray(apiData) && apiData.length > 0) {
          const mapped: EnquiryItemData[] = apiData.map((item: InquiryItem) => {
            const orgName = item.organization?.name || item.property?.title || "Briksy Provider";
            const isClosed = item.status === "closed" || item.status === "completed";
            const isAwaiting = item.status === "pending" || item.status === "sent";

            return {
              id: item.id,
              name: orgName,
              message: item.latest_update?.message || item.message || item.subject,
              time: item.created_at ? new Date(item.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short" }) : "Recent",
              isUnread: false,
              avatarType: isClosed ? "mail" : "image",
              avatarImage: tradePersonImg,
              section: isClosed ? "closed" : isAwaiting ? "awaiting" : "active",
              statusText: item.status,
              fullMessage: item.message,
              phone: item.organization?.contact?.phone || undefined,
              email: item.organization?.contact?.email || undefined,
              slug: item.organization?.slug,
            };
          });

          // Merge: Show API items alongside default items
          setEnquiries((prev) => {
            const ids = new Set(mapped.map((m) => m.id));
            const filteredDefaults = prev.filter((p) => !ids.has(p.id));
            return [...mapped, ...filteredDefaults];
          });
        }
      })
      .catch(() => {
        // Fallback to default items smoothly
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleItemClick = (item: EnquiryItemData) => {
    // Mark as read when clicked
    if (item.isUnread) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, isUnread: false } : e))
      );
    }
    setSelectedEnquiry(item);
    setReplyText("");
    setReplySent(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplySent(true);
    setTimeout(() => {
      setReplyText("");
      setReplySent(false);
      setSelectedEnquiry(null);
    }, 1200);
  };

  const activeItems = enquiries.filter((e) => e.section === "active");
  const awaitingItems = enquiries.filter((e) => e.section === "awaiting");
  const closedItems = enquiries.filter((e) => e.section === "closed");

  return (
    <div className="min-h-screen bg-[#F8F4EE] font-helvetica select-none pb-28 pt-2">
      <div className="max-w-md mx-auto px-4">
        {/* Header matching Figma: font 20px, medium, Dark Brown #342511 */}
        <div className="pt-2 pb-1">
          <h1 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#342511]">
            Enquiries
          </h1>
        </div>

        {/* List Content */}
        <div className="pt-1">
          {/* Section: Active */}
          {activeItems.length > 0 && (
            <div>
              <div className="pt-2 pb-2.5">
                <h2 className="text-[14px] font-medium leading-[20px] text-[#342511]">
                  Active
                </h2>
              </div>

              {activeItems.map((item, idx) => (
                <div key={item.id}>
                  <EnquiryRow item={item} onClick={() => handleItemClick(item)} />
                  {idx < activeItems.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}

          {/* Section: Awaiting reply */}
          {awaitingItems.length > 0 && (
            <div>
              <div className="pt-5 pb-2.5">
                <h2 className="text-[14px] font-medium leading-[20px] text-[#342511]">
                  Awaiting reply
                </h2>
              </div>

              {awaitingItems.map((item, idx) => (
                <div key={item.id}>
                  <EnquiryRow item={item} onClick={() => handleItemClick(item)} />
                  {idx < awaitingItems.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}

          {/* Section: Closed */}
          {closedItems.length > 0 && (
            <div>
              <div className="pt-5 pb-2.5">
                <h2 className="text-[14px] font-medium leading-[20px] text-[#342511]">
                  Closed
                </h2>
              </div>

              {closedItems.map((item, idx) => (
                <div key={item.id}>
                  <EnquiryRow item={item} onClick={() => handleItemClick(item)} />
                  {idx < closedItems.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-[24px] p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Bar with Dismiss */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EDE8E4]">
              <div className="flex items-center gap-3">
                <Avatar item={selectedEnquiry} />
                <div>
                  <h3 className="text-[16px] font-medium text-[#342511] leading-tight">
                    {selectedEnquiry.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-[#7C5F42] flex items-center gap-1">
                      <Clock size={12} /> {selectedEnquiry.time}
                    </span>
                    {selectedEnquiry.statusText && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F8F4EE] text-[#7C5F42] font-medium">
                        {selectedEnquiry.statusText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-[#F8F4EE] flex items-center justify-center text-[#7C5F42] hover:bg-[#EDE8E4] transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Body */}
            <div className="py-5 space-y-4">
              <div className="bg-[#F8F4EE] p-4 rounded-2xl text-[13px] leading-[20px] text-[#342511]">
                <p className="font-medium text-[#7C5F42] text-[11px] uppercase tracking-wider mb-1.5">
                  Latest Message
                </p>
                <p>{selectedEnquiry.fullMessage || selectedEnquiry.message}</p>
              </div>

              {/* Contact Information if available */}
              {(selectedEnquiry.phone || selectedEnquiry.email) && (
                <div className="flex flex-col gap-2 pt-1 text-[13px] text-[#7C5F42]">
                  {selectedEnquiry.phone && (
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-[#EDE8E4] hover:bg-[#F8F4EE] transition-colors text-[#342511] font-medium"
                    >
                      <Phone size={15} className="text-[#7C5F42]" />
                      <span>{selectedEnquiry.phone}</span>
                    </a>
                  )}
                  {selectedEnquiry.email && (
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-[#EDE8E4] hover:bg-[#F8F4EE] transition-colors text-[#342511] font-medium"
                    >
                      <Mail size={15} className="text-[#7C5F42]" />
                      <span>{selectedEnquiry.email}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Reply Section for Active & Awaiting */}
              {selectedEnquiry.section !== "closed" && (
                <div className="pt-2">
                  <label htmlFor="enquiry-reply" className="block text-[12px] font-medium text-[#7C5F42] mb-1.5">
                    Send a reply
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="enquiry-reply"
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendReply();
                      }}
                      placeholder="Type your response..."
                      disabled={replySent}
                      className="flex-1 px-4 py-2.5 rounded-full border border-[#EDE8E4] bg-white text-[13px] text-[#342511] placeholder:text-[#7C5F42]/60 focus:outline-none focus:ring-1 focus:ring-[#342511]"
                    />
                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={replySent || !replyText.trim()}
                      className={`px-4 py-2.5 rounded-full font-medium text-[13px] flex items-center gap-1.5 transition-all cursor-pointer ${
                        replySent
                          ? "bg-emerald-600 text-white"
                          : replyText.trim()
                          ? "bg-[#342511] text-white hover:bg-[#251a0b] active:scale-95"
                          : "bg-[#EDE8E4] text-[#7C5F42] cursor-not-allowed"
                      }`}
                    >
                      {replySent ? (
                        <>
                          <CheckCircle2 size={15} /> Sent
                        </>
                      ) : (
                        <>
                          <Send size={14} /> Send
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="pt-2 flex items-center gap-2">
              {selectedEnquiry.slug && (
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/builder/${selectedEnquiry.slug}`);
                    setSelectedEnquiry(null);
                  }}
                  className="flex-1 py-2.5 rounded-full bg-[#342511] text-white text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#251a0b] transition-colors cursor-pointer"
                >
                  <ExternalLink size={14} /> View provider
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="flex-1 py-2.5 rounded-full border border-[#EDE8E4] text-[13px] font-medium text-[#342511] hover:bg-[#F8F4EE] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EnquiryRow({
  item,
  onClick,
}: {
  item: EnquiryItemData;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-[14px] py-[14px] cursor-pointer rounded-xl transition-colors hover:bg-[#EDE8E4]/30 active:bg-[#EDE8E4]/60"
    >
      {/* 44px Avatar / Icon */}
      <Avatar item={item} />

      {/* Text block: name, message snippet, timestamp */}
      <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[14px] font-medium leading-[20px] text-[#342511] truncate">
            {item.name}
          </p>
          {item.isUnread && (
            <span
              className="w-2 h-2 rounded-full bg-[#F5551A] shrink-0"
              title="Unread"
              aria-label="Unread"
            />
          )}
        </div>

        <p className="text-[12px] font-normal leading-[18px] text-[#7C5F42] line-clamp-2">
          {item.message}
        </p>

        <p className="text-[12px] font-normal leading-[18px] text-[#7C5F42]">
          {item.time}
        </p>
      </div>
    </div>
  );
}

function Avatar({ item }: { item: EnquiryItemData }) {
  if (item.avatarType === "mail") {
    return (
      <div
        className="w-[44px] h-[44px] rounded-[12px] bg-[#F8F4EE] border border-[#EDE8E4] flex items-center justify-center shrink-0 text-[#342511]"
      >
        <Mail size={18} className="text-[#342511]" />
      </div>
    );
  }

  if (item.avatarType === "diamond") {
    return (
      <div
        className="w-[44px] h-[44px] rounded-[12px] bg-[#E2CBB3] flex items-center justify-center shrink-0 text-[#342511]"
      >
        <span className="text-[16px] leading-none text-[#342511]">◆</span>
      </div>
    );
  }

  return (
    <img
      src={item.avatarImage || tradePersonImg}
      alt={item.name}
      className="w-[44px] h-[44px] rounded-[12px] object-cover shrink-0 bg-white"
    />
  );
}

function Divider() {
  return <div className="h-[1px] bg-[#EDE8E4] w-full" />;
}
