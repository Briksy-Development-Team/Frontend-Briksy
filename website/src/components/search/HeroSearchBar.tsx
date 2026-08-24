import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, AudioLines } from "lucide-react";
import AiVoiceModal from "./AiVoiceModal";
import Filter from "../filter/Filter";
import { useScrollFade } from "./FloatingSearch";
import { useNavigate } from "react-router-dom";
import type { ResultType } from "../../types/search";

type DropdownOption = { label: string; short: string };

type Tab = {
  label: string;
  resultType: ResultType;
  dropdown?: DropdownOption[];
};
type Mode = "collapsed" | "search" | "ai";
const TABS: Tab[] = [
  { label: "Buy", resultType: "property" },
  { label: "Sold", resultType: "property" },
  { label: "Builders", resultType: "builder" },
  {
    label: "Agents",
    resultType: "trader",
    dropdown: [
      { label: "Real Estate Agents", short: "Real Estate" },
      { label: "Buyers Agents", short: "Buyers Agent" },
    ],
  },
  {
    label: "Traders",
    resultType: "trader",
    dropdown: [
      { label: "Electrical", short: "Electrical" },
      { label: "Plumbing", short: "Plumbing" },
      { label: "Fencing", short: "Fencing" },
      { label: "Landscapers", short: "Landscapers" },
      { label: "Conveyancers", short: "Conveyancers" },
    ],
  },
];

const PLACEHOLDERS: Record<string, string> = {
  Buy: "Search Your Desired Location...",
  Sold: "Search suburb or address for sold prices...",
  Builders: "Search builder name or suburb...",
  Agents: "Search agent name or suburb...",
  
  Traders: "Search a service, e.g. 'electrician'...",
};

const tabClass = (active: boolean) =>
  `h-11 w-full rounded-xl px-6 py-2 text-[0.875rem] font-normal truncate transition-all  lg:text-[1rem] ${active
    ? "border border-[#DBDAD3] bg-primary-brown text-white hover:border hover:border-primary"
    : "border border-[#EDE8E4] bg-white-50 text-primary-brown"
  }`;

const FadeButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <button
      onClick={onClick}
      className={`${className} transition-opacity  duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {children}
    </button>
  );
};
type Props = { mode: Mode; setMode: (m: Mode) => void };

function DropdownTab({
  tab,
  isActive,
  category,
  onSelectTab,
  onSelectCategory,
}: {
  tab: Tab;
  isActive: boolean;
  category: string;
  onSelectTab: () => void;
  onSelectCategory: (label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const short =
    tab.dropdown?.find((o) => o.label === category)?.short ?? tab.label;

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      <button onClick={onSelectTab} className={tabClass(isActive)}>
        {isActive ? short : tab.label}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[200] mt-0 w-48  rounded-xl bg-white shadow-lg">
          {tab.dropdown!.map((opt, idx) => (
            <div key={opt.label}>
              <button
                onClick={() => {
                  onSelectTab();
                  onSelectCategory(opt.label);
                  setOpen(false);
                }}
                className="block w-full px-4 py-3 text-left text-[0.875rem] transition hover:bg-gray-50"
              >
                {opt.label}
              </button>
              {idx !== tab.dropdown!.length - 1 && (
                <div className="mx-4 h-px bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchBarActions({
  isAi,
  onFilterClick,
  onVoiceClick,
  onSubmit,
}: {
  isAi: boolean;
  onFilterClick: () => void;
  onVoiceClick: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex items-center gap-x-3">
      <button
        onClick={isAi ? onVoiceClick : onFilterClick}
        className="flex h-12 w-12 items-center justify-center rounded-[4px] text-gray-500 transition hover:text-gray-700"
      >
        {isAi ? <AudioLines size={20} /> : <SlidersHorizontal size={20} />}
      </button>

      <button
        onClick={isAi ? undefined : onSubmit}
        className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#562F00] text-white transition hover:bg-[#2f2008]"
      >
        {isAi ? <Sparkles size={18} /> : <Search size={18} />}
      </button>
    </div>
  );
}

const HeroSearchBar = ({ mode, setMode }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [categories, setCategories] = useState<Record<string, string>>({
    Agents: "Real Estate Agents",
    Traders: "Electrical",
  });

  const rootRef = useRef<HTMLDivElement>(null);
  useScrollFade(rootRef, "out");
  const navigate = useNavigate();

  const isAi = mode === "ai";
  const activeTab = TABS[activeIdx];
  const activeCategory = categories[activeTab.label];

  const placeholder = isAi
    ? "Ask what you are looking for..."
    : activeTab.dropdown
      ? `Search ${activeCategory.toLowerCase()} by name or suburb...`
      : PLACEHOLDERS[activeTab.label];

  const goToResults = () => {
    const params = new URLSearchParams({ type: activeTab.resultType });
    if (activeTab.dropdown) params.set("category", activeCategory);
    navigate(`/result?${params.toString()}`);
  };

  return (
    <div
      ref={rootRef}
      className="mx-auto flex flex-col items-center gap-y-3 bg-white rounded-3xl p-3 shadow-xl"
   
    >
      <div className="grid w-[95%] grid-cols-2 gap-1.5 sm:w-[80%] sm:grid-cols-3 lg:w-full lg:grid-cols-5">
        {TABS.map((tab, i) =>
          tab.dropdown ? (
            <DropdownTab
              key={tab.label}
              tab={tab}
              isActive={activeIdx === i}
              category={categories[tab.label]}
              onSelectTab={() => setActiveIdx(i)}
              onSelectCategory={(label) =>
                setCategories((prev) => ({ ...prev, [tab.label]: label }))
              }
            />
          ) : (
            <button
              key={tab.label}
              onClick={() => setActiveIdx(i)}
              className={tabClass(activeIdx === i)}
            >
              {tab.label}
            </button>
          ),
        )}
      </div>

      <div className="flex w-[95%] items-center gap-x-[17px] sm:w-[80%] lg:w-full">
        {isAi && (
          <FadeButton
            onClick={() => setMode("search")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-white text-[#3D2A0B] shadow-md hover:border hover:border-primary sm:h-12 sm:w-12 lg:h-16 lg:w-16"
          >
            <Search size={18} />
          </FadeButton>
        )}

        <div className="flex h-11 flex-1 items-center justify-between overflow-hidden rounded-xl border border-[#D9D9D9] bg-white pl-8 pr-2 py-2 sm:h-12 lg:h-14">
          <input
            type="text"
            value={isAi ? undefined : query}
            onChange={isAi ? undefined : (e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="h-full w-full pr-4 text-base outline-none placeholder:text-[#6B7280]"
          />
          <SearchBarActions
            isAi={isAi}
            onFilterClick={() => setFilterOpen(true)}
            onVoiceClick={() => setVoiceOpen(true)}
            onSubmit={goToResults}
          />
        </div>

        {!isAi && (
          <FadeButton
            onClick={() => setMode("ai")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-white shadow-md hover:border hover:border-primary sm:h-12 sm:w-12 lg:h-16 lg:w-16"
          >
            <Sparkles size={20} />
          </FadeButton>
        )}
      </div>

      <Filter
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        initialTab={activeTab.label as any}
        agentCategory={activeCategory ?? ""}
      />
      <AiVoiceModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};

export default HeroSearchBar;
