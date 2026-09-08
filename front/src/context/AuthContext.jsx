import { useEffect, useState } from "react";
import {
  authApi,
  getAccessToken,
  isApiConfigured,
  setAccessToken,
} from "../services/api";
import { AuthContext } from "./auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("cv_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(
    isApiConfigured && Boolean(getAccessToken())
  );

  useEffect(() => {
    if (!isApiConfigured || !getAccessToken()) return;

    authApi
      .me()
      .then((response) => setUser(response.user))
      .catch(() => {
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cv_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("cv_user");
    }
  }, [user]);

  async function login(email, password) {
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    if (isApiConfigured) {
      try {
        const response = await authApi.login({ email, password });
        setAccessToken(response.token);
        setUser(response.user);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const accounts = JSON.parse(
      localStorage.getItem("cv_accounts") ||
        localStorage.getItem("cv_account") ||
        "[]"
    );
    const savedAccounts = Array.isArray(accounts) ? accounts : [accounts];
    const savedUser = savedAccounts.find(
      (account) =>
        account?.email?.trim().toLowerCase() === normalizedEmail
    );

    if (
      savedUser &&
      savedUser.email.trim().toLowerCase() === normalizedEmail &&
      savedUser.password === password
    ) {
      setUser({
        name: savedUser.name,
        email: normalizedEmail,
        role: savedUser.role || "USER",
      });

      return { success: true };
    }

    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  async function register(name, email, password) {
    if (!name || !email || !password) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    if (isApiConfigured) {
      try {
        const response = await authApi.register({
          name,
          email,
          password,
        });
        setAccessToken(response.token);
        setUser(response.user);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingAccounts = JSON.parse(
      localStorage.getItem("cv_accounts") || "[]"
    );
    const accounts = Array.isArray(existingAccounts)
      ? existingAccounts
      : [];

    if (
      accounts.some(
        (account) =>
          account?.email?.trim().toLowerCase() === normalizedEmail
      )
    ) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const account = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "USER",
    };

    localStorage.setItem(
      "cv_accounts",
      JSON.stringify([...accounts, account])
    );

    setUser({
      name: name.trim(),
      email: normalizedEmail,
      role: "USER",
    });

    return { success: true };
  }

  function logout() {
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
