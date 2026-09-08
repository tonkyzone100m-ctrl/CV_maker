import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";

const templateStyles = {
  professional: {
    accent: "bg-blue-600",
    badge: "bg-blue-50 text-blue-600",
    line: "bg-blue-600",
  },
  modern: {
    accent: "bg-slate-900",
    badge: "bg-slate-100 text-slate-700",
    line: "bg-slate-900",
  },
  minimal: {
    accent: "bg-slate-500",
    badge: "bg-slate-100 text-slate-600",
    line: "bg-slate-500",
  },
  creative: {
    accent: "bg-purple-600",
    badge: "bg-purple-50 text-purple-600",
    line: "bg-purple-600",
  },
};

export default function TemplateCard({
  name,
  description,
  type,
  popular = false,
}) {
  const { isAuthenticated } = useAuth();
  const style = templateStyles[type] || templateStyles.professional;
  const templatePath = `/create-cv?template=${type}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-72 overflow-hidden bg-slate-100 p-5">
        {popular && (
          <span className="absolute right-4 top-4 z-10 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow">
            Popular
          </span>
        )}

        <div className="mx-auto h-[430px] w-[305px] rounded bg-white p-5 shadow-lg transition duration-300 group-hover:scale-[1.02]">
          <div
            className={`h-3 w-16 rounded ${style.accent}`}
          />

          <div className="mt-4">
            <div className="h-5 w-36 rounded bg-slate-800" />
            <div className="mt-2 h-2 w-24 rounded bg-slate-300" />
          </div>

          <div className={`mt-5 h-0.5 w-full ${style.line}`} />

          <div className="mt-5">
            <div className="h-2 w-20 rounded bg-slate-700" />

            <div className="mt-3 space-y-2">
              <div className="h-1.5 rounded bg-slate-200" />
              <div className="h-1.5 rounded bg-slate-200" />
              <div className="h-1.5 w-4/5 rounded bg-slate-200" />
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2 w-24 rounded bg-slate-700" />

            <div className="mt-3 space-y-3">
              <MiniLine />
              <MiniLine />
              <MiniLine />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">{name}</h3>

          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}>
            CV
          </span>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <Link
          to={isAuthenticated ? templatePath : `/login?redirect=${encodeURIComponent(templatePath)}`}
          className="mt-5 block rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
        >
          {isAuthenticated ? "Use This Template" : "Login to Use Template"}
        </Link>
      </div>
    </article>
  );
}

function MiniLine() {
  return (
    <div>
      <div className="h-1.5 w-3/5 rounded bg-slate-300" />
      <div className="mt-2 h-1.5 rounded bg-slate-100" />
      <div className="mt-1 h-1.5 w-4/5 rounded bg-slate-100" />
    </div>
  );
}