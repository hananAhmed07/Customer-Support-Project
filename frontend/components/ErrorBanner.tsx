"use client";

import { AlertIcon, ArrowPathIcon } from "./icons";

export type ErrorInfo = {
  message: string;
  kind: "network" | "server" | "client";
  status?: number;
  detail?: string;
};

export default function ErrorBanner({
  error,
  backendUrl,
  onRetry,
  retrying,
}: {
  error: ErrorInfo;
  backendUrl: string;
  onRetry: () => void;
  retrying: boolean;
}) {
  const headline =
    error.kind === "network"
      ? "Backend unreachable"
      : error.kind === "server"
        ? "Backend error"
        : "Request rejected";

  return (
    <div
      role="alert"
      className="rounded-2xl border border-danger-line bg-danger-soft p-5 shadow-card sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-danger">
          <AlertIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-danger">{headline}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink">{error.message}</p>
          {error.detail && (
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">{error.detail}</p>
          )}

          <dl className="mt-3 space-y-0.5 rounded-lg border border-danger-line/70 bg-surface/70 px-3 py-2 font-mono text-2xs text-ink-muted">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink-subtle">endpoint</dt>
              <dd className="break-all">{backendUrl}/predict</dd>
            </div>
            {typeof error.status === "number" && (
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-ink-subtle">status</dt>
                <dd>{error.status}</dd>
              </div>
            )}
          </dl>

          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-danger-line bg-surface px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-3.5 w-3.5 ${retrying ? "animate-spin" : ""}`} />
            {retrying ? "Retrying…" : "Retry request"}
          </button>
        </div>
      </div>
    </div>
  );
}
