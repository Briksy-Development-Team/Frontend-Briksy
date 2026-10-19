import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import welcomeBg from "../../../assets/mobile_app/welcome/welcome_bg.svg";
import briksyLogo from "../../../assets/logo/loaderbg.svg";
import { setMobileWelcomeSeen } from "../../../utils/welcome";

export interface AppWelcomeProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

interface WelcomeSlide {
  kicker: string;
  title: string;
  description: string;
}

const SLIDES: WelcomeSlide[] = [
  {
    kicker: "1,240+ VERIFIED PROFESSIONALS",
    title: "Find people you can trust with your home",
    description:
      "Every builder, agent and trade on Briksy is ABN, licence and insurance checked before you ever see them.",
  },
  {
    kicker: "TRANSPARENT & RELIABLE",
    title: "Compare quotes & track project milestones",
    description:
      "Communicate directly with verified experts, review detailed project portfolios, and manage your builds with confidence.",
  },
  {
    kicker: "BUILT FOR AUSTRALIA",
    title: "Your dream property journey starts here",
    description:
      "Discover top-rated builders, explore master-planned communities, and connect with local specialists today.",
  },
];

export default function AppWelcome({ onGetStarted, onLogin }: AppWelcomeProps) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileWelcomeSeen(true);
    if (onGetStarted) {
      onGetStarted();
    }
  };

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileWelcomeSeen(true);
    if (onLogin) {
      onLogin();
    } else {
      navigate("/login");
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (diff > swipeThreshold) {
      // Swiped left -> next
      setCurrentSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
    } else if (diff < -swipeThreshold) {
      // Swiped right -> prev
      setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = SLIDES[currentSlide];

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col justify-between overflow-hidden bg-primary-brown font-helvetica select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={welcomeBg}
        alt="Briksy Architecture"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(31, 15, 10, 0.05) 0%, rgba(52, 37, 17, 0) 30%, rgba(52, 37, 17, 0.05) 50%, rgba(52, 37, 17, 0.4) 72%, rgba(52, 37, 17, 0.6) 90%, #342511 100%)",
        }}
      />

      <header className="relative z-10 w-full pt-[max(1.75rem,env(safe-area-inset-top))] px-6 flex flex-col items-center">
        <div className="pt-8 pb-4">
          <img
            src={briksyLogo}
            alt="Briksy - BUY • BUILD • CONNECT"
            className="w-[155px] h-auto object-contain "
          />
        </div>
      </header>

      <main className="relative z-10 w-full max-w-md mx-auto px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col gap-6">
        <div
          key={currentSlide}
          className="flex flex-col gap-3  transition-all duration-300 animate-fade-in"
        >
          <span className="text-primary-bleach text-[1.125rem] font-medium leading-[28px] tracking-wide">
            {slide.kicker}
          </span>

          <h1 className="text-white text-[1.875rem] font-medium leading-[36px] tracking-[-0.03em]">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-primary-bleach text-[1rem]  leading-[26px] sm:leading-[28px] font-normal">
            {slide.description}
          </p>
        </div>

        {/* Pager Dots */}
        <div
          className="flex items-center gap-1.5 py-1"
          role="tablist"
          aria-label="Welcome slide indicators"
        >
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === currentSlide}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide
                ? "w-5 bg-white"
                : "w-1.5 bg-[#BF9F7D] hover:bg-white/70"
                }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3.5 pt-1">
          {/* Primary CTA */}
          <button
            type="button"
            onClick={handleGetStarted}
            className="w-full h-14 rounded-full bg-white text-primary-brown font-medium text-[0.875rem]  flex items-center justify-center tracking-wide active:scale-[0.98] transition-all duration-200 shadow-xl cursor-pointer"
          >
            Get started
          </button>

          {/* Sign in row */}
          <div className="flex items-center justify-center gap-1.5 text-[0.75rem]">
            <span className="text-primary-bleach">Already have an account?</span>
            <button
              type="button"
              onClick={handleLogin}
              className="text-white underline  hover:text-white/80 transition-colors cursor-pointer"
            >
              Log in
            </button>
          </div>
        </div>

        {/* iOS / Mobile Home indicator pill */}
        <div className="w-32 h-1 bg-white/35 rounded-full mx-auto mt-2" />
      </main>
    </div>
  );
}
