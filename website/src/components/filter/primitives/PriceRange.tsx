import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./PriceRange.css";

export type PriceRangeTab = {
  id: string;
  label: string;
  prices: number[];
  min?: number;
  max?: number;
};

type RangeValue = {
  min: number;
  max: number;
};

type PriceRangeProps = {
  tabs: PriceRangeTab[];
  initialTab?: string;
  bucketCount?: number;
  step?: number;
  onChange?: (range: RangeValue, tab: PriceRangeTab) => void;
};

type HistogramBar = {
  min: number;
  max: number;
  count: number;
};

const formatPrice = (value: number) =>
  `$${Math.round(value).toLocaleString("en-AU")}`;

const parsePrice = (value: string) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const createHistogram = (
  prices: number[],
  minPrice: number,
  maxPrice: number,
  bucketCount: number,
): HistogramBar[] => {
  if (!prices.length || maxPrice <= minPrice) {
    return Array.from({ length: bucketCount }, () => ({
      min: minPrice,
      max: maxPrice,
      count: 0,
    }));
  }

  const buckets: HistogramBar[] = Array.from(
    { length: bucketCount },
    (_, index) => {
      const bucketMin =
        minPrice + ((maxPrice - minPrice) / bucketCount) * index;
      const bucketMax =
        minPrice + ((maxPrice - minPrice) / bucketCount) * (index + 1);
      return { min: bucketMin, max: bucketMax, count: 0 };
    },
  );

  prices.forEach((price) => {
    if (price < minPrice || price > maxPrice) return;
    let index = Math.floor(
      ((price - minPrice) / (maxPrice - minPrice)) * bucketCount,
    );
    if (index >= bucketCount) index = bucketCount - 1;
    if (index < 0) index = 0;
    buckets[index].count += 1;
  });

  return buckets;
};

export default function PriceRange({
  tabs,
  initialTab,
  bucketCount = 42,
  step = 50,
  onChange,
}: PriceRangeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const selectedTrackRef = useRef<HTMLDivElement>(null);

  const firstTab = tabs[0];
  const [activeTabId, setActiveTabId] = useState(initialTab ?? firstTab?.id);
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? firstTab;

  const getInitialRange = (tab: PriceRangeTab): RangeValue => {
    const prices = tab.prices ?? [];
    const dataMin = prices.length > 0 ? Math.min(...prices) : 0;
    const dataMax = prices.length > 0 ? Math.max(...prices) : 15000;
    return { min: tab.min ?? dataMin, max: tab.max ?? dataMax };
  };

  const [ranges, setRanges] = useState<Record<string, RangeValue>>(() =>
    Object.fromEntries(tabs.map((tab) => [tab.id, getInitialRange(tab)])),
  );

  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  const range = ranges[activeTab.id] ?? getInitialRange(activeTab);

  const priceBounds = useMemo(() => {
    const prices = activeTab.prices ?? [];
    const dataMin = prices.length > 0 ? Math.min(...prices) : 0;
    const dataMax = prices.length > 0 ? Math.max(...prices) : 15000;
    return {
      min: Math.min(0, activeTab.min ?? dataMin),
      max: Math.max(activeTab.max ?? dataMax, range.max),
    };
  }, [activeTab, range.max]);

  const sliderMin = priceBounds.min;
  const sliderMax = priceBounds.max;

  const histogram = useMemo(
    () =>
      createHistogram(
        activeTab.prices ?? [],
        sliderMin,
        sliderMax,
        bucketCount,
      ),
    [activeTab.prices, sliderMin, sliderMax, bucketCount],
  );

  const histogramMax = Math.max(...histogram.map((item) => item.count), 1);

  const minPercent = ((range.min - sliderMin) / (sliderMax - sliderMin)) * 100;
  const maxPercent = ((range.max - sliderMin) / (sliderMax - sliderMin)) * 100;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setMinInput(String(range.min));
    setMaxInput(String(range.max));
  }, [activeTabId]);
