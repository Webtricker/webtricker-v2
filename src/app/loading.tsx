/** Root Suspense fallback: a blank dark screen that matches the Studio loader, so there is no white flash or spinner before it appears. */
export default function LoadingPage() {
  return <div aria-hidden="true" style={{ position: "fixed", inset: 0, background: "#0b0b0c", zIndex: 9999 }} />;
}
