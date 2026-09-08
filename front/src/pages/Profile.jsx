import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  function saveProfile() {
    const normalizedEmail = email.trim().toLowerCase();
    const savedAccounts = JSON.parse(
      localStorage.getItem("cv_accounts") ||
        localStorage.getItem("cv_account") ||
        "[]"
    );
    const accounts = Array.isArray(savedAccounts)
      ? savedAccounts
      : [savedAccounts];
    const duplicate = accounts.some(
      (account) =>
        account?.email?.trim().toLowerCase() === normalizedEmail &&
        account.email.trim().toLowerCase() !==
          user?.email?.trim().toLowerCase()
    );

    if (duplicate) {
      setMessage("That email is already used by another account.");
      return;
    }

    if (accounts.length > 0 && accounts[0]) {
      const updatedAccounts = accounts.map((account) =>
        account.email.trim().toLowerCase() ===
        user?.email?.trim().toLowerCase()
          ? { ...account, name, email: normalizedEmail }
          : account
      );
      localStorage.setItem(
        "cv_accounts",
        JSON.stringify(updatedAccounts)
      );
    }

    localStorage.setItem(
      "cv_user",
      JSON.stringify({
        name,
        email: normalizedEmail,
      })
    );

    setMessage("Profile updated successfully.");
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              CV
            </div>

            <span className="text-xl font-bold text-slate-900">
              CV Maker
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your CV Maker account.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          {/* PROFILE CARD */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
              {name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                {name || "User"}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                {email}
              </p>
            </div>
          </div>

          {/* SETTINGS */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Account Information
            </h2>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </span>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              {message && (
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  ✓ {message}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={saveProfile}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Save Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}