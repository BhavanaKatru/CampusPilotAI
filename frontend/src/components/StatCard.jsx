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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-500/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-cyan-100 p-3 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-600 dark:text-slate-500">
        {change}
      </p>
    </div>
  );
}

export default StatCard;