import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type ModalWrapperProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  backdropClassName?: string;
  className?: string;
  hideBackdrop?: boolean;
};

const ModalWrapper = ({
  isOpen,
  onClose,
  children,
  backdropClassName = "",
  className = "",
  hideBackdrop = false,
}: ModalWrapperProps) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isMounted) {
      const scrollY = window.scrollY;
      const body = document.body;

      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.height = "100dvh";
      body.style.overflow = "hidden";

      return () => {
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        body.style.height = "";
        body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  return createPortal(
    <>
      {/* Backdrop with background blur & fade animation */}
      {!hideBackdrop && (
        <div
          className={`fixed inset-0 z-[99998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          } ${backdropClassName}`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Modal Dialog Content with opening/closing animation */}
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none overflow-y-auto overflow-x-hidden">
        <div
          className={`relative z-10 w-full flex items-center justify-center transition-all duration-300 ease-out pointer-events-none ${
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4 md:translate-y-0"
          } ${className}`}
        >
          <div
            className="pointer-events-auto w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModalWrapper;
