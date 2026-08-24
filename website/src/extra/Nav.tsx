import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Sparkles, AudioLines } from "lucide-react";
import AiVoiceModal from "../components/search/AiVoiceModal";
import { useScrollFade } from "../components/search/FloatingSearch";
import Filter from "../components/filter/Filter";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { FilterTab } from "../components/filter/filterTypes";

const BTN =
  "flex items-center justify-center rounded-xl  text-black  transition";

type Mode = "collapsed" | "search" | "ai";
type Props = { mode: Mode; setMode: (m: Mode) => void; hasHero?: boolean };

export const Nav = ({ setMode, hasHero = true }: Props) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  useScrollFade(btnRef, "in", hasHero);

  return (
    <button
      ref={btnRef}
      onClick={() => setMode("search")}
      className={`${BTN} bg-white-50 h-11 w-11 rounded-full`}
      aria-label="Open search"
    >
      <Search size={18} />
    </button>
  );
};

export const NavSearch = ({ mode, setMode }: Props) => {
  const [query, setQuery] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const isAi = mode === "ai";

  const [searchParams] = useSearchParams();
  const currentTabRaw = searchParams.get("tab");
  const initialTab: FilterTab =
    (currentTabRaw && ["Buy", "Sold", "Builders", "Agents", "Trades"].includes(
      currentTabRaw.charAt(0).toUpperCase() + currentTabRaw.slice(1)
    ))
      ? (currentTabRaw.charAt(0).toUpperCase() + currentTabRaw.slice(1) as FilterTab)
      : "Buy";

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (filterOpen || voiceOpen) return; 
      if (!wrapRef.current?.contains(e.target as Node)) setMode("collapsed");
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [setMode, filterOpen, voiceOpen]);

  return (
    <div
      ref={wrapRef}
      className="mx-auto flex w-full max-w-[900px] items-center justify-center gap-3"
    >
      
      <div
        className={`overflow-hidden transition-[width,opacity] duration-300 ${isAi ? "w-11 opacity-100 sm:w-12 lg:w-14" : "w-0 opacity-0"
          }`}
      >
        <button
          onClick={() => setMode("search")}
          className={`${BTN} bg-primary text-white h-11 w-11 shrink-0 sm:h-12 sm:w-12 lg:h-11 lg:w-11`}
        >
          <Search size={18} />
        </button>
      </div>

      
      <div className="flex h-11 flex-1 items-center overflow-hidden rounded-xl bg-white pr-2 shadow-xl sm:h-12 lg:h-14">
        <input
          type="text"
          value={isAi ? undefined : query}
          onChange={isAi ? undefined : (e) => setQuery(e.target.value)}
          placeholder={
            isAi
              ? "Ask what you are looking for..."
              : "Search Your Desired Location..."
          }
          className="h-full w-[50%] flex-1 pl-3 pr-4 text-base outline-none placeholder:text-gray-400 lg:pl-7"
        />

        {isAi ? (
          <>
            <button
              onClick={() => setVoiceOpen(true)}
              className="flex items-center justify-center px-3 text-gray-500 transition hover:text-gray-700"
            >
              <AudioLines size={20} />
            </button>
            <button className={`${BTN} bg-primary text-white h-8 w-8 sm:h-10 sm:w-10`}>
              <Sparkles size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center justify-center px-3 text-gray-500 transition hover:text-gray-700"
            >
              <SlidersHorizontal size={20} />
            </button>
            <button
              onClick={() => navigate("/result")}
              className={`${BTN} bg-primary text-white h-8 w-8 sm:h-10 sm:w-10`}
            >
              <Search size={18} />
            </button>
          </>
        )}
      </div>

      
      <div
        className={`overflow-hidden transition-[width,opacity] duration-300 ${isAi ? "w-0 opacity-0" : "w-11 opacity-100 sm:w-12 lg:w-14"
          }`}
      >
        <button
          onClick={() => setMode("ai")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xl transitio sm:h-12 sm:w-12 lg:h-11 lg:w-11"
        >
          <Sparkles size={20} />
        </button>
      </div>

      <Filter isOpen={filterOpen} onClose={() => setFilterOpen(false)} initialTab={initialTab} />
      <AiVoiceModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};