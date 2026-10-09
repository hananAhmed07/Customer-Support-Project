"use client";

import { categoryStyle } from "@/lib/categories";
import type { PredictResponse } from "@/lib/types";
import IntentRail from "./IntentRail";
import { CheckIcon } from "./icons";

export default function ResultCard({
  response,
  requestKey,
}: {
  response: PredictResponse;
  requestKey: string;
}) {
  const style = categoryStyle(response.category);
  const confidencePct = Math.round(response.confidence * 1000) / 10;

  return (
    <div className="animate-fade-up rounded-2xl border border-hairline bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-2xs font-medium uppercase tracking-wide text-ink-subtle">
            <CheckIcon className="h-3.5 w-3.5 text-accent" />
            Predicted intent
          </span>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-accent-soft px-2.5 py-1 font-mono text-sm font-semibold text-accent-strong sm:text-base">
              {response.intent}
            </span>
          </div>
          <div className="mt-2.5">
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {response.category}
            </span>
          </div>
        </div>

        <div className="w-full sm:w-40 sm:shrink-0 sm:text-right">
          <div className="tnum text-3xl font-semibold leading-none tracking-[-0.02em] text-ink">
            {confidencePct.toFixed(1)}
            <span className="text-base font-medium text-ink-subtle">%</span>
          </div>
          <div className="mt-1 text-2xs uppercase tracking-wide text-ink-subtle">confidence</div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
              style={{ width: `${Math.max(3, confidencePct)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-hairline pt-4">
        <IntentRail
          predictions={response.top_k}
          latencyMs={response.latency_ms}
          requestKey={requestKey}
        />
      </div>
    </div>
  );
}
