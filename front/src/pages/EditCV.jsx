// src/pages/EditCV.jsx

import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cvApi, isApiConfigured } from "../services/api";
import { useAuth } from "../context/auth";

export default function EditCV() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userStorageKey =
    user?.id || user?.email?.trim().toLowerCase() || null;

  const loadCV = useCallback(async () => {
    try {
      if (isApiConfigured) {
        const response = await cvApi.list();
        const cv = response.cvs.find((item) => String(item.id) === String(id));
        if (!cv) {
          alert("CV not found.");
          navigate("/dashboard", { replace: true });
          return;
        }
        localStorage.setItem(
          `cv_draft_${userStorageKey}`,
          JSON.stringify(cv)
        );
        navigate(`/create-cv?edit=${cv.id}`, { replace: true });
        return;
      }

      const saved = JSON.parse(
        localStorage.getItem(
          `cvs_${userStorageKey}`
        ) || "[]"
      );

      if (!Array.isArray(saved)) {
        alert("No saved CVs were found.");
        navigate("/dashboard", { replace: true });
        return;
      }

      const cv = saved.find(
        (item) => String(item.id) === String(id)
      );

      if (!cv) {
        alert("CV not found.");
        navigate("/dashboard", { replace: true });
        return;
      }

      // Store selected CV as the current draft
      localStorage.setItem(
        `cv_draft_${userStorageKey}`,
        JSON.stringify(cv)
      );

      // Store selected template
      if (cv.template) {
        localStorage.setItem(
          "cv_template",
          cv.template
        );
      }

      // Open the main CV editor
      navigate(`/create-cv?edit=${cv.id}`, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Failed to load CV for editing:",
        error
      );

      alert("Could not load this CV.");

      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [id, navigate, userStorageKey]);

  useEffect(() => {
    loadCV();
  }, [loadCV]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-2xl bg-white px-8 py-10 text-center shadow-lg">

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>

        <h1 className="text-xl font-bold text-slate-900">
          Loading CV...
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Preparing your CV for editing.
        </p>

      </div>
    </div>
  );
}