export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14" fill="#14110a" stroke="#C9A227" strokeWidth="1.25" />
      <circle cx="16" cy="16" r="11.3" stroke="#8A6D1C" strokeWidth="0.8" />
      <path d="M16 8.5a7.5 7.5 0 0 0-7.5 7.5M16 8.5a7.5 7.5 0 0 1 7.5 7.5" stroke="#E6C34F" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M10.2 18.2a6.2 6.2 0 0 0 11.6 0M9.5 21.1a8.4 8.4 0 0 0 13 0" stroke="#E6C34F" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M13.1 12.3a4.1 4.1 0 0 0-.8 5.1M18.9 12.3a4.1 4.1 0 0 1 .8 5.1M16 12.2v7.6" stroke="#C9A227" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="16" cy="20.3" r="1.25" fill="#E6C34F" />
    </svg>
  );
}
