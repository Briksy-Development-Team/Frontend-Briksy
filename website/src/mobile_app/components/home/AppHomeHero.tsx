import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Bell } from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";
import BriksyLogo from "../../../assets/logo/briksy.svg";
import HeroM from "../../../assets/hero/HeroM.svg";
import Filter from "../../../components/filter/Filter";

export default function AppHomeHero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const firstName = user?.name?.split(" ")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/result?q=${encodeURIComponent(q)}` : "/result");
  };

  return (
    <section
      className="text-white pt-3 h-[45vh] pb-14 px-4 bg-cover bg-bottom"
      style={{ backgroundImage: `linear-gradient(rgb(0 0 0 / 0.4), rgb(0 0 0 / 0.4)), url(${HeroM})` }}
    >
      <div className="max-w-md mx-auto flex flex-col justify-between h-full">
        <div className="flex items-center justify-between pt-1 pb-4">
          <Link to="/">
            <img src={BriksyLogo} alt="Briksy" className="h-7 w-auto object-contain" />
          </Link>

          <button
            type="button"
            onClick={() => navigate("/notification")}
            className="grid place-items-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={19} className="col-start-1 row-start-1" />
            <span className="col-start-1 row-start-1 justify-self-end self-start mr-2.5 mt-2.5 w-2 h-2 rounded-full bg-[#F5551A]" />
          </button>
        </div>

        <div>
          <div className="pt-2 pb-4">
            <p className="text-xs text-white/80 tracking-wide">Good morning{firstName && `, ${firstName}`}</p>
            <h1 className="text-[1.85rem] font-medium leading-[1.15] mt-1 tracking-tight">Who do you need today?</h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-white rounded-full pl-4 pr-1.5 py-1.5 shadow-xl focus-within:ring-2 focus-within:ring-[#DFB28A]"
          >
            <Search size={18} className="text-primary-light-brown shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search homes, builders, trades..."
              className="w-full bg-transparent text-xs text-primary-brown placeholder-primary-light-brown focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="w-9 h-9 rounded-full bg-primary-brown text-white flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
              aria-label="Filter"
            >
              <SlidersHorizontal size={15} />
            </button>
          </form>
        </div>
      </div>

      <Filter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} category="real-estate" initialTab="All" />
    </section>
  );
}