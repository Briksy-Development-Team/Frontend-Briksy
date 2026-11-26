import { Children, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";

export interface SwiperScrollProps<T = any> {
  items?: T[];
  renderItem?: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  children?: ReactNode;
  slideClassName?: string;
  className?: string;
  spaceBetween?: number;
  slidesPerView?: number | "auto";
  fadeColor?: string;
}


export function SwiperScroll<T = any>({
  items,
  renderItem,
  keyExtractor,
  children,
  slideClassName = "!w-[19.4375rem]",
  className = "",
  spaceBetween = 12,
  slidesPerView = "auto",
  fadeColor,
}: SwiperScrollProps<T>) {
  const [showFade, setShowFade] = useState(true);
  const updateFade = (s: { isEnd: boolean }) => setShowFade(!s.isEnd);

  return (
    <div className="relative">
      <Swiper
        modules={[Mousewheel]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        watchOverflow={false}
        grabCursor
        onSwiper={updateFade}
        onSlideChange={updateFade}
        onResize={updateFade}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
        }}
        className={`[overscroll-behavior-x:contain] touch-pan-y ${className}`}
      >
        {items && renderItem
          ? items.map((item, index) => {
              const key = keyExtractor
                ? keyExtractor(item, index)
                : ((item as any)?.id ?? index);
              return (
                <SwiperSlide key={key} className={slideClassName}>
                  {renderItem(item, index)}
                </SwiperSlide>
              );
            })
          : Children.map(children, (child, index) =>
              child ? (
                <SwiperSlide key={index} className={slideClassName}>
                  {child}
                </SwiperSlide>
              ) : null
            )}
      </Swiper>
      {fadeColor && showFade && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24"
          style={{ background: `linear-gradient(to right, transparent, ${fadeColor} 85%)` }}
        />
      )}
    </div>
  );
}

export { SwiperSlide };
export default SwiperScroll;