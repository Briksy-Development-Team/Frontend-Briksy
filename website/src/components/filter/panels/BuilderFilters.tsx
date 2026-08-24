import ChipGroup from "../primitives/ChipGroup";
import ToggleSwitch from "../primitives/ToggleSwitch";
import MinMaxRange from "../primitives/MinMaxRange";
import { Section, Divider } from "../primitives/Section";
import PropertyFilters from "./PropertyFilters";
import type { BuilderProfileFilters, BuyFilters, BuilderMode } from "../filterTypes";
import { PRICE_OPTIONS } from "../filterTypes";

const BUILDER_TYPES = [
  "Custom home builder", "Volume/project builder", "Renovation specialist",
  "Granny flat / small dwelling", "Multi-residential developer",
];
const PROJECT_TYPES = ["House & land", "Knockdown-rebuild", "Duplex", "Extension / reno"];
const HOUSE_STYLES = ["Modern", "Hamptons", "Acreage", "Duplex design", "Coastal", "Farmhouse"];
const RATING_OPTIONS = [
  { value: 0, label: "Any" }, { value: 3, label: "3★+" }, { value: 4, label: "4★+" }, { value: 4.5, label: "4.5★+" },
];

function BuilderProfilePanel({
  values, onChange,
}: { values: BuilderProfileFilters; onChange: (v: BuilderProfileFilters) => void }) {
  const set = <K extends keyof BuilderProfileFilters>(k: K, v: BuilderProfileFilters[K]) =>
    onChange({ ...values, [k]: v });

  return (
    <div className="space-y-6">
      <Section title="What they build">
        <div className="space-y-4">
          <ChipGroup options={BUILDER_TYPES} value={values.builderTypes} onChange={(v) => set("builderTypes", v)} multi />
          <ChipGroup options={PROJECT_TYPES} value={values.projectTypes} onChange={(v) => set("projectTypes", v)} multi />
        </div>
      </Section>

      <Divider />

      <Section title="Service area">
        <input
          type="text"
          placeholder="e.g. Sydney, Melbourne CBD…"
          value={values.serviceArea}
          onChange={(e) => set("serviceArea", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#3D2C1D]"
        />
      </Section>

      <Divider />

      <Section title="Build cost (indicative)">
        <MinMaxRange
          options={PRICE_OPTIONS}
          value={[values.buildCostMin, values.buildCostMax]}
          onChange={([lo, hi]) => { set("buildCostMin", lo); set("buildCostMax", hi); }}
          idPrefix="build-cost"
        />
      </Section>

      <Divider />

      <Section title="House style">
        <ChipGroup options={HOUSE_STYLES} value={values.houseStyles} onChange={(v) => set("houseStyles", v)} multi />
      </Section>

      <Divider />

      <Section title="Rating">
        <ChipGroup options={RATING_OPTIONS} value={values.rating} onChange={(v) => set("rating", v)} />
      </Section>

      <Divider />

      <Section title="Trust & availability">
        <div className="space-y-4">
          <ToggleSwitch label="Has display home" checked={values.displayHome} onChange={(v) => set("displayHome", v)} />
          <ToggleSwitch
            label="Verified & licensed"
            sublabel="Only show builders with a verified badge"
            checked={values.verified}
            onChange={(v) => set("verified", v)}
          />
        </div>
      </Section>
    </div>
  );
}

type BuilderFiltersProps = {
  mode: BuilderMode;
  profileValues: BuilderProfileFilters;
  onProfileChange: (v: BuilderProfileFilters) => void;
  listingsValues: BuyFilters;
  onListingsChange: (v: BuyFilters) => void;
};

export default function BuilderFilters({
  mode, profileValues, onProfileChange, listingsValues, onListingsChange,
}: BuilderFiltersProps) {
  if (mode === "listings") {
    return <PropertyFilters mode="Buy" values={listingsValues} onChange={onListingsChange} />;
  }
  return <BuilderProfilePanel values={profileValues} onChange={onProfileChange} />;
}