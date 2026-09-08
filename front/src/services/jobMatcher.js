const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "you",
  "your",
  "are",
  "our",
  "will",
  "have",
  "has",
  "been",
  "was",
  "were",
  "into",
  "their",
  "they",
  "them",
  "about",
  "work",
  "working",
  "using",
  "years",
  "year",
  "role",
  "job",
  "team",
  "able",
  "ability",
  "required",
  "requirements",
  "responsibilities",
]);

const IMPORTANT_TERMS = [
  "javascript",
  "typescript",
  "react",
  "react.js",
  "vue",
  "angular",
  "node.js",
  "nodejs",
  "python",
  "java",
  "c#",
  "c++",
  "php",
  "laravel",
  "django",
  "flask",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "firebase",
  "aws",
  "azure",
  "docker",
  "kubernetes",
  "git",
  "github",
  "rest",
  "api",
  "html",
  "css",
  "tailwind",
  "figma",
  "excel",
  "powerpoint",
  "communication",
  "leadership",
  "management",
  "marketing",
  "sales",
  "customer service",
  "project management",
  "problem solving",
  "data analysis",
  "machine learning",
  "artificial intelligence",
  "networking",
  "cybersecurity",
];

function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractWords(text) {
  return normalize(text)
    .split(" ")
    .filter(
      (word) =>
        word.length >= 3 && !STOP_WORDS.has(word)
    );
}

function extractImportantTerms(text) {
  const normalized = normalize(text);

  return IMPORTANT_TERMS.filter((term) =>
    normalized.includes(term)
  );
}

function buildCVText(cv) {
  const experience = (cv.experience || [])
    .map((item) =>
      [
        item.position,
        item.company,
        item.location,
        item.description,
      ].join(" ")
    )
    .join(" ");

  const education = (cv.education || [])
    .map((item) =>
      [
        item.degree,
        item.school,
        item.location,
        item.description,
      ].join(" ")
    )
    .join(" ");

  const skills = (cv.skills || [])
    .map((skill) =>
      typeof skill === "string"
        ? skill
        : skill.name || skill.title || ""
    )
    .join(" ");

  const projects = (cv.projects || [])
    .map((project) =>
      [
        project.name,
        project.title,
        project.description,
        project.technologies,
      ].join(" ")
    )
    .join(" ");

  const languages = (cv.languages || [])
    .map((language) =>
      typeof language === "string"
        ? language
        : [
            language.name,
            language.language,
            language.level,
          ].join(" ")
    )
    .join(" ");

  return [
    cv.name,
    cv.title,
    cv.email,
    cv.phone,
    cv.location,
    cv.website,
    cv.summary,
    experience,
    education,
    skills,
    projects,
    languages,
  ].join(" ");
}

export function matchJobDescription(cv, jobDescription) {
  const jobText = normalize(jobDescription);
  const cvText = normalize(buildCVText(cv));

  if (!jobText) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      recommendations: [
        "Paste a job description to analyze your CV.",
      ],
    };
  }

  const importantTerms =
    extractImportantTerms(jobText);

  const jobWords = [
    ...new Set(extractWords(jobText)),
  ];

  const cvWords = new Set(extractWords(cvText));

  const matchedKeywords = [];
  const missingKeywords = [];

  importantTerms.forEach((term) => {
    if (cvText.includes(term)) {
      matchedKeywords.push(term);
    } else {
      missingKeywords.push(term);
    }
  });

  const matchedWords = jobWords.filter((word) =>
    cvWords.has(word)
  );

  const keywordScore =
    jobWords.length > 0
      ? Math.round(
          (matchedWords.length / jobWords.length) * 100
        )
      : 0;

  const importantScore =
    importantTerms.length > 0
      ? Math.round(
          (matchedKeywords.length /
            importantTerms.length) *
            100
        )
      : keywordScore;

  const score = Math.min(
    100,
    Math.round(
      keywordScore * 0.4 +
        importantScore * 0.6
    )
  );

  const recommendations = [];

  if (missingKeywords.length > 0) {
    recommendations.push(
      `Consider adding relevant skills or experience related to: ${missingKeywords
        .slice(0, 5)
        .join(", ")}.`
    );
  }

  if (!cv.summary?.trim()) {
    recommendations.push(
      "Add a professional summary tailored to this position."
    );
  }

  if (!cv.skills || cv.skills.length < 5) {
    recommendations.push(
      "Add more relevant skills from the job description."
    );
  }

  if (!cv.experience || cv.experience.length === 0) {
    recommendations.push(
      "Add relevant work experience or internships."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Your CV has a strong keyword match with this job."
    );
  }

  let level = "Low match";

  if (score >= 80) {
    level = "Excellent match";
  } else if (score >= 65) {
    level = "Good match";
  } else if (score >= 45) {
    level = "Fair match";
  }

  return {
    score,
    level,
    matchedKeywords,
    missingKeywords,
    matchedWords: matchedWords.slice(0, 30),
    recommendations,
  };
}