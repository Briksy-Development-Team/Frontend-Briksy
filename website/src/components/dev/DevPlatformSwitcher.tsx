import { useIsMobileApp, setDevPlatformOverride, getDevPlatformOverride } from "../../utils/platform";
import { setMobileWelcomeSeen } from "../../utils/welcome";
import { Smartphone, Globe, RotateCcw, Sparkles } from "lucide-react";

export default function DevPlatformSwitcher() {
  if (!import.meta.env.DEV) return null;

  const isApp = useIsMobileApp();
  const override = getDevPlatformOverride();

  const togglePlatform = () => {
    // If currently app, switch to web; if web, switch to app
    setDevPlatformOverride(isApp ? "web" : "app");
  };

  const resetToAuto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDevPlatformOverride(null);
  };

  const replayWelcome = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileWelcomeSeen(false);
  };

  return (
    <div
      role="region"
      aria-label="Development Platform Switcher"
      className="fixed bottom-20 right-4 z-[9999] flex md:hidden items-center gap-1.5 bg-[#1F170E]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-2xl border border-white/15 select-none"
    >
      <button
        type="button"
        onClick={togglePlatform}
        className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide cursor-pointer hover:text-[#DFB28A] transition-colors"
        title="Click to toggle between PWA Mobile App UI and Web UI in Dev"
      >
        {isApp ? (
          <>
            <Smartphone size={13} className="text-[#E0A86E]" />
            <span>📱 PWA UI</span>
          </>
        ) : (
          <>
            <Globe size={13} className="text-[#6EA8E0]" />
            <span>🌐 Web UI</span>
          </>
        )}
      </button>

      {isApp && (
        <button
          type="button"
          onClick={replayWelcome}
          className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/10 hover:bg-white/20 text-[#DFB28A] rounded-full flex items-center gap-1 transition-colors cursor-pointer"
          title="Replay first-time welcome screen"
        >
          <Sparkles size={10} />
          <span>Welcome</span>
        </button>
      )}

      {override !== null && (
        <button
          type="button"
          onClick={resetToAuto}
          className="ml-1 p-0.5 text-white/60 hover:text-white transition-colors cursor-pointer"
          title="Reset to automatic platform detection"
        >
          <RotateCcw size={11} />
        </button>
      )}
    </div>
  );
}
