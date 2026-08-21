type ChipOption = { value: string | number; label: string };

type ChipGroupProps = {
    options: (string | ChipOption)[];
    value: (string | number) | (string | number)[];
    onChange: (v: any) => void;
    multi?: boolean;
};

const normalize = (opt: string | ChipOption): ChipOption =>
    typeof opt === "string" ? { value: opt, label: opt } : opt;

export default function ChipGroup({ options, value, onChange, multi = false }: ChipGroupProps) {
    const opts = options.map(normalize);
    const isSelected = (v: string | number) =>
        multi ? (value as (string | number)[]).includes(v) : value === v;

    const toggle = (v: string | number) => {
        if (multi) {
            const arr = value as (string | number)[];
            onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
        } else {
            onChange(v);
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-3">
            {opts.map((opt) => (
                <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700"
                >
                    <input
                        type="checkbox"
                        checked={isSelected(opt.value)}
                        onChange={() => toggle(opt.value)}
                        className="h-4 w-4 shrink-0 accent-[#3D2C1D]"
                    />
                    <span className="truncate">{opt.label}</span>
                </label>
            ))}
        </div>
    );
}