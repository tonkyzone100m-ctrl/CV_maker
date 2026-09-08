// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { cvApi, isApiConfigured } from "../services/api";
import BrandLogo from "../components/BrandLogo";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const userStorageKey =
    user?.id || user?.email?.trim().toLowerCase() || null;
  const [cvs, setCvs] = useState([]);

  useEffect(() => {
    if (!userStorageKey) {
      return;
    }

    if (isApiConfigured) {
      cvApi
        .list()
        .then((response) => setCvs(response.cvs))
        .catch((error) => {
          console.error("Failed to load CVs:", error);
          setCvs([]);
        });
      return;
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem(`cvs_${userStorageKey}`) || "[]"
      );
      Promise.resolve().then(() =>
        setCvs(Array.isArray(saved) ? saved : [])
      );
    } catch (error) {
      console.error("Failed to load local CVs:", error);
      Promise.resolve().then(() => setCvs([]));
    }
  }, [userStorageKey]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function deleteCV(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this CV?"
    );

    if (!confirmed) return;

    const updated = cvs.filter((cv) => cv.id !== id);

    if (isApiConfigured) {
      cvApi.remove(id).then(() => setCvs(updated));
      return;
    }

    localStorage.setItem(
      `cvs_${userStorageKey}`,
      JSON.stringify(updated)
    );
    setCvs(updated);
  }

  function duplicateCV(cv) {
    const duplicate = {
      ...cv,
      id: `${cv.id}-copy-${cvs.length}`,
      name: `${cv.name} Copy`,
      updated: new Date().toLocaleDateString(),
    };

    const updated = [duplicate, ...cvs];

    if (isApiConfigured) {
      cvApi.create({
        ...duplicate,
        id: undefined,
      }).then((response) => setCvs([response.cv, ...cvs]));
      return;
    }

    localStorage.setItem(
      `cvs_${userStorageKey}`,
      JSON.stringify(updated)
    );
    setCvs(updated);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <BrandLogo compact />

            <span className="text-xl font-bold">
              CV Maker
            </span>
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </span>
              <span className="max-w-32 truncate">
                {user?.name || "User"}
              </span>
              <span aria-hidden="true" className="text-xs">
                {menuOpen ? "▲" : "▼"}
              </span>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
              >
                <Link
                  to="/profile"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  My Profile
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">
              My CVs
            </h1>

            <p className="mt-2 text-slate-500">
              Create, edit and manage your professional CVs.
            </p>
          </div>

          <Link
            to="/create-cv"
            className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Create New CV
          </Link>
        </div>

        {cvs.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📄
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No CVs yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Create your first professional CV and start building
              your career profile.
            </p>

            <Link
              to="/create-cv"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Create Your First CV
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-64 items-center justify-center bg-slate-100 p-6">
                  <div className="h-full w-full max-w-[210px] overflow-hidden bg-white p-5 shadow-md">
                    <div className="border-b pb-3">
                      <div className="h-3 w-24 rounded bg-slate-800" />
                      <div className="mt-2 h-2 w-16 rounded bg-blue-500" />
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="h-2 w-full rounded bg-slate-200" />
                      <div className="h-2 w-5/6 rounded bg-slate-200" />
                      <div className="h-2 w-4/5 rounded bg-slate-200" />
                    </div>

                    <div className="mt-5 space-y-2">
                      <div className="h-2 w-20 rounded bg-slate-800" />
                      <div className="h-2 w-full rounded bg-slate-200" />
                      <div className="h-2 w-full rounded bg-slate-200" />
                      <div className="h-2 w-3/4 rounded bg-slate-200" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="truncate font-bold text-slate-900">
                    {cv.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {cv.title}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Updated {cv.updated}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Link
                      to={`/edit-cv/${cv.id}`}
                      className="rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => duplicateCV(cv)}
                      className="rounded-lg border py-2.5 text-sm font-semibold hover:bg-slate-50"
                    >
                      Duplicate
                    </button>
                  </div>

                  <button
                    onClick={() => deleteCV(cv.id)}
                    className="mt-3 w-full rounded-lg py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    Delete CV
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}