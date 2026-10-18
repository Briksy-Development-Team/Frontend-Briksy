import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import briksyLogoBrown from "../../../assets/mobile_app/auth/briksy_logo_brown.png";

export default function AppGuestAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  const handleJoinNow = () => {
    navigate("/register", { state: { from: location.pathname } });
  };

  const links = [
    { label: "Find Agents", to: "/agents" },
    { label: "Find a Broker", to: "/professionals?category=broker" },
    { label: "Find Professionals", to: "/professionals" },
    { label: "Help & Support", to: "/help-support" },
  ];

  return (
    <div className="min-h-[calc(100dvh-4.5rem)] flex flex-col justify-between  font-helvetica select-none px-5 pt-20 pb-10 max-w-md mx-auto animate-fade-in">
      <div className="flex flex-col items-center text-center pt-2">
        <span className="text-primary-light-brown text-[1.25rem] font-medium tracking-[0.03em] uppercase">
          Welcome to
        </span>

        <div className="pt-3 pb-2 flex justify-center">
          <img
            src={briksyLogoBrown}
            alt="Briksy - BUY • BUILD • CONNECT"
            className="w-[190px] h-auto object-contain"
          />
        </div>

        <p className="text-primary-brown text-[0.875rem] leading-[20px] font-normal max-w-[280px] pt-1">
          Create your account to save properties, schedule visits, get updates and more.
        </p>

        <div className="flex items-center gap-2 w-full pt-6">
          <button
            type="button"
            onClick={handleSignIn}
            className="flex-1 py-[0.5rem] px-[1.5rem] rounded-full bg-primary-brown text-white font-medium text-[0.875rem] flex items-center justify-center tracking-wide active:scale-[0.98] transition-all shadow-sm cursor-pointer hover:bg-[#251a0b]"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={handleJoinNow}
            className="flex-1 py-[0.5rem] px-[1.5rem] rounded-full bg-white text-primary-brown border border-[#E2E8F0] font-medium text-[0.875rem] flex items-center justify-center tracking-wide active:scale-[0.98] transition-all shadow-sm cursor-pointer hover:bg-neutral-50"
          >
            Join now
          </button>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <div className="bg-white rounded-[14px] border border-[#EDE8E4] overflow-hidden shadow-sm">
          {links.map((link, idx) => (
            <div key={link.label}>
              <button
                type="button"
                onClick={() => navigate(link.to)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
              >
                <span className="text-[0.875rem] font-medium text-primary-brown">
                  {link.label}
                </span>
                <ChevronRight size={18} className="text-primary-light-brown" />
              </button>
              {idx < links.length - 1 && (
                <div className="h-[1px] bg-[#EDE8E4] w-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
