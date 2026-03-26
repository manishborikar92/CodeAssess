"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function Toast() {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  const addToast = useCallback((message, type = "default", duration = 3000) => {
    const id = ++idCounter.current;
    setToasts((prev) => [...prev.slice(-2), { id, message, type, visible: true }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  // Expose addToast globally
  useEffect(() => {
    window.__showToast = addToast;
    return () => {
      delete window.__showToast;
    };
  }, [addToast]);

  return (
    <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-5 py-3 rounded-lg text-sm font-medium max-w-xs
            border shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${toast.visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
            ${
              toast.type === "success"
                ? "bg-bg-card border-accent-green text-text-primary"
                : toast.type === "error"
                ? "bg-bg-card border-accent-red text-text-primary"
                : "bg-bg-card border-border-main text-text-primary"
            }
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function showToast(message, type = "default", duration = 3000) {
  if (typeof window !== "undefined" && window.__showToast) {
    window.__showToast(message, type, duration);
  }
}
