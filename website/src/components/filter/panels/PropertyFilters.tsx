import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ChipGroup from "../primitives/ChipGroup";
import ToggleSwitch from "../primitives/ToggleSwitch";
import MinMaxRange from "../primitives/MinMaxRange";
import { Section, Divider } from "../primitives/Section";
import type { BuyFilters, SoldFilters } from "../filterTypes";
import {
  PRICE_OPTIONS,
  LAND_SIZE_OPTIONS,
  PROPERTY_TYPES,
} from "../filterTypes";

const BED_BATH_CAR_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5+" },
];

const BUY_FEATURES = [
  "Pool",
  "Air conditioning",
  "Solar panels",
  "Pet-friendly",
  "Study",
];

const LISTING_STATUS = [
  "New listing",
  "Under offer",
  "Open for inspection",
];

const SOLD_DATE_RANGES = [
  { value: "3m", label: "Last 3 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "12m", label: "Last 12 months" },
];

const DAYS_ON_MARKET_OPTIONS = Array.from({ length: 366 }, (_, i) => ({
  value: i,
  label: `${i}d`,
}));

type PropertyFiltersProps =
  | {
    mode: "Buy";
    values: BuyFilters;
    onChange: (v: BuyFilters) => void;
  }
  | {
    mode: "Sold";
    values: SoldFilters;
    onChange: (v: SoldFilters) => void;
  };

export default function PropertyFilters(props: PropertyFiltersProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const isBuy = props.mode === "Buy";

  const values = props.values as BuyFilters & SoldFilters;
  const onChange = props.onChange as (v: BuyFilters & SoldFilters) => void;

  const set = <K extends keyof (BuyFilters & SoldFilters)>(
    key: K,
    value: (BuyFilters & SoldFilters)[K]
  ) => onChange({ ...values, [key]: value });

  const priceMinKey = isBuy ? "priceMin" : "soldPriceMin";
  const priceMaxKey = isBuy ? "priceMax" : "soldPriceMax";

  return (
    <div className="space-y-6">
      <Section title="Property type">
        <ChipGroup
          options={PROPERTY_TYPES}
          value={values.propertyTypes}
          onChange={(v) => set("propertyTypes", v)}
          multi
        />
      </Section>

      <Divider />

      <Section title={isBuy ? "Price" : "Sold price"}>
        <MinMaxRange
          options={PRICE_OPTIONS}
          value={[values[priceMinKey], values[priceMaxKey]]}
          onChange={([lo, hi]) => {
            set(priceMinKey, lo);
            set(priceMaxKey, hi);
          }}
          idPrefix={isBuy ? "price" : "sold-price"}
        />
      </Section>

      <Divider />

      <Section title="Bed / Bath / Car">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-gray-400">
              Bedrooms
            </label>
            <ChipGroup
              options={BED_BATH_CAR_OPTIONS}
              value={values.bedrooms}
              onChange={(v) => set("bedrooms", v)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-gray-400">
              Bathrooms
            </label>
            <ChipGroup
              options={BED_BATH_CAR_OPTIONS}
              value={values.bathrooms}
              onChange={(v) => set("bathrooms", v)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-gray-400">
              Car spaces
            </label>
            <ChipGroup
              options={BED_BATH_CAR_OPTIONS}
              value={values.carSpaces}
              onChange={(v) => set("carSpaces", v)}
            />
          </div>
        </div>
      </Section>

      <Divider />

      <Section title="Land size">
        <MinMaxRange
          options={LAND_SIZE_OPTIONS}
          value={[values.landSizeMin, values.landSizeMax]}
          onChange={([lo, hi]) => {
            set("landSizeMin", lo);
            set("landSizeMax", hi);
          }}
          idPrefix="land"
        />
      </Section>

      <Divider />

      {isBuy ? (
        <>
          <Section title="Listing status">
            <ChipGroup
              options={LISTING_STATUS}
              value={values.listingStatus}
              onChange={(v) => set("listingStatus", v)}
              multi
            />
          </Section>

          <ToggleSwitch
            label="Has upcoming inspection"
            checked={values.hasInspection}
            onChange={(v) => set("hasInspection", v)}
          />
        </>
      ) : (
        <Section title="Sold date">
          <ChipGroup
            options={SOLD_DATE_RANGES}
            value={values.soldDateRange}
            onChange={(v) =>
              set(
                "soldDateRange",
                values.soldDateRange === v ? "" : v
              )
            }
          />
        </Section>
      )}

      <Divider />

      <button
        type="button"
        onClick={() => setMoreOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-medium text-[#3D2C1D]"
      >
        <span>More filters</span>
        {moreOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {moreOpen && isBuy && (
        <>
          <Section title="Features">
            <ChipGroup
              options={BUY_FEATURES}
              value={values.features}
              onChange={(v) => set("features", v)}
              multi
            />
          </Section>

          <Section title="Keyword search">
            <input
              type="text"
              placeholder="e.g. pool, solar, granny flat…"
              value={values.keyword}
              onChange={(e) => set("keyword", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#3D2C1D]"
            />
          </Section>
        </>
      )}

      {moreOpen && !isBuy && (
        <Section title="Days on market">
          <MinMaxRange
            options={DAYS_ON_MARKET_OPTIONS}
            value={[
              values.daysOnMarketMin,
              values.daysOnMarketMax,
            ]}
            onChange={([lo, hi]) => {
              set("daysOnMarketMin", lo);
              set("daysOnMarketMax", hi);
            }}
            idPrefix="days"
          />
        </Section>
      )}
    </div>
  );
}