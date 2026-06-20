export default function DeprecatedSiteConfigNotice() {
  return (
    <div
      role="status"
      className="mb-5 flex gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700/70 dark:bg-amber-950/40 dark:text-amber-100"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-500 text-xs font-bold"
      >
        !
      </span>
      <div className="space-y-1">
        <p className="font-semibold">
          This data is no longer used on the live site.
        </p>
        <p>
          Contact info and social links are now managed in Site Settings
          (coming in Phase 9).
        </p>
        <p>Changes here will not appear anywhere publicly.</p>
      </div>
    </div>
  );
}
