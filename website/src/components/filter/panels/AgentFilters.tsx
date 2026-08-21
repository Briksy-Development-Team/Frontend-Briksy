import ChipGroup from "../primitives/ChipGroup.tsx";
import ToggleSwitch from "../primitives/ToggleSwitch";
import { Section, Divider } from "../primitives/Section";
import type { AgentFiltersType, AgentType } from "../filterTypes";

const LANGUAGES = ["English", "Mandarin", "Cantonese", "Hindi", "Arabic", "Vietnamese", "Italian", "Greek", "Spanish", "Korean"];
const SPECIALIZATIONS = ["Residential", "Commercial", "Luxury", "First-home buyers", "Investors"];
const BUYER_TYPES = ["Investor", "First-home buyer", "Downsizer", "Relocator"];
const AREAS_OF_EXPERTISE = ["Off-market access", "Auction bidding", "Due diligence"];
const FEE_STRUCTURES = ["Flat fee", "% of purchase price"];
const RATING_OPTIONS = [
  { value: 0, label: "Any" }, { value: 3, label: "3★+" }, { value: 4, label: "4★+" }, { value: 4.5, label: "4.5★+" },
];
const EXP_OPTIONS = [
  { value: 0, label: "Any" }, { value: 1, label: "1+ yrs" }, { value: 2, label: "2+ yrs" },
  { value: 5, label: "5+ yrs" }, { value: 10, label: "10+ yrs" },
];

type Props = { agentType: AgentType; values: AgentFiltersType; onChange: (v: AgentFiltersType) => void };

export default function AgentFilters({ agentType, values, onChange }: Props) {
  const set = <K extends keyof AgentFiltersType>(k: K, v: AgentFiltersType[K]) =>
    onChange({ ...values, [k]: v });

  return (
    <div className="space-y-6 ">
      <Section title="Location served">
        <input
          type="text"
          placeholder="e.g. Bondi, Inner West, Sydney…"
          value={values.location}
          onChange={(e) => set("location", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#3D2C1D]"
        />
      </Section>

      <Divider />

      <Section title="Rating & experience">
        <div className="space-y-4">
          <ChipGroup options={RATING_OPTIONS} value={values.rating} onChange={(v) => set("rating", v)} />
          <ChipGroup options={EXP_OPTIONS} value={values.experienceMin} onChange={(v) => set("experienceMin", v)} />
        </div>
      </Section>

      <Divider />

      <Section title="Languages spoken">
        <ChipGroup options={LANGUAGES} value={values.languages} onChange={(v) => set("languages", v)} multi />
      </Section>

      <Divider />

      <Section title="Specialization">
        <ChipGroup options={SPECIALIZATIONS} value={values.specializations} onChange={(v) => set("specializations", v)} multi />
      </Section>

      {agentType === "real-estate" && (
        <>
          <Divider />
          <Section title="Agency / brand">
            <input
              type="text"
              placeholder="e.g. Ray White, McGrath…"
              value={values.agency}
              onChange={(e) => set("agency", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#3D2C1D]"
            />
          </Section>
          <ToggleSwitch
            label="Suburb specialist"
            sublabel="Show only agents with a suburb specialist badge"
            checked={values.suburbSpecialist}
            onChange={(v) => set("suburbSpecialist", v)}
          />
        </>
      )}

      {agentType === "buyers" && (
        <>
          <Divider />
          <Section title="Fee structure">
            <ChipGroup options={FEE_STRUCTURES} value={values.feeStructure} onChange={(v) => set("feeStructure", v)} multi />
          </Section>
          <Divider />
          <Section title="Buyer type served">
            <ChipGroup options={BUYER_TYPES} value={values.buyerTypes} onChange={(v) => set("buyerTypes", v)} multi />
          </Section>
          <Divider />
          <Section title="Areas of expertise">
            <ChipGroup options={AREAS_OF_EXPERTISE} value={values.areasOfExpertise} onChange={(v) => set("areasOfExpertise", v)} multi />
          </Section>
        </>
      )}
    </div>
  );
}