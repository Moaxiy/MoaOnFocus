import Link from "next/link";

import { PrimaryButton } from "@/components/common/primary-button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
};

export function EmptyState({ title, description, actionLabel, href }: EmptyStateProps) {
  return (
    <div className="paper-shell space-y-5 p-6 text-center page-enter">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-2xl text-[var(--accent)]">
        ·
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h2>
        <p className="mx-auto max-w-md text-sm leading-6 text-[var(--text-soft)]">{description}</p>
      </div>
      <Link href={href}>
        <PrimaryButton>{actionLabel}</PrimaryButton>
      </Link>
    </div>
  );
}

