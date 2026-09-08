import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { matchJobDescription } from "../services/jobMatcher";
import BrandLogo from "../components/BrandLogo";

export default function JobMatcher() {
  const [cv] = useState(() => {
    try {
      const saved = localStorage.getItem("cv_draft");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Could not load CV draft:", error);
      return null;
    }
  });
  const [jobDescription, setJobDescription] =
    useState("");

  const [analyzed, setAnalyzed] = useState(false);

  const result = useMemo(() => {
    if (!cv || !jobDescription.trim()) {
      return null;
    }

    return matchJobDescription(
      cv,
      jobDescription
    );
  }, [cv, jobDescription]);

  const analyze = () => {
    if (!jobDescription.trim()) {
      return;
    }

    setAnalyzed(true);
  };

  const scoreColor =
    result?.score >= 80
      ? "text-green-600"
      : result?.score >= 60
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo compact className="h-9 w-9 rounded-lg" />
            <span className="text-xl font-bold text-gray-900">
              CV Maker
            </span>
          </Link>

          <Link
            to="/create-cv"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Edit My CV
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Job Description Matcher
          </h1>

          <p className="mt-2 text-gray-600">
            Compare your CV with a job description
            and discover important keywords you may
            be missing.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Job Description */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Job Description
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Copy and paste the complete job
              description below.
            </p>

            <textarea
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              placeholder="Paste the job description here..."
              className="mt-5 min-h-[420px] w-full resize-y rounded-xl border border-gray-300 p-4 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />

            <button
              onClick={analyze}
              disabled={!jobDescription.trim()}
              className="mt-4 w-full rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Analyze Job Match
            </button>
          </section>

          {/* Results */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            {!analyzed || !result ? (
              <div className="flex min-h-[520px] items-center justify-center text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    🎯
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Ready to analyze
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                    Paste a job description and we'll
                    compare it with your current CV.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Match Results
                </h2>

                {/* Score */}
                <div className="my-7 text-center">
                  <div
                    className={`text-6xl font-black ${scoreColor}`}
                  >
                    {result.score}%
                  </div>

                  <p
                    className={`mt-2 font-semibold ${scoreColor}`}
                  >
                    {result.level}
                  </p>
                </div>

                {/* Matched */}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    ✓ Matched keywords
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.matchedKeywords
                      .length > 0 ? (
                      result.matchedKeywords.map(
                        (keyword) => (
                          <span
                            key={keyword}
                            className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                          >
                            {keyword}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        No important keywords matched
                        yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="mt-7">
                  <h3 className="font-semibold text-gray-900">
                    ⚠ Missing keywords
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.missingKeywords
                      .length > 0 ? (
                      result.missingKeywords.map(
                        (keyword) => (
                          <span
                            key={keyword}
                            className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                          >
                            {keyword}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        Great! No important keywords
                        appear to be missing.
                      </p>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-7 rounded-xl bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-900">
                    Recommendations
                  </h3>

                  <ul className="mt-3 space-y-2">
                    {result.recommendations.map(
                      (recommendation, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600"
                        >
                          • {recommendation}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <Link
                  to="/create-cv"
                  className="mt-6 block rounded-xl bg-gray-900 px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
                >
                  Improve My CV
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}