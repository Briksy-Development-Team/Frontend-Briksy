import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { NavSearchButton, NavSearchPanel } from "./NavSearchBar";
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

const Navbar = ({ mode, setMode, hasHero = true }: NavbarProps) => {
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

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 border-b border-[#d8d8d8] bg-primary-brown text-white transition-[height] duration-300 ease-out ${isExpanded ? "h-[200px]" : "h-16"
          }`}
      >
        
        <div className="flex h-16 items-center justify-between px-2 sm:px-4 lg:px-10">
          
          <Link to="/" className="shrink-0">
            <img
              loading="eager"
              src={Briskybrown}
              alt="Briksy"
              className="h-10 w-auto"
            />
          </Link>

          
          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            <Link
              to="/buyer-seller"
              className="relative whitespace-nowrap text-sm font-normal text-white/90 transition hover:text-white"
            >
              Buyer/Seller
              <span className="absolute -bottom-2 left-0 h-[1px] w-full bg-white" />
            </Link>

            <Link
              to="/agents-finder"
              className="whitespace-nowrap text-sm font-normal text-white/90 transition hover:text-white"
            >
              Agents Finder
            </Link>

            <Link
              to="/builders"
              className="whitespace-nowrap text-sm font-normal text-white/90 transition hover:text-white"
            >
              Builders
            </Link>

            <Link
              to="/questions"
              className="whitespace-nowrap text-sm font-normal text-white/90 transition hover:text-white"
            >
              Questions
            </Link>

            <Link
              to="/blogs"
              className="whitespace-nowrap text-sm font-normal text-white/90 transition hover:text-white"
            >
              Blogs
            </Link>

            <Link
              to="/commercials"
              className="whitespace-nowrap text-sm font-normal text-white/90 transition hover:text-white"
            >
              Commercials
            </Link>
          </div>

          
          <div className="flex shrink-0 items-center gap-6">
            {pastHero && navbarMode === "collapsed" && (
              <NavSearchButton
                mode={navbarMode}
                setMode={setMode}
                hasHero={hasHero}
              />
            )}

            <button
              onClick={() => setLangModalOpen(true)}
              className="transition hover:opacity-70"
              aria-label="Language and region"
            >
              <Globe size={18} color="white" />
            </button>

            <ProfileDropdown />
          </div>
        </div>

        
        <div
          className={`px-2 pb-8 transition-[opacity,transform] duration-300 sm:px-4 lg:px-10 ${isExpanded
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
            }`}
        >
          <div className="mt-6">
            <NavSearchPanel
              mode={navbarMode}
              setMode={setMode}
            />
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

export default Navbar;