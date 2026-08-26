import ChipGroup from "../primitives/ChipGroup.tsx";
import ToggleSwitch from "../primitives/ToggleSwitch";
import { Section, Divider } from "../primitives/Section";
import type { TradeFiltersType } from "../filterTypes";

const CATEGORIES = [
  "Electrician", "Plumber", "Landscaper", "Concreter", "Fencing", "Painter", "Plasterer",
  "Tiler", "Carpenter", "Roofer", "Cleaner", "Mortgage Broker", "Conveyancer",
  "Building Inspector", "Interior Designer", "Architect",
];
const PRICE_GUIDES = ["$", "$$", "$$$", "Free quote"];
const RESPONSE_TIMES = ["Responds within 24h", "Responds within 3 days", "Responds within a week"];
const RATING_OPTIONS = [
  { value: 0, label: "Any" }, { value: 3, label: "3★+" }, { value: 4, label: "4★+" }, { value: 4.5, label: "4.5★+" },
];

type Props = { values: TradeFiltersType; onChange: (v: TradeFiltersType) => void };

export default function TradeFilters({ values, onChange }: Props) {
  const set = <K extends keyof TradeFiltersType>(k: K, v: TradeFiltersType[K]) =>
    onChange({ ...values, [k]: v });

  return (
    <div className="space-y-6">
      <Section title="Category">
        <ChipGroup options={CATEGORIES} value={values.categories} onChange={(v) => set("categories", v)} multi />
      </Section>

      <Divider />

      <Section title="Service area">
        <input
          type="text"
          placeholder="e.g. Parramatta, Brisbane 50km…"
          value={values.serviceArea}
          onChange={(e) => set("serviceArea", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#3D2C1D]"
        />
      </Section>

      <Divider />

      <Section title="Rating">
        <ChipGroup options={RATING_OPTIONS} value={values.rating} onChange={(v) => set("rating", v)} />
      </Section>

      <Divider />

      <Section title="Price guide">
        <ChipGroup options={PRICE_GUIDES} value={values.priceGuide} onChange={(v) => set("priceGuide", v)} multi />
      </Section>

      <Divider />

      <Section title="Response time">
        <ChipGroup options={RESPONSE_TIMES} value={values.responseTime} onChange={(v) => set("responseTime", v)} multi />
      </Section>

      <Divider />

      <ToggleSwitch label="Available this week" checked={values.availableThisWeek} onChange={(v) => set("availableThisWeek", v)} />
      <ToggleSwitch
        label="Verified, licensed & insured"
        sublabel="Only show providers with trust badge"
        checked={values.verified}
        onChange={(v) => set("verified", v)}
      />
    </div>
  );
}