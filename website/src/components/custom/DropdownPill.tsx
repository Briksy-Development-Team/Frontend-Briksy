import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

const PANEL_WIDTH = 231;
const MARGIN = 8;

type DropdownOption = { label: string; value: string; icon?: ReactNode };

type DropdownPillProps = {
  label: ReactNode;
  options: DropdownOption[];
  value: string;
  onSelect: (value: string) => void;
  className?: string;
  icon?: ReactNode;
};

export default function DropdownPill({ label, options, value, onSelect, className = "", icon }: DropdownPillProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!open && buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      // Align panel to right edge of button, clamped so it doesn't overflow viewport
      const idealLeft = r.right - PANEL_WIDTH;
      const left = Math.max(MARGIN, Math.min(idealLeft, window.innerWidth - PANEL_WIDTH - MARGIN));
      setPos({ top: r.bottom + MARGIN, left });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (buttonRef.current?.contains(e.target as Node)) return;
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggle}
        className={`flex items-center justify-center gap-2 rounded-full border border-[#EDE8E4] bg-white px-4 h-10 text-[0.875rem] text-[#342511] transition-colors whitespace-nowrap shrink-0 ${className}`}
      >
        {icon}{label}<ChevronDown size={16} />
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: PANEL_WIDTH }}
          className="z-[9999] rounded-3xl border border-[#EDE8E4] bg-white shadow-xl px-6 py-6 flex flex-col gap-3"
        >
          {options.map((opt, i) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              className={`w-full text-left pb-3 text-[16px] font-helvetica flex items-center gap-3 transition-opacity ${i !== options.length - 1 ? "border-b border-[#88867A]/40" : ""} ${opt.value === value ? "text-[#342511] font-medium" : "text-[#342511] hover:opacity-70"}`}
            >
              {opt.icon}{opt.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}
