/**
 * AiSidebar.tsx — Lean ChatGPT-style sidebar for Briksy AI.
 * ponytail: Replaced duplicated list loops with shared list renderer and self-contained SessionItem.
 */
import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  PanelLeft,
  PanelLeftClose,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Search,
  Sparkles,
  SquarePen,
  Trash2,
  X,
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
  onOpen?: () => void;
  onToggle?: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onTogglePin: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
}

export default function AiSidebar({
  sessions,
  activeSessionId,
  isOpen,
  onClose,
  onOpen,
  onToggle,
  onNewChat,
  onSelectSession,
  onTogglePin,
  onRenameSession,
  onDeleteSession,
}: Props) {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const auth = getStoredAuth();
  const user = auth?.user;
  const userName = user?.name || user?.display_name || "Briksy Seeker";
  const userRole = user?.roles?.[0] || "Seeker";
  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "BS";

  const q = search.trim().toLowerCase();
  const list = q ? sessions.filter((s) => s.title.toLowerCase().includes(q)) : sessions;
  const pinned = list.filter((s) => s.pinned);
  const recents = list.filter((s) => !s.pinned);

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

  const handleExpand = () => {
    if (onOpen) onOpen();
    else if (onToggle) onToggle();
  };

  const renderItems = (items: ChatSession[]) => (
    <ul className="flex flex-col gap-0.5">
      {items.map((s) => (
        <SessionItem
          key={s.id}
          session={s}
          isActive={s.id === activeSessionId}
          onSelect={() => select(s.id)}
          onTogglePin={() => onTogglePin(s.id)}
          onRename={(t) => onRenameSession(s.id, t)}
          onDelete={() => onDeleteSession(s.id)}
        />
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="absolute inset-0 z-20 bg-primary-brown/20 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`z-30 flex flex-col font-helvetica text-primary-brown transition-all duration-300 ease-in-out ${
          // Mobile: absolute slide-out drawer
          "absolute inset-y-0 left-0 bg-white-50 shadow-2xl md:shadow-none " +
          (isOpen ? "translate-x-0 w-72 " : "-translate-x-full pointer-events-none ") +
          // Desktop: static docked rail or expanded sidebar
          "md:static md:translate-x-0 md:pointer-events-auto md:border-r md:border-white-100/70 " +
          (isOpen ? "md:w-72" : "md:w-14")
        }`}
      >
        {/* Expanded View */}
        <div
          className={`flex h-full w-72 shrink-0 flex-col bg-white-50 ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-white-100/70 px-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-brown text-white-50 shadow-xs">
                <Sparkles size={16} />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-primary-brown">Briksy AI</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSearch((p) => !p)}
                aria-label="Search chats"
                className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                  showSearch ? "bg-primary-bleach/50 text-primary-brown" : "text-primary-brown/75 hover:bg-white-100"
                }`}
              >
                <Search size={18} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Collapse sidebar"
                className="rounded-lg p-1.5 text-primary-brown/75 hover:bg-white-100 transition-colors cursor-pointer"
              >
                <PanelLeftClose size={18} strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="shrink-0 p-4 pb-2">
            <button
              type="button"
              onClick={() => {
                onNewChat();
                if (typeof window !== "undefined" && window.innerWidth < 768) onClose();
              }}
              className="flex w-full items-center justify-between rounded-2xl border border-white-100/90 bg-white px-4 py-3.5 text-[14px] text-primary-brown shadow-2xs hover:border-primary-brown/30 hover:shadow-xs transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Plus size={18} className="text-primary-brown/80" strokeWidth={1.75} />
                <span className="font-normal text-primary-brown">New chat</span>
              </span>
              <span className="text-[12px] font-medium text-primary-light-brown/60 tracking-wider">⌘N</span>
            </button>

            {showSearch && (
              <div className="relative mt-2.5">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light-brown" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chats…"
                  className="w-full rounded-xl border border-white-100 bg-white py-2 pl-8 pr-7 text-[12.5px] text-primary-brown outline-none focus:border-primary-brown/40"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-light-brown cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Recents list */}
          <div className="scrollbar-custom flex-1 overflow-y-auto px-3 py-1">
            {pinned.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-light-brown/80">
                  <Pin size={11} className="rotate-45" />
                  <span>Pinned</span>
                </div>
                {renderItems(pinned)}
              </div>
            )}

            <div>
              <div className="mt-3 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-light-brown/80">
                <span>RECENTS</span>
              </div>
              {recents.length === 0 && pinned.length === 0 ? (
                <p className="px-3 py-6 text-center text-[13px] text-primary-light-brown/70 font-normal">
                  {search ? "No matches found" : "No conversation history yet"}
                </p>
              ) : (
                renderItems(recents)
              )}
            </div>
          </div>

          {/* User profile footer */}
          <div className="shrink-0 border-t border-white-100/70 p-3">
            <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white-100/60">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={userName} className="h-9 w-9 rounded-full object-cover border border-white-100" />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-brown text-[12.5px] font-semibold text-white-50">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-primary-brown">{userName}</p>
                <p className="truncate text-[11.5px] capitalize text-primary-light-brown">{userRole}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsed Rail (Visible on desktop when !isOpen: side, newchat, profile) */}
        <div
          className={`h-full w-14 shrink-0 flex-col items-center justify-between bg-white-50 ${
            !isOpen ? "hidden md:flex" : "hidden"
          }`}
        >
          {/* Top: AI icon by default, turns into sidebar toggle bar icon on hover */}
          <div className="flex h-14 w-full shrink-0 items-center justify-center border-b border-white-100/70">
            <button
              type="button"
              onClick={handleExpand}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="group flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white-100 transition-colors cursor-pointer"
            >
              {/* AI Sparkles icon (visible by default, hidden on hover) */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-brown text-white-50 shadow-xs group-hover:hidden transition-all">
                <Sparkles size={15} />
              </div>

              {/* Bar icon (hidden by default, appears on hover) */}
              <div className="hidden group-hover:flex items-center justify-center text-primary-brown transition-all">
                <PanelLeft size={19} strokeWidth={1.75} />
              </div>
            </button>
          </div>

          {/* New Chat Button */}
          <div className="flex flex-1 flex-col items-center p-2.5">
            <button
              type="button"
              onClick={onNewChat}
              title="New chat (⌘N)"
              aria-label="New chat"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-brown/80 hover:bg-white-100 hover:text-primary-brown transition-colors cursor-pointer"
            >
              <SquarePen size={18} strokeWidth={1.75} />
            </button>
          </div>

          {/* Bottom: Profile Avatar */}
          <div className="flex w-full shrink-0 items-center justify-center border-t border-white-100/70 p-2.5">
            <button
              type="button"
              onClick={handleExpand}
              title={userName}
              aria-label={userName}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white-100 overflow-hidden bg-primary-brown text-[11.5px] font-semibold text-white-50 cursor-pointer hover:ring-2 hover:ring-primary-bleach"
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={userName} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </button>
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const saveRename = () => {
    if (title.trim()) onRename(title.trim());
    setEditing(false);
  };

  if (editing) {
    return (
      <li className="px-2 py-1">
        <form onSubmit={(e) => { e.preventDefault(); saveRename(); }}>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveRename}
            className="w-full rounded-md border border-primary-brown/40 bg-white px-2 py-1 text-[13px] outline-none"
          />
        </form>
      </li>
    );
  }

  return (
    <li className="group relative">
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors cursor-pointer ${
          isActive ? "bg-primary-bleach/45 font-medium text-primary-brown" : "text-primary-brown/85 hover:bg-white-100/60"
        }`}
      >
        <span className="truncate pr-5">{session.title}</span>
        <span
          onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
          className={`shrink-0 rounded p-1 transition-opacity cursor-pointer ${
            isActive || menuOpen ? "opacity-100 text-primary-brown" : "opacity-0 group-hover:opacity-100 text-primary-light-brown hover:text-primary-brown"
          }`}
        >
          <MoreHorizontal size={14} />
        </span>
      </button>

      {menuOpen && (
        <div ref={menuRef} className="absolute right-2 top-full z-30 mt-1 w-40 rounded-xl border border-white-100 bg-white p-1 shadow-lg">
          <button
            type="button"
            onClick={() => { setMenuOpen(false); setEditing(true); }}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] text-primary-brown hover:bg-white-50 cursor-pointer"
          >
            <Pencil size={13} className="text-primary-light-brown" />
            <span>Rename</span>
          </button>
          <button
            type="button"
            onClick={() => { setMenuOpen(false); onTogglePin(); }}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] text-primary-brown hover:bg-white-50 cursor-pointer"
          >
            {session.pinned ? <PinOff size={13} /> : <Pin size={13} className="rotate-45" />}
            <span>{session.pinned ? "Unpin chat" : "Pin chat"}</span>
          </button>
          <div className="my-1 border-t border-white-100" />
          <button
            type="button"
            onClick={() => { setMenuOpen(false); onDelete(); }}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </li>
  );
}
