import { Children, type ReactNode } from "react";
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
}: SwiperScrollProps<T>) {
  return (
    <Swiper
      modules={[Mousewheel]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      watchOverflow={false}
      grabCursor
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
  );
}

export { SwiperSlide };
export default SwiperScroll;
