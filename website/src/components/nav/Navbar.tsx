import { useState, useRef, useEffect } from "react";

import { Globe } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import { NavSearchButton, SearchOverlay } from "./NavSearchBar";

import { SCROLL_THRESHOLD } from "../search/FloatingSearch";

import LanguageModal from "./LanguageModal.tsx";

import ProfileDropdown from "./ProfileDropdown.tsx";

import Briskybrown from "../../assets/logo/briskybrown.svg";

type NavbarProps = {
  mode: "collapsed" | "search" | "ai";
  setMode: (mode: "collapsed" | "search" | "ai") => void;
  hasHero?: boolean;
};

type Lang = {
  label: string;
  region: string;
};

const navItems = [
  { label: "Buy", to: "/buy" },
  { label: "Sold", to: "/sold" },
  { label: "Rent", to: "/rent" },
  { label: "Agents", to: "/agents" },
  { label: "Builders", to: "/builders" },
  { label: "Trades & Professionals", to: "/professionals" },
  { label: "Blogs", to: "/blogs" },
  { label: "Commercials", to: "/commercials" },
];

const Navbar = ({ mode, setMode, hasHero = true }: NavbarProps) => {
  const [langModalOpen, setLangModalOpen] = useState(false);

  const [selectedLang, setSelectedLang] = useState<Lang>({
    label: "English",
    region: "UK",
  });
  const [pastHero, setPastHero] = useState(!hasHero);

  const pastHeroRef = useRef(pastHero);

  const location = useLocation();

  const isSearchOpen = mode !== "collapsed";

  useEffect(() => {
    if (!hasHero) return;

    const onScroll = () => {
      if (document.body.style.position === "fixed") return;

      const isPast = window.scrollY > SCROLL_THRESHOLD;

      // Close the search if we cross the hero boundary
      if (isPast !== pastHeroRef.current) {
        setMode("collapsed");
      }

      pastHeroRef.current = isPast;
      setPastHero(isPast);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHero, setMode]);

  const isNavItemActive = (to: string) => {
    const url = new URL(to, window.location.origin);

    // Check pathname
    if (location.pathname !== url.pathname) {
      return false;
    }

    // Check query parameters
    const targetParams = new URLSearchParams(url.search);
    const currentParams = new URLSearchParams(location.search);

    // Agents and Builders share the same result type. Builders must not also
    // appear active when the Agents tab is selected.
    if (to === "/builders" && currentParams.get("tab") === "agents") {
      return false;
    }

    for (const [key, value] of targetParams.entries()) {
      if (location.search.includes(`${key}=${value}`) === false) {
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0  z-50 h-20 border-b border-[#d8d8d8] bg-primary-brown text-white">
        <div className="flex h-20 items-center justify-between px-2  sm:px-4 lg:px-6">

          {/* Logo */}
          <Link to="/" className="shrink-0 lg:w-[13.75rem]">
            <img
              loading="eager"
              src={Briskybrown}
              alt="Briksy"
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation */}
          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {navItems.map((item) => {
              const active = isNavItemActive(item.to);

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`relative whitespace-nowrap py-1 text-sm font-normal text-white/90 transition hover:text-white ${active ? "border-b border-white" : ""
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex shrink-0 items-center justify-end lg:w-[13.75rem]  gap-5">

            {/* Search */}
            {pastHero && !isSearchOpen && (
              <NavSearchButton
                onClick={() => setMode("search")}
              />
            )}

            {/* Language */}
            <button
              onClick={() => setLangModalOpen(true)}
              className="transition hover:opacity-70"
              aria-label="Language and region"
            >
              <Globe
                size={18}
                color="white"
              />
            </button>

            {/* Profile */}
            <ProfileDropdown />

          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <SearchOverlay
        open={isSearchOpen}
        onClose={() => setMode("collapsed")}
      />

      {/* Language Modal */}
      <LanguageModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        selectedLang={selectedLang}
        onSelect={setSelectedLang}
      />
    </>
  );
};

export default Navbar;
