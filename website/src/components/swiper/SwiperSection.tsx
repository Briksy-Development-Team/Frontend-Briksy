import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SwiperScroll } from "./SwiperScroll";

export interface SubCategory {
  id?: string | number;
  label: string;
  slug: string;
  [key: string]: any;
}

export interface SwiperSectionProps<T = any> {
  title: string;
  subtitle?: string;


  showViewAll?: boolean;
  viewAllHref?: string;
  onViewAll?: () => void;
  viewAllText?: string;
  count?: number;

 
  categories?: SubCategory[];
  activeCategoryIndex?: number;
  onCategoryChange?: (category: SubCategory, index: number) => void;

  items?: T[];
  fetchItems?: (activeCategory?: SubCategory) => Promise<T[]>;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;

  variant?: "home" | "detail" | "search";

  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  slideClassName?: string;
  spaceBetween?: number;

  headerRight?: ReactNode;
}

export function SwiperSection<T = any>({
  title,
  subtitle,
  showViewAll = true,
  viewAllHref,
  onViewAll,
  viewAllText = "View All",
  count,
  categories,
  activeCategoryIndex,
  onCategoryChange,
  items: propItems,
  fetchItems,
  renderItem,
  keyExtractor,
  variant = "home",
  className = "",
  containerClassName,
  headerClassName = "",
  slideClassName,
  spaceBetween = 12,
  headerRight,
}: SwiperSectionProps<T>) {
  const navigate = useNavigate();
  const [internalActiveIdx, setInternalActiveIdx] = useState(0);
  const [fetchedItems, setFetchedItems] = useState<T[]>([]);

  const activeIdx = activeCategoryIndex ?? internalActiveIdx;

  useEffect(() => {
    if (!fetchItems) return;

    if (categories && categories.length === 0) return;

    let active = true;
    const activeCategory = categories && categories.length > 0 ? categories[activeIdx] : undefined;

    fetchItems(activeCategory)
      .then((data) => {
        if (active) setFetchedItems(data || []);
      })
      .catch((err) => {
        console.error(`Failed to fetch items for "${title}":`, err);
      });

    return () => {
      active = false;
    };
  }, [fetchItems, activeIdx, categories, title]);

  const displayItems = propItems ?? fetchedItems;

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else if (viewAllHref) {
      navigate(viewAllHref);
    }
  };

  const hasViewAll = showViewAll && (Boolean(viewAllHref) || Boolean(onViewAll));

  const resolvedViewAllText =
    count !== undefined && variant === "search"
      ? `View more (${count})`
      : viewAllText;

  // Typography & layout classes by variant
  const titleClasses =
    variant === "detail"
      ? "text-[24px] md:text-[30px] font-medium leading-[36px] tracking-[-0.03em] text-primary-brown"
      : variant === "search"
      ? "text-[1.2rem] md:text-[1.5rem] font-medium tracking-tight text-primary-brown"
      : "text-[30px] font-medium lg:text-[44px] text-primary-brown";

  const headerMargin =
    variant === "search" ? "mb-3" : variant === "detail" ? "mb-6" : "mb-10";

  const defaultContainerClass =
    variant === "home"
      ? "lg:w-full pl-[5%] lg:px-0 lg:ml-10 min-[1530px]:ml-0 min-[1530px]:pl-0"
      : "w-full max-w-[1530px] mx-auto";

  const innerContainerClass = containerClassName ?? defaultContainerClass;

  return (
    <section className={`font-helvetica ${className}`}>
      <div className={innerContainerClass}>
        <div
          className={`relative ${headerMargin} ${
            variant === "home"
              ? "lg:mr-14 max-w-[1530px] mx-auto"
              : ""
          } flex flex-col text-primary-brown items-start justify-end lg:justify-center ${headerClassName}`}
        >
          <div className="flex w-full items-center justify-between">
            <h2 className={titleClasses}>{title}</h2>

            <div className="flex items-center gap-4">
              {headerRight}

              {hasViewAll && (
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="cursor-pointer hidden md:flex items-center gap-1.5 text-[14px] md:text-[16px] font-medium text-[#8B6F54] hover:text-[#562F00] transition-colors"
                >
                  <span>{resolvedViewAllText}</span>
                  <ArrowUpRight size={18} />
                </button>
              )}
            </div>
          </div>

          {subtitle && (
            <p className="mt-1 text-[0.875rem] lg:text-[1rem] text-primary-light-brown">
              {subtitle}
            </p>
          )}
        </div>

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap justify-center hidden md:flex gap-4 pb-6 text-[1rem] sm:justify-start max-w-[1530px] mx-auto">
            {categories.map((tab, i) => (
              <button
                type="button"
                key={tab.slug || tab.id || i}
                onClick={() => {
                  setInternalActiveIdx(i);
                  onCategoryChange?.(tab, i);
                }}
                className={`min-w-[140px] rounded-xl border hover:border hover:border-primary border-[#DBDAD3] py-2 px-4 transition ${
                  activeIdx === i ? "bg-primary-brown text-white" : "bg-white text-primary-brown"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Swiper Cards */}
        <div
          key={activeIdx}
          className={`animate-fade-in gap-3 ${
            variant === "home"
              ? "min-[1530px]:pl-[calc((100vw-1530px)/2)]"
              : ""
          }`}
        >
          <SwiperScroll
            items={displayItems}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            slideClassName={slideClassName}
            spaceBetween={spaceBetween}
            className={variant === "home" ? "" : "!ml-0"}
          />
        </div>
      </div>
    </section>
  );
}

export default SwiperSection;
