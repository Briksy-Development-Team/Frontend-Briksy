import { useState } from "react";
import { Check, Copy, RotateCw, ThumbsDown, ThumbsUp } from "lucide-react";

interface Props {
  content: string;
  feedback?: "like" | "dislike";
  onFeedback?: (val: "like" | "dislike") => void;
  onRefresh?: () => void;
  disabled?: boolean;
}

export default function MessageActions({ content, feedback, onFeedback, onRefresh, disabled }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(content).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLiked = feedback === "like";
  const isDisliked = feedback === "dislike";

  return (
    <div className="mt-3 flex items-center gap-1.5 text-[#7C5F42]">
      {/* 1. Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy response"
        title={copied ? "Copied to clipboard" : "Copy response"}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
          copied ? "text-emerald-700 bg-emerald-50" : "text-[#7C5F42] hover:bg-black/5 hover:text-[#342511]"
        }`}
      >
        {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} />}
      </button>

      {/* 2. Retry / Regenerate whole message again */}
      <button
        type="button"
        disabled={disabled}
        onClick={onRefresh}
        aria-label="Retry response"
        title="Retry whole message"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7C5F42] hover:bg-black/5 hover:text-[#342511] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <RotateCw size={16} className={disabled ? "animate-spin" : ""} />
      </button>

      {/* 3. Like (Good response) */}
      <button
        type="button"
        onClick={() => onFeedback?.("like")}
        aria-label="Good response"
        title="Good response"
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
          isLiked
            ? "bg-[#342511] text-white shadow-2xs"
            : "text-[#7C5F42] hover:bg-black/5 hover:text-[#342511]"
        }`}
      >
        <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
      </button>

      {/* 4. Dislike (Bad response) */}
      <button
        type="button"
        onClick={() => onFeedback?.("dislike")}
        aria-label="Bad response"
        title="Bad response"
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
          isDisliked
            ? "bg-[#342511] text-white shadow-2xs"
            : "text-[#7C5F42] hover:bg-black/5 hover:text-[#342511]"
        }`}
      >
        <ThumbsDown size={16} fill={isDisliked ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
