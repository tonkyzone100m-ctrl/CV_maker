const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = (configuredApiUrl || "").replace(/\/$/, "");
const TOKEN_KEY = "cv_access_token";

export const isApiConfigured = Boolean(API_URL) || import.meta.env.DEV;

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error(`API request failed for ${API_URL}${path}:`, error);
    const target = import.meta.env.DEV
      ? "the local backend at http://localhost:4000"
      : "the configured backend";
    throw new Error(
      `Cannot reach ${target}. Start the backend locally or set VITE_API_URL to its public HTTPS URL.`,
      { cause: error }
    );
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || "The request could not be completed.");
  }

  return body;
}

export const authApi = {
  login: (credentials) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (user) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  me: () => request("/api/auth/me"),
};

export const adminApi = {
  users: () => request("/api/admin/users"),
};

export const aiApi = {
  professionalSummary: (cv) =>
    request("/api/ai/professional-summary", {
      method: "POST",
      body: JSON.stringify(cv),
    }),
};

export const cvApi = {
  list: () => request("/api/cvs"),
  create: (cv) =>
    request("/api/cvs", {
      method: "POST",
      body: JSON.stringify(cv),
    }),
  update: (id, cv) =>
    request(`/api/cvs/${id}`, {
      method: "PUT",
      body: JSON.stringify(cv),
    }),
  remove: (id) =>
    request(`/api/cvs/${id}`, {
      method: "DELETE",
    }),
};

export const healthApi = {
  check: () => request("/api/health"),
};