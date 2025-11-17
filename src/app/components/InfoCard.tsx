import type { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  note: string;
  hoverBorderClass?: string; // napr. "hover:border-indigo-300/40"
  hoverShadowClass?: string; // napr. "hover:shadow-indigo-500/10"
}

export default function InfoCard({
  icon,
  title,
  value,
  note,
  hoverBorderClass = "",
  hoverShadowClass = "",
}: InfoCardProps) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl border border-white/15 
        bg-gradient-to-br from-white/10 via-white/5 to-transparent px-5 py-4 
        shadow-lg shadow-black/25 transition-all duration-300
        ${hoverBorderClass} ${hoverShadowClass}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg">
          {icon}
        </span>
        <dt className="text-[11px] uppercase tracking-[0.35em] text-white/80">
          {title}
        </dt>
      </div>

      <dd className="mt-3 text-3xl font-semibold text-white">{value}</dd>
      <p className="text-[11px] text-slate-400 mt-1">{note}</p>
    </div>
  );
}
