"use client";

import { useEffect } from "react";

export function DesktopCloseGuard() {
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function bindCloseHandler() {
      try {
        const [{ getCurrentWindow }, { invoke }] = await Promise.all([
          import("@tauri-apps/api/window"),
          import("@tauri-apps/api/core"),
        ]);
        const currentWindow = getCurrentWindow();

        if (currentWindow.label !== "main") {
          return;
        }

        unlisten = await currentWindow.onCloseRequested(async (event) => {
          event.preventDefault();

          const shouldExit = window.confirm(
            "关闭 Today Trajectory？\n\n点击“确定”退出软件。\n点击“取消”最小化到后台。",
          );

          if (shouldExit) {
            await invoke("exit_application");
            return;
          }

          await currentWindow.hide();
        });
      } catch {
        // Ignore non-Tauri environments such as web development preview.
      }
    }

    void bindCloseHandler();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return null;
}
