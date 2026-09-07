import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type DropdownOption = {
  label: string;
  value: string;
  icon?: ReactNode;
};

type DropdownPillProps = {
  label: ReactNode;
  options: DropdownOption[];
  value: string;
  onSelect: (value: string) => void;
  className?: string;
  icon?: ReactNode;
  alignment?: "left" | "right";
};

export default function DropdownPill({
  label,
  options,
  value,
  onSelect,
  className = "",
  icon,
  alignment = "right",
}: DropdownPillProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (document.body.style.position === "fixed") return;
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-center gap-2 rounded-full border border-[#EDE8E4] bg-white px-4 h-10 text-[0.875rem] text-[#342511] transition-colors whitespace-nowrap ${className}`}
      >
        {icon}
        {label}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div
          className={`absolute ${
            alignment === "right" ? "right-0" : "left-0"
          } z-50 mt-3 min-w-[231px] rounded-3xl border border-[#EDE8E4] bg-white shadow-xl px-6 py-6 flex flex-col gap-[12px]`}
        >
          {options.map((opt, index) => (
            <button
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left pb-3 text-[16px] font-helvetica flex items-center gap-3 transition-opacity ${
                index !== options.length - 1 ? "border-b border-[#88867A]/40" : ""
              } ${
                opt.value === value
                  ? "text-[#342511] font-medium"
                  : "text-[#342511] hover:opacity-70"
              }`}
            >
              {opt.icon && opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
