import { useRef, useState } from "react";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";
import ModalWrapper from "../wrapper/ModalWrapper";
import BriksyLogo from "../../assets/logo/loaderbg.svg";
import HelpIcon from "../../assets/icons/help/help.svg";
import { askBriksyAi, type AiRecommendation } from "../../api/clients.api";

type Props = { isOpen: boolean; onClose: () => void };

// ponytail: phase drives 3 UI states; backend/AI fills headline, body, and cards via props once endpoint exists
type Phase = "idle" | "searching" | "answered";

const QUICK_PROMPTS = [
  "3-bedroom house in Richmond under $1.2M",
  "2-bedroom apartments for rent in Melbourne",
  "Verified custom home builders",
  "Licensed landscapers & trades",
];

export default function AiModeModal({ isOpen, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async (query = input) => {
    if (!query.trim()) return;
    setInput(query.trim());
    setPhase("searching");
    setError("");
    try {
      const result = await askBriksyAi(query.trim());
      setAnswer(result.answer);
      setRecommendations(result.recommendations ?? []);
      setPhase("answered");
    } catch {
      setError("Briksy AI is temporarily unavailable. Please try again.");
      setPhase("idle");
    }
  };

  const reset = () => { setPhase("idle"); setInput(""); setAnswer(""); setRecommendations([]); setError(""); };

  // ModalWrapper handles scroll-lock + createPortal(document.body)
  return (
    <ModalWrapper isOpen={isOpen}>
      {/* Full-screen bottom-up slide (same animation pattern as mobile Filter) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Briksy AI"
        data-lenis-prevent
        className="fixed inset-0 z-[90] flex flex-col bg-white-50 font-helvetica text-primary-brown animate-in slide-in-from-bottom duration-300"
      >
        {/* Top bar */}
        <div className="mx-auto flex w-full max-w-[2000px] shrink-0 items-center justify-between px-5 pt-4 md:px-12 lg:px-20 lg:pt-6">
          {phase === "answered" && (
            <button onClick={reset} className="text-xs font-medium text-primary-light-brown hover:underline cursor-pointer">
              New AI search
            </button>
          )}
          <div className="ml-auto">
            <button onClick={onClose} aria-label="Close" className="rounded-full p-2 text-primary-light-brown hover:bg-primary-bleach/40 cursor-pointer">
              <X size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Body: left column + right recommendations */}
        <div
          data-lenis-prevent
          className="mx-auto flex min-h-0 w-full max-w-[2000px] flex-1 flex-col gap-8 overflow-y-auto px-5 pb-6 pt-4 md:px-12 lg:flex-row lg:gap-12 lg:overflow-hidden lg:px-20 lg:pb-8 lg:pt-6"
        >
          {/* Left column */}
          <div className="flex flex-col justify-between gap-6 lg:min-h-0 lg:flex-1">
            <div data-lenis-prevent className="scrollbar-custom flex flex-col lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">

              {/* Idle: welcome state */}
              {phase === "idle" && (
                <div className="my-auto flex max-w-2xl flex-col items-start py-4">
                  <img src={BriksyLogo} alt="Briksy" className="mb-5 h-14 w-auto object-contain sm:h-16" />
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={18} />
                    <span className="text-[14px] font-medium">Briksy AI</span>
                    <span className="rounded-full bg-primary-bleach px-[9px] py-[3px] text-[12px]">Beta</span>
                  </div>
                  <h2 className="mt-3 text-[26px] font-medium leading-tight tracking-tight sm:text-[32px]">
                    Property & Pro Search, Made Easy.
                  </h2>
                  <p className="mt-2.5 text-[16px] leading-7 text-primary-light-brown">
                    Ask in plain English for homes to buy or rent, verified builders, agents, or licensed local trades across Australia.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((p) => (
                      <button key={p} onClick={() => submit(p)} className="rounded-full border border-white-100 bg-white px-4 py-2 text-[13px] hover:border-primary-brown cursor-pointer">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Searching / Answered: shared header */}
              {phase !== "idle" && (
                <div className="flex flex-col gap-5 pt-1">
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={18} />
                    <span className="text-[14px] font-medium">Briksy AI</span>
                    <span className="rounded-full bg-primary-bleach px-[9px] py-[3px] text-[12px]">Beta</span>
                  </div>

                  {/* Searching: skeleton */}
                  {phase === "searching" && (
                    <div className="space-y-3 py-2">
                      <div className="h-7 w-11/12 animate-pulse rounded bg-white-100" />
                      <div className="h-7 w-3/4 animate-pulse rounded bg-white-100" />
                      <div className="h-5 w-full animate-pulse rounded bg-white-100" />
                      <div className="h-5 w-5/6 animate-pulse rounded bg-white-100" />
                    </div>
                  )}

                  {/* Answered: backend fills headline + body here */}
                  {phase === "answered" && (
                    <>
                      <h2 className="text-[20px] font-medium leading-7 tracking-tight">Here’s what I found on Briksy</h2>
                      <p className="whitespace-pre-wrap text-[16px] leading-7">{answer}</p>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button className="inline-flex items-center gap-1.5 rounded-[6px] border border-white-100 bg-white px-4 py-2 text-[14px] font-medium hover:border-primary-brown/40 cursor-pointer">
                          <img src={HelpIcon} alt="" className="h-[18px] w-[18px]" />
                          Still Need Help
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-2 py-2 text-[14px] font-medium text-primary-light-brown hover:text-primary-brown cursor-pointer">
                          Open in Search <ArrowRight size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Pinned search bar */}
            <div className="flex shrink-0 flex-col gap-4 pt-2">
              <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex items-center gap-3 rounded-full border border-white-100 bg-white p-2 pl-5">
                <Sparkles size={18} className="shrink-0 opacity-45" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={phase === "answered" ? "Ask a follow-up…" : "Ask Briksy AI anything…"}
                  className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:opacity-45"
                />
                <button
                  type="submit"
                  disabled={phase === "searching" || !input.trim()}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-brown px-6 py-3 text-[14px] font-medium text-white-50 hover:opacity-90 disabled:opacity-50 sm:px-[30px] sm:py-[15px] cursor-pointer"
                >
                  <Search size={18} />
                  {phase === "searching" ? "Searching…" : "Search"}
                </button>
              </form>
              {error && <p className="text-center text-sm text-red-600">{error}</p>}
              <p className="text-center text-[12px] text-primary-light-brown">
                AI answers are built from verified profile data and public licence records. Prices are indicative — always confirm with the provider.
              </p>
            </div>
          </div>

          {/* Right column: Recommendations */}
          <div className="flex shrink-0 flex-col w-full lg:min-h-0 lg:w-[322px]">
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <h3 className="text-[20px] font-medium tracking-tight">Recommendations</h3>
              <span className="text-[12px] text-primary-light-brown">{phase === "idle" ? "Top-rated" : "Matched results"}</span>
            </div>
            <div data-lenis-prevent className="scrollbar-custom min-h-0 flex-1 space-y-4 pb-4 lg:overflow-y-auto lg:pr-1">
              {phase === "idle" && <>
                <div className="h-40 w-full animate-pulse rounded-[20px] bg-white/80" />
                <div className="h-40 w-full animate-pulse rounded-[20px] bg-white/80" />
              </>}
              {phase !== "idle" && recommendations.map((item) => (
                <div key={`${item.type}-${item.id}`} className="rounded-[20px] border border-white-100 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-primary-light-brown">{item.type}</p>
                  <p className="mt-1 font-medium">{item.title || item.name}</p>
                  <p className="mt-1 text-sm text-primary-light-brown">{[item.suburb, item.state, item.category, item.organization].filter(Boolean).join(" · ")}</p>
                </div>
              ))}
              {phase !== "idle" && recommendations.length === 0 && <p className="rounded-[20px] bg-white p-4 text-sm text-primary-light-brown">No matching public Briksy records yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
