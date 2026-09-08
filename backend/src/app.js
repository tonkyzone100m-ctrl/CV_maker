const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const {
  clientOrigin,
  adminEmail,
  aiApiKey,
  aiApiUrl,
  aiModel,
} = require("./config");
const { createToken, requireAuth } = require("./auth");
const { prisma } = require("./db");

const app = express();

app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: "6mb" }));

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role:
      user.role === "ADMIN" || user.email === adminEmail
        ? "ADMIN"
        : user.role || "USER",
  };
}

async function requireAdmin(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true, email: true },
    });

    if (!user || (user.role !== "ADMIN" && user.email !== adminEmail)) {
      return res.status(403).json({ message: "Administrator access is required." });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

const cvInclude = {
  experience: { orderBy: { sortOrder: "asc" } },
  education: { orderBy: { sortOrder: "asc" } },
  skills: { orderBy: { sortOrder: "asc" } },
  projects: { orderBy: { sortOrder: "asc" } },
  languages: { orderBy: { sortOrder: "asc" } },
};

function publicCV(cv) {
  return {
    ...cv,
    experience: cv.experience || [],
    education: cv.education || [],
    skills: (cv.skills || []).map((item) => item.name),
    projects: cv.projects || [],
    languages: cv.languages || [],
  };
}

function relationData(cv) {
  return {
    experience: {
      create: (Array.isArray(cv.experience) ? cv.experience : []).map((item, index) => ({
        jobTitle: item.jobTitle || item.position || "",
        company: item.company || "",
        location: item.location || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        description: item.description || "",
        sortOrder: index,
      })),
    },
    education: {
      create: (Array.isArray(cv.education) ? cv.education : []).map((item, index) => ({
        degree: item.degree || "",
        school: item.school || "",
        location: item.location || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        description: item.description || "",
        sortOrder: index,
      })),
    },
    skills: {
      create: (Array.isArray(cv.skills) ? cv.skills : []).map((item, index) => ({
        name: typeof item === "string" ? item : item.name || item.title || "",
        sortOrder: index,
      })),
    },
    projects: {
      create: (Array.isArray(cv.projects) ? cv.projects : []).map((item, index) => ({
        name: item.name || "",
        title: item.title || "",
        description: item.description || "",
        technologies: Array.isArray(item.technologies)
          ? item.technologies.join(", ")
          : item.technologies || "",
        sortOrder: index,
      })),
    },
    languages: {
      create: (Array.isArray(cv.languages) ? cv.languages : []).map((item, index) => ({
        name: typeof item === "string" ? item : item.name || "",
        language: typeof item === "string" ? item : item.language || "",
        level: typeof item === "string" ? "" : item.level || "",
        sortOrder: index,
      })),
    },
  };
}

function scalarCVData(cv) {
  return {
    name: cv.name || "",
    title: cv.title || "",
    email: cv.email || "",
    photo: cv.photo || "",
    phone: cv.phone || "",
    location: cv.location || "",
    website: cv.website || "",
    summary: cv.summary || "",
    template: cv.template || "professional",
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cv-maker-api" });
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({
        message: "Name, email and a password of at least 6 characters are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    let user;
    try {
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          passwordHash: await bcrypt.hash(password, 12),
        },
      });
    } catch (error) {
      if (error?.code === "P2002") {
        return res.status(409).json({ message: "An account with this email already exists." });
      }
      throw error;
    }
    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: String(req.body.email || "").trim().toLowerCase() },
    });
    if (!user || !(await bcrypt.compare(req.body.password || "", user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    return res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/auth/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/admin/users", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { cvs: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cvCount: user._count.cvs,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/cvs", requireAuth, async (req, res, next) => {
  try {
    const cvs = await prisma.cV.findMany({
      where: { userId: req.userId },
      include: cvInclude,
      orderBy: { updatedAt: "desc" },
    });

    return res.json({ cvs: cvs.map(publicCV) });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/ai/professional-summary", requireAuth, async (req, res, next) => {
  try {
    if (!aiApiKey) {
      return res.status(503).json({
        message:
          "AI summary generation is not configured. Add AI_API_KEY to the backend environment.",
      });
    }

    const {
      name = "",
      title = "",
      experience = [],
      education = [],
      skills = [],
    } = req.body || {};

    const prompt = [
      "Write one professional CV summary in English.",
      "Use third-person voice without first-person pronouns.",
      "Use 45-75 words, 3-4 concise sentences, and no headings or bullet points.",
      "Do not invent employers, dates, qualifications, achievements, metrics, or skills.",
      `Candidate name: ${String(name).trim() || "Not provided"}`,
      `Professional title: ${String(title).trim() || "Not provided"}`,
      `Skills: ${JSON.stringify(Array.isArray(skills) ? skills.slice(0, 20) : [])}`,
      `Experience: ${JSON.stringify(
        Array.isArray(experience) ? experience.slice(0, 8) : []
      )}`,
      `Education: ${JSON.stringify(
        Array.isArray(education) ? education.slice(0, 5) : []
      )}`,
    ].join("\n");

    let response;
    try {
      response = await fetch(aiApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aiApiKey}`,
        },
        body: JSON.stringify({
          model: aiModel,
          temperature: 0.7,
          max_tokens: 180,
          messages: [
            {
              role: "system",
              content: "You are a professional CV writing assistant.",
            },
            { role: "user", content: prompt },
          ],
        }),
        signal: AbortSignal.timeout(30000),
      });
    } catch (error) {
      console.error("AI provider is unreachable:", error);
      return res.status(503).json({
        message:
          "The AI provider is unavailable. Check AI_API_URL and try again.",
      });
    }

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("AI provider request failed:", response.status, body);
      const providerMessage =
        typeof body?.error?.message === "string"
          ? body.error.message
          : "";
      return res.status(502).json({
        message: providerMessage
          ? `AI provider error: ${providerMessage}`
          : `AI provider rejected the request (HTTP ${response.status}). Check AI_MODEL and AI_API_KEY.`,
      });
    }

    const summary = body?.choices?.[0]?.message?.content?.trim();
    if (!summary) {
      return res.status(502).json({
        message: "The AI assistant returned an empty summary.",
      });
    }

    return res.json({ summary });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/cvs", requireAuth, async (req, res, next) => {
  try {
    const cv = await prisma.cV.create({
      data: {
        userId: req.userId,
        ...scalarCVData(req.body),
        ...relationData(req.body),
      },
      include: cvInclude,
    });
    return res.status(201).json({ cv: publicCV(cv) });
  } catch (error) {
    return next(error);
  }
});

app.put("/api/cvs/:id", requireAuth, async (req, res, next) => {
  try {
    const existingCV = await prisma.cV.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existingCV) return res.status(404).json({ message: "CV not found." });
    const cv = await prisma.cV.update({
      where: { id: existingCV.id },
      data: {
        ...scalarCVData(req.body),
        experience: { deleteMany: {}, ...relationData(req.body).experience },
        education: { deleteMany: {}, ...relationData(req.body).education },
        skills: { deleteMany: {}, ...relationData(req.body).skills },
        projects: { deleteMany: {}, ...relationData(req.body).projects },
        languages: { deleteMany: {}, ...relationData(req.body).languages },
      },
      include: cvInclude,
    });
    return res.json({ cv: publicCV(cv) });
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/cvs/:id", requireAuth, async (req, res, next) => {
  try {
    const result = await prisma.cV.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });
    if (result.count === 0) return res.status(404).json({ message: "CV not found." });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error?.code === "P1001" || error?.code === "P1000") {
    return res.status(503).json({
      message:
        "The database is unavailable. Start PostgreSQL locally or configure the Railway DATABASE_URL.",
    });
  }
  res.status(500).json({ message: "Internal server error." });
});

module.exports = app;
