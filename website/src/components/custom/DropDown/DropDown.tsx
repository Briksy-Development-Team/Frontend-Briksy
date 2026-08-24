import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = {
  value: number;
  label: string;
};

type CustomSelectProps = {
  options: SelectOption[];
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
};

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected =
    options.find((option) => option.value === value) ??
    ({ value: 0, label: placeholder } as SelectOption);

  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  
  useEffect(() => {
    if (!open || !listRef.current) return;

    const selectedEl = listRef.current.querySelector(`[data-value="${value}"]`);

    if (selectedEl instanceof HTMLElement) {
      selectedEl.scrollIntoView({
        block: "nearest",
      });
    }
  }, [open, value]);

  return (
    <div ref={containerRef} className="relative w-full">
      
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 transition hover:border-gray-300"
      >
        <span>{selected.label}</span>

        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      
      {open && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl"
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                data-value={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition
                  ${
                    active
                      ? "bg-[#F7F2EC] text-[#3D2C1D] font-medium"
                      : "hover:bg-gray-50"
                  }`}
              >
                <span>{option.label}</span>

                {active && <Check size={16} className="text-[#3D2C1D]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