/* Notify parent whenever range changes */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    onChange?.(range, activeTab);
  }, [range, activeTab]);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const bars = barsRef.current.filter(Boolean) as HTMLDivElement[];
      gsap.fromTo(
        bars,
        { scaleY: 0, opacity: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.012,
          ease: "power3.out",
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [activeTabId]);

  /* GSAP range animation */
  useLayoutEffect(() => {
    const bars = barsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!bars.length) return;

    bars.forEach((bar, index) => {
      const bucket = histogram[index];
      if (!bucket) return;
      const isActive = bucket.max >= range.min && bucket.min <= range.max;
      gsap.to(bar, {
        scaleY: isActive ? 1 : 0.55,
        opacity: isActive ? 1 : 0.28,
        duration: 0.2,
        ease: "power2.out",
      });
    });

    if (selectedTrackRef.current) {
      gsap.to(selectedTrackRef.current, {
        left: `${minPercent}%`,
        right: `${100 - maxPercent}%`,
        duration: 0.18,
        ease: "power2.out",
      });
    }
  }, [range.min, range.max, histogram, minPercent, maxPercent]);

  const updateRange = (min: number, max: number) => {
    setRanges((previous) => ({ ...previous, [activeTab.id]: { min, max } }));
  };

  const handleMinChange = (value: number) => {
    const newMin = Math.max(sliderMin, Math.min(value, range.max - step));
    updateRange(newMin, range.max);
    setMinInput(String(newMin));
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.min(sliderMax, Math.max(value, range.min + step));
    updateRange(range.min, newMax);
    setMaxInput(String(newMax));
  };

  const commitMin = () => {
    const value = parsePrice(minInput);
    if (value === null) {
      setMinInput(String(range.min));
      return;
    }
    handleMinChange(value);
  };

  const commitMax = () => {
    const value = parsePrice(maxInput);
    if (value === null) {
      setMaxInput(String(range.max));
      return;
    }
    handleMaxChange(value);
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTabId) return;
    setActiveTabId(tabId);
  };

  if (!tabs.length) return null;

  return (
    <div ref={rootRef} className="w-full">
      {tabs.length > 1 && (
        <div className="grid grid-cols-3 rounded-[18px] border border-[#ddd] p-1">
          {tabs.map((tab) => {
            const active = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`h-11 rounded-[14px] border-2 text-[14px] transition-all duration-200 ${
                  active
                    ? "border-[#333] bg-white font-medium"
                    : "border-transparent bg-transparent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-5">
        <div className="flex h-[112px] items-end gap-[3px] px-[2px]">
          {histogram.map((bucket, index) => {
            const height =
              bucket.count === 0
                ? 2
                : Math.max((bucket.count / histogramMax) * 100, 3);
            const isActive = bucket.max >= range.min && bucket.min <= range.max;

            return (
              <div
                key={`${activeTab.id}-${index}`}
                ref={(element) => {
                  barsRef.current[index] = element;
                }}
                className="min-w-0 flex-1 origin-bottom rounded-t-[2px] bg-[#C4A882]"
                style={{
                  height: `${height}%`,
                  opacity: isActive ? 1 : 0.28,
                  transform: isActive ? "scaleY(1)" : "scaleY(0.55)",
                }}
              />
            );
          })}
        </div>

        <div className="relative h-[42px]">
          <div className="absolute left-0 right-0 top-[19px] h-[2px] bg-[#ddd]" />

          <div
            ref={selectedTrackRef}
            className="absolute top-[19px] h-[2px] bg-[#333]"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={step}
            value={range.min}
            onChange={(event) => handleMinChange(Number(event.target.value))}
            className="price-range-slider absolute left-0 top-0 z-20 h-[42px] w-full"
            aria-label="Minimum price"
          />

          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={step}
            value={range.max}
            onChange={(event) => handleMaxChange(Number(event.target.value))}
            className="price-range-slider absolute left-0 top-0 z-10 h-[42px] w-full"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="flex-1">
          <label className="mb-1.5 block text-[13px] text-gray-500">Min</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Any"
            value={minInput === "" ? "" : formatPrice(Number(minInput))}
            onChange={(event) =>
              setMinInput(event.target.value.replace(/[^0-9]/g, ""))
            }
            onBlur={commitMin}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitMin();
            }}
            className="w-full rounded-lg border border-[#ddd] bg-white px-4 py-2.5 text-[14px] outline-none focus:border-[#3D2C1D]"
          />
        </div>

        <div className="flex-1">
          <label className="mb-1.5 block text-[13px] text-gray-500">Max</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Any"
            value={
              maxInput === ""
                ? ""
                : Number(maxInput) >= sliderMax
                  ? `${formatPrice(sliderMax)}+`
                  : formatPrice(Number(maxInput))
            }
            onChange={(event) =>
              setMaxInput(event.target.value.replace(/[^0-9]/g, ""))
            }
            onBlur={commitMax}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitMax();
            }}
            className="w-full rounded-lg border border-[#ddd] bg-white px-4 py-2.5 text-[14px] outline-none focus:border-[#3D2C1D]"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input type="checkbox" className="peer sr-only" />
            <div className="h-5 w-5 rounded border border-gray-300 bg-white transition-colors peer-checked:border-[#3D2C1D] peer-checked:bg-[#3D2C1D]"></div>
            <svg
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[14px] text-gray-700">
            Only show properties with price
          </span>
        </label>
      </div>
    </div>
  );
}
