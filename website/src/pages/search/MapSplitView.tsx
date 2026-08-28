import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ResultType } from "../../types/search";
import { mockTraders } from "../../data/mockTraders";
import type { Trader } from "../../types/trader";
import Approves from "../../assets/logo/apprrove.svg";

function MapListCard({ item }: { item: Trader }) {
  return (
    <Link to={`/service/${item.id}`} className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-[#EDE8E4] hover:border-[#8B6F54] transition-colors">
      <div className="relative shrink-0">
        <img src={item.avatar} alt={item.name} className="w-16 h-16 rounded-full object-cover" />
        <img src={Approves} alt="Verified" className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-9 h-9" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[0.9rem] font-semibold text-primary-brown leading-tight">{item.name}</h3>
            <p className="text-[0.75rem] text-[primary-light-brown] mt-0.5">{item.role}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#E2CBB3] text-[#E2CBB3]" />
            <span className="text-[0.8rem] font-semibold text-[primary-brown]">{item.rating}</span>
            <span className="text-[0.75rem] text-[#8B6F54]">({item.reviews})</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-[#8B6F54] shrink-0" />
          <span className="text-[0.7rem] text-[#8B6F54] truncate">{item.location}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[0.65rem] px-2 py-0.5 bg-[#F0EBE4] text-[primary-brown] rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#F0EBE4]">
          <span className="text-[0.75rem] text-[primary-light-brown] font-medium">View Profile</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8B6F54]" />
        </div>
      </div>
    </Link>
  );
}

export default function MapSplitView({ resultType, selectedSub }: { resultType: ResultType; selectedSub: string }) {
  const [page, setPage] = useState(1);
  const total = 15; 
  const traders = resultType === "trader"
    ? (mockTraders.some(t => t.category === selectedSub) ? mockTraders.filter(t => t.category === selectedSub) : mockTraders)
    : mockTraders;

  return (
    <div className="flex gap-4" style={{ height: "calc(100vh - 280px)", minHeight: 500 }}>
      <div className="w-[360px] shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
        <p className="text-[0.75rem] text-[#8B6F54] shrink-0">Over 1,000 professionals near Brisbane</p>
        {traders.map(item => <MapListCard key={item.id} item={item} />)}
        <div className="flex items-center justify-center gap-1.5 py-4 shrink-0">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="w-8 h-8 flex items-center justify-center rounded-full border border-[#EDE8E4] hover:bg-[#F0EBE4] transition-colors">
            <ChevronLeft className="w-4 h-4 text-[primary-brown]" />
          </button>
          {[1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 text-[0.8rem] font-medium rounded-full transition-colors ${page === n ? "bg-[primary-brown] text-white" : "border border-[#EDE8E4] text-[primary-brown] hover:bg-[#F0EBE4]"}`}>{n}</button>
          ))}
          <span className="text-[#8B6F54] text-[0.8rem]">...</span>
          <button onClick={() => setPage(total)} className="w-8 h-8 text-[0.8rem] font-medium rounded-full border border-[#EDE8E4] text-[primary-brown] hover:bg-[#F0EBE4] transition-colors">{total}</button>
          <button onClick={() => setPage(p => Math.min(total, p + 1))} className="w-8 h-8 flex items-center justify-center rounded-full border border-[#EDE8E4] hover:bg-[#F0EBE4] transition-colors">
            <ChevronRight className="w-4 h-4 text-[primary-brown]" />
          </button>
        </div>
      </div>
      <div className="flex-1 rounded-2xl overflow-hidden sticky top-24 self-start" style={{ height: "calc(100vh - 300px)" }}>
        <iframe title="Map" width="100%" height="100%" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d211800!2d151.2093!3d-33.8688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
          className="w-full h-full border-0" />
      </div>
    </div>
  );
}
