import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ResultType } from "../../types/search";
import TraderListCard from "../../components/cards/trader/TraderListCard";
import BuilderListCard from "../../components/cards/builder/BuilderListCard";
import PropertyListCard from "../../components/cards/property/PropertyListCard";
import PropertyResultsMap from "../../components/search/PropertyResultsMap";
import type { Property } from "../../types/property";
import { buildGoogleMapsEmbedUrl } from "../../utils/googleMaps";

export default function MapSplitView({
  resultType,
  items,
}: {
  resultType: ResultType;
  items: any[];
}) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const visibleItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const firstLocatedItem = items.find((item) => item?.lat || item?.lng || item?.address || item?.location);
  const mapSrc = buildGoogleMapsEmbedUrl({
    lat: firstLocatedItem?.lat,
    lng: firstLocatedItem?.lng,
    address: firstLocatedItem?.address || firstLocatedItem?.location,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Cards Column */}
      <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 flex flex-col gap-4">
        <p className="text-[0.8125rem] text-[#8B6F54] font-medium">
          Showing {visibleItems.length} of {items.length} results
        </p>

        <div className="flex flex-col gap-4">
          {visibleItems.map((item) => (
            resultType === "trader" ? <TraderListCard key={item.id} item={item} /> :
            resultType === "builder" ? <BuilderListCard key={item.id} item={item} /> :
            <PropertyListCard key={item.id} item={item} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-4 shrink-0">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#EDE8E4] hover:bg-[#F0EBE4] transition-colors disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-primary-brown" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 text-[0.8rem] font-medium rounded-full transition-colors ${
                  currentPage === n
                    ? "bg-primary-brown text-white"
                    : "border border-[#EDE8E4] text-primary-brown hover:bg-[#F0EBE4]"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#EDE8E4] hover:bg-[#F0EBE4] transition-colors disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 text-primary-brown" />
            </button>
          </div>
        )}
      </div>

      {/* Map Column */}
      <div className="w-full flex-1 rounded-2xl overflow-hidden h-[380px] sm:h-[480px] lg:h-[calc(100vh-160px)] lg:sticky lg:top-28 self-start border border-[#EBE5D9]">
        {resultType === "property" || resultType === "comercial" ? (
          <PropertyResultsMap properties={items as Property[]} />
        ) : (
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
        )}
      </div>
    </div>
  );
}
