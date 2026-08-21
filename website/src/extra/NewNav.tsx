import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {  NavSearch } from "../extra/Nav.tsx";
import { SCROLL_THRESHOLD } from "../components/search/FloatingSearch.tsx";

import LanguageModal from "../components/nav/LanguageModal.tsx";
import ProfileDropdown from "../components/nav/ProfileDropdown.tsx";
import Briskybrown from "../../../assets/logo/briksyB.svg";
import { Nav } from "./Nav.tsx";

type NavbarProps = {
  mode: "collapsed" | "search" | "ai";
  setMode: (mode: "collapsed" | "search" | "ai") => void;
  hasHero?: boolean;
};

type Lang = { label: string; region: string };

const NewNav = ({ mode, setMode, hasHero = true }: NavbarProps) => {
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Lang>({
    label: "English",
    region: "UK",
  });
  const [pastHero, setPastHero] = useState(!hasHero);
  const pastHeroRef = useRef(pastHero);

  const navbarMode = pastHero ? mode : "collapsed";
  const isExpanded = navbarMode !== "collapsed";

  useEffect(() => {
    if (!hasHero) return;

    const onScroll = () => {
      if (document.body.style.position === "fixed") return;
      const isPast = window.scrollY > SCROLL_THRESHOLD;
      if (isPast !== pastHeroRef.current) setMode("collapsed");
      pastHeroRef.current = isPast;
      setPastHero(isPast);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHero, setMode]);

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 mt-10 w-[90%] bg-white mx-auto rounded-[4.625rem] border-b text-white border-[#d8d8d8] transition-[height]
            duration-300 ease-out ${isExpanded ? "h-[200px]" : "h-20"}`}
      >
        <div className="flex h-20 items-center justify-between px-2 sm:px-4 lg:px-10">
          <Link to="/" className="shrink-0">
            <img
              loading="eager"
              src={Briskybrown}
              alt="Briksy"
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex-1" />

          <div className="flex shrink-0 items-center gap-6">
            {pastHero && navbarMode === "collapsed" && (
              <Nav
                mode={navbarMode}
                setMode={setMode}
                hasHero={hasHero}
              />
            )}

            <button
              onClick={() => setLangModalOpen(true)}
              className="text-gray-800 transition h-11 w-11 rounded-xl flex items-center justify-center bg-white-50 hover:opacity-70"
              aria-label="Language and region"
            >
              <Globe size={18} />
            </button>

            <ProfileDropdown />
          </div>
        </div>

        <div
          className={`px-2 pb-8 sm:px-4 lg:px-10 transition-[opacity,transform] duration-300 ${
            isExpanded
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div className="mt-6">
            <NavSearch mode={navbarMode} setMode={setMode} />
          </div>
        </div>
      </nav>

      <LanguageModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        selectedLang={selectedLang}
        onSelect={setSelectedLang}
      />
    </>
  );
};

export default NewNav;
