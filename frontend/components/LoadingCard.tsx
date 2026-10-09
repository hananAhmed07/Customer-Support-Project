export default function LoadingCard() {
  return (
    <div
      aria-busy="true"
      aria-label="Analyzing message"
      className="rounded-2xl border border-hairline bg-surface p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full sm:max-w-[60%]">
          <div className="shimmer h-3 w-24 rounded-full" />
          <div className="shimmer mt-3 h-6 w-44 rounded-md" />
          <div className="shimmer mt-3 h-5 w-20 rounded-md" />
        </div>
        <div className="w-full sm:w-40">
          <div className="shimmer h-8 w-24 rounded-md sm:ml-auto" />
          <div className="shimmer mt-3 h-1.5 w-full rounded-full" />
        </div>
      </div>
      <div className="mt-5 space-y-2.5 border-t border-hairline pt-4">
        <div className="shimmer h-3 w-28 rounded-full" />
        <div className="shimmer h-12 w-full rounded-lg" />
        <div className="shimmer h-12 w-full rounded-lg" />
        <div className="shimmer h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
