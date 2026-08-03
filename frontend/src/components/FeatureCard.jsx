import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FeatureCard({
  title,
  description,
  icon,
  path,
  status = "Available",
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(path)}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500/40 dark:hover:bg-white/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-2xl shadow-sm dark:from-blue-600/30 dark:to-cyan-500/20">
          {icon}
        </div>

        <ArrowUpRight
          size={20}
          className="text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-600 dark:text-slate-500 dark:group-hover:text-cyan-400"
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {description}
      </p>

      <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
        {status}
      </span>
    </button>
  );
}

export default FeatureCard;