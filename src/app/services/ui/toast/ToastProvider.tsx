import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type ToastLevel = "success" | "info" | "warning" | "danger";

type ToastItem = {
  id: string;
  message: string;
  level: ToastLevel;
};

type ToastContextValue = {
  success: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  danger: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = (level: ToastLevel, message: string) => {
    const id = makeId();
    setItems((current) => [...current, { id, level, message }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 3500);
  };

  const value: ToastContextValue = {
    success: (message: string) => push("success", message),
    info: (message: string) => push("info", message),
    warning: (message: string) => push("warning", message),
    danger: (message: string) => push("danger", message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1080 }}>
              <div className="d-flex flex-column gap-2">
                {items.map((item) => (
                  <div key={item.id} className={`alert alert-${item.level} shadow-sm mb-0 py-3 px-4 rounded-3`}>
                    {item.message}
                  </div>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    return {
      success: (message: string) => window.alert(message),
      info: (message: string) => window.alert(message),
      warning: (message: string) => window.alert(message),
      danger: (message: string) => window.alert(message),
    };
  }

  return context;
};

export { ToastProvider, useToast };
