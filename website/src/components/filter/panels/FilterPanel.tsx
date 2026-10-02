import PriceRange from "../primitives/PriceRange";
import { Divider } from "../primitives/Section";
import { getFieldsForMode } from "../filterConfig";
import type { 
  FilterMode, FilterField, RangeField, MinMaxField, InputField,
  GridSelectField, PillSelectField, SingleCheckboxField, ToggleField
} from "../filterConfig";

type Values = Record<string, any>;

type FilterPanelProps = {
  mode: FilterMode;
  values: Values;
  onChange: (v: Values) => void;
};


function GridSelectSection({ field, values, set }: { field: GridSelectField; values: Values; set: (k: string, v: unknown) => void }) {
  const currentValues = (values[field.key] as string[]) || [];

  const toggle = (option: string) => {
    if (field.multiSelect) {
      if (currentValues.includes(option)) {
        set(field.key, currentValues.filter((v) => v !== option));
      } else {
        set(field.key, [...currentValues, option]);
      }
    } else {
      set(field.key, [option]);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {field.options.map((opt) => {
        const isSelected = currentValues.includes(opt.id);
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-colors ${
              isSelected 
                ? "bg-[#3D2C1D] border-[#3D2C1D] text-white" 
                : "bg-white border-[#EDE8E4] text-[#3D2C1D] hover:bg-[#F8F4EE]"
            }`}
          >
            <Icon className="w-6 h-6 mb-2" strokeWidth={1.5} />
            <span className="text-[12px] font-medium text-center leading-tight">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PillSelectSection({ field, values, set }: { field: PillSelectField; values: Values; set: (k: string, v: unknown) => void }) {
  const currentValues = (values[field.key] as string[]) || [];

  const toggle = (option: string) => {
    if (field.multiSelect) {
      if (currentValues.includes(option)) {
        set(field.key, currentValues.filter((v) => v !== option));
      } else {
        set(field.key, [...currentValues, option]);
      }
    } else {
      set(field.key, [option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {field.options.map((opt) => {
        const isSelected = currentValues.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`px-4 py-2 min-w-[3.5rem] rounded-lg border transition-colors text-[13px] ${
              isSelected
                ? "bg-[#3D2C1D] border-[#3D2C1D] text-white"
                : "bg-white border-[#EDE8E4] text-[#3D2C1D] hover:bg-[#F8F4EE]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SingleCheckboxSection({ field, values, set }: { field: SingleCheckboxField; values: Values; set: (k: string, v: unknown) => void }) {
  const isChecked = !!values[field.key];
  return (
    <label className="flex items-center gap-2 cursor-pointer group pt-1">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={isChecked}
          onChange={(e) => set(field.key, e.target.checked)}
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
      <span className="text-[13px] text-gray-700 group-hover:text-gray-900">{field.label}</span>
    </label>
  );
}

function ToggleSection({ field, values, set }: { field: ToggleField; values: Values; set: (k: string, v: unknown) => void }) {
  const isChecked = !!values[field.key];
  return (
    <label className="flex items-center justify-between cursor-pointer py-1">
      <span className="text-[16px] text-[#333]">{field.label}</span>
      <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-[#3D2C1D] focus-within:ring-offset-2" style={{ backgroundColor: isChecked ? "#3D2C1D" : "#E5E7EB" }}>
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={(e) => set(field.key, e.target.checked)}
        />
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isChecked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
    </label>
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
          className="w-full rounded-lg border border-[#EDE8E4] px-4 py-2.5 text-[14px] outline-none transition-colors focus:border-[#3D2C1D]"
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
            className="w-full rounded-lg border border-[#EDE8E4] px-4 py-2.5 text-[14px] outline-none transition-colors focus:border-[#3D2C1D]"
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
        className="w-full rounded-lg border border-[#EDE8E4] px-4 py-3 text-[14px] outline-none transition-colors focus:border-[#3D2C1D]"
      />
      {field.hint && <p className="mt-1.5 text-xs text-gray-500">{field.hint}</p>}
    </>
  );
}


function renderField(field: FilterField, values: Values, set: (k: string, v: unknown) => void) {
  switch (field.type) {
    case "gridSelect":
      return <GridSelectSection field={field} values={values} set={set} />;
    case "pillSelect":
      return <PillSelectSection field={field} values={values} set={set} />;
    case "singleCheckbox":
      return <SingleCheckboxSection field={field} values={values} set={set} />;
    case "toggle":
      return <ToggleSection field={field} values={values} set={set} />;
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

  const renderFieldWithLabel = (field: FilterField, i: number) => {
    let containerClass = "mt-6 space-y-4";
    if (field.type === "singleCheckbox") containerClass = "";
    else if (field.type === "toggle") containerClass = "mt-4 space-y-0";

    return (
      <div key={field.key}>
        {i > 0 && field.type !== "singleCheckbox" && <Divider />}
        <div className={containerClass}>
          {field.type !== "singleCheckbox" && field.type !== "toggle" && (
            <h3 className="text-[17px] font-semibold text-[#333]">
              {field.label}
            </h3>
          )}
          {renderField(field, values, set)}
        </div>
      </div>
    );
  };

  const leftFields = fields.filter(f => f.column === "left");
  const rightFields = fields.filter(f => f.column !== "left");

  if (leftFields.length === 0) {
    return (
      <div className="space-y-8 md:overflow-y-auto md:h-full md:pb-8 scrollbar-hide">
        {rightFields.map(renderFieldWithLabel)}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 md:h-full">
      <div className="w-full md:w-[320px] lg:w-[380px] shrink-0 border-b md:border-b-0 md:border-r border-[#EDE8E4] pb-8 md:pb-0 md:pr-8">
        {leftFields.map(renderFieldWithLabel)}
      </div>
      <div className="flex-1 space-y-8 md:overflow-y-auto md:pr-4 md:pb-8 scrollbar-hide">
        {rightFields.map(renderFieldWithLabel)}
      </div>
    </div>
  );
}
