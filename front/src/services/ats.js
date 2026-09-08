export function analyzeCV(cv) {
  const checks = [];

  // Personal information
  checks.push({
    id: "name",
    label: "Full name",
    passed: Boolean(cv.name?.trim()),
    points: 10,
  });

  checks.push({
    id: "title",
    label: "Professional title",
    passed: Boolean(cv.title?.trim()),
    points: 10,
  });

  checks.push({
    id: "email",
    label: "Email address",
    passed: Boolean(cv.email?.trim()),
    points: 10,
  });

  checks.push({
    id: "phone",
    label: "Phone number",
    passed: Boolean(cv.phone?.trim()),
    points: 5,
  });

  // Professional summary
  const summaryLength = cv.summary?.trim().length || 0;

  checks.push({
    id: "summary",
    label: "Professional summary",
    passed: summaryLength >= 80,
    points: 15,
    message:
      summaryLength < 80
        ? "Write a stronger summary with at least 80 characters."
        : "Good professional summary.",
  });

  // Experience
  const experienceCount = cv.experience?.length || 0;

  checks.push({
    id: "experience",
    label: "Work experience",
    passed: experienceCount > 0,
    points: 15,
    message:
      experienceCount === 0
        ? "Add at least one work experience."
        : "Work experience added.",
  });

  // Education
  const educationCount = cv.education?.length || 0;

  checks.push({
    id: "education",
    label: "Education",
    passed: educationCount > 0,
    points: 10,
    message:
      educationCount === 0
        ? "Add your education."
        : "Education added.",
  });

  // Skills
  const skillsCount = cv.skills?.length || 0;

  checks.push({
    id: "skills",
    label: "Skills",
    passed: skillsCount >= 3,
    points: 10,
    message:
      skillsCount < 3
        ? "Add at least 3 relevant skills."
        : "Good number of skills.",
  });

  // Projects
  const projectCount = cv.projects?.length || 0;

  checks.push({
    id: "projects",
    label: "Projects",
    passed: projectCount > 0,
    points: 5,
    message:
      projectCount === 0
        ? "Consider adding relevant projects."
        : "Projects added.",
  });

  // Languages
  const languageCount = cv.languages?.length || 0;

  checks.push({
    id: "languages",
    label: "Languages",
    passed: languageCount > 0,
    points: 5,
    message:
      languageCount === 0
        ? "Consider adding languages."
        : "Languages added.",
  });

  const totalPoints = checks.reduce(
    (total, check) => total + check.points,
    0
  );

  const earnedPoints = checks
    .filter((check) => check.passed)
    .reduce((total, check) => total + check.points, 0);

  const score = Math.round((earnedPoints / totalPoints) * 100);

  let level = "Needs improvement";

  if (score >= 90) {
    level = "Excellent";
  } else if (score >= 80) {
    level = "Very good";
  } else if (score >= 70) {
    level = "Good";
  } else if (score >= 50) {
    level = "Fair";
  }

  return {
    score,
    level,
    checks,
    passed: checks.filter((check) => check.passed),
    failed: checks.filter((check) => !check.passed),
  };
}