import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import BrandLogo from "../components/BrandLogo";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <BrandLogo compact className="h-9 w-9 rounded-lg" />
            <span className="font-bold">CV Maker</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              to="/dashboard"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/profile"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              {user?.name || "Profile"}
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}