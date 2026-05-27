"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  label?: string;
};

export function BackButton({ label = "返回今天" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,252,246,0.42)] px-4 py-2 text-sm text-[var(--text-soft)] transition hover:-translate-x-0.5 hover:border-[var(--border-strong)] hover:bg-[rgba(255,252,246,0.74)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(30,123,111,0.3)]"
      aria-label={label}
    >
      <span className="text-base transition group-hover:-translate-x-0.5">←</span>
      <span>{label}</span>
    </button>
  );
}
