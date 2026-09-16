import PriceRange from "../primitives/PriceRange";
import { Divider } from "../primitives/Section";
import { getFieldsForMode } from "../filterConfig";
import type { FilterMode, FilterField, CheckboxField, RangeField, MinMaxField, InputField } from "../filterConfig";

type Values = Record<string, any>;

type FilterPanelProps = {
  mode: FilterMode;
  values: Values;
  onChange: (v: Values) => void;
};


function CheckboxSection({ field, values, set }: { field: CheckboxField; values: Values; set: (k: string, v: unknown) => void }) {
  const currentValues = (values[field.key] as string[]) || [];

  const toggle = (option: string) => {
    if (currentValues.includes(option)) {
      set(field.key, currentValues.filter((v) => v !== option));
    } else {
      set(field.key, [...currentValues, option]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
      {field.options.map((option) => (
        <label key={option} className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={currentValues.includes(option)}
              onChange={() => toggle(option)}
            />
            <div className="h-5 w-5 rounded border border-gray-300 bg-white transition-colors peer-checked:border-[#3D2C1D] peer-checked:bg-[#3D2C1D] peer-focus-visible:ring-2 peer-focus-visible:ring-[#3D2C1D] peer-focus-visible:ring-offset-2"></div>
            <svg
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[14px] text-gray-700 group-hover:text-gray-900">{option}</span>
        </label>
      ))}
    </div>
  );
}

function RangeSection({ field, set }: { field: RangeField; set: (k: string, v: unknown) => void }) {
  return (
    <PriceRange
      tabs={field.tabs}
      bucketCount={field.bucketCount ?? 42}
      step={field.step ?? 50}
      onChange={(range) => {
        set(field.minKey, range.min);
        set(field.maxKey, range.max);
      }}
    />
  );
}

function MinMaxSection({ field, values, set }: { field: MinMaxField; values: Values; set: (k: string, v: unknown) => void }) {
  const maxKey = field.maxKey;

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="mb-1.5 block text-[13px] text-gray-500">Min</label>
        <input
          type="text"
          placeholder="Any"
          value={values[field.minKey] ?? ""}
          onChange={(e) => set(field.minKey, e.target.value)}
          className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 text-[14px] outline-none transition-colors focus:border-[#3D2C1D]"
        />
      </div>
      {maxKey && (
        <div className="flex-1">
          <label className="mb-1.5 block text-[13px] text-gray-500">Max</label>
          <input
            type="text"
            placeholder="Any"
            value={values[maxKey] ?? ""}
            onChange={(e) => set(maxKey, e.target.value)}
            className="w-full rounded-lg border border-[#ddd] px-4 py-2.5 text-[14px] outline-none transition-colors focus:border-[#3D2C1D]"
          />
        </div>
      )}
    </div>
  );
}

function InputSection({ field, values, set }: { field: InputField; values: Values; set: (k: string, v: unknown) => void }) {
  return (
    <>
      <input
        type="text"
        placeholder={field.placeholder ?? ""}
        value={values[field.key] ?? ""}
        onChange={(e) => set(field.key, e.target.value)}
        className="w-full rounded-lg border border-[#ddd] px-4 py-3 text-[14px] outline-none transition-colors focus:border-[#3D2C1D]"
      />
      {field.hint && <p className="mt-1.5 text-xs text-gray-500">{field.hint}</p>}
    </>
  );
}


function renderField(field: FilterField, values: Values, set: (k: string, v: unknown) => void) {
  switch (field.type) {
    case "checkbox":
      return <CheckboxSection field={field} values={values} set={set} />;
    case "range":
      return <RangeSection field={field} set={set} />;
    case "minMax":
      return <MinMaxSection field={field} values={values} set={set} />;
    case "input":
      return <InputSection field={field} values={values} set={set} />;
  }
}


export default function FilterPanel({ mode, values, onChange }: FilterPanelProps) {
  const fields = getFieldsForMode(mode);

  const set = (key: string, value: unknown) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-8">
      {fields.map((field, i) => (
        <div key={field.key}>
          {i > 0 && <Divider />}
          <div className="mt-6 space-y-4">
            <h3 className="text-[17px] font-semibold text-[#333]">
              {field.label}
            </h3>
            {renderField(field, values, set)}
          </div>
        </div>
      ))}
    </div>
  );
}
