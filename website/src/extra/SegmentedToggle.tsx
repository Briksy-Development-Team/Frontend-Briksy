type Option<T extends string> = { label: string; value: T };

type SegmentedToggleProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  fullWidth?: boolean;
  size?: "sm" | "md";
};

export default function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  fullWidth = false,
  size = "md",
}: SegmentedToggleProps<T>) {
  const padding = size === "sm" ? "px-4 py-1.5 text-sm" : "px-6 py-2.5 text-sm";

  return (
    <div
      className={`inline-flex rounded-xl border border-gray-200 bg-gray-100 p-1 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-lg font-medium transition-all duration-200 ${padding} ${
            value === opt.value
              ? "bg-white text-[#3D2C1D] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
