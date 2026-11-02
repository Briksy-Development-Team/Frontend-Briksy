import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Heart, MessageCircle, Share2, Volume2, VolumeX, Send, Check, Music2 } from "lucide-react";
// ponytail: Up/Down nav arrows removed from UI per user request; swipe + keyboard ArrowUp/Down still work
import type { ShortItem, ShortComment } from "./types";

interface Props { shorts: ShortItem[]; initialIndex: number; isOpen: boolean; onClose: () => void; }

const BTN = "rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-95 cursor-pointer bg-black/50 hover:bg-black/75 text-white";

export default function ReelViewer({ shorts, initialIndex, isOpen, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [toast, setToast] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [commentMap, setCommentMap] = useState<Record<string, ShortComment[]>>({});
  const touchY = useRef<number | null>(null);
  const wheelTs = useRef(0);

  useEffect(() => { setIdx(initialIndex); setComments(false); setExpanded(false); }, [initialIndex, isOpen]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { comments ? setComments(false) : onClose(); }
      else if (e.key === "ArrowUp") next(-1);
      else if (e.key === "ArrowDown") next(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, comments, idx]);

  if (!isOpen || !shorts.length) return null;

  const s = shorts[idx];
  const id = s.id;
  const isLiked = liked[id] ?? s.isLiked ?? false;
  const isFollowing = following[id] ?? s.uploader.isFollowing ?? false;
  const commentList = commentMap[id] ?? s.comments ?? [];

  const next = (dir: 1 | -1) => {
    const n = idx + dir;
    if (n >= 0 && n < shorts.length) { setIdx(n); setComments(false); setExpanded(false); }
  };

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelTs.current < 380) return;
    if (Math.abs(e.deltaY) > 30) { next(e.deltaY > 0 ? 1 : -1); wheelTs.current = now; }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current === null) return;
    const diff = touchY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 45) next(diff > 0 ? 1 : -1);
    touchY.current = null;
  };

  const share = async () => {
    try { await (navigator.share ? navigator.share({ title: s.title, url: location.href }) : navigator.clipboard.writeText(location.href)); }
    catch { try { await navigator.clipboard.writeText(location.href); setToast(true); setTimeout(() => setToast(false), 2000); } catch {} }
  };

  const addComment = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!commentText.trim()) return;
    const c: ShortComment = { id: `c${Date.now()}`, author: "You", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", text: commentText.trim(), timeAgo: "Just now", likes: 0 };
    setCommentMap(p => ({ ...p, [id]: [c, ...(p[id] ?? s.comments ?? [])] }));
    setCommentText("");
  };

  return createPortal(
    <div onWheel={onWheel} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md select-none">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100000] bg-white/95 text-black px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5">
          <Check size={13} className="text-green-600" /> Link copied!
        </div>
      )}

      {/* Outer shell — anchors desktop nav buttons outside the card */}
      <div className="relative w-full h-[100dvh] max-w-[430px] sm:h-[94vh] sm:max-h-[860px] sm:rounded-3xl flex items-center justify-center">
        {/* Reel card */}
        <div onTouchStart={e => { touchY.current = e.touches[0].clientY; }} onTouchEnd={onTouchEnd}
          className="relative w-full h-full sm:rounded-3xl overflow-hidden bg-black flex flex-col justify-between shadow-2xl">

          {/* Background image + gradient */}
          <div className="absolute inset-0 z-0">
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(0,0,0,.98) 0%,rgba(0,0,0,.8) 32%,rgba(0,0,0,.15) 75%,rgba(0,0,0,.55) 100%)" }} />
          </div>

          {/* Top bar */}
          <div className="relative z-20 flex items-center justify-between p-4 pt-safe-or-6">
            <button type="button" onClick={onClose} aria-label="Close" className={`${BTN} p-2`}><X size={19} /></button>
            <button type="button" onClick={() => setMuted(m => !m)} aria-label="Sound" className={`${BTN} p-2`}>
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          </div>

          {/* Bottom content */}
          <div className="relative z-20 flex items-end justify-between px-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:pb-5 gap-3">
            {/* Left info */}
            <div className="flex-1 min-w-0 text-white space-y-1.5">
              {/* Uploader row */}
              <div className="flex items-center gap-2">
                <img src={s.uploader.avatar} alt={s.uploader.name} className="w-7 h-7 rounded-full object-cover border border-white/30 shrink-0" />
                <span className="font-semibold text-xs truncate max-w-[120px]">{s.uploader.name}</span>
                {s.uploader.isVerified && <span className="bg-white text-black text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center shrink-0">✓</span>}
                <button type="button" onClick={() => setFollowing(p => ({ ...p, [id]: !isFollowing }))}
                  className={`ml-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full cursor-pointer ${isFollowing ? "bg-white/20 text-white" : "bg-red-600 text-white"}`}>
                  {isFollowing ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              <h3 className="font-bold text-sm leading-snug line-clamp-2">{s.title}</h3>

              {/* Views + desc */}
              <div className="text-xs text-neutral-200">
                <p className={expanded ? "max-h-20 overflow-y-auto pr-1" : "line-clamp-2"}>
                  <span className="font-semibold text-[#F8F4EE] mr-1.5">{s.views}</span>{s.description}
                </p>
                {(s.description?.length ?? 0) > 50 && (
                  <button type="button" onClick={() => setExpanded(x => !x)} className="text-neutral-400 text-[11px] underline cursor-pointer">
                    {expanded ? "less" : "...more"}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <Music2 size={11} className="animate-spin shrink-0" style={{ animationDuration: "6s" }} />
                <span className="truncate">Original Audio • Briksy</span>
              </div>
            </div>

            {/* Right action rail */}
            <div className="flex flex-col items-center gap-2 shrink-0 text-white">
              {/* Like */}
              <div className="flex flex-col items-center">
                <button type="button" onClick={() => setLiked(p => ({ ...p, [id]: !isLiked }))} aria-label="Like"
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-125 cursor-pointer ${isLiked ? "bg-red-600/90" : "bg-black/50 hover:bg-black/75"}`}>
                  <Heart size={19} className={isLiked ? "fill-white" : ""} />
                </button>
                <span className="text-[10px] mt-0.5">{isLiked ? "Liked" : s.likesCount}</span>
              </div>

              {/* Comment */}
              <div className="flex flex-col items-center">
                <button type="button" onClick={() => setComments(true)} aria-label="Comments" className={`${BTN} w-10 h-10`}><MessageCircle size={19} /></button>
                <span className="text-[10px] mt-0.5">{commentList.length}</span>
              </div>

              {/* Share */}
              <div className="flex flex-col items-center">
                <button type="button" onClick={share} aria-label="Share" className={`${BTN} w-10 h-10`}><Share2 size={18} /></button>
                <span className="text-[10px] mt-0.5">Share</span>
              </div>

            </div>
          </div>

          {/* Comment sheet */}
          {comments && (
            <div className="absolute inset-x-0 bottom-0 h-[460px] max-h-[70%] bg-[#1a1715]/98 text-white rounded-t-3xl z-40 flex flex-col border-t border-white/10">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                <span className="font-semibold text-sm">Comments <span className="text-neutral-400 font-normal text-xs">({commentList.length})</span></span>
                <button type="button" onClick={() => setComments(false)} className="p-1 rounded-full hover:bg-white/10 text-neutral-300 cursor-pointer"><X size={17} /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
                {commentList.map(c => (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <img src={c.avatar} alt={c.author} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white/90">{c.author}</span>
                        <span className="text-[10px] text-neutral-500">{c.timeAgo}</span>
                      </div>
                      <p className="text-neutral-200 mt-0.5 leading-relaxed">{c.text}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-neutral-500">
                        <button type="button" className="flex items-center gap-1 hover:text-white cursor-pointer"><Heart size={10} />{c.likes > 0 && c.likes}</button>
                        <button type="button" className="hover:text-white cursor-pointer">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={addComment} className="p-3 border-t border-white/10 bg-[#141210] flex items-center gap-2 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div className="w-6 h-6 rounded-full bg-neutral-700 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="You" className="w-full h-full object-cover" />
                </div>
                <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..."
                  className="flex-1 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/25" />
                <button type="submit" disabled={!commentText.trim()} aria-label="Post"
                  className="p-1.5 rounded-full bg-red-600 disabled:bg-neutral-800 disabled:text-neutral-500 text-white cursor-pointer disabled:cursor-not-allowed">
                  <Send size={13} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
