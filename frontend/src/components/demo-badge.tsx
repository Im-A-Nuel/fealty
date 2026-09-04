export default function DemoBadge({ label = "Demo data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-goldbright">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
      {label}
    </span>
  );
}