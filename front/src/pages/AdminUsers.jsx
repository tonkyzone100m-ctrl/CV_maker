import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, isApiConfigured } from "../services/api";
import { useAuth } from "../context/auth";

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(
    isApiConfigured
      ? ""
      : "The admin panel requires a configured backend API."
  );

  useEffect(() => {
    if (!isApiConfigured) {
      return;
    }

    adminApi.users()
      .then((response) => setUsers(response.users))
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Administrator
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">User accounts</h1>
          <p className="mt-2 text-slate-500">
            Every account is uniquely identified by its normalized email address.
          </p>
        </div>
        <Link to="/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Back to dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Unique email</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">CVs</th>
              <th className="px-5 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((account) => (
              <tr key={account.id} className={account.email === user?.email ? "bg-blue-50/50" : ""}>
                <td className="px-5 py-4 font-semibold text-slate-900">{account.name}</td>
                <td className="px-5 py-4 font-mono text-slate-700">{account.email}</td>
                <td className="px-5 py-4">{account.role}</td>
                <td className="px-5 py-4">{account.cvCount}</td>
                <td className="px-5 py-4 text-slate-500">
                  {new Date(account.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
