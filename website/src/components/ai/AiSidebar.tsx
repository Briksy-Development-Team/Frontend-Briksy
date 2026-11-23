/**
 * AiSidebar.tsx — Exact Figma-matched lean sidebar for Briksy AI.
 * ponytail: collapses cleanly with zero-width transition matching Figma #4847:24283.
 */
import { useEffect, useState } from "react";
import {
  Check,
  History,
  MoreHorizontal,
  PanelLeftClose,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import { getStoredAuth } from "../../auth/auth.storage";
import type { ChatMessageItem } from "./ChatMessage";

export interface ChatSession {
  id: string;
  title: string;
  pinned?: boolean;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessageItem[];
}

interface Props {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onTogglePin: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  onRequestDelete?: (session: ChatSession) => void;
}

function groupSessions(sessions: ChatSession[]) {
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const startOfYesterday = startOfToday - 86400000;
  const startOf7Days = startOfToday - 7 * 86400000;

  return {
    today: sessions.filter((s) => (s.updatedAt || s.createdAt) >= startOfToday),
    yesterday: sessions.filter((s) => {
      const t = s.updatedAt || s.createdAt;
      return t >= startOfYesterday && t < startOfToday;
    }),
    previous7Days: sessions.filter((s) => {
      const t = s.updatedAt || s.createdAt;
      return t >= startOf7Days && t < startOfYesterday;
    }),
    older: sessions.filter((s) => (s.updatedAt || s.createdAt) < startOf7Days),
  };
}

export default function AiSidebar({
  sessions,
  activeSessionId,
  isOpen,
  onClose,
  onNewChat,
  onSelectSession,
  onTogglePin,
  onRenameSession,
  onDeleteSession,
  onRequestDelete,
}: Props) {
  const user = getStoredAuth()?.user;
  const userName = user?.name || user?.display_name || "Briksy Seeker";
  const userRole = user?.roles?.[0] || "Seeker";
  const initials = (userName.match(/\b\w/g)?.slice(0, 2).join("") || "BS").toUpperCase();

  const pinned = sessions.filter((s) => s.pinned);
  const recents = sessions.filter((s) => !s.pinned);
  const { today, yesterday, previous7Days, older } = groupSessions(recents);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        onNewChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewChat]);

  const select = (id: string) => {
    onSelectSession(id);
    if (typeof window !== "undefined" && window.innerWidth < 768) onClose();
  };

  const renderGroup = (label: string, items: ChatSession[], icon?: React.ReactNode) =>
    items.length > 0 && (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5 px-2.5 pt-3 pb-1 text-[12px] font-medium uppercase tracking-[0.1em] text-[#8B6F54]">
          {icon}
          <span>{label}</span>
        </div>
        <ul className="flex flex-col gap-0.5">
          {items.map((s) => (
            <SessionItem
              key={s.id}
              session={s}
              isActive={s.id === activeSessionId}
              onSelect={() => select(s.id)}
              onTogglePin={() => onTogglePin(s.id)}
              onRename={(t) => onRenameSession(s.id, t)}
              onDelete={() => (onRequestDelete ? onRequestDelete(s) : onDeleteSession(s.id))}
            />
          ))}
        </ul>
      </div>
    );

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="absolute inset-0 z-20 bg-[#342511]/25 backdrop-blur-xs md:hidden" />
      )}

      <aside
        className={`z-30 flex flex-col font-helvetica transition-all duration-300 ease-in-out absolute inset-y-0 left-0 bg-[#F8F4EE] shadow-2xl md:shadow-none md:static md:pointer-events-auto ${
          isOpen
            ? "translate-x-0 w-[272px] md:w-[272px] md:border-r md:border-[#EBEBEB] opacity-100"
            : "-translate-x-full pointer-events-none md:translate-x-0 md:w-0 md:border-0 md:opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex h-full w-[272px] shrink-0 flex-col bg-[#F8F4EE]">
          {/* Brand Row */}
          <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#EBEBEB] px-3.5">
            <div className="flex items-center gap-2 pl-1">
              <span className="text-[14px] font-medium leading-5 text-[#342511]">Briksy AI</span>
              <span className="rounded-full bg-[#E2CBB3] px-2 py-0.5 text-[12px] font-medium leading-[1.5em] text-[#342511]">
                Beta
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Collapse sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7C5F42] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <PanelLeftClose size={16} strokeWidth={1.75} />
            </button>
          </div>

          {/* Recents Container */}
          <div className="flex flex-1 flex-col overflow-hidden p-3 gap-3">
            <button
              type="button"
              onClick={() => {
                onNewChat();
                if (typeof window !== "undefined" && window.innerWidth < 768) onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl border border-[#EBEBEB] bg-white p-3 text-[14px] font-medium text-[#342511] shadow-2xs hover:border-[#342511]/30 hover:shadow-xs transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Plus size={18} className="text-[#342511]" strokeWidth={1.75} />
                <span>New chat</span>
              </span>
              <span className="text-[12px] font-medium text-[#7C5F42]/60 tracking-wider">⌘N</span>
            </button>

            <div className="scrollbar-custom flex-1 overflow-y-auto">
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#EBEBEB] p-5 text-center gap-2 mt-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#7C5F42] shadow-2xs">
                    <History size={18} strokeWidth={1.75} />
                  </div>
                  <p className="text-[14px] font-medium text-[#342511]">No chats yet</p>
                  <p className="text-[12px] leading-relaxed text-[#7C5F42]">
                    Your conversations will be saved here so you can pick up any search later.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1 pb-2">
                  {renderGroup("Pinned", pinned, <Pin size={11} className="rotate-45" />)}
                  {renderGroup("TODAY", today)}
                  {renderGroup("YESTERDAY", yesterday)}
                  {renderGroup("PREVIOUS 7 DAYS", previous7Days)}
                  {renderGroup("OLDER", older)}
                </div>
              )}
            </div>
          </div>

          {/* User profile footer */}
          <div className="shrink-0 border-t border-[#EBEBEB] p-3">
            <div className="flex items-center gap-2.5 p-1 rounded-xl transition-colors hover:bg-white/60">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={userName} className="h-9 w-9 rounded-full object-cover border border-[#EBEBEB]" />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#342511] text-[13px] font-medium text-white shadow-2xs">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-[#342511]">{userName}</p>
                <p className="truncate text-[12px] text-[#7C5F42]">{userRole} · Australia</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function SessionItem({
  session,
  isActive,
  onSelect,
  onTogglePin,
  onRename,
  onDelete,
}: {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(session.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const saveRename = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== session.title) onRename(trimmed);
    setEditing(false);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?chat=${session.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedShare(true);
    setTimeout(() => {
      setCopiedShare(false);
      setMenuOpen(false);
    }, 800);
  };

  if (editing) {
    return (
      <li className="relative px-1 py-0.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveRename();
          }}
          className="flex w-full items-center justify-between gap-1.5 rounded-lg border-[1.5px] border-[#E05A38] bg-white px-2.5 py-1.5 shadow-2xs"
        >
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setEditing(false);
                setTitle(session.title);
              }
            }}
            onBlur={saveRename}
            className="w-full min-w-0 bg-transparent text-[14px] leading-5 text-[#342511] outline-none"
          />
          <button
            type="submit"
            onMouseDown={(e) => {
              e.preventDefault();
              saveRename();
            }}
            aria-label="Confirm rename"
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[8px] bg-[#E2CBB3]/40 hover:bg-[#E2CBB3] text-[#342511] transition-colors cursor-pointer"
          >
            <Check size={14} strokeWidth={2.5} />
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="group relative">
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[14px] leading-5 tracking-[0.03em] transition-colors cursor-pointer hover:bg-[#E2CBB3]/45 ${
          isActive || menuOpen ? "bg-[#E2CBB3]/45 font-medium text-[#342511]" : "text-[#342511]"
        }`}
      >
        <span className="truncate pr-2">{session.title}</span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((p) => !p);
          }}
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[8px] border border-[#EBEBEB] bg-white text-[#342511] shadow-2xs transition-opacity cursor-pointer ${
            isActive || menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <MoreHorizontal size={14} />
        </span>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full z-30 mt-1 w-[200px] rounded-xl border border-[#EBEBEB] bg-white p-1.5 shadow-xl flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => { setMenuOpen(false); onTogglePin(); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[14px] text-[#342511] hover:bg-[#F8F4EE] transition-colors cursor-pointer"
            >
              {session.pinned ? <PinOff size={15} /> : <Pin size={15} className="rotate-45 text-[#7C5F42]" />}
              <span>{session.pinned ? "Unpin" : "Pin to top"}</span>
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); setEditing(true); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[14px] text-[#342511] hover:bg-[#F8F4EE] transition-colors cursor-pointer"
            >
              <Pencil size={15} className="text-[#7C5F42]" />
              <span>Rename</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[14px] text-[#342511] hover:bg-[#F8F4EE] transition-colors cursor-pointer"
            >
              <Share2 size={15} className="text-[#7C5F42]" />
              <span>{copiedShare ? "Link copied!" : "Share link"}</span>
            </button>
            <div className="my-1 border-t border-[#EBEBEB]" />
            <button
              type="button"
              onClick={() => { setMenuOpen(false); onDelete(); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[14px] text-[#B42318] hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </li>
  );
}
