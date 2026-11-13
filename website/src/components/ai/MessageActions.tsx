/**
 * MessageActions.tsx — Gemini-style actions bar below assistant responses.
 * Provides: Copy response, Like / Dislike rating, and Still Need Help trigger.
 * Uses Briksy design tokens and Lucide icons without external libraries.
 */
import { useState } from "react";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import HelpIcon from "../../assets/icons/help/help.svg";

interface Props {
  content: string;
  onNeedHelp?: () => void;
}

export default function MessageActions({ content, onNeedHelp }: Props) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ponytail: fallback if clipboard API is restricted
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1 text-primary-light-brown">
      {/* Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy response"
        title="Copy response"
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-white-100/70 hover:text-primary-brown cursor-pointer"
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald-700" />
            <span className="text-emerald-700 font-medium">Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} />
            <span>Copy</span>
          </>
        )}
      </button>

      {/* Helpful / Not helpful */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setLiked((prev) => (prev === true ? null : true))}
          aria-label="Good response"
          title="Good response"
          className={`rounded-lg p-1 transition-colors hover:bg-white-100/70 hover:text-primary-brown cursor-pointer ${
            liked === true ? "text-primary-brown bg-primary-bleach/30" : ""
          }`}
        >
          <ThumbsUp size={14} />
        </button>
        <button
          type="button"
          onClick={() => setLiked((prev) => (prev === false ? null : false))}
          aria-label="Bad response"
          title="Bad response"
          className={`rounded-lg p-1 transition-colors hover:bg-white-100/70 hover:text-primary-brown cursor-pointer ${
            liked === false ? "text-primary-brown bg-primary-bleach/30" : ""
          }`}
        >
          <ThumbsDown size={14} />
        </button>
      </div>

      {/* Still need help */}
      {onNeedHelp && (
        <button
          type="button"
          onClick={onNeedHelp}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white-100 bg-white px-2.5 py-1 text-xs font-medium text-primary-brown transition-colors hover:border-primary-brown/40 cursor-pointer"
        >
          <img src={HelpIcon} alt="" className="h-3.5 w-3.5" />
          <span>Still need help?</span>
        </button>
      )}
    </div>
  );
}
