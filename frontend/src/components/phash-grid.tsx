const SIZE = 8;

export default function PhashGrid({
  seed = 0,
  className = "",
}: {
  seed?: number;
  className?: string;
}) {
  const cells = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const on = (row * SIZE + col + seed * 3) % 3 !== 0;
      cells.push(
        <span
          key={`${row}-${col}`}
          className="rounded-[1px]"
          style={{
            backgroundColor: on ? "var(--gold)" : "rgba(154,154,154,0.22)",
            opacity: on ? 0.85 : 1,
          }}
        />,
      );
    }
  }
  return (
    <div
      className={`grid grid-cols-8 gap-[2px] ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      {cells}
    </div>
  );
}