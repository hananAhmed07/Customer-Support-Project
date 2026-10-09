"use client";

import { useRef, useState } from "react";

import EmptyState from "@/components/EmptyState";
import ErrorBanner, { type ErrorInfo } from "@/components/ErrorBanner";
import Header from "@/components/Header";
import LoadingCard from "@/components/LoadingCard";
import PredictForm from "@/components/PredictForm";
import ResultCard from "@/components/ResultCard";
import { ApiError, BACKEND_URL, predict } from "@/lib/api";
import type { PredictResponse, RequestStatus } from "@/lib/types";

export default function Home() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [response, setResponse] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [requestKey, setRequestKey] = useState("initial");
  const abortRef = useRef<AbortController | null>(null);

  async function run(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError(null);

    try {
      const result = await predict(trimmed, controller.signal);
      setResponse(result);
      setRequestKey(String(Date.now()));
      setStatus("success");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const info: ErrorInfo =
        err instanceof ApiError
          ? { message: err.message, kind: err.kind, status: err.status, detail: err.detail }
          : { message: "Something went wrong while analyzing the message.", kind: "server" };
      setResponse(null);
      setError(info);
      setStatus("error");
    }
  }

  function handleClear() {
    abortRef.current?.abort();
    setMessage("");
    setResponse(null);
    setError(null);
    setStatus("idle");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-lift">
        <Header backendUrl={BACKEND_URL} />
        <PredictForm
          value={message}
          onChange={setMessage}
          onSubmit={() => run(message)}
          onClear={handleClear}
          loading={status === "loading"}
        />

        <section className="border-t border-hairline bg-surface-muted/40 px-6 py-6 sm:px-8 sm:py-7">
          <div aria-live="polite" aria-atomic="true">
            {status === "idle" && <EmptyState />}
            {status === "loading" && <LoadingCard />}
            {status === "error" && error && (
              <ErrorBanner
                error={error}
                backendUrl={BACKEND_URL}
                onRetry={() => run(message)}
                retrying={false}
              />
            )}
            {status === "success" && response && (
              <ResultCard response={response} requestKey={requestKey} />
            )}
          </div>
        </section>

        <footer className="border-t border-hairline px-6 py-3.5 sm:px-8">
          <p className="text-2xs text-ink-subtle">
            Char TF-IDF + Word2Vec, LinearSVC, seed 42 — predictions are model estimates.
          </p>
        </footer>
      </div>
    </main>
  );
}
