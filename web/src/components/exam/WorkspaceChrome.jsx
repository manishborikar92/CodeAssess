"use client";

import { Group, Panel, Separator } from "react-resizable-panels";

function ResizeHandle({ orientation = "horizontal" }) {
  const isHorizontal = orientation === "horizontal";

  return (
    <Separator
      className={`relative z-10 flex items-center justify-center bg-[#0a0a0a] transition-colors ${
        isHorizontal ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-border-main transition-colors hover:bg-border-bright ${
          isHorizontal ? "h-6 w-1" : "h-1 w-6"
        }`}
      />
    </Separator>
  );
}

export default function WorkspaceChrome({
  codePanel,
  header,
  onCloseSidebar,
  outputPanel,
  problemPanel,
  sidebar,
  sidebarVisible,
  sidebarClosing,
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a]">
      <div className="shrink-0">{header}</div>

      <div className="relative min-h-0 flex-1 overflow-hidden p-2">
        {sidebarVisible && (
          <>
            <div
              aria-hidden="true"
              onClick={onCloseSidebar}
              className={`absolute inset-0 z-40 bg-black/50 ${
                sidebarClosing ? "animate-fade-out" : "animate-fade-in"
              }`}
            />
            <div
              className={`absolute top-2 bottom-2 left-2 z-50 w-[420px] overflow-hidden rounded-lg border border-border-main bg-bg-secondary shadow-2xl ${
                sidebarClosing
                  ? "animate-slide-out-left"
                  : "animate-slide-in-left"
              }`}
            >
              {sidebar}
            </div>
          </>
        )}

        <Group orientation="horizontal" className="h-full">
          <Panel
            defaultSize={50}
            minSize={20}
            className="flex flex-col overflow-hidden rounded-lg border border-border-main bg-bg-secondary"
          >
            {problemPanel}
          </Panel>

          <ResizeHandle orientation="horizontal" />

          <Panel defaultSize={50} minSize={30}>
            <Group orientation="vertical" className="h-full">
              <Panel
                defaultSize={65}
                minSize={30}
                className="flex flex-col overflow-hidden rounded-lg border border-border-main bg-bg-secondary"
              >
                {codePanel}
              </Panel>

              <ResizeHandle orientation="vertical" />

              <Panel
                defaultSize={35}
                minSize={20}
                className="flex flex-col overflow-hidden rounded-lg border border-border-main bg-bg-secondary"
              >
                {outputPanel}
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>
    </div>
  );
}
