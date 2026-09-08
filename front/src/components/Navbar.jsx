import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
            CV
          </div>

          <span className="text-xl font-bold text-slate-900">
            CV Maker
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/templates"
            className="hidden text-slate-600 hover:text-blue-600 md:block"
          >
            Templates
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-600 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="font-medium text-slate-700 hover:text-blue-600"
              >
                {user?.name || "Profile"}
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  to="/admin/users"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Admin users
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}