import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">

      <h1 className="text-8xl font-bold text-blue-600">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-bold">
        Page not found
      </h2>

      <p className="mt-2 text-slate-500">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
      >
        Back Home
      </Link>

    </div>
  );
}