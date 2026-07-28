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
      className="group w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 text-2xl">
          {icon}
        </div>

        <ArrowUpRight
          size={20}
          className="text-slate-500 transition group-hover:text-cyan-400"
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <span className="mt-4 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
        {status}
      </span>
    </button>
  );
}

export default FeatureCard;