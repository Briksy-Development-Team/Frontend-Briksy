import type { ResultType } from "../../types/search";
import { useListingData } from "./useListingData";
import { LISTING_DISPLAY } from "./listingDisplay";
import MapSplitView from "./MapSplitView";

const GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

export default function ResultsView({
  resultType,
  selectedSub,
  showMap,
}: {
  resultType: ResultType;
  selectedSub: string;
  showMap: boolean;
}) {
  const items = useListingData(resultType, selectedSub);
  const { Card } = LISTING_DISPLAY[resultType];

  return (
    <>
      <p className="text-[0.75rem] text-[#8B6F54] mb-5">{items.length} verified results</p>

      {showMap ? (
        <MapSplitView resultType={resultType} selectedSub={selectedSub} items={items} />
      ) : (
        <div className={GRID}>
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}