import React from "react";
import type { ResultType } from "../../types/search";
import { useListingData } from "./useListingData";
import { LISTING_DISPLAY } from "./listingDisplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";

function SectionSwiper({ children }: { children: React.ReactNode[] }) {
  return (
    <Swiper
      modules={[Mousewheel]}
      spaceBetween={16}
      slidesPerView="auto"
      watchOverflow={false}
      grabCursor
      mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
      className="[overscroll-behavior-x:contain] touch-pan-y"
    >
      {children.map((child, index) => (
        <SwiperSlide key={index} className="!w-[20.5rem]">
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function Section<T extends { id: string | number }>({
  title,
  items,
  Card,
  onViewMore,
}: {
  title: string;
  items: T[];
  Card: React.ComponentType<{ item: T }>;
  onViewMore: () => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between py-2">
        <h2 className="text-[1.5rem] font-medium tracking-tight text-[#342511]">{title}</h2>
        {items.length > 4 && (
          <button
            type="button"
            onClick={onViewMore}
            className="text-[0.75rem] text-[#8B6F54] transition-colors hover:text-[#342511]"
          >
            View more ({items.length})
          </button>
        )}
      </div>

      <SectionSwiper>
        {items.slice(0, 10).map((item) => (
          <div key={item.id}>
            <Card item={item} />
          </div>
        ))}
      </SectionSwiper>
    </section>
  );
}

export default function BrowseView({
  resultType,
  onViewMore,
}: {
  resultType: ResultType;
  onViewMore: (section: "popular" | "newly") => void;
}) {
  const items = useListingData(resultType);
  const { popularTitle, newlyTitle, Card } = LISTING_DISPLAY[resultType];

  const splitIndex = Math.ceil(items.length / 2);

  return (
    <>
      <Section
        title={popularTitle}
        items={items.slice(0, splitIndex)}
        Card={Card}
        onViewMore={() => onViewMore("popular")}
      />
      <Section
        title={newlyTitle}
        items={items.slice(splitIndex)}
        Card={Card}
        onViewMore={() => onViewMore("newly")}
      />
    </>
  );
}