import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function SecondaryButton({
  children,
  className = "",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`rounded-full border border-[var(--border-strong)] bg-transparent px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[var(--text-soft)] transition hover:border-[var(--text-soft)] hover:text-[var(--text)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

