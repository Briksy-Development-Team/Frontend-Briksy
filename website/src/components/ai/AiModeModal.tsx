/**
 * AiModeModal.tsx — Briksy AI Modal dialog.
 * Exact match for Figma:
 * - "01 Welcome — empty history" (#4847:24181)
 * - "02 Typing — sidebar collapsed" (#4847:24283)
 */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, ArrowUpRight, Check, PanelLeft, RotateCw, Search, Square, Trash2, WifiOff, X } from "lucide-react";
import ModalWrapper from "../wrapper/ModalWrapper";
import LogoM from "../../assets/logo/logomobile.svg";
import { askBriksyAi } from "../../api/clients.api";
import ChatMessage, { type ChatMessageItem } from "./ChatMessage";
import AiSidebar, { type ChatSession } from "./AiSidebar";
import type { AuthUser } from "../../auth/auth.types";
import { useAuth } from "../../auth/AuthContext";

const STORAGE_KEY = "briksy_ai_chat_sessions_v2";
let _id = 0;
const uid = (p = "ai") => `${p}-${Date.now()}-${++_id}`;

const PROMPT_POOLS = [
  ["3-bed house in Richmond under $1.2M", "2-bed apartments to rent in Melbourne", "Verified custom home builders near me", "Licensed landscapers in Brunswick"],
  ["Top rated buyer agents in Sydney", "Townhouses for sale near public schools", "Renovation builders with active licences", "Commercial properties under $2M in Brisbane"],
  ["Modern apartments with balcony in South Yarra", "Verified electrical contractors in Perth", "Family homes with pool under $1.5M", "Architectural designers in Melbourne"],
];

const readSessions = (storageKey: string): ChatSession[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s: ChatSession) => !s.id?.startsWith("seed-")) : [];
  } catch {
    return [];
  }
};

const writeSessions = (storageKey: string, s: ChatSession[]) => {
  try { localStorage.setItem(storageKey, JSON.stringify(s)); } catch {}
};

const OfflineBanner = () => (
  <div className="flex items-center gap-2.5 rounded-xl bg-[#FBEFD5] px-3.5 py-2.5 text-[#8A5A00] text-left">
    <WifiOff size={18} className="shrink-0 text-[#8A5A00]" />
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-[12px] leading-snug">
      <span className="font-medium text-[13px]">You’re offline</span>
      <span className="opacity-90">Messages will send automatically when you reconnect. Search results may be out of date.</span>
    </div>
  </div>
);

type ModalProps = { isOpen: boolean; onClose: () => void };

export default function AiModeModal(props: ModalProps) {
  const { user, isAuthenticated, isBootstrapping } = useAuth();
  const account = !isBootstrapping && isAuthenticated && user?.id ? user : null;
  const storageKey = account ? `${STORAGE_KEY}:${account.id}` : null;

  return <AiChat key={storageKey ?? "guest"} {...props} user={account} storageKey={storageKey} />;
}

