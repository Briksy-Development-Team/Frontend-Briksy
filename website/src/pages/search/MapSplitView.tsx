import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ResultType } from "../../types/search";
import TraderListCard from "../../components/cards/trader/TraderListCard";
import BuilderListCard from "../../components/cards/builder/BuilderListCard";
import PropertyListCard from "../../components/cards/property/PropertyListCard";
import { buildGoogleMapsEmbedUrl } from "../../utils/googleMaps";

export default function MapSplitView({
  resultType,
  items,
}: {
  resultType: ResultType;
  items: any[];
}) {
  const [page, setPage] = useState(1);
  const total = 15;
  const firstLocatedItem = items.find((item) => item?.lat || item?.lng || item?.address || item?.location);
  const mapSrc = buildGoogleMapsEmbedUrl({
    lat: firstLocatedItem?.lat,
    lng: firstLocatedItem?.lng,
    address: firstLocatedItem?.address || firstLocatedItem?.location,
  });

  return (
    <div
      className="flex gap-4"
    >
      <div className="shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
        <p className="text-[0.75rem] text-[#8B6F54] shrink-0">
          Over 1,000 professionals near Brisbane
        </p>
        {items.map((item) => (
          resultType === "trader" ? <TraderListCard key={item.id} item={item} /> :
            resultType === "builder" ? <BuilderListCard key={item.id} item={item} /> :
              <PropertyListCard key={item.id} item={item} />
        ))}
        <div className="flex items-center justify-center gap-1.5 py-4 shrink-0">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#EDE8E4] hover:bg-[#F0EBE4] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[primary-brown]" />
          </button>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-8 h-8 text-[0.8rem] font-medium rounded-full transition-colors ${page === n ? "bg-[primary-brown] text-white" : "border border-[#EDE8E4] text-[primary-brown] hover:bg-[#F0EBE4]"}`}
            >
              {n}
            </button>
          ))}
          <span className="text-[#8B6F54] text-[0.8rem]">...</span>
          <button
            onClick={() => setPage(total)}
            className="w-8 h-8 text-[0.8rem] font-medium rounded-full border border-[#EDE8E4] text-[primary-brown] hover:bg-[#F0EBE4] transition-colors"
          >
            {total}
          </button>
          <button
            onClick={() => setPage((p) => Math.min(total, p + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#EDE8E4] hover:bg-[#F0EBE4] transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[primary-brown]" />
          </button>
        </div>
      </div>
      <div
        className="flex-1 rounded-2xl overflow-hidden sticky top-24 self-start"
        style={{ height: "calc(100vh - 300px)" }}
      >
        <iframe
          title="Map"
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapSrc}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}