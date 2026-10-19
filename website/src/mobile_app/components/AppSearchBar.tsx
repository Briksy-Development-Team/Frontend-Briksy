import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

interface AppSearchBarProps {
  placeholder?: string;
  onClick?: () => void;
}

export default function AppSearchBar({
  placeholder = "Search suburb, postcode or address...",
  onClick,
}: AppSearchBarProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate("/result");
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleClick}
          className="flex-1 flex items-center gap-2.5 bg-white border border-[#EDE8E4] rounded-2xl px-3.5 py-2.5 shadow-sm hover:border-[#D4C8B8] transition-all text-left"
        >
          <Search size={18} className="text-[#342511]/60 shrink-0" />
          <span className="text-xs sm:text-sm text-gray-400 truncate font-normal">
            {placeholder}
          </span>
          <div className="ml-auto flex items-center pl-1 border-l border-gray-100 text-[#342511]/70">
            <SlidersHorizontal size={15} />
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/result?ai=true")}
          className="shrink-0 flex items-center justify-center gap-1.5 bg-gradient-to-tr from-[#79241D] to-[#DF4235] text-white px-3.5 py-2.5 rounded-2xl text-xs font-medium shadow-sm hover:opacity-95 transition-opacity"
          aria-label="Ask AI"
        >
          <Sparkles size={14} />
          <span>AI</span>
        </button>
      </div>
    </div>
  );
}
