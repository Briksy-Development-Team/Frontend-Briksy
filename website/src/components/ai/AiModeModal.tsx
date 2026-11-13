/**
 * AiModeModal.tsx — Gemini & ChatGPT-style full-screen AI chat modal.
 * ponytail: Lean session state management, minimal boilerplate, auto-persistence.
 */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PanelLeft, Search, Sparkles, SquarePen, X } from "lucide-react";
import ModalWrapper from "../wrapper/ModalWrapper";
import BriksyLogo from "../../assets/logo/loaderbg.svg";
import { askBriksyAi } from "../../api/clients.api";
import ChatMessage, { type ChatMessageItem } from "./ChatMessage";
import AiSidebar, { type ChatSession } from "./AiSidebar";

const STORAGE_KEY = "briksy_ai_chat_sessions_v1";
let _id = 0;
const uid = (p = "ai") => `${p}-${Date.now()}-${++_id}`;

const PROMPTS = [
  "3-bedroom house in Richmond under $1.2M",
  "2-bedroom apartments for rent in Melbourne",
  "Verified custom home builders near me",
  "Licensed landscapers & trades",
];

const readSessions = (): ChatSession[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeSessions = (s: ChatSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (err) {
    console.error("Storage error", err);
  }
};

export default function AiModeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const openedPath = useRef(location.pathname);

  const [sessions, setSessions] = useState<ChatSession[]>(readSessions);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeSession = sessions.find((s) => s.id === activeId);
  const messages = activeSession?.messages || [];

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      openedPath.current = location.pathname;
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen, location.pathname]);

  useEffect(() => {
    if (isOpen && location.pathname !== openedPath.current) onClose();
  }, [isOpen, location.pathname, onClose]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const updateSessions = (fn: (prev: ChatSession[]) => ChatSession[]) => {
    setSessions((prev) => {
      const next = fn(prev);
      writeSessions(next);
      return next;
    });
  };

  const handleNewChat = () => {
    setActiveId(null);
    setInput("");
    setError("");
    setBusy(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const submit = async (query = input) => {
    const q = query.trim();
    if (!q || busy) return;

    setInput("");
    setError("");
    setBusy(true);

    const userMsg: ChatMessageItem = { id: uid("u"), role: "user", content: q, recommendations: [] };
    const thinkId = uid("t");
    const thinkMsg: ChatMessageItem = { id: thinkId, role: "assistant", content: "", recommendations: [], thinking: true };

    let targetId = activeId;

    if (!targetId) {
      targetId = uid("chat");
      const title = q.length > 36 ? `${q.slice(0, 36)}…` : q;
      const newSession: ChatSession = {
        id: targetId,
        title,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [userMsg, thinkMsg],
      };
      updateSessions((prev) => [newSession, ...prev]);
      setActiveId(targetId);
    } else {
      updateSessions((prev) =>
        prev.map((s) => (s.id === targetId ? { ...s, updatedAt: Date.now(), messages: [...s.messages, userMsg, thinkMsg] } : s))
      );
    }

    try {
      const res = await askBriksyAi(q);
      updateSessions((prev) =>
        prev.map((s) =>
          s.id === targetId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === thinkId ? { ...m, thinking: false, content: res.answer, recommendations: res.recommendations ?? [], recsVisible: true } : m
                ),
              }
            : s
        )
      );
    } catch {
      setError("Briksy AI is temporarily unavailable. Please try again.");
      updateSessions((prev) =>
        prev.map((s) => (s.id === targetId ? { ...s, messages: s.messages.filter((m) => m.id !== thinkId) } : s))
      );
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const idle = messages.length === 0;

  return (
    <ModalWrapper isOpen={isOpen}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Briksy AI Chat"
        data-lenis-prevent
        className="fixed inset-0 z-[90] flex overflow-hidden bg-white-50 font-helvetica text-primary-brown animate-in fade-in duration-200"
      >
        <AiSidebar
          sessions={sessions}
          activeSessionId={activeId}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectSession={setActiveId}
          onTogglePin={(id) => updateSessions((p) => p.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s)))}
          onRenameSession={(id, title) => updateSessions((p) => p.map((s) => (s.id === id ? { ...s, title } : s)))}
          onDeleteSession={(id) => {
            updateSessions((p) => p.filter((s) => s.id !== id));
            if (activeId === id) setActiveId(null);
          }}
        />

        <div className="relative flex h-full min-w-0 flex-1 flex-col bg-white-50">
          <header className="flex shrink-0 items-center justify-between border-b border-white-100/70 px-4 py-3 md:px-8">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSidebarOpen((p) => !p)}
                aria-label="Toggle sidebar"
                className="rounded-lg p-1.5 text-primary-light-brown hover:bg-white-100 hover:text-primary-brown cursor-pointer"
              >
                <PanelLeft size={19} />
              </button>
              <button
                type="button"
                onClick={handleNewChat}
                aria-label="New chat"
                className="rounded-lg p-1.5 text-primary-light-brown hover:bg-white-100 md:hidden cursor-pointer"
              >
                <SquarePen size={18} />
              </button>
              <span className="truncate max-w-[200px] sm:max-w-[320px] text-[13.5px] font-semibold text-primary-brown">
                {activeSession?.title || "Briksy AI"}
              </span>
              <span className="rounded-full bg-primary-bleach px-[7px] py-[2px] text-[10.5px] font-medium text-primary-brown">
                Beta
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Briksy AI"
              className="rounded-full p-2 text-primary-light-brown hover:bg-primary-bleach/40 hover:text-primary-brown cursor-pointer"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
          </header>

          <div data-lenis-prevent className="scrollbar-custom flex-1 overflow-y-auto">
            <div className="mx-auto flex min-h-full max-w-3xl lg:max-w-4xl flex-col px-4 py-6 md:px-6">
              {idle ? (
                <div className="my-auto flex flex-col items-start py-8">
                  <img src={BriksyLogo} alt="Briksy" className="mb-5 h-12 w-auto object-contain sm:h-14" />
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} />
                    <span className="text-[13.5px] font-medium">Briksy AI</span>
                    <span className="rounded-full bg-primary-bleach px-[8px] py-[2px] text-[11px]">Beta</span>
                  </div>
                  <h2 className="mt-3 text-[24px] font-medium leading-tight tracking-tight sm:text-[30px]">
                    Property &amp; Pro Search, Made Easy.
                  </h2>
                  <p className="mt-2.5 max-w-lg text-[15px] leading-relaxed text-primary-light-brown">
                    Ask in plain English for homes to buy or rent, verified builders, agents, or licensed local trades across Australia.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => submit(p)}
                        className="rounded-full border border-white-100 bg-white px-3.5 py-1.5 text-[12.5px] text-primary-brown hover:border-primary-brown cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {messages.map((m) => (
                    <ChatMessage key={m.id} msg={m} onNeedHelp={() => { onClose(); navigate("/help"); }} />
                  ))}
                </div>
              )}
              {error && <p className="mt-4 text-center text-[13px] text-red-600">{error}</p>}
              <div ref={bottomRef} className="h-2 shrink-0" />
            </div>
          </div>

          <footer className="shrink-0 border-t border-white-100/70 px-4 py-3.5 md:px-8">
            <div className="mx-auto max-w-3xl lg:max-w-4xl flex flex-col gap-2.5">
              <form
                onSubmit={(e) => { e.preventDefault(); submit(); }}
                className="flex items-center gap-2.5 rounded-full border border-white-100 bg-white px-3.5 py-2 shadow-2xs focus-within:shadow-md focus-within:border-primary-bleach"
              >
                <Sparkles size={16} className="shrink-0 opacity-40 text-primary-brown" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={idle ? "Ask Briksy AI anything…" : "Ask a follow-up…"}
                  disabled={busy}
                  className="min-w-0 flex-1 bg-transparent text-[14.5px] text-primary-brown outline-none placeholder:opacity-40"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-brown px-4 py-2 text-[12.5px] font-medium text-white-50 hover:opacity-90 disabled:opacity-45 cursor-pointer"
                >
                  <Search size={14} />
                  <span>{busy ? "Thinking…" : "Ask"}</span>
                </button>
              </form>
              <p className="text-center text-[11px] text-primary-light-brown">
                AI answers are built from verified profile data and public licence records. Prices are indicative — always confirm with the provider.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </ModalWrapper>
  );
}
