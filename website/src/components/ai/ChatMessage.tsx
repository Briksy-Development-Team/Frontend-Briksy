
import BriksyLogo from "../../assets/logo/loaderbg.svg";
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
}

export function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl bg-primary-bleach/50 px-4 py-2.5 text-[0.93rem] leading-6 text-primary-brown break-words shadow-xs">
        {content}
      </div>
    </div>
  );
}

export function ThinkingSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-bleach/60">
        <img src={BriksyLogo} alt="" className="h-4 w-4 animate-pulse object-contain" />
      </div>

      <div className="flex flex-1 flex-col gap-2 pt-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded-md bg-white-100" />
        <div className="h-3.5 w-full animate-pulse rounded-md bg-white-100" />
        <div className="h-3.5 w-1/2 animate-pulse rounded-md bg-white-100" />
      </div>
    </div>
  );
}

export function AssistantMessage({
  msg,
  onNeedHelp,
  onNavigate,
}: {
  msg: ChatMessageItem;
  onNeedHelp?: () => void;
  onNavigate?: () => void;
}) {
  if (msg.thinking) {
    return <ThinkingSkeleton />;
  }

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      {/* Briksy AI avatar badge */}
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-bleach/60">
        <img src={BriksyLogo} alt="Briksy AI" className="h-4 w-4 object-contain" />
      </div>

      {/* Content column */}
      <div className="min-w-0 flex-1">
        <MessageRenderer content={msg.content} />
        <RecommendationSection
          items={msg.recommendations}
          visible={msg.recsVisible ?? true}
          onNavigate={onNavigate}
        />
        <MessageActions content={msg.content} onNeedHelp={onNeedHelp} />
      </div>
    </div>
  );
}

export default function ChatMessage({
  msg,
  onNeedHelp,
  onNavigate,
}: {
  msg: ChatMessageItem;
  onNeedHelp?: () => void;
  onNavigate?: () => void;
}) {
  if (msg.role === "user") {
    return <UserMessage content={msg.content} />;
  }
  return <AssistantMessage msg={msg} onNeedHelp={onNeedHelp} onNavigate={onNavigate} />;
}
