"use client";

export default function Modal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", variant = "danger" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
      <div className="bg-bg-secondary border border-border-main rounded-xl p-6 max-w-md w-full mx-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[fadeIn_0.2s_ease]">
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-text-secondary bg-transparent border border-border-main rounded-md hover:bg-bg-hover transition-all duration-200 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold text-white rounded-md transition-all duration-200 cursor-pointer ${
              variant === "danger"
                ? "bg-accent-red hover:opacity-90"
                : "bg-accent-blue hover:opacity-90"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