function AiChat({ isOpen, onClose, user, storageKey }: ModalProps & {
  user: AuthUser | null;
  storageKey: string | null;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const openedPath = useRef(location.pathname);

  const [sessions, setSessions] = useState<ChatSession[]>(() => storageKey ? readSessions(storageKey) : []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const [toast, setToast] = useState<{
    id: string;
    text: string;
    icon?: "check" | "alert";
    actionLabel?: string;
    onAction?: () => void;
    onUndo?: () => void;
  } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  const activeSession = sessions.find((s) => s.id === activeId);
  const messages = activeSession?.messages || [];

  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [poolIndex, setPoolIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const followUpRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleStop = () => {
    abortRef.current?.abort();
    setBusy(false);
    updateSessions((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, messages: s.messages.filter((m) => !m.thinking) } : s))
    );
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    const prevSession = sessions.find((s) => s.id === id);
    const prevTitle = prevSession?.title || "";
    if (!newTitle || newTitle === prevTitle) return;

    updateSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s))
    );

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({
      id,
      text: "Chat renamed",
      onUndo: () => {
        updateSessions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, title: prevTitle } : s))
        );
        setToast(null);
      },
    });
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 5000);
  };

  const handleRegenerate = async (msgId: string) => {
    if (busy) return;
    const session = sessions.find((s) => s.id === activeId);
    if (!session) return;
    const idx = session.messages.findIndex((m) => m.id === msgId);
    if (idx < 0) return;

    const userMsg = session.messages.slice(0, idx).reverse().find((m) => m.role === "user");
    if (!userMsg) return;

    setBusy(true);
    setError("");
    const controller = new AbortController();
    abortRef.current = controller;

    updateSessions((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === msgId
                  ? { ...m, thinking: true, content: "", recommendations: [], recsVisible: false }
                  : m
              ),
            }
          : s
      )
    );

    try {
      const res = await askBriksyAi(userMsg.content, controller.signal);
      if (controller.signal.aborted) return;
      updateSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === msgId
                    ? {
                        ...m,
                        thinking: false,
                        content: res.answer,
                        recommendations: res.recommendations ?? [],
                        recsVisible: true,
                        feedback: undefined,
                      }
                    : m
                ),
              }
            : s
        )
      );
    } catch {
      if (controller.signal.aborted) return;
      setError("Briksy AI is temporarily unavailable. Please try again.");
      updateSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === msgId ? { ...m, thinking: false } : m
                ),
              }
            : s
        )
      );
    } finally {
      setBusy(false);
    }
  };

  const handleFeedback = (msgId: string, val: "like" | "dislike") => {
    let newFeedback: "like" | "dislike" | undefined;
    updateSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeId) return s;
        return {
          ...s,
          messages: s.messages.map((m) => {
            if (m.id !== msgId) return m;
            newFeedback = m.feedback === val ? undefined : val;
            return { ...m, feedback: newFeedback };
          }),
        };
      })
    );

    if (newFeedback) {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToast({
        id: msgId,
        text: newFeedback === "like" ? "Marked as helpful" : "Feedback submitted",
      });
      toastTimeoutRef.current = window.setTimeout(() => setToast(null), 3000);
    }
  };

  const retry = (msg: ChatMessageItem) => {
    updateSessions((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, messages: s.messages.filter((m) => m.id !== msg.id) } : s))
    );
    submit(msg.content);
  };

  useEffect(() => {
    const fn = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", fn);
    window.addEventListener("offline", fn);
    return () => {
      window.removeEventListener("online", fn);
      window.removeEventListener("offline", fn);
    };
  }, []);

  useEffect(() => {
    if (storageKey) writeSessions(storageKey, sessions);
  }, [storageKey, sessions]);

  useEffect(() => () => {
    abortRef.current?.abort();
    if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      openedPath.current = location.pathname;
      const t = setTimeout(() => (messages.length ? followUpRef : textareaRef).current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen, location.pathname, messages.length]);

  useEffect(() => {
    if (isOpen && location.pathname !== openedPath.current) onClose();
  }, [isOpen, location.pathname, onClose]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const updateSessions = (fn: (prev: ChatSession[]) => ChatSession[]) => {
    setSessions(fn);
  };

  const handleNewChat = () => {
    abortRef.current?.abort();
    setActiveId(null);
    setInput("");
    setError("");
    setBusy(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const submit = async (query = input, forceNew = false) => {
    const q = query.trim();
    if (!q || (busy && !forceNew)) return;
    if (forceNew) abortRef.current?.abort();

    setInput("");
    setError("");

    const isOff = typeof navigator !== "undefined" && !navigator.onLine;
    const userMsg: ChatMessageItem = { id: uid("u"), role: "user", content: q, recommendations: [], failed: isOff };
    const thinkId = uid("t");
    const thinkMsg: ChatMessageItem = { id: thinkId, role: "assistant", content: "", recommendations: [], thinking: true };

    let targetId = forceNew ? null : activeId;
    if (!targetId) {
      targetId = uid("chat");
      updateSessions((prev) => [
        { id: targetId!, title: q.slice(0, 36), createdAt: Date.now(), updatedAt: Date.now(), messages: isOff ? [userMsg] : [userMsg, thinkMsg] },
        ...prev,
      ]);
      setActiveId(targetId);
    } else {
      updateSessions((prev) =>
        prev.map((s) => (s.id === targetId ? { ...s, updatedAt: Date.now(), messages: [...s.messages, userMsg, ...(isOff ? [] : [thinkMsg])] } : s))
      );
    }

    if (isOff) {
      setBusy(false);
      setToast({ id: uid("err"), text: "Couldn’t reach Briksy AI. Please try again.", icon: "alert", actionLabel: "Retry", onAction: () => retry(userMsg) });
      return;
    }

    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await askBriksyAi(q, controller.signal);
      if (controller.signal.aborted) return;
      updateSessions((prev) =>
        prev.map((s) =>
          s.id === targetId
            ? {
                ...s,
                messages: s.messages.map((m) =>
                  m.id === thinkId
                    ? { ...m, thinking: false, content: res.answer, recommendations: res.recommendations ?? [], recsVisible: true }
                    : m
                ),
              }
            : s
        )
      );
    } catch {
      if (controller.signal.aborted) return;
      updateSessions((prev) =>
        prev.map((s) =>
          s.id === targetId
            ? {
                ...s,
                messages: s.messages
                  .filter((m) => m.id !== thinkId)
                  .map((m) => (m.id === userMsg.id ? { ...m, failed: true } : m)),
              }
            : s
        )
      );
      setToast({ id: uid("err"), text: "Couldn’t reach Briksy AI. Please try again.", icon: "alert", actionLabel: "Retry", onAction: () => retry(userMsg) });
    } finally {
      if (abortRef.current === controller) {
        setBusy(false);
        setTimeout(() => followUpRef.current?.focus(), 50);
      }
    }
  };

  const askRef = useRef({ submit, handleNewChat });
  askRef.current = { submit, handleNewChat };
  useEffect(() => {
    const onAsk = (e: Event) => {
      const q = (e as CustomEvent<string>).detail?.trim();
      if (q) askRef.current.submit(q, true);
      else askRef.current.handleNewChat();
    };
    window.addEventListener("briksy:ai-ask", onAsk);
    return () => window.removeEventListener("briksy:ai-ask", onAsk);
  }, []);

  const idle = messages.length === 0;
  const currentPrompts = PROMPT_POOLS[poolIndex] || PROMPT_POOLS[0];
  const hasText = input.trim().length > 0;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Briksy AI Chat"
        data-lenis-prevent
        className="relative flex overflow-hidden h-[90vh] w-[90vw] max-w-7xl rounded-[24px] bg-[#F8F4EE] font-helvetica text-[#342511] shadow-2xl my-auto border border-[#EBEBEB]"
      >
        <AiSidebar
          user={user}
          onLogin={() => {
            onClose();
            navigate("/login", { state: { from: location.pathname + location.search } });
          }}
          sessions={user ? sessions : []}
          activeSessionId={activeId}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectSession={setActiveId}
          onTogglePin={(id) => updateSessions((p) => p.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s)))}
          onRenameSession={handleRenameSession}
          onDeleteSession={(id) => {
            updateSessions((p) => p.filter((s) => s.id !== id));
            if (activeId === id) setActiveId(null);
          }}
          onRequestDelete={(s) => setSessionToDelete(s)}
        />

        {/* Toast Notification (Figma #4847:25571 / #4847:26106) */}
        {toast && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-[#342511] px-3.5 py-2.5 text-[13px] text-white shadow-2xl animate-fade-in font-helvetica select-none border border-white/10">
            {toast.icon === "alert" ? (
              <AlertCircle size={16} strokeWidth={2.5} className="text-[#F97066] shrink-0" />
            ) : (
              <Check size={16} strokeWidth={2.5} className="text-white shrink-0" />
            )}
            <span className="font-normal text-white">{toast.text}</span>
            {toast.actionLabel && toast.onAction && (
              <button
                type="button"
                onClick={toast.onAction}
                className="font-medium text-[#E2CBB3] hover:underline cursor-pointer"
              >
                {toast.actionLabel}
              </button>
            )}
            {toast.onUndo && (
              <button
                type="button"
                onClick={toast.onUndo}
                className="font-medium text-[#E2CBB3] hover:underline cursor-pointer"
              >
                Undo
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
                setToast(null);
              }}
              aria-label="Dismiss notification"
              className="text-white/60 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Right Main Container (Figma fills=White, node #4847:24284) */}
        <div className="relative flex h-full min-w-0 flex-1 flex-col bg-white">
          {/* Header Row (#4847:24285) */}
          <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#EBEBEB] px-5">
            <div>
              {!sidebarOpen && (
                /* Figma #4847:24287 IconButton/panel (32x32) */
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  title="Open sidebar"
                  aria-label="Open sidebar"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7C5F42] hover:bg-black/5 hover:text-[#342511] transition-colors cursor-pointer"
                >
                  <PanelLeft size={16} strokeWidth={1.75} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Briksy AI"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#342511] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
          </header>

          <div data-lenis-prevent className="scrollbar-custom flex-1 overflow-y-auto">
            {idle ? (
              /* Figma Welcome & Typing Screen (#4847:24181 / #4847:24283) */
              <div className="flex min-h-full flex-col justify-between p-6 md:p-8">
                <div className="my-auto flex flex-col items-center text-center max-w-[720px] mx-auto w-full py-4">
                  {/* 72x72 squircle emblem (#4847:24300) */}
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-[#342511] shadow-md mb-4">
                    <img src={LogoM} alt="Briksy" className="h-10 w-auto object-contain brightness-0 invert" />
                  </div>
                  <h1 className="text-[30px] font-medium leading-[36px] tracking-[-0.03em] text-[#342511]">
                    Welcome to Briksy
                  </h1>
                  <p className="mt-2 text-[16px] leading-[28px] text-[#7C5F42] max-w-[560px]">
                    Ask in plain English for homes to buy or rent, verified builders and agents, or licensed local trades.
                  </p>

                  {/* Offline Warning Banner (Figma #4847:25815) */}
                  {isOffline && <div className="mt-4 w-full"><OfflineBanner /></div>}

                  {/* Composer (#4847:24307) - adapts when writing */}
                  <div
                    className={`mt-6 w-full rounded-[20px] bg-white p-3.5 transition-all shadow-xs ${
                      hasText || isFocused
                        ? "border border-[#342511] shadow-sm"
                        : "border border-[#EBEBEB] focus-within:border-[#342511]"
                    }`}
                  >
                    <div className="flex gap-2.5 min-h-[72px]">
                      {!hasText && <Search size={20} className="text-[#8B6F54] shrink-0 mt-1" />}
                      <textarea
                        ref={textareaRef}
                        rows={2}
                        maxLength={4000}
                        value={input}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submit();
                          }
                        }}
                        placeholder="Ask about homes, builders, agents or trades…"
                        disabled={busy}
                        className="w-full resize-none bg-transparent text-[16px] leading-[28px] text-[#342511] placeholder:text-[#8B6F54] outline-none"
                      />
                    </div>

                    {/* Toolbar (#4847:24310) */}
                    <div className="flex items-center justify-end gap-3 pt-1">
                      {(hasText || isFocused) && (
                        <span className="text-[12px] font-medium text-[#8B6F54] select-none">
                          {input.length.toLocaleString()} / 4,000
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => submit()}
                        disabled={busy || !hasText}
                        aria-label="Send"
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all cursor-pointer shadow-2xs ${
                          hasText
                            ? "bg-[#342511] text-white hover:opacity-90 active:scale-95"
                            : "bg-[#E2CBB3] text-[#7C5F42] opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <ArrowRight size={18} strokeWidth={2.25} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Section (#4847:24318) */}
                <div className="mt-6 w-full max-w-[720px] mx-auto flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[14px] font-normal tracking-[0.03em] text-[#342511]">Try asking</span>
                    <button
                      type="button"
                      onClick={() => setPoolIndex((p) => (p + 1) % PROMPT_POOLS.length)}
                      className="flex items-center gap-1.5 text-[12px] text-[#8B6F54] hover:text-[#342511] transition-colors cursor-pointer"
                    >
                      <RotateCw size={12} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {currentPrompts.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => submit(p)}
                        className="flex items-center gap-2 rounded-full border border-[#EBEBEB] bg-white px-3.5 py-2 text-[14px] text-[#342511] shadow-2xs hover:border-[#342511] hover:bg-[#F8F4EE] transition-all cursor-pointer"
                      >
                        <ArrowUpRight size={14} className="text-[#7C5F42]" />
                        <span>{p}</span>
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 text-center text-[12px] leading-relaxed text-[#8B6F54]">
                    Briksy AI uses verified profiles and public licence records. Prices are indicative always confirm with the provider.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex min-h-full max-w-3xl lg:max-w-4xl flex-col px-4 py-6 md:px-6">
                <div className="flex flex-col gap-6">
                  {messages.map((m) => (
                    <ChatMessage
                      key={m.id}
                      msg={m}
                      onNavigate={onClose}
                      onRefresh={() => handleRegenerate(m.id)}
                      onFeedback={(val) => handleFeedback(m.id, val)}
                      onRetryUserMsg={() => retry(m)}
                      onEditUserMsg={() => setInput(m.content)}
                      isBusy={busy}
                    />
                  ))}
                </div>
                {error && <p className="mt-4 text-center text-[13px] text-red-600">{error}</p>}
                <div ref={bottomRef} className="h-4 shrink-0" />
              </div>
            )}
          </div>

          {!idle && (
            <footer className="shrink-0 border-t border-[#EBEBEB] bg-white px-4 py-3.5 md:px-8">
              <div className="mx-auto max-w-3xl lg:max-w-4xl flex flex-col gap-2.5">
                {/* Offline Warning Banner (Figma #4847:25815) */}
                {isOffline && <OfflineBanner />}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                  className={`flex items-center gap-2.5 rounded-[20px] bg-white px-3.5 py-3 shadow-xs transition-all ${
                    hasText ? "border border-[#342511] shadow-sm" : "border border-[#EBEBEB] focus-within:border-[#342511]"
                  }`}
                >
                  <Search size={20} className="shrink-0 text-[#8B6F54] ml-0.5" />
                  <input
                    ref={followUpRef}
                    maxLength={4000}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={busy ? "Briksy AI is answering… you can type your next question" : "Ask a follow-up…"}
                    disabled={busy}
                    className="min-w-0 flex-1 bg-transparent text-[15px] text-[#342511] outline-none placeholder:text-[#8B6F54]"
                  />
                  {hasText && !busy && (
                    <span className="text-[12px] font-medium text-[#8B6F54] select-none shrink-0">
                      {input.length.toLocaleString()} / 4,000
                    </span>
                  )}
                  {busy ? (
                    <button
                      type="button"
                      onClick={handleStop}
                      className="flex items-center gap-1.5 rounded-full bg-[#342511] px-3.5 py-1.5 text-[14px] font-medium text-white shadow-2xs hover:opacity-90 transition-all cursor-pointer shrink-0"
                    >
                      <Square size={12} fill="currentColor" strokeWidth={0} />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!hasText}
                      aria-label="Send"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer shadow-2xs ${
                        hasText
                          ? "bg-[#342511] text-white hover:opacity-90 active:scale-95"
                          : "bg-[#E2CBB3] text-[#7C5F42] opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <ArrowRight size={18} strokeWidth={2.25} />
                    </button>
                  )}
                </form>

                <p className="text-center text-[12px] text-[#8B6F54]">
                  Briksy AI uses verified profiles and public licence records. Prices are indicative always confirm with the provider.
                </p>
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (Figma #4847:24930) */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342511]/35 backdrop-blur-xs animate-fade-in font-helvetica">
          <div className="w-full max-w-[440px] rounded-[20px] bg-white p-6 shadow-2xl border border-[#EBEBEB] flex flex-col gap-4 animate-scale-in">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBE7E4] text-[#B42318]">
              <Trash2 size={20} strokeWidth={2} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[20px] font-medium leading-7 text-[#342511]">Delete this chat?</h3>
              <p className="text-[14px] leading-relaxed text-[#7C5F42]">
                “{sessionToDelete.title}” will be deleted for good. Saved results and quotes you’ve requested are kept.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                className="rounded-full border border-[#EBEBEB] bg-white px-5 py-2.5 text-[14px] font-medium text-[#342511] hover:bg-[#F8F4EE] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = sessionToDelete.id;
                  setSessionToDelete(null);
                  updateSessions((p) => p.filter((s) => s.id !== id));
                  if (activeId === id) setActiveId(null);
                }}
                className="flex items-center gap-2 rounded-full bg-[#B42318] px-5 py-2.5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#991B1B] transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Delete chat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}
