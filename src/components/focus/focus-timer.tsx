function formatRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

type FocusTimerProps = {
  remainingSeconds: number;
};

export function FocusTimer({ remainingSeconds }: FocusTimerProps) {
  return (
    <div className="space-y-3 text-center">
      <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[var(--text-soft)]">
        正在流动的时间
      </p>
      <p
        className="text-6xl leading-none text-[var(--text)] sm:text-7xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {formatRemaining(remainingSeconds)}
      </p>
    </div>
  );
}
