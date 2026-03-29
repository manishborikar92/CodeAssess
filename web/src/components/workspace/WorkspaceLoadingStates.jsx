"use client";

import Spinner from "@/components/ui/Spinner";

export function WorkspaceLoadingScreen({ label = "Loading workspace..." }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bg-primary">
      <Spinner size="lg" />
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}

export function PyodideLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-[rgba(10,13,20,0.94)]">
      <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-border-main border-t-accent-cyan" />
      <p className="text-base font-semibold text-text-primary">Loading Python Runtime...</p>
      <p className="text-[0.8rem] text-text-muted">
        Initializing the in-browser judge engine
      </p>
    </div>
  );
}
