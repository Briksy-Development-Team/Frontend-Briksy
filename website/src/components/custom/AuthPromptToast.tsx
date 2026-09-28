import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { storePendingFavoriteAction } from "../../auth/auth.intent";
import type { FavoriteType } from "../../api/seeker/seeker.api";

type AuthPromptToastProps = {
  isOpen: boolean;
  onClose: () => void;
  targetId?: string | number;
  targetType?: FavoriteType;
};

export const AuthPromptToast: React.FC<AuthPromptToastProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType = "property",
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAuthRedirect = (path: string) => {
    if (targetId) {
      storePendingFavoriteAction(String(targetId), window.location.pathname, targetType);
    }
    onClose();
    navigate(path);
  };

  return createPortal(
    <div
      role="alert"
      className="fixed top-6 right-6 z-[300] w-[calc(100%-3rem)] max-w-[400px] rounded-[24px] bg-[#E2CBB3] p-6 text-[#342511] shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-all animate-in fade-in slide-in-from-top-4 duration-300 font-helvetica"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[1.25rem] font-medium leading-snug tracking-[-0.2px] text-[#342511]">
          Save to Favorites
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-full p-1 text-[#8B6F54] hover:bg-black/5 hover:text-[#342511] transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <p className="mt-3 text-[0.875rem] leading-relaxed text-[#342511]">
        Log in or register an account to save properties, manage favorites, and organize your collections.
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => handleAuthRedirect("/register")}
          className="rounded-full text-[0.875rem] font-medium text-[#8B6F54] hover:text-[#342511] transition-colors px-2 py-1"
        >
          Register
        </button>

        <button
          type="button"
          onClick={() => handleAuthRedirect("/login")}
          className="rounded-full bg-[#342511] px-6 py-2.5 text-[0.875rem] font-medium text-[#F8F4EE] hover:bg-[#463116] transition-all shadow-sm"
        >
          Log in
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AuthPromptToast;
