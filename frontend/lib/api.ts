import type { PredictResponse } from "./types";

/**
 * Backend base URL. Next.js only inlines `NEXT_PUBLIC_*` variables, so the
 * documented deploy variable for this service is NEXT_PUBLIC_BACKEND_URL.
 * Falls back to the local FastAPI dev server.
 */
export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export type ApiErrorKind = "network" | "server" | "client";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly detail?: string;

  constructor(kind: ApiErrorKind, message: string, status?: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.detail = detail;
  }
}

/** Pings /health. Never throws; returns false on any failure. */
export async function checkHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { signal, cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as { status?: string };
    return data.status === "ok";
  } catch {
    return false;
  }
}

/** Calls /predict with a raw customer message. Throws ApiError on failure. */
export async function predict(text: string, signal?: AbortSignal): Promise<PredictResponse> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(
      "network",
      `Could not reach the backend at ${BACKEND_URL}.`,
      undefined,
      "Check that the API is running and that its CORS policy allows this origin.",
    );
  }

  if (!res.ok) {
    let detail: string | undefined;
    try {
      const body = (await res.json()) as { detail?: unknown };
      detail = typeof body.detail === "string" ? body.detail : undefined;
    } catch {
      detail = undefined;
    }
    if (res.status >= 500) {
      throw new ApiError("server", `The backend returned an error (${res.status}).`, res.status, detail);
    }
    throw new ApiError("client", `The request was rejected (${res.status}).`, res.status, detail);
  }

  return (await res.json()) as PredictResponse;
}
