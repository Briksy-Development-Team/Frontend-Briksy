
import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  PanelLeftClose,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Search,
  Sparkles,
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
  onNewChat,
  onSelectSession,
  onTogglePin,
  onRenameSession,
  onDeleteSession,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Authenticated user profile
  const auth = getStoredAuth();
  const user = auth?.user;
  const userName = user?.name || user?.display_name || "Briksy Seeker";
  const userRole = user?.roles?.[0] || "Seeker";
  const userInitials = userName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "BS";

  // Close 3-dots menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    }
    if (menuOpenId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpenId]);

  // Focus rename input when renaming begins
  useEffect(() => {
    if (renamingId) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [renamingId]);

  const handleStartRename = (session: ChatSession) => {
    setRenamingId(session.id);
    setRenameValue(session.title);
    setMenuOpenId(null);
  };

  const handleSaveRename = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      onRenameSession(id, trimmed);
    }
    setRenamingId(null);
  };

  // Filtered lists
  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? sessions.filter((s) => s.title.toLowerCase().includes(query))
    : sessions;

  const pinnedSessions = filtered.filter((s) => s.pinned);
  const recentSessions = filtered.filter((s) => !s.pinned);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-primary-brown/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white-100/80 bg-white-50/95 font-helvetica text-primary-brown backdrop-blur-md transition-transform duration-300 md:static md:z-auto md:w-64 lg:w-72 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white-100/60 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-brown text-white-50">
              <Sparkles size={15} />
            </div>
            <span className="text-[14px] font-semibold tracking-tight text-primary-brown">
              Briksy AI
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowSearch((prev) => !prev)}
              aria-label="Search chats"
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                showSearch
                  ? "bg-primary-bleach/50 text-primary-brown"
                  : "text-primary-light-brown hover:bg-white-100/70 hover:text-primary-brown"
              }`}
            >
              <Search size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Collapse sidebar"
              className="rounded-md p-1.5 text-primary-light-brown transition-colors hover:bg-white-100/70 hover:text-primary-brown cursor-pointer"
            >
              <PanelLeftClose size={17} />
            </button>
          </div>
        </div>

        {/* Action: New Chat */}
        <div className="shrink-0 p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              // Close on mobile after initiating new chat
              if (window.innerWidth < 768) onClose();
            }}
            className="flex w-full items-center justify-between rounded-xl border border-white-100 bg-white px-3.5 py-2.5 text-[13.5px] font-medium text-primary-brown shadow-2xs transition-all hover:border-primary-brown/30 hover:bg-white-50 hover:shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <Plus size={16} className="text-primary-light-brown" />
              <span>New chat</span>
            </span>
            <span className="text-[11px] font-mono text-primary-light-brown/70">
              ⌘N
            </span>
          </button>

          {/* Search Bar (toggleable) */}
          {showSearch && (
            <div className="relative mt-2.5">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary-light-brown"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats…"
                className="w-full rounded-lg border border-white-100 bg-white py-1.5 pl-8 pr-7 text-[12.5px] text-primary-brown outline-none placeholder:text-primary-light-brown/60 focus:border-primary-brown/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-light-brown hover:text-primary-brown cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scrollable Conversation List */}
        <div className="scrollbar-custom flex-1 overflow-y-auto px-2 py-1">
          {/* Pinned Section */}
          {pinnedSessions.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-light-brown">
                <Pin size={11} className="rotate-45" />
                <span>Pinned</span>
              </div>
              <ul className="flex flex-col gap-0.5">
                {pinnedSessions.map((session) => (
                  <ChatSessionItem
                    key={session.id}
                    session={session}
                    isActive={session.id === activeSessionId}
                    isRenaming={renamingId === session.id}
                    renameValue={renameValue}
                    renameInputRef={renameInputRef}
                    isMenuOpen={menuOpenId === session.id}
                    menuRef={menuRef}
                    onSelect={() => {
                      onSelectSession(session.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                    onToggleMenu={(e) => {
                      e.stopPropagation();
                      setMenuOpenId((prev) => (prev === session.id ? null : session.id));
                    }}
                    onRenameChange={(val) => setRenameValue(val)}
                    onSaveRename={() => handleSaveRename(session.id)}
                    onCancelRename={() => setRenamingId(null)}
                    onStartRename={() => handleStartRename(session)}
                    onTogglePin={() => {
                      onTogglePin(session.id);
                      setMenuOpenId(null);
                    }}
                    onDelete={() => {
                      onDeleteSession(session.id);
                      setMenuOpenId(null);
                    }}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Recents Section */}
          <div>
            <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-light-brown">
              <span>Recents</span>
            </div>
            {recentSessions.length === 0 && pinnedSessions.length === 0 ? (
              <p className="px-3 py-4 text-center text-[12.5px] text-primary-light-brown/70">
                {searchQuery ? "No matches found" : "No conversation history yet"}
              </p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {recentSessions.map((session) => (
                  <ChatSessionItem
                    key={session.id}
                    session={session}
                    isActive={session.id === activeSessionId}
                    isRenaming={renamingId === session.id}
                    renameValue={renameValue}
                    renameInputRef={renameInputRef}
                    isMenuOpen={menuOpenId === session.id}
                    menuRef={menuRef}
                    onSelect={() => {
                      onSelectSession(session.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                    onToggleMenu={(e) => {
                      e.stopPropagation();
                      setMenuOpenId((prev) => (prev === session.id ? null : session.id));
                    }}
                    onRenameChange={(val) => setRenameValue(val)}
                    onSaveRename={() => handleSaveRename(session.id)}
                    onCancelRename={() => setRenamingId(null)}
                    onStartRename={() => handleStartRename(session)}
                    onTogglePin={() => {
                      onTogglePin(session.id);
                      setMenuOpenId(null);
                    }}
                    onDelete={() => {
                      onDeleteSession(session.id);
                      setMenuOpenId(null);
                    }}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="shrink-0 border-t border-white-100/80 p-3">
          <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white-100/60">
            {/* User Avatar */}
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={userName}
                className="h-9 w-9 rounded-full object-cover border border-white-100"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-brown text-[12.5px] font-semibold text-white-50">
                {userInitials}
              </div>
            )}

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-primary-brown">
                {userName}
              </p>
              <p className="truncate text-[11.5px] text-primary-light-brown capitalize">
                {userRole}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Single Chat Item Component ───────────────────────────────────────────────

interface ItemProps {
  session: ChatSession;
  isActive: boolean;
  isRenaming: boolean;
  renameValue: string;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  isMenuOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onToggleMenu: (e: React.MouseEvent) => void;
  onRenameChange: (val: string) => void;
  onSaveRename: () => void;
  onCancelRename: () => void;
  onStartRename: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

function ChatSessionItem({
  session,
  isActive,
  isRenaming,
  renameValue,
  renameInputRef,
  isMenuOpen,
  menuRef,
  onSelect,
  onToggleMenu,
  onRenameChange,
  onSaveRename,
  onCancelRename,
  onStartRename,
  onTogglePin,
  onDelete,
}: ItemProps) {
  if (isRenaming) {
    return (
      <li className="px-2 py-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSaveRename();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            ref={renameInputRef}
            type="text"
            value={renameValue}
            onChange={(e) => onRenameChange(e.target.value)}
            onBlur={onSaveRename}
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancelRename();
            }}
            className="w-full rounded-md border border-primary-brown/40 bg-white px-2 py-1 text-[13px] text-primary-brown outline-none"
          />
        </form>
      </li>
    );
  }

  return (
    <li className="relative group">
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors cursor-pointer ${
          isActive
            ? "bg-primary-bleach/45 font-medium text-primary-brown"
            : "text-primary-brown/85 hover:bg-white-100/60"
        }`}
      >
        <span className="truncate pr-5">{session.title}</span>

        {/* 3-dots action button (visible on hover or when active) */}
        <span
          onClick={onToggleMenu}
          className={`shrink-0 rounded p-1 transition-opacity cursor-pointer ${
            isActive || isMenuOpen
              ? "opacity-100 text-primary-brown hover:bg-white/60"
              : "opacity-0 group-hover:opacity-100 text-primary-light-brown hover:bg-white/60 hover:text-primary-brown"
          }`}
          aria-label="Chat options"
        >
          <MoreHorizontal size={14} />
        </span>
      </button>

      {/* 3-dots Dropdown Menu (ChatGPT style) */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-2 top-full z-30 mt-1 w-44 rounded-xl border border-white-100 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            type="button"
            onClick={onStartRename}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] text-primary-brown transition-colors hover:bg-white-50 cursor-pointer"
          >
            <Pencil size={13} className="text-primary-light-brown" />
            <span>Rename</span>
          </button>

          <button
            type="button"
            onClick={onTogglePin}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] text-primary-brown transition-colors hover:bg-white-50 cursor-pointer"
          >
            {session.pinned ? (
              <>
                <PinOff size={13} className="text-primary-light-brown" />
                <span>Unpin chat</span>
              </>
            ) : (
              <>
                <Pin size={13} className="text-primary-light-brown rotate-45" />
                <span>Pin chat</span>
              </>
            )}
          </button>

          <div className="my-1 border-t border-white-100" />

          <button
            type="button"
            onClick={onDelete}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </li>
  );
}
