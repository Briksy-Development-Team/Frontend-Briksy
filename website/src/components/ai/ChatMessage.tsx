import { AlertCircle, Check, RotateCw } from "lucide-react";
import LogoM from "../../assets/logo/logomobile.svg";
import type { AiRecommendation } from "../../api/clients.api";
import MessageRenderer from "./MessageRenderer";
import RecommendationSection from "./RecommendationSection";
import MessageActions from "./MessageActions";

export type Role = "user" | "assistant";

export interface ChatMessageItem {
  id: string;
  role: Role;
  content: string;
  recommendations: AiRecommendation[];
  thinking?: boolean;
  recsVisible?: boolean;
  time?: string;
  feedback?: "like" | "dislike";
  failed?: boolean;
}

interface ChatMessageProps {
  msg: ChatMessageItem;
  onNavigate?: () => void;
  onRefresh?: () => void;
  onFeedback?: (val: "like" | "dislike") => void;
  onRetryUserMsg?: () => void;
  onEditUserMsg?: () => void;
  isBusy?: boolean;
}

export default function ChatMessage({
  msg,
  onNavigate,
  onRefresh,
  onFeedback,
  onRetryUserMsg,
  onEditUserMsg,
  isBusy,
}: ChatMessageProps) {
  if (msg.role === "user") {
    if (msg.failed) {
      return (
        <div className="flex flex-col items-end gap-1.5 animate-fade-in">
          <div className="max-w-[80%] rounded-[18px_18px_6px_18px] border border-[#B42318] bg-[#FBE7E4] px-4 py-2.5 text-[15px] leading-6 text-[#342511] break-words shadow-2xs">
            {msg.content}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] pr-1 select-none">
            <span className="flex items-center gap-1 text-[#B42318] font-medium">
              <AlertCircle size={12} strokeWidth={2.5} />
              <span>Not sent</span>
            </span>
            <span className="text-[#8B6F54]">·</span>
            <button
              type="button"
              onClick={onRetryUserMsg}
              className="flex items-center gap-1 font-bold text-[#342511] hover:underline cursor-pointer"
            >
              <RotateCw size={11} strokeWidth={2.5} />
              <span>Retry</span>
            </button>
            <span className="text-[#8B6F54]">·</span>
            <button
              type="button"
              onClick={onEditUserMsg}
              className="font-bold text-[#342511] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-end gap-1.5">
        <div className="max-w-[80%] rounded-[18px_18px_6px_18px] border border-[#EBEBEB]/60 bg-[#F8F4EE] px-4 py-2.5 text-[15px] leading-6 text-[#342511] break-words shadow-2xs">
          {msg.content}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#8B6F54] pr-1 select-none">
          <Check size={12} strokeWidth={2.5} />
          <span>{msg.time || "Sent now"}</span>
        </div>
      </div>
    );
  }

  if (msg.thinking) {
    return (
      <div className="flex items-start gap-3 animate-fade-in">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#342511] shadow-2xs">
          <img src={LogoM} alt="Briksy AI" className="h-4 w-auto object-contain brightness-0 invert animate-pulse" />
        </div>
        <div className="flex flex-1 flex-col gap-3 pt-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-[14px] font-medium leading-5 text-[#342511]">Briksy AI</span>
            <span className="text-[12px] font-normal leading-[1.5em] text-[#8B6F54]">answering…</span>
          </div>
          {msg.content ? (
            <div className="text-[15.2px] leading-7 text-[#342511]">
              <MessageRenderer content={msg.content} />
              <span className="inline-block ml-0.5 w-1.5 h-4 bg-[#342511] animate-pulse align-middle" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-[#EBEBEB]" />
              <div className="h-3.5 w-full animate-pulse rounded-md bg-[#EBEBEB]" />
              <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-[#EBEBEB]" />
            </div>
          )}
          {/* Skeleton cards matching Figma #4847:25078 & Swiper layout */}
          <div className="flex gap-3.5 overflow-hidden w-full pt-1">
            <div className="w-[19.6667rem] h-[28rem] shrink-0 rounded-3xl bg-[#F8F4EE] animate-pulse border border-[#EBEBEB]" />
            <div className="w-[19.6667rem] h-[28rem] shrink-0 rounded-3xl bg-[#F8F4EE] animate-pulse border border-[#EBEBEB]" />
            <div className="w-[19.6667rem] h-[28rem] shrink-0 rounded-3xl bg-[#F8F4EE] animate-pulse border border-[#EBEBEB]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#342511] shadow-2xs">
        <img src={LogoM} alt="Briksy AI" className="h-4 w-auto object-contain brightness-0 invert" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[14px] font-medium leading-5 text-[#342511]">Briksy AI</span>
          <span className="text-[12px] font-normal leading-[1.5em] text-[#8B6F54]">now</span>
        </div>
        <div className="text-[15.2px] leading-7 text-[#342511]">
          <MessageRenderer content={msg.content} />
        </div>
        <RecommendationSection
          items={msg.recommendations}
          visible={msg.recsVisible ?? true}
          onNavigate={onNavigate}
        />
        <MessageActions
          content={msg.content}
          feedback={msg.feedback}
          onFeedback={onFeedback}
          onRefresh={onRefresh}
          disabled={isBusy}
        />
      </div>
    </div>
  );
}
