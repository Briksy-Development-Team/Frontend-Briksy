type ToggleSwitchProps = {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export default function ToggleSwitch({
  label,
  sublabel,
  checked,
  onChange,
}: ToggleSwitchProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <div>
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {sublabel && (
          <p className="mt-0.5 text-xs text-gray-400">{sublabel}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#3D2C1D]" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
