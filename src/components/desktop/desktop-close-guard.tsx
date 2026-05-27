"use client";

import { useEffect, useRef, useState } from "react";

export function DesktopCloseGuard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<"exit" | "hide" | null>(null);
  const windowRef = useRef<Awaited<ReturnType<typeof import("@tauri-apps/api/window").getCurrentWindow>> | null>(
    null,
  );
  const invokeRef = useRef<((command: string, args?: Record<string, unknown>) => Promise<unknown>) | null>(
    null,
  );

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

        windowRef.current = currentWindow;
        invokeRef.current = invoke;

        unlisten = await currentWindow.onCloseRequested(async (event) => {
          event.preventDefault();
          setIsSubmitting(null);
          setIsOpen(true);
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

  async function handleAction(action: "exit" | "hide") {
    const currentWindow = windowRef.current;
    const invoke = invokeRef.current;

    if (!currentWindow) {
      return;
    }

    setIsSubmitting(action);

    try {
      if (action === "exit" && invoke) {
        await invoke("exit_application");
        return;
      }

      await currentWindow.hide();
      setIsOpen(false);
    } finally {
      setIsSubmitting(null);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="desktop-exit-overlay">
      <div className="desktop-exit-panel paper-shell">
        <div className="desktop-exit-head">
          <p className="desktop-exit-eyebrow">Close Ritual</p>
          <button
            aria-label="继续使用应用"
            className="desktop-exit-ghost"
            disabled={isSubmitting !== null}
            onClick={() => setIsOpen(false)}
            type="button"
          >
            继续使用
          </button>
        </div>

        <div className="desktop-exit-copy">
          <h2>这一段先停在这里吗？</h2>
          <p>
            如果你只是暂时离开，可以把 Today Trajectory 收进后台；如果今天已经结束，也可以直接退出软件。
          </p>
        </div>

        <div className="desktop-exit-actions">
          <button
            className="desktop-exit-option"
            disabled={isSubmitting !== null}
            onClick={() => void handleAction("hide")}
            type="button"
          >
            <span className="desktop-exit-option-label">最小化到后台</span>
            <span className="desktop-exit-option-copy">保留在托盘，随时回来继续。</span>
          </button>

          <button
            className="desktop-exit-option desktop-exit-option-danger"
            disabled={isSubmitting !== null}
            onClick={() => void handleAction("exit")}
            type="button"
          >
            <span className="desktop-exit-option-label">退出软件</span>
            <span className="desktop-exit-option-copy">关闭主程序，结束本次使用。</span>
          </button>
        </div>
      </div>
    </div>
  );
}
