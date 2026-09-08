export function calculateCVScore(cv = {}) {
  let score = 0;
  const checks = [];

  function addCheck(label, condition, points) {
    const passed = Boolean(condition);

    checks.push({
      label,
      passed,
      points,
    });

    if (passed) {
      score += points;
    }
  }

  addCheck(
    "Full name",
    cv.name?.trim(),
    10
  );

  addCheck(
    "Professional title",
    cv.title?.trim(),
    10
  );

  addCheck(
    "Email address",
    cv.email?.trim(),
    10
  );

  addCheck(
    "Phone number",
    cv.phone?.trim(),
    5
  );

  addCheck(
    "Location",
    cv.location?.trim(),
    5
  );

  addCheck(
    "Professional summary",
    cv.summary?.trim().length >= 50,
    15
  );

  addCheck(
    "Work experience",
    Array.isArray(cv.experience) &&
      cv.experience.length > 0,
    15
  );

  addCheck(
    "Education",
    Array.isArray(cv.education) &&
      cv.education.length > 0,
    10
  );

  addCheck(
    "Skills",
    Array.isArray(cv.skills) &&
      cv.skills.length >= 3,
    10
  );

  addCheck(
    "Projects",
    Array.isArray(cv.projects) &&
      cv.projects.length > 0,
    5
  );

  addCheck(
    "Languages",
    Array.isArray(cv.languages) &&
      cv.languages.length > 0,
    5
  );

  return {
    score,
    checks,
  };
}