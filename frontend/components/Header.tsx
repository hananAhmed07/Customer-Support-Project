import ConnectionPill from "./ConnectionPill";

export default function Header({ backendUrl }: { backendUrl: string }) {
  return (
    <header className="flex flex-col gap-4 border-b border-hairline px-6 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-8 sm:py-7">
      <div className="max-w-[52ch]">
        <h1 className="text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.75rem]">
          Intent Analyzer
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          A real-time customer-support intent classifier. Paste a message and the model routes it to
          one of 27 intents across 11 categories.
        </p>
      </div>
      <div className="pt-0.5 sm:pt-1">
        <ConnectionPill backendUrl={backendUrl} />
      </div>
    </header>
  );
}
