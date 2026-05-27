import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function PrimaryButton({
  children,
  className = "",
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`rounded-full border border-[var(--accent-strong)] bg-[var(--accent)] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#f8f3e9] shadow-[0_16px_30px_rgba(21,88,79,0.25)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

