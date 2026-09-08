import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import CVPreview from "../components/CVPreview";
import CVProgress from "../components/CVProgress";
import { downloadCVAsPDF } from "../services/pdf";
import { cvApi, isApiConfigured } from "../services/api";
import { useAuth } from "../context/auth";



const emptyExperience = {
  id: Date.now(),
  jobTitle: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};

const emptyEducation = {
  id: Date.now() + 1,
  degree: "",
  school: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};

const initialCV = {
  name: "",
  title: "",
  email: "",
  photo: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
};

const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and traditional",
    color: "bg-blue-600",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold and contemporary",
    color: "bg-slate-900",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
    color: "bg-slate-300",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Distinctive and visual",
    color: "bg-purple-600",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium leadership",
    color: "bg-slate-950",
  },
  {
    id: "tech",
    name: "Tech",
    description: "For technology careers",
    color: "bg-emerald-600",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Business and finance",
    color: "bg-slate-600",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated design",
    color: "bg-rose-700",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Research and education",
    color: "bg-blue-800",
  },
  {
    id: "student",
    name: "Student",
    description: "Students and graduates",
    color: "bg-sky-600",
  },
];

export default function CreateCV() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const editId = searchParams.get("edit");
  const userStorageKey =
    user?.id || user?.email?.trim().toLowerCase() || null;

  const selectedFromUrl = searchParams.get("template");

  const [template, setTemplate] = useState(
    templates.some((item) => item.id === selectedFromUrl)
      ? selectedFromUrl
      : "professional"
  );

  const [cv, setCV] = useState(initialCV);

  const [skillInput, setSkillInput] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const [saved, setSaved] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [validationMessage, setValidationMessage] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const previewRef = useRef(null);
  const photoInputRef = useRef(null);
  const loadedStorageKeyRef = useRef(null);

  function normalizeCV(parsed) {
    return {
      ...initialCV,
      ...parsed,
      experience: Array.isArray(parsed.experience)
        ? parsed.experience
        : [],
      education: Array.isArray(parsed.education)
        ? parsed.education
        : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      languages: Array.isArray(parsed.languages) ? parsed.languages : [],
      photo: typeof parsed.photo === "string" ? parsed.photo : "",
    };
  }

  useEffect(() => {
    if (!userStorageKey) {
      loadedStorageKeyRef.current = null;
      return;
    }

    let nextCV = initialCV;
    const savedDraft = localStorage.getItem(
      `cv_draft_${userStorageKey}`
    );

    if (savedDraft) {
      try {
        nextCV = normalizeCV(JSON.parse(savedDraft));
      } catch (error) {
        console.error("Failed to load CV draft:", error);
      }
    }

    Promise.resolve().then(() => {
      loadedStorageKeyRef.current = userStorageKey;
      setCV(nextCV);
      setSaved(false);
      setSaveStatus("idle");
    });
  }, [userStorageKey]);

  useEffect(() => {
    if (
      !userStorageKey ||
      loadedStorageKeyRef.current !== userStorageKey
    ) {
      return;
    }

    const handleBeforeUnload = (event) => {
      if (!saved) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saved, userStorageKey]);

  useEffect(() => {
    if (
      !userStorageKey ||
      loadedStorageKeyRef.current !== userStorageKey
    ) {
      return;
    }

    try {
      localStorage.setItem(
        `cv_draft_${userStorageKey}`,
        JSON.stringify(cv)
      );
    } catch (error) {
      console.error(
        "Failed to save CV draft:",
        error
      );
    }
  }, [cv, userStorageKey]);

  const selectedTemplate = useMemo(
    () =>
      templates.find(
        (item) => item.id === template
      ),
    [template]
  );

  function validateCV(cvData) {
    const errors = [];

    if (!cvData.name?.trim()) {
      errors.push("Full name is required.");
    }

    if (!cvData.title?.trim()) {
      errors.push("Professional title is required.");
    }

    if (!cvData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.email.trim())) {
      errors.push("A valid email address is required.");
    }

    if (!cvData.summary?.trim() || cvData.summary.trim().length < 50) {
      errors.push("Professional summary should be at least 50 characters long.");
    }

    if (!Array.isArray(cvData.experience) || cvData.experience.length === 0) {
      errors.push("Add at least one work experience entry.");
    }

    if (!Array.isArray(cvData.education) || cvData.education.length === 0) {
      errors.push("Add at least one education entry.");
    }

    if (!Array.isArray(cvData.skills) || cvData.skills.length < 3) {
      errors.push("Add at least 3 skills.");
    }

    return errors;
  }

  function markUnsaved() {
    setSaved(false);
    setSaveStatus("idle");
    setValidationMessage("");
  }

  function updateField(field, value) {
    setCV((current) => ({
      ...current,
      [field]: value,
    }));

    markUnsaved();
  }

  function handlePhotoUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setPhotoError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setPhotoError(
        "Please upload a JPG, PNG, or WebP image."
      );

      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setPhotoError(
        "Photo is too large. Maximum size is 5MB."
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setCV((current) => ({
        ...current,
        photo: reader.result,
      }));

      markUnsaved();
      setPhotoError("");
    };

    reader.onerror = () => {
      setPhotoError(
        "Unable to read this photo. Please try another image."
      );
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  }

  function removePhoto() {
    setCV((current) => ({
      ...current,
      photo: "",
    }));

    setPhotoError("");
    markUnsaved();

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }

  function addExperience() {
    setCV((current) => ({
      ...current,
      experience: [
        ...current.experience,
        {
          ...emptyExperience,
          id: Date.now() + Math.random(),
        },
      ],
    }));

    markUnsaved();
  }

  function updateExperience(id, field, value) {
    setCV((current) => ({
      ...current,
      experience: current.experience.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));

    markUnsaved();
  }

  function removeExperience(id) {
    setCV((current) => ({
      ...current,
      experience: current.experience.filter(
        (item) => item.id !== id
      ),
    }));

    markUnsaved();
  }

  function addEducation() {
    setCV((current) => ({
      ...current,
      education: [
        ...current.education,
        {
          ...emptyEducation,
          id: Date.now() + Math.random(),
        },
      ],
    }));

    markUnsaved();
  }

  function updateEducation(id, field, value) {
    setCV((current) => ({
      ...current,
      education: current.education.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));

    markUnsaved();
  }

  function removeEducation(id) {
    setCV((current) => ({
      ...current,
      education: current.education.filter(
        (item) => item.id !== id
      ),
    }));

    markUnsaved();
  }

  function addTag(field, value, setter) {
    const cleanValue = value.trim();

    if (!cleanValue) return;

    setCV((current) => {
      const existingValues = current[field] || [];

      const alreadyExists = existingValues.some(
        (item) =>
          String(item)
            .trim()
            .toLowerCase() ===
          cleanValue.toLowerCase()
      );

      if (alreadyExists) {
        return current;
      }

      return {
        ...current,
        [field]: [
          ...existingValues,
          cleanValue,
        ],
      };
    });

    setter("");
    markUnsaved();
  }

  function removeTag(field, index) {
    setCV((current) => ({
      ...current,
      [field]: current[field].filter(
        (_, itemIndex) =>
          itemIndex !== index
      ),
    }));

    markUnsaved();
  }

  async function saveCV() {
    const payload = { ...cv, template };
    const errors = validateCV(payload);

    if (errors.length > 0) {
      setValidationMessage(errors[0]);
      setSaveStatus("error");
      return;
    }

    setValidationMessage("");
    setSaveStatus("saving");

    try {
      if (isApiConfigured) {
        const response = editId
          ? await cvApi.update(editId, payload)
          : await cvApi.create(payload);
        localStorage.setItem(
          `cv_draft_${userStorageKey}`,
          JSON.stringify(response.cv)
        );
        setSaved(true);
        setSaveStatus("saved");
        setTimeout(() => navigate("/dashboard"), 700);
        return;
      }

      const existingCVs = JSON.parse(
        localStorage.getItem(
          `cvs_${userStorageKey}`
        ) || "[]"
      );

      const now = new Date().toISOString();

      const newCV = {
        ...payload,
        id: Date.now(),
        template,
        createdAt: now,
        updatedAt: now,
      };

      localStorage.setItem(
        `cvs_${userStorageKey}`,
        JSON.stringify([
          newCV,
          ...existingCVs,
        ])
      );

      localStorage.setItem(
        `cv_draft_${userStorageKey}`,
        JSON.stringify(payload)
      );

      setSaved(true);
      setSaveStatus("saved");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      console.error(
        "Failed to save CV:",
        error
      );

      setValidationMessage(
        "Unable to save your CV. Please check your data and try again."
      );
      setSaveStatus("error");
    }
  }

  async function downloadPDF() {
    if (!previewRef.current) {
      alert("CV preview is not ready.");
      return;
    }

    setDownloading(true);

    try {
      const safeName =
        (cv.name || "my-cv")
          .trim()
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-+|-+$/g, "")
          .toLowerCase() || "my-cv";

      await downloadCVAsPDF(
        previewRef.current,
        `${safeName}-cv.pdf`
      );
    } catch (error) {
      console.error(
        "PDF generation failed:",
        error
      );

      alert(
        "Unable to generate the PDF. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* TOP BAR */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm print:hidden">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4">

          <div className="flex items-center gap-4">

            <Link
              to="/dashboard"
              className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              ← Dashboard
            </Link>

            <div>
              <h1 className="font-bold text-slate-900">
                Create CV
              </h1>

              <p className="text-xs text-slate-500">
                {selectedTemplate?.name} template
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            {saveStatus === "saved" && (
              <span className="mr-2 text-sm font-medium text-green-600">
                ✓ Saved
              </span>
            )}

            {saveStatus === "saving" && (
              <span className="mr-2 text-sm font-medium text-blue-600">
                Saving...
              </span>
            )}

            {saveStatus === "error" && validationMessage && (
              <span className="mr-2 max-w-xs text-xs font-medium text-red-600">
                {validationMessage}
              </span>
            )}

            <button
              type="button"
              onClick={downloadPDF}
              disabled={downloading}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloading
                ? "Generating..."
                : "Download PDF"}
            </button>

            <button
              type="button"
              onClick={saveCV}
              disabled={saveStatus === "saving"}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveStatus === "saving" ? "Saving..." : "Save CV"}
            </button>

          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-6 px-5 py-6 lg:grid-cols-[760px_1fr]">

        {/* EDITOR */}
        <section className="space-y-6 print:hidden lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-6 lg:space-y-0">

          {/* TEMPLATE SELECTOR */}
          <div className="lg:sticky lg:top-24">
            <CVProgress cv={cv} />
          </div>

          <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <div className="mb-4">
              <h2 className="font-bold text-slate-900">
                Choose Template
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your information stays the same while
                the design changes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTemplate(item.id);
                    markUnsaved();
                  }}
                  className={`rounded-xl border p-3 text-left transition ${
                    template === item.id
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`mb-3 h-16 rounded-lg ${item.color}`}
                  />

                  <div className="flex items-center justify-between gap-2">

                    <p className="text-sm font-bold text-slate-900">
                      {item.name}
                    </p>

                    {item.id === "professional" ||
                    item.id === "modern" ||
                    item.id === "executive" ? (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700">
                        Popular
                      </span>
                    ) : null}

                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <EditorCard title="Personal Information">

            {/* PROFILE PHOTO */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                {cv.photo ? (
                  <div className="relative shrink-0">

                    <img
                      src={cv.photo}
                      alt="CV profile"
                      className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                    />

                    <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-green-500 text-xs text-white">
                      ✓
                    </span>

                  </div>
                ) : (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-3xl">
                    📷
                  </div>
                )}

                <div className="flex-1">

                  <div className="flex items-center gap-2">

                    <h3 className="font-semibold text-slate-900">
                      Profile Photo
                    </h3>

                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      Optional
                    </span>

                  </div>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Add a professional photo if it is
                    appropriate for your industry or
                    job market.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">

                      {cv.photo
                        ? "Change Photo"
                        : "Choose Photo"}

                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />

                    </label>

                    {cv.photo && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    JPG, PNG or WebP · Maximum 5MB
                  </p>

                  {photoError && (
                    <p className="mt-2 text-sm font-medium text-red-600">
                      {photoError}
                    </p>
                  )}

                </div>
              </div>
            </div>

            {/* PERSONAL FIELDS */}
            <div className="grid gap-4 sm:grid-cols-2">

              <Field
                label="Full Name"
                value={cv.name}
                onChange={(value) =>
                  updateField("name", value)
                }
                placeholder="John Doe"
                required
              />

              <Field
                label="Professional Title"
                value={cv.title}
                onChange={(value) =>
                  updateField("title", value)
                }
                placeholder="Software Developer"
              />

              <Field
                label="Email"
                type="email"
                value={cv.email}
                onChange={(value) =>
                  updateField("email", value)
                }
                placeholder="john@example.com"
                required
              />

              <Field
                label="Phone"
                value={cv.phone}
                onChange={(value) =>
                  updateField("phone", value)
                }
                placeholder="+250 7XX XXX XXX"
              />

              <Field
                label="Location"
                value={cv.location}
                onChange={(value) =>
                  updateField("location", value)
                }
                placeholder="Kigali, Rwanda"
              />

              <Field
                label="Website"
                value={cv.website}
                onChange={(value) =>
                  updateField("website", value)
                }
                placeholder="www.example.com"
              />

            </div>

            <TextArea
              label="Professional Summary"
              value={cv.summary}
              onChange={(value) =>
                updateField("summary", value)
              }
              placeholder="Write a short professional summary..."
            />

          </EditorCard>

          {/* EXPERIENCE */}
          <EditorCard
            title="Work Experience"
            action={
              <button
                type="button"
                onClick={addExperience}
                className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
              >
                + Add Experience
              </button>
            }
          >
            {cv.experience.length === 0 ? (
              <EmptySection text="No work experience added yet." />
            ) : (
              <div className="space-y-5">

                {cv.experience.map(
                  (item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >

                      <div className="mb-4 flex items-center justify-between">

                        <h3 className="font-semibold text-slate-800">
                          Experience {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeExperience(
                              item.id
                            )
                          }
                          className="text-sm font-semibold text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>

                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">

                        <Field
                          label="Job Title"
                          value={item.jobTitle}
                          onChange={(value) =>
                            updateExperience(
                              item.id,
                              "jobTitle",
                              value
                            )
                          }
                          placeholder="Software Developer"
                        />

                        <Field
                          label="Company"
                          value={item.company}
                          onChange={(value) =>
                            updateExperience(
                              item.id,
                              "company",
                              value
                            )
                          }
                          placeholder="Company Name"
                        />

                        <Field
                          label="Location"
                          value={item.location}
                          onChange={(value) =>
                            updateExperience(
                              item.id,
                              "location",
                              value
                            )
                          }
                          placeholder="Kigali"
                        />

                        <Field
                          label="Start Date"
                          type="month"
                          value={item.startDate}
                          onChange={(value) =>
                            updateExperience(
                              item.id,
                              "startDate",
                              value
                            )
                          }
                        />

                        <Field
                          label="End Date"
                          type="month"
                          value={item.endDate}
                          onChange={(value) =>
                            updateExperience(
                              item.id,
                              "endDate",
                              value
                            )
                          }
                        />

                      </div>

                      <TextArea
                        label="Description"
                        value={item.description}
                        onChange={(value) =>
                          updateExperience(
                            item.id,
                            "description",
                            value
                          )
                        }
                        placeholder="Describe your responsibilities and achievements..."
                      />

                    </div>
                  )
                )}

              </div>
            )}
          </EditorCard>

          {/* EDUCATION */}
          <EditorCard
            title="Education"
            action={
              <button
                type="button"
                onClick={addEducation}
                className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
              >
                + Add Education
              </button>
            }
          >
            {cv.education.length === 0 ? (
              <EmptySection text="No education added yet." />
            ) : (
              <div className="space-y-5">

                {cv.education.map(
                  (item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >

                      <div className="mb-4 flex items-center justify-between">

                        <h3 className="font-semibold text-slate-800">
                          Education {index + 1}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            removeEducation(
                              item.id
                            )
                          }
                          className="text-sm font-semibold text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>

                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">

                        <Field
                          label="Degree"
                          value={item.degree}
                          onChange={(value) =>
                            updateEducation(
                              item.id,
                              "degree",
                              value
                            )
                          }
                          placeholder="Bachelor of Computer Science"
                        />

                        <Field
                          label="School"
                          value={item.school}
                          onChange={(value) =>
                            updateEducation(
                              item.id,
                              "school",
                              value
                            )
                          }
                          placeholder="University Name"
                        />

                        <Field
                          label="Location"
                          value={item.location}
                          onChange={(value) =>
                            updateEducation(
                              item.id,
                              "location",
                              value
                            )
                          }
                          placeholder="Kigali"
                        />

                        <Field
                          label="Start Date"
                          type="month"
                          value={item.startDate}
                          onChange={(value) =>
                            updateEducation(
                              item.id,
                              "startDate",
                              value
                            )
                          }
                        />

                        <Field
                          label="End Date"
                          type="month"
                          value={item.endDate}
                          onChange={(value) =>
                            updateEducation(
                              item.id,
                              "endDate",
                              value
                            )
                          }
                        />

                      </div>

                      <TextArea
                        label="Description"
                        value={item.description}
                        onChange={(value) =>
                          updateEducation(
                            item.id,
                            "description",
                            value
                          )
                        }
                        placeholder="Relevant coursework, achievements..."
                      />

                    </div>
                  )
                )}

              </div>
            )}
          </EditorCard>

          {/* SKILLS */}
          <EditorCard title="Skills">

            <TagInput
              placeholder="e.g. React"
              value={skillInput}
              setValue={setSkillInput}
              add={() =>
                addTag(
                  "skills",
                  skillInput,
                  setSkillInput
                )
              }
            />

            <Tags
              items={cv.skills}
              remove={(index) =>
                removeTag(
                  "skills",
                  index
                )
              }
            />

          </EditorCard>

          {/* PROJECTS */}
          <EditorCard title="Projects">

            <TagInput
              placeholder="e.g. CV Maker App"
              value={projectInput}
              setValue={setProjectInput}
              add={() =>
                addTag(
                  "projects",
                  projectInput,
                  setProjectInput
                )
              }
            />

            <Tags
              items={cv.projects}
              remove={(index) =>
                removeTag(
                  "projects",
                  index
                )
              }
            />

          </EditorCard>

          {/* LANGUAGES */}
          <EditorCard title="Languages">

            <TagInput
              placeholder="e.g. English"
              value={languageInput}
              setValue={setLanguageInput}
              add={() =>
                addTag(
                  "languages",
                  languageInput,
                  setLanguageInput
                )
              }
            />

            <Tags
              items={cv.languages}
              remove={(index) =>
                removeTag(
                  "languages",
                  index
                )
              }
            />

          </EditorCard>

          </div>
        </section>

        {/* PREVIEW */}
        <section className="lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-auto">

          <div className="mb-4 flex items-center justify-between print:hidden">

            <div>
              <h2 className="font-bold text-slate-900">
                Live Preview
              </h2>

              <p className="text-sm text-slate-500">
                Your CV updates automatically.
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
              {selectedTemplate?.name}
            </span>

          </div>

          <div className="overflow-auto rounded-xl">

            <div ref={previewRef}>

              <CVPreview
                cv={cv}
                template={template}
              />

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

function EditorCard({
  title,
  action,
  children,
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">

      <div className="mb-5 flex items-center justify-between gap-4">

        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        {action}

      </div>

      {children}

    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-sm font-medium text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </span>

      <input
        type={type}
        value={value || ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <label className="mt-4 block">

      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <textarea
        value={value || ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

    </label>
  );
}

function TagInput({
  value,
  setValue,
  add,
  placeholder,
}) {
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      add();
    }
  }

  return (
    <div className="flex gap-2">

      <input
        value={value}
        onChange={(event) =>
          setValue(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      <button
        type="button"
        onClick={add}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        Add
      </button>

    </div>
  );
}

function Tags({
  items,
  remove,
}) {
  if (!items.length) {
    return (
      <p className="mt-4 text-sm text-slate-400">
        Nothing added yet.
      </p>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">

      {items.map((item, index) => {

        const label =
          typeof item === "string"
            ? item
            : item?.name ||
              item?.title ||
              "Item";

        return (
          <span
            key={`${label}-${index}`}
            className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
          >

            {label}

            <button
              type="button"
              onClick={() =>
                remove(index)
              }
              className="font-bold text-blue-400 hover:text-red-500"
              aria-label={`Remove ${label}`}
            >
              ×
            </button>

          </span>
        );
      })}

    </div>
  );
}

function EmptySection({
  text,
}) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 px-5 py-8 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}