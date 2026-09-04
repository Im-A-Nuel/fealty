export default function ScanOverlay({ label = "Scanning" }: { label?: string }) {
  return (
    <div className="scan-overlay" aria-hidden="true">
      <span className="scan-corner scan-corner-tl" />
      <span className="scan-corner scan-corner-tr" />
      <span className="scan-corner scan-corner-bl" />
      <span className="scan-corner scan-corner-br" />
      <div className="scan-beam" />
      <p className="scan-label">
        <span className="scan-dot" />
        {label}
      </p>
    </div>
  );
}