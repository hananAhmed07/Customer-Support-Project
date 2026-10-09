"use client";

import { categoryStyle } from "@/lib/categories";
import type { Prediction } from "@/lib/types";
import { MessageIcon } from "./icons";

function Lane({
  prediction,
  winner,
  delayMs,
}: {
  prediction: Prediction;
  winner: boolean;
  delayMs: number;
}) {
  const style = categoryStyle(prediction.category);
  const pct = Math.round(prediction.confidence * 1000) / 10;

  return (
    <div
      className={[
        "ml-4 flex-1 rounded-lg border px-3 py-2.5 transition-colors",
        winner
          ? "border-accent-line bg-accent-soft"
          : "border-hairline bg-surface-muted/50",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="shrink-0 rounded px-1.5 py-0.5 text-2xs font-medium"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {prediction.category}
          </span>
          <span
            className={[
              "truncate font-mono text-[0.8125rem]",
              winner ? "font-medium text-accent-strong" : "text-ink-muted",
            ].join(" ")}
          >
            {prediction.intent}
          </span>
        </div>
        <span
          className={[
            "tnum shrink-0 text-xs",
            winner ? "font-semibold text-accent-strong" : "text-ink-subtle",
          ].join(" ")}
        >
          {pct.toFixed(1)}%
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${Math.max(2, pct)}%`,
            backgroundColor: winner ? "#0F766E" : style.dot,
            animationDelay: `${delayMs}ms`,
          }}
        />
      </div>
    </div>
  );
}

function Node({ winner, pulsing }: { winner?: boolean; pulsing?: boolean }) {
  return (
    <span className="relative z-10 mt-2 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
      {pulsing && (
        <span className="absolute h-3.5 w-3.5 rounded-full bg-accent/40 animate-ping-soft" />
      )}
      <span
        className={[
          "relative h-3.5 w-3.5 rounded-full border-2",
          winner ? "border-accent bg-accent" : "border-line bg-surface",
        ].join(" ")}
      />
    </span>
  );
}

export default function IntentRail({
  predictions,
  latencyMs,
  requestKey,
}: {
  predictions: Prediction[];
  latencyMs: number;
  requestKey: string;
}) {
  return (
    <section aria-label="Routing trace" className="mt-1">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-2xs font-medium uppercase tracking-wide text-ink-subtle">
          Routing trace
        </h3>
        <span className="tnum font-mono text-2xs text-ink-subtle">
          {latencyMs.toFixed(1)} ms
        </span>
      </div>

      <ol key={requestKey} className="relative mt-3 space-y-1">
        {/* source node */}
        <li className="flex items-start gap-2.5">
          <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            <MessageIcon className="h-3.5 w-3.5 text-ink-subtle" />
            <span className="absolute left-[6px] top-4 h-[26px] w-px origin-top bg-accent animate-trace-draw" />
          </span>
          <span className="pt-0.5 text-xs text-ink-subtle">Input message</span>
        </li>

        {predictions.map((prediction, index) => {
          const winner = index === 0;
          const last = index === predictions.length - 1;
          return (
            <li
              key={`${prediction.intent}-${index}`}
              className="flex items-start animate-fade-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                <Node winner={winner} pulsing={winner} />
                {!last && !winner && (
                  <span className="absolute left-[6px] top-4 h-[26px] w-px bg-hairline" />
                )}
              </span>
              <Lane prediction={prediction} winner={winner} delayMs={index * 80} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
