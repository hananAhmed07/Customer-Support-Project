"use client";

import { useEffect, useState } from "react";

import { checkHealth } from "@/lib/api";
import type { HealthState } from "@/lib/types";

const POLL_MS = 20_000;

const STATE_META: Record<HealthState, { label: string; dot: string; text: string; pulse: boolean }> = {
  checking: { label: "Checking backend", dot: "bg-warning", text: "text-ink-muted", pulse: true },
  online: { label: "Backend online", dot: "bg-success", text: "text-ink-muted", pulse: true },
  offline: { label: "Backend offline", dot: "bg-danger", text: "text-danger", pulse: false },
};

export default function ConnectionPill({ backendUrl }: { backendUrl: string }) {
  const [state, setState] = useState<HealthState>("checking");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function ping() {
      const ok = await checkHealth(controller.signal);
      if (active) setState(ok ? "online" : "offline");
    }

    ping();
    const id = window.setInterval(ping, POLL_MS);
    return () => {
      active = false;
      controller.abort();
      window.clearInterval(id);
    };
  }, [backendUrl]);

  const meta = STATE_META[state];

  return (
    <div
      role="status"
      aria-live="polite"
      title={backendUrl}
      className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-muted/80 py-1.5 pl-2.5 pr-3"
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {meta.pulse && (
          <span className={`absolute inline-flex h-2 w-2 rounded-full ${meta.dot} animate-ping-soft`} />
        )}
        <span className={`relative inline-block h-2 w-2 rounded-full ${meta.dot}`} />
      </span>
      <span className={`text-2xs font-medium uppercase tracking-wide ${meta.text}`}>{meta.label}</span>
    </div>
  );
}
