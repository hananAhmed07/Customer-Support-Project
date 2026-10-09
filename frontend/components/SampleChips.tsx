"use client";

import { SAMPLE_QUERIES } from "@/lib/samples";

export default function SampleChips({
  onPick,
  disabled,
}: {
  onPick: (query: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-2xs font-medium uppercase tracking-wide text-ink-subtle">Try</span>
      {SAMPLE_QUERIES.map((query) => (
        <button
          key={query}
          type="button"
          disabled={disabled}
          onClick={() => onPick(query)}
          className="max-w-full truncate rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted shadow-control transition-colors hover:border-accent-line hover:bg-accent-soft hover:text-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          {query}
        </button>
      ))}
    </div>
  );
}
