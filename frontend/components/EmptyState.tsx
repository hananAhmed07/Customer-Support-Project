import { RouteIcon } from "./icons";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface-muted text-ink-subtle">
        <RouteIcon className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-sm font-medium text-ink">No message analyzed yet</h2>
      <p className="mt-1.5 max-w-[42ch] text-sm leading-relaxed text-ink-muted">
        Type a customer message above, or pick a sample query, and the model will route it to an
        intent with a confidence score.
      </p>
    </div>
  );
}
