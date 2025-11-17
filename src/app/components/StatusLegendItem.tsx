interface StatusLegendItemProps {
  color: string;   // napr. "bg-emerald-400"
  label: string;
}

export default function StatusLegendItem({ color, label }: StatusLegendItemProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={`inline-block h-3 w-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
