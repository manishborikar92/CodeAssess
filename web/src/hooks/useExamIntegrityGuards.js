"use client";

import { useEffect } from "react";

const BLOCKED_SHORTCUT_KEYS = new Set(["a", "c", "v", "x"]);

export function useExamIntegrityGuards({
  blockClipboard,
  blockContextMenu,
  isActive,
  onFullscreenStateChange,
  onViolation,
  requireFullscreen,
  warnBeforeUnload,
}) {
  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onViolation("tab-switch");
      }
    };

    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(document.fullscreenElement);
      onFullscreenStateChange?.(isFullscreen);

      if (
        requireFullscreen &&
        !isFullscreen &&
        document.visibilityState === "visible"
      ) {
        onViolation("fullscreen-exit");
      }
    };

    const handleBeforeUnload = (event) => {
      if (!warnBeforeUnload) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    const handleClipboardEvent = (event) => {
      if (!blockClipboard) {
        return;
      }

      event.preventDefault();
      onViolation("clipboard");
    };

    const handleKeyDown = (event) => {
      if (!blockClipboard) {
        return;
      }

      if (!(event.ctrlKey || event.metaKey)) {
        return;
      }

      if (BLOCKED_SHORTCUT_KEYS.has(event.key.toLowerCase())) {
        event.preventDefault();
        onViolation("clipboard");
      }
    };

    const handleContextMenu = (event) => {
      if (!blockContextMenu) {
        return;
      }

      event.preventDefault();
      onViolation("context-menu");
    };

    onFullscreenStateChange?.(Boolean(document.fullscreenElement));

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleClipboardEvent, true);
    document.addEventListener("cut", handleClipboardEvent, true);
    document.addEventListener("paste", handleClipboardEvent, true);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleClipboardEvent, true);
      document.removeEventListener("cut", handleClipboardEvent, true);
      document.removeEventListener("paste", handleClipboardEvent, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    blockClipboard,
    blockContextMenu,
    isActive,
    onFullscreenStateChange,
    onViolation,
    requireFullscreen,
    warnBeforeUnload,
  ]);
}
