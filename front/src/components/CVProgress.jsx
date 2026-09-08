import { useMemo } from "react";
import { calculateCVScore } from "../services/cvScoring";

export default function CVProgress({ cv }) {
  const result = useMemo(
    () => calculateCVScore(cv),
    [cv]
  );

  const { score, checks } = result;
  const missing = checks.filter((check) => !check.passed);

  let message = "Let's build your CV!";
  let status = "Needs improvement";

  if (score >= 90) {
    message = "Your CV is ready to impress!";
    status = "Excellent";
  } else if (score >= 75) {
    message = "Your CV is looking strong!";
    status = "Very good";
  } else if (score >= 50) {
    message = "Your CV is coming together!";
    status = "Good";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            CV Completion
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {message}
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-blue-600">
            {score}%
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {score === 100 ? "Complete" : status}
          </div>
        </div>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${score}%`,
          }}
        />
      </div>

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex items-center justify-between text-xs"
          >
            <span
              className={
                check.passed
                  ? "text-slate-700"
                  : "text-slate-400"
              }
            >
              {check.label}
            </span>

            <span
              className={
                check.passed
                  ? "font-bold text-green-600"
                  : "font-bold text-slate-300"
              }
            >
              {check.passed ? "✓" : "○"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {missing.length > 0 ? "Still missing" : "Everything is complete"}
        </h4>

        {missing.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {missing.map((check) => (
              <li
                key={check.label}
                className="flex items-center gap-2 text-xs text-amber-700"
              >
                <span aria-hidden="true">!</span>
                {check.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-green-600">
            Your CV includes all recommended sections.
          </p>
        )}
      </div>
    </div>
  );
}