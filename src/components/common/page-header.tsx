type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className="space-y-3">
      {eyebrow ? (
        <p className="text-[0.7rem] uppercase tracking-[0.38em] text-[var(--text-soft)]">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-2">
        <h1
          className="max-w-[12ch] text-4xl leading-none text-[var(--text)] sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-xl text-sm leading-6 text-[var(--text-soft)] sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}

