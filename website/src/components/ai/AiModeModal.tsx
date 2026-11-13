
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PanelLeft,
  Search,
  Sparkles,
  SquarePen,
  X,
} from "lucide-react";
import ModalWrapper from "../wrapper/ModalWrapper";
import BriksyLogo from "../../assets/logo/loaderbg.svg";
import { askBriksyAi } from "../../api/clients.api";
import ChatMessage, { type ChatMessageItem } from "./ChatMessage";
import AiSidebar, { type ChatSession } from "./AiSidebar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "briksy_ai_chat_sessions_v1";

let _idCounter = 0;
const uid = (prefix = "ai") => `${prefix}-${Date.now()}-${++_idCounter}`;

const QUICK_PROMPTS = [
  "3-bedroom house in Richmond under $1.2M",
  "2-bedroom apartments for rent in Melbourne",
  "Verified custom home builders near me",
  "Licensed landscapers & trades",
];

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatSession[];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error("Failed to save chat sessions", err);
  }
}

export default function AiModeModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const openedPathRef = useRef(location.pathname);

  // Sessions state
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Active chat state
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession ? activeSession.messages : [];

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-collapse sidebar on smaller screens on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  // Sync opened path and auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      openedPathRef.current = location.pathname;
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, location.pathname]);

  // When location changes while modal is open (e.g. user clicked on a card Link), close modal
  useEffect(() => {
    if (isOpen && location.pathname !== openedPathRef.current) {
      onClose();
    }
  }, [isOpen, location.pathname, onClose]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  // Session Handlers
  const handleNewChat = () => {
    setActiveSessionId(null);
    setInput("");
    setError("");
    setBusy(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setInput("");
    setError("");
    setBusy(false);
  };

  const handleTogglePin = (id: string) => {
    setSessions((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s));
      saveSessions(next);
      return next;
    });
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s));
      saveSessions(next);
      return next;
    });
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSessions(next);
      return next;
    });
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  };

  const idle = messages.length === 0;

  const submit = async (query = input) => {
    const q = query.trim();
    if (!q || busy) return;

    setInput("");
    setError("");
    setBusy(true);

    const userMsg: ChatMessageItem = {
      id: uid("msg-user"),
      role: "user",
      content: q,
      recommendations: [],
      thinking: false,
    };

    const thinkId = uid("msg-think");
    const thinkMsg: ChatMessageItem = {
      id: thinkId,
      role: "assistant",
      content: "",
      recommendations: [],
      thinking: true,
      recsVisible: false,
    };

    let targetSessionId = activeSessionId;

    // Create session if starting a new chat
    if (!targetSessionId) {
      targetSessionId = uid("chat");
      const newTitle = q.length > 36 ? `${q.slice(0, 36)}…` : q;
      const newSession: ChatSession = {
        id: targetSessionId,
        title: newTitle,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [userMsg, thinkMsg],
      };

      setSessions((prev) => {
        const next = [newSession, ...prev];
        saveSessions(next);
        return next;
      });
      setActiveSessionId(targetSessionId);
    } else {
      setSessions((prev) => {
        const next = prev.map((s) =>
          s.id === targetSessionId
            ? {
                ...s,
                updatedAt: Date.now(),
                messages: [...s.messages, userMsg, thinkMsg],
              }
            : s
        );
        saveSessions(next);
        return next;
      });
    }

    try {
      const result = await askBriksyAi(q);

      setSessions((prev) => {
        const next = prev.map((s) => {
          if (s.id !== targetSessionId) return s;
          return {
            ...s,
            updatedAt: Date.now(),
            messages: s.messages.map((m) =>
              m.id === thinkId
                ? {
                    ...m,
                    thinking: false,
                    content: result.answer,
                    recommendations: result.recommendations ?? [],
                  }
                : m
            ),
          };
        });
        saveSessions(next);
        return next;
      });

      // Subtle delayed entrance for recommendations
      setTimeout(() => {
        setSessions((prev) => {
          const next = prev.map((s) => {
            if (s.id !== targetSessionId) return s;
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === thinkId ? { ...m, recsVisible: true } : m
              ),
            };
          });
          saveSessions(next);
          return next;
        });
      }, 150);
    } catch {
      setError("Briksy AI is temporarily unavailable. Please try again.");
      setSessions((prev) => {
        const next = prev.map((s) => {
          if (s.id !== targetSessionId) return s;
          return {
            ...s,
            messages: s.messages.filter((m) => m.id !== thinkId),
          };
        });
        saveSessions(next);
        return next;
      });
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleNeedHelp = () => {
    onClose();
    navigate("/help");
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Briksy AI Chat"
        data-lenis-prevent
        className="fixed inset-0 z-[90] flex overflow-hidden bg-white-50 font-helvetica text-primary-brown animate-in fade-in duration-200"
      >
        {/* Left Sidebar (ChatGPT-style history, pinned, new chat, user profile) */}
        <AiSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onTogglePin={handleTogglePin}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
        />

        {/* Main Chat Area */}
        <div className="flex flex-1 min-w-0 flex-col h-full bg-white-50 relative">
          {/* Top Header */}
          <header className="shrink-0 border-b border-white-100/70 px-4 py-3 md:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Toggle sidebar button */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                  className="rounded-lg p-1.5 text-primary-light-brown transition-colors hover:bg-white-100 hover:text-primary-brown cursor-pointer"
                >
                  <PanelLeft size={19} />
                </button>

                {/* Mobile / Quick New Chat button */}
                <button
                  type="button"
                  onClick={handleNewChat}
                  aria-label="New chat"
                  className="rounded-lg p-1.5 text-primary-light-brown transition-colors hover:bg-white-100 hover:text-primary-brown cursor-pointer md:hidden"
                >
                  <SquarePen size={18} />
                </button>

                {/* Chat Title / Brand */}
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold text-primary-brown truncate max-w-[200px] sm:max-w-[320px]">
                    {activeSession ? activeSession.title : "Briksy AI"}
                  </span>
                  <span className="rounded-full bg-primary-bleach px-[7px] py-[2px] text-[10.5px] font-medium text-primary-brown">
                    Beta
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Briksy AI"
                className="rounded-full p-2 text-primary-light-brown transition-colors hover:bg-primary-bleach/40 hover:text-primary-brown cursor-pointer"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
          </header>

          {/* Conversation Stream */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent
            className="scrollbar-custom flex-1 overflow-y-auto"
          >
            <div className="mx-auto flex min-h-full max-w-3xl lg:max-w-4xl flex-col px-4 py-6 md:px-6">
              {idle ? (
                <div className="my-auto flex flex-col items-start py-8">
                  <img
                    src={BriksyLogo}
                    alt="Briksy"
                    className="mb-5 h-12 w-auto object-contain sm:h-14"
                  />
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} />
                    <span className="text-[13.5px] font-medium">Briksy AI</span>
                    <span className="rounded-full bg-primary-bleach px-[8px] py-[2px] text-[11px]">
                      Beta
                    </span>
                  </div>
                  <h2 className="mt-3 text-[24px] font-medium leading-tight tracking-tight sm:text-[30px]">
                    Property &amp; Pro Search, Made Easy.
                  </h2>
                  <p className="mt-2.5 max-w-lg text-[15px] leading-relaxed text-primary-light-brown">
                    Ask in plain English for homes to buy or rent, verified builders, agents, or licensed local trades across Australia.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => submit(p)}
                        className="rounded-full border border-white-100 bg-white px-3.5 py-1.5 text-[12.5px] text-primary-brown transition-colors hover:border-primary-brown cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} msg={msg} onNeedHelp={handleNeedHelp} />
                  ))}
                </div>
              )}

              {error && (
                <p className="mt-4 text-center text-[13px] text-red-600">{error}</p>
              )}

              <div ref={bottomRef} className="h-2 shrink-0" />
            </div>
          </div>

          {/* Pinned Bottom Input */}
          <footer className="shrink-0 border-t border-white-100/70 px-4 py-3.5 md:px-8">
            <div className="mx-auto max-w-3xl lg:max-w-4xl flex flex-col gap-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="flex items-center gap-2.5 rounded-full border border-white-100 bg-white px-3.5 py-2 shadow-2xs transition-shadow focus-within:shadow-md focus-within:border-primary-bleach"
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
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-brown px-4 py-2 text-[12.5px] font-medium text-white-50 transition-opacity hover:opacity-90 disabled:opacity-45 cursor-pointer"
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
