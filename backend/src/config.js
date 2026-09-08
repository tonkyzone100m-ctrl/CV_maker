require("dotenv").config();

const port = Number(process.env.PORT || 4000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

module.exports = {
  port,
  jwtSecret: process.env.JWT_SECRET || "development-only-secret",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  adminEmail: (process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
  aiApiKey: process.env.AI_API_KEY || "",
  aiApiUrl: process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions",
  aiModel: process.env.AI_MODEL || "gpt-4o-mini",
};
