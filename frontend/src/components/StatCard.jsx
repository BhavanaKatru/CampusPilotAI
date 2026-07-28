import {
  Brain,
  CheckCircle2,
  Clock3,
  Flame,
} from "lucide-react";

const icons = {
  Clock: Clock3,
  CheckCircle: CheckCircle2,
  Brain,
  Flame,
};

function StatCard({ title, value, change, icon }) {
  const Icon = icons[icon] || Clock3;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-500/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{change}</p>
    </div>
  );
}

export default StatCard;