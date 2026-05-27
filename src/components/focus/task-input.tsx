type TaskInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TaskInput({ value, onChange }: TaskInputProps) {
  return (
    <label className="block space-y-3">
      <span className="text-[0.72rem] uppercase tracking-[0.26em] text-[var(--text-soft)]">
        你现在要做什么
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="例如：背英语单词"
        className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[rgba(255,252,246,0.86)] px-5 py-4 text-base text-[var(--text)] outline-none transition placeholder:text-[rgba(111,90,66,0.6)] focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(30,123,111,0.08)]"
      />
    </label>
  );
}
