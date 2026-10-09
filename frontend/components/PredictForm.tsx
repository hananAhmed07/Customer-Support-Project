"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

import SampleChips from "./SampleChips";
import { SendIcon, XIcon } from "./icons";

const MAX_LEN = 500;

export default function PredictForm({
  value,
  onChange,
  onSubmit,
  onClear,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  loading: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  const canSubmit = value.trim().length > 0 && !loading;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSubmit) onSubmit();
    }
  }

  return (
    <div className="px-6 py-6 sm:px-8 sm:py-7">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit) onSubmit();
        }}
      >
        <div className="flex items-baseline justify-between">
          <label htmlFor="message" className="text-sm font-medium text-ink">
            Customer message
          </label>
          <span className="text-2xs text-ink-subtle">
            <kbd className="rounded border border-line bg-surface-muted px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-muted">
              Enter
            </kbd>{" "}
            to route · Shift + Enter for a new line
          </span>
        </div>

        <div className="group relative mt-2.5">
          <textarea
            id="message"
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value.slice(0, MAX_LEN))}
            onKeyDown={handleKeyDown}
            rows={3}
            maxLength={MAX_LEN}
            disabled={loading}
            aria-busy={loading}
            placeholder="e.g. I was charged twice for {{Order Number}} and need a refund"
            className="block w-full resize-none rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink shadow-control transition-colors placeholder:text-ink-subtle/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-subtle"
          />

          <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center gap-2">
          {value.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              disabled={loading}
              aria-label="Clear message"
              className="pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-surface-sunken hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="tnum text-2xs text-ink-subtle">
            {value.length}/{MAX_LEN}
          </span>
        </div>
      </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SampleChips onPick={onChange} disabled={loading} />
          <button
            type="submit"
            disabled={!canSubmit}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-control transition-colors hover:bg-accent-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-subtle"
          >
            <SendIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            Analyze intent
          </button>
        </div>
      </form>
    </div>
  );
}
