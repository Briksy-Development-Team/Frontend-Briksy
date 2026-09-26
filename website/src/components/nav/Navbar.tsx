import { useState, useRef, useEffect } from "react";

import { Globe, Menu, X } from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { NavSearchButton, SearchOverlay } from "./NavSearchBar";

import { SCROLL_THRESHOLD } from "../search/FloatingSearch";

import LanguageModal from "./LanguageModal.tsx";

import ProfileDropdown from "./ProfileDropdown.tsx";

import Briskybrown from "../../assets/logo/briskybrown.svg";

import { useAuth } from "../../auth/AuthContext";

type NavbarProps = {
  mode: "collapsed" | "search" | "ai";
  setMode: (mode: "collapsed" | "search" | "ai") => void;
  hasHero?: boolean;
  hideOnMobile?: boolean;
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

const mobileMenuItems = [
  { label: "Buy / Sell", to: "/buy" },
  { label: "Agents Finder", to: "/agents" },
  { label: "Builders", to: "/builders" },
  { label: "Professionals", to: "/professionals" },
  { label: "Blogs", to: "/blogs" },
  { label: "Commercials", to: "/commercials" },
];

const Navbar = ({ mode, setMode, hasHero = true, hideOnMobile = false }: NavbarProps) => {
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [selectedLang, setSelectedLang] = useState<Lang>({
    label: "English",
    region: "UK",
  });
  const [pastHero, setPastHero] = useState(!hasHero);

  const pastHeroRef = useRef(pastHero);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isSearchOpen = mode !== "collapsed";

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!hasHero) return;

    const onScroll = () => {
      if (document.body.style.position === "fixed") return;

      const isPast = window.scrollY > SCROLL_THRESHOLD;

      if (isPast !== pastHeroRef.current) {
        setMode("collapsed");
      }

      if (pastHeroRef.current !== isPast) {
        pastHeroRef.current = isPast;
        setPastHero(isPast);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHero, setMode]);

  // Check if current route matches nav item route
  const isNavItemActive = (to: string) => {
    const url = new URL(to, window.location.origin);

    // Check pathname
    if (location.pathname !== url.pathname) {
      return false;
    }

    // Check query parameters
    const targetParams = new URLSearchParams(url.search);
    const currentParams = new URLSearchParams(location.search);

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

  const closeMobileAndNav = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className={`fixed left-0 right-0 top-0 z-50 h-20 border-b border-[#d8d8d8] bg-primary-brown text-white ${hideOnMobile ? 'hidden md:block' : ''}`}>
        <div className="flex h-20 items-center justify-between px-2 sm:px-4 lg:px-6">

          {/* Logo */}
          <Link to="/" className="shrink-0 lg:w-[13.75rem]">
            <img
              loading="eager"
              src={Briskybrown}
              alt="Briksy"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-center gap-4 lg:flex">
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

          <div className="flex shrink-0 items-center justify-end lg:w-[13.75rem] gap-5">

            {pastHero && !isSearchOpen && (
              <>
                <div className="md:hidden">
                  <NavSearchButton onClick={() => navigate("/result?type=all")} />
                </div>
                <div className="hidden md:block">
                  <NavSearchButton onClick={() => setMode("search")} />
                </div>
              </>
            )}


            {/* Language — desktop only */}
            <button
              onClick={() => setLangModalOpen(true)}
              className="hidden lg:block transition hover:opacity-70"
              aria-label="Language and region"
            >
              <Globe size={18} color="white" />
            </button>

            {/* Desktop profile dropdown */}
            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>

            {/* Mobile hamburger / X toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-1.5 text-white transition hover:opacity-70"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen drawer ── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden
      />

      {/* Drawer panel — slides in from the left */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-full z-40 bg-[#f5f2ed] flex flex-col transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer header — matches navbar height */}
        <div className="flex h-20 items-center justify-between px-5 bg-primary-brown shrink-0">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <img src={Briskybrown} alt="Briksy" className="h-12 w-auto" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-white hover:opacity-70 transition"
            aria-label="Close menu"
          >
            <X size={26} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-6 py-4">
          {mobileMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => closeMobileAndNav(item.to)}
              className="w-full text-left py-5 text-[1.0625rem] font-medium text-[#342511] border-b border-[#e5e0d8] hover:text-[#6b4c2a] transition-colors"
            >
              {item.label}
            </button>
          ))}

          {/* Language */}
          <button
            onClick={() => {
              setMobileOpen(false);
              setLangModalOpen(true);
            }}
            className="w-full text-left py-5 text-[1.0625rem] font-medium text-[#342511] border-b border-[#e5e0d8] hover:text-[#6b4c2a] transition-colors"
          >
            Language
          </button>

          {/* Profile / Auth */}
          {isAuthenticated ? (
            <button
              onClick={() => closeMobileAndNav("/profile")}
              className="w-full text-left py-5 text-[1.0625rem] font-medium text-[#342511] border-b border-[#e5e0d8] hover:text-[#6b4c2a] transition-colors"
            >
              Profile
            </button>
          ) : (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => closeMobileAndNav("/login")}
                className=" bg-primary-brown text-white rounded-2xl py-3.5  px-[3rem] font-medium transition hover:opacity-90"
              >
                Login
              </button>
              <button
                onClick={() => closeMobileAndNav("/register")}
                className=" bg-white border border-gray-300 text-primary-brown  px-[3rem] rounded-2xl py-3.5 font-medium transition hover:border-gray-400"
              >
                Register
              </button>
            </div>
          )}
        </nav>
      </div>

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
