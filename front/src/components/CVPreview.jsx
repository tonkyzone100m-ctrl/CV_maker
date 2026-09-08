const templates = {
  professional: {
    accent: "#1e3a8a",
    layout: "classic",
  },
  modern: {
    accent: "#2563eb",
    layout: "modern",
  },
  minimal: {
    accent: "#111827",
    layout: "minimal",
  },
  creative: {
    accent: "#7c3aed",
    layout: "creative",
  },
  executive: {
    accent: "#0f172a",
    layout: "executive",
  },
  tech: {
    accent: "#059669",
    layout: "tech",
  },
  corporate: {
    accent: "#334155",
    layout: "corporate",
  },
  elegant: {
    accent: "#9f1239",
    layout: "elegant",
  },
  academic: {
    accent: "#1e40af",
    layout: "academic",
  },
  student: {
    accent: "#0369a1",
    layout: "student",
  },
};

/* ==================================================
   SAFE VALUE HELPERS
================================================== */

function getValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

/* ==================================================
   SKILLS
================================================== */

function getSkillName(skill) {
  if (typeof skill === "string") {
    return skill;
  }

  if (!skill || typeof skill !== "object") {
    return "";
  }

  return (
    skill.name ||
    skill.title ||
    skill.skill ||
    ""
  );
}

/* ==================================================
   LANGUAGES
================================================== */

function getLanguageName(language) {
  if (typeof language === "string") {
    return language;
  }

  if (!language || typeof language !== "object") {
    return "";
  }

  return (
    language.name ||
    language.language ||
    ""
  );
}

function getLanguageLevel(language) {
  if (typeof language === "string") {
    return "";
  }

  if (!language || typeof language !== "object") {
    return "";
  }

  return (
    language.level ||
    language.proficiency ||
    ""
  );
}

/* ==================================================
   PROJECTS
================================================== */

function getProjectName(project) {
  if (typeof project === "string") {
    return project;
  }

  if (!project || typeof project !== "object") {
    return "Project";
  }

  return (
    project.name ||
    project.title ||
    "Project"
  );
}

function getProjectDescription(project) {
  if (typeof project === "string") {
    return "";
  }

  if (!project || typeof project !== "object") {
    return "";
  }

  return project.description || "";
}

function getProjectTechnologies(project) {
  if (typeof project === "string") {
    return "";
  }

  if (!project || typeof project !== "object") {
    return "";
  }

  if (Array.isArray(project.technologies)) {
    return project.technologies
      .filter(Boolean)
      .join(", ");
  }

  return project.technologies || "";
}

/* ==================================================
   EXPERIENCE
================================================== */

function getExperiencePosition(item) {
  if (!item || typeof item !== "object") {
    return "";
  }

  return (
    item.jobTitle ||
    item.position ||
    item.title ||
    item.role ||
    ""
  );
}

function getExperienceCompany(item) {
  if (!item || typeof item !== "object") {
    return "";
  }

  return (
    item.company ||
    item.organization ||
    ""
  );
}

function getExperienceDates(item) {
  if (!item || typeof item !== "object") {
    return "";
  }

  const start =
    item.startDate ||
    item.start ||
    "";

  const end =
    item.endDate ||
    item.end ||
    "";

  if (!start && !end) {
    return "";
  }

  if (start && !end) {
    return `${start} — Present`;
  }

  if (!start && end) {
    return end;
  }

  return `${start} — ${end}`;
}

/* ==================================================
   EDUCATION
================================================== */

function getEducationDegree(item) {
  if (!item || typeof item !== "object") {
    return "";
  }

  return (
    item.degree ||
    item.program ||
    item.qualification ||
    ""
  );
}

function getEducationSchool(item) {
  if (!item || typeof item !== "object") {
    return "";
  }

  return (
    item.school ||
    item.institution ||
    item.university ||
    ""
  );
}

function getEducationDates(item) {
  if (!item || typeof item !== "object") {
    return "";
  }

  const start =
    item.startDate ||
    item.start ||
    "";

  const end =
    item.endDate ||
    item.end ||
    "";

  if (!start && !end) {
    return "";
  }

  if (!start && end) {
    return end;
  }

  return `${start}${start && end ? " — " : ""}${end}`;
}

/* ==================================================
   SECTION TITLE
================================================== */

function SectionTitle({
  children,
  accent,
  style = {},
}) {
  return (
    <h2
      style={{
        margin: "0 0 12px",
        color: accent,
        fontSize: "12px",
        fontWeight: 800,
        letterSpacing: "1.2px",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

/* ==================================================
   PHOTO
================================================== */

function Photo({
  src,
  shape = "circle",
}) {
  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt="Profile"
      style={{
        width: 92,
        height: 92,
        objectFit: "cover",
        flexShrink: 0,
        borderRadius:
          shape === "square"
            ? 12
            : "50%",
        border: "3px solid white",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.15)",
      }}
    />
  );
}

/* ==================================================
   CONTACT
================================================== */

function ContactLine({ cv }) {
  const items = [
    cv?.email,
    cv?.phone,
    cv?.location,
    cv?.website,
  ].filter(Boolean);

  if (!items.length) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px 16px",
        color: "#64748b",
        fontSize: 9,
        marginTop: 8,
      }}
    >
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

/* ==================================================
   SUMMARY
================================================== */

function Summary({
  cv,
  accent,
}) {
  if (!cv?.summary?.trim()) {
    return null;
  }

  return (
    <section style={{ marginBottom: 22 }}>
      <SectionTitle accent={accent}>
        Profile
      </SectionTitle>

      <p
        style={{
          margin: 0,
          color: "#475569",
          fontSize: 10,
          lineHeight: 1.65,
        }}
      >
        {cv.summary}
      </p>
    </section>
  );
}

/* ==================================================
   EXPERIENCE
================================================== */

function Experience({
  cv,
  accent,
  style = {},
}) {
  if (!Array.isArray(cv?.experience)) {
    return null;
  }

  if (!cv.experience.length) {
    return null;
  }

  return (
    <section
      style={{
        marginBottom: 22,
        ...style,
      }}
    >
      <SectionTitle accent={accent}>
        Experience
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        {cv.experience.map((item, index) => {
          if (!item) {
            return null;
          }

          return (
            <div
              key={item.id || index}
              style={{
                position: "relative",
                paddingLeft:
                  style.timeline ? 15 : 0,
                borderLeft:
                  style.timeline
                    ? `2px solid ${accent}`
                    : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#0f172a",
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {getExperiencePosition(
                      item
                    )}
                  </h3>

                  <p
                    style={{
                      margin: "3px 0 0",
                      color: accent,
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    {getExperienceCompany(
                      item
                    )}
                  </p>
                </div>

                <span
                  style={{
                    color: "#64748b",
                    fontSize: 8,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {getExperienceDates(
                    item
                  )}
                </span>
              </div>

              {item.location && (
                <p
                  style={{
                    margin: "3px 0 0",
                    color: "#94a3b8",
                    fontSize: 8,
                  }}
                >
                  {item.location}
                </p>
              )}

              {item.description && (
                <p
                  style={{
                    margin: "7px 0 0",
                    color: "#475569",
                    fontSize: 9,
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ==================================================
   EDUCATION
================================================== */

function Education({
  cv,
  accent,
}) {
  if (!Array.isArray(cv?.education)) {
    return null;
  }

  if (!cv.education.length) {
    return null;
  }

  return (
    <section style={{ marginBottom: 22 }}>
      <SectionTitle accent={accent}>
        Education
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gap: 14,
        }}
      >
        {cv.education.map((item, index) => {
          if (!item) {
            return null;
          }

          return (
            <div
              key={item.id || index}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#0f172a",
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    {getEducationDegree(
                      item
                    )}
                  </h3>

                  <p
                    style={{
                      margin: "3px 0 0",
                      color: accent,
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    {getEducationSchool(
                      item
                    )}
                  </p>
                </div>

                <span
                  style={{
                    color: "#64748b",
                    fontSize: 8,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {getEducationDates(
                    item
                  )}
                </span>
              </div>

              {item.location && (
                <p
                  style={{
                    margin: "3px 0 0",
                    color: "#94a3b8",
                    fontSize: 8,
                  }}
                >
                  {item.location}
                </p>
              )}

              {item.description && (
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#475569",
                    fontSize: 9,
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ==================================================
   SKILLS
================================================== */

function Skills({
  cv,
  accent,
  style = "tags",
}) {
  if (!Array.isArray(cv?.skills)) {
    return null;
  }

  if (!cv.skills.length) {
    return null;
  }

  const skills = cv.skills
    .map(getSkillName)
    .filter(Boolean);

  if (!skills.length) {
    return null;
  }

  return (
    <section style={{ marginBottom: 22 }}>
      <SectionTitle accent={accent}>
        Skills
      </SectionTitle>

      {style === "list" ? (
        <ul
          style={{
            margin: 0,
            paddingLeft: 16,
            color: "#475569",
            fontSize: 9,
            lineHeight: 1.8,
          }}
        >
          {skills.map((skill, index) => (
            <li
              key={`${skill}-${index}`}
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              style={{
                padding: "5px 8px",
                borderRadius:
                  style === "pill"
                    ? 999
                    : 4,
                background: `${accent}12`,
                color: accent,
                fontSize: 8,
                fontWeight: 700,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

/* ==================================================
   PROJECTS
================================================== */

function Projects({
  cv,
  accent,
}) {
  if (!Array.isArray(cv?.projects)) {
    return null;
  }

  if (!cv.projects.length) {
    return null;
  }

  return (
    <section style={{ marginBottom: 22 }}>
      <SectionTitle accent={accent}>
        Projects
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gap: 13,
        }}
      >
        {cv.projects.map((project, index) => {
          const name =
            getProjectName(project);

          const technologies =
            getProjectTechnologies(
              project
            );

          const description =
            getProjectDescription(
              project
            );

          return (
            <div
              key={
                typeof project ===
                  "object" &&
                project?.id
                  ? project.id
                  : index
              }
            >
              <h3
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {name}
              </h3>

              {technologies && (
                <p
                  style={{
                    margin: "3px 0",
                    color: accent,
                    fontSize: 8,
                    fontWeight: 700,
                  }}
                >
                  {technologies}
                </p>
              )}

              {description && (
                <p
                  style={{
                    margin: 0,
                    color: "#475569",
                    fontSize: 9,
                    lineHeight: 1.5,
                  }}
                >
                  {description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ==================================================
   LANGUAGES
================================================== */

function Languages({
  cv,
  accent,
}) {
  if (!Array.isArray(cv?.languages)) {
    return null;
  }

  if (!cv.languages.length) {
    return null;
  }

  return (
    <section style={{ marginBottom: 22 }}>
      <SectionTitle accent={accent}>
        Languages
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gap: 7,
        }}
      >
        {cv.languages.map(
          (language, index) => (
            <div
              key={
                language?.id ||
                index
              }
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 10,
                fontSize: 9,
              }}
            >
              <span
                style={{
                  color: "#334155",
                  fontWeight: 700,
                }}
              >
                {getLanguageName(
                  language
                )}
              </span>

              <span
                style={{
                  color: accent,
                }}
              >
                {getLanguageLevel(
                  language
                )}
              </span>
            </div>
          )
        )}
      </div>
    </section>
  );
}

/* ==================================================
   PROFESSIONAL TEMPLATE
================================================== */

function ProfessionalTemplate({
  cv,
  accent,
}) {
  return (
    <div
      style={{
        padding: 42,
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#0f172a",
      }}
    >
      <header
        style={{
          borderBottom: `3px solid ${accent}`,
          paddingBottom: 18,
          marginBottom: 25,
          display: "flex",
          justifyContent:
            "space-between",
          gap: 20,
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            {getValue(cv.name) ||
              "Your Name"}
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: accent,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {getValue(cv.title) ||
              "Professional Title"}
          </p>

          <ContactLine cv={cv} />
        </div>

        <Photo src={cv.photo} />
      </header>

      <Summary
        cv={cv}
        accent={accent}
      />

      <Experience
        cv={cv}
        accent={accent}
      />

      <Education
        cv={cv}
        accent={accent}
      />

      <Skills
        cv={cv}
        accent={accent}
      />

      <Projects
        cv={cv}
        accent={accent}
      />

      <Languages
        cv={cv}
        accent={accent}
      />
    </div>
  );
}

/* ==================================================
   MODERN TEMPLATE
================================================== */

function ModernTemplate({
  cv,
  accent,
}) {
  return (
    <div
      style={{
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#0f172a",
      }}
    >
      <header
        style={{
          background: accent,
          color: "white",
          padding: 38,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            {cv.name ||
              "Your Name"}
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              opacity: 0.9,
            }}
          >
            {cv.title ||
              "Professional Title"}
          </p>

          <div
            style={{
              marginTop: 9,
              fontSize: 8,
              opacity: 0.8,
            }}
          >
            {[
              cv.email,
              cv.phone,
              cv.location,
            ]
              .filter(Boolean)
              .join("  •  ")}
          </div>
        </div>

        <Photo src={cv.photo} />
      </header>

      <div
        style={{
          padding: 38,
        }}
      >
        <Summary
          cv={cv}
          accent={accent}
        />

        <Experience
          cv={cv}
          accent={accent}
          style={{
            timeline: true,
          }}
        />

        <Education
          cv={cv}
          accent={accent}
        />

        <Skills
          cv={cv}
          accent={accent}
          style="pill"
        />

        <Projects
          cv={cv}
          accent={accent}
        />

        <Languages
          cv={cv}
          accent={accent}
        />
      </div>
    </div>
  );
}

/* ==================================================
   MINIMAL TEMPLATE
================================================== */

function MinimalTemplate({
  cv,
  accent,
}) {
  return (
    <div
      style={{
        padding: 45,
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#111827",
      }}
    >
      <header
        style={{
          marginBottom: 30,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            fontWeight: 400,
            letterSpacing: "-0.5px",
          }}
        >
          {cv.name ||
            "Your Name"}
        </h1>

        <p
          style={{
            margin: "7px 0",
            fontSize: 11,
            color: "#64748b",
          }}
        >
          {cv.title ||
            "Professional Title"}
        </p>

        <ContactLine cv={cv} />
      </header>

      <Summary
        cv={cv}
        accent={accent}
      />

      <Experience
        cv={cv}
        accent={accent}
      />

      <Education
        cv={cv}
        accent={accent}
      />

      <Skills
        cv={cv}
        accent={accent}
        style="list"
      />

      <Projects
        cv={cv}
        accent={accent}
      />

      <Languages
        cv={cv}
        accent={accent}
      />
    </div>
  );
}

/* ==================================================
   CREATIVE TEMPLATE
================================================== */

function CreativeTemplate({
  cv,
  accent,
}) {
  const skills = Array.isArray(
    cv.skills
  )
    ? cv.skills
        .map(getSkillName)
        .filter(Boolean)
    : [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "32% 68%",
        minHeight: 1050,
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <aside
        style={{
          background: accent,
          color: "white",
          padding: 30,
        }}
      >
        <Photo
          src={cv.photo}
          shape="square"
        />

        <h1
          style={{
            margin: "20px 0 5px",
            fontSize: 23,
            fontWeight: 900,
          }}
        >
          {cv.name ||
            "Your Name"}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 10,
            opacity: 0.85,
          }}
        >
          {cv.title ||
            "Professional Title"}
        </p>

        <div
          style={{
            marginTop: 25,
            fontSize: 8,
            lineHeight: 1.9,
            opacity: 0.85,
          }}
        >
          {[
            cv.email,
            cv.phone,
            cv.location,
            cv.website,
          ]
            .filter(Boolean)
            .map((item, index) => (
              <div
                key={`${item}-${index}`}
              >
                {item}
              </div>
            ))}
        </div>

        {skills.length > 0 && (
          <div
            style={{
              marginTop: 28,
            }}
          >
            <h2
              style={{
                fontSize: 10,
                letterSpacing: 1,
                textTransform:
                  "uppercase",
                marginBottom: 12,
              }}
            >
              Skills
            </h2>

            {skills.map(
              (skill, index) => (
                <div
                  key={`${skill}-${index}`}
                  style={{
                    fontSize: 8,
                    padding: "5px 0",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {skill}
                </div>
              )
            )}
          </div>
        )}
      </aside>

      <main
        style={{
          padding: 35,
        }}
      >
        <Summary
          cv={cv}
          accent={accent}
        />

        <Experience
          cv={cv}
          accent={accent}
        />

        <Education
          cv={cv}
          accent={accent}
        />

        <Projects
          cv={cv}
          accent={accent}
        />

        <Languages
          cv={cv}
          accent={accent}
        />
      </main>
    </div>
  );
}

/* ==================================================
   EXECUTIVE TEMPLATE
================================================== */

function ExecutiveTemplate({
  cv,
  accent,
}) {
  return (
    <div
      style={{
        padding: 44,
        fontFamily:
          "Georgia, 'Times New Roman', serif",
        color: "#172033",
      }}
    >
      <header
        style={{
          textAlign: "center",
          paddingBottom: 22,
          borderBottom:
            "1px solid #cbd5e1",
          marginBottom: 25,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          {cv.name ||
            "Your Name"}
        </h1>

        <p
          style={{
            margin: "7px 0",
            color: accent,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {cv.title ||
            "Executive Professional"}
        </p>

        <ContactLine cv={cv} />
      </header>

      <Summary
        cv={cv}
        accent={accent}
      />

      <Experience
        cv={cv}
        accent={accent}
      />

      <Education
        cv={cv}
        accent={accent}
      />

      <Skills
        cv={cv}
        accent={accent}
        style="list"
      />

      <Projects
        cv={cv}
        accent={accent}
      />

      <Languages
        cv={cv}
        accent={accent}
      />
    </div>
  );
}

/* ==================================================
   TECH TEMPLATE
================================================== */

function TechTemplate({
  cv,
  accent,
}) {
  return (
    <div
      style={{
        padding: 38,
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#0f172a",
      }}
    >
      <header
        style={{
          padding: 22,
          background: "#f0fdf4",
          borderLeft:
            `5px solid ${accent}`,
          marginBottom: 25,
          display: "flex",
          justifyContent:
            "space-between",
          gap: 20,
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <div
            style={{
              color: accent,
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            SOFTWARE / TECHNOLOGY
          </div>

          <h1
            style={{
              margin: "7px 0 3px",
              fontSize: 27,
              fontWeight: 900,
            }}
          >
            {cv.name ||
              "Your Name"}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#475569",
              fontSize: 11,
            }}
          >
            {cv.title ||
              "Software Developer"}
          </p>

          <ContactLine cv={cv} />
        </div>

        <Photo src={cv.photo} />
      </header>

      <Summary
        cv={cv}
        accent={accent}
      />

      <Experience
        cv={cv}
        accent={accent}
        style={{
          timeline: true,
        }}
      />

      <Skills
        cv={cv}
        accent={accent}
        style="pill"
      />

      <Projects
        cv={cv}
        accent={accent}
      />

      <Education
        cv={cv}
        accent={accent}
      />

      <Languages
        cv={cv}
        accent={accent}
      />
    </div>
  );
}

/* ==================================================
   CORPORATE TEMPLATE
================================================== */

function CorporateTemplate({
  cv,
  accent,
}) {
  return (
    <div
      style={{
        padding: 40,
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#1e293b",
      }}
    >
      <header
        style={{
          background: "#f8fafc",
          padding: 25,
          borderTop:
            `6px solid ${accent}`,
          marginBottom: 25,
          display: "flex",
          justifyContent:
            "space-between",
          gap: 20,
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 27,
              fontWeight: 900,
            }}
          >
            {cv.name ||
              "Your Name"}
          </h1>

          <p
            style={{
              margin: "5px 0",
              color: accent,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {cv.title ||
              "Business Professional"}
          </p>

          <ContactLine cv={cv} />
        </div>

        <Photo src={cv.photo} />
      </header>

      <Summary
        cv={cv}
        accent={accent}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 25,
        }}
      >
        <div>
          <Experience
            cv={cv}
            accent={accent}
          />

          <Education
            cv={cv}
            accent={accent}
          />
        </div>

        <div>
          <Skills
            cv={cv}
            accent={accent}
            style="list"
          />

          <Projects
            cv={cv}
            accent={accent}
          />

          <Languages
            cv={cv}
            accent={accent}
          />
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   ELEGANT TEMPLATE
================================================== */

function ElegantTemplate({
  cv,
  accent,
}) {
  return (
    <div
      style={{
        padding: 45,
        fontFamily:
          "Georgia, 'Times New Roman', serif",
        color: "#1f2937",
      }}
    >
      <header
        style={{
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        <Photo src={cv.photo} />

        <h1
          style={{
            margin: "15px 0 4px",
            fontSize: 29,
            fontWeight: 700,
          }}
        >
          {cv.name ||
            "Your Name"}
        </h1>

        <p
          style={{
            margin: 0,
            color: accent,
            fontSize: 11,
            fontStyle: "italic",
          }}
        >
          {cv.title ||
            "Professional Title"}
        </p>

        <ContactLine cv={cv} />
      </header>

      <Summary
        cv={cv}
        accent={accent}
      />

      <Experience
        cv={cv}
        accent={accent}
      />

      <Education
        cv={cv}
        accent={accent}
      />

      <Skills
        cv={cv}
        accent={accent}
        style="pill"
      />

      <Projects
        cv={cv}
        accent={accent}
      />

      <Languages
        cv={cv}
        accent={accent}
      />
    </div>
  );
}

/* ==================================================
   ACADEMIC TEMPLATE
================================================== */

function AcademicTemplate({
  cv,
  accent,
}) {
  return (
    <div
      style={{
        padding: 42,
        fontFamily:
          "Georgia, 'Times New Roman', serif",
        color: "#1e293b",
      }}
    >
      <header
        style={{
          marginBottom: 25,
          borderBottom:
            "1px solid #94a3b8",
          paddingBottom: 18,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 27,
            fontWeight: 700,
          }}
        >
          {cv.name ||
            "Your Name"}
        </h1>

        <p
          style={{
            margin: "5px 0",
            color: accent,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {cv.title ||
            "Academic Professional"}
        </p>

        <ContactLine cv={cv} />
      </header>

      <Summary
        cv={cv}
        accent={accent}
      />

      <Education
        cv={cv}
        accent={accent}
      />

      <Experience
        cv={cv}
        accent={accent}
      />

      <Projects
        cv={cv}
        accent={accent}
      />

      <Skills
        cv={cv}
        accent={accent}
        style="list"
      />

      <Languages
        cv={cv}
        accent={accent}
      />
    </div>
  );
}

/* ==================================================
   STUDENT TEMPLATE
================================================== */

function StudentTemplate({
  cv,
  accent,
}) {
  return (
    <div
      style={{
        padding: 40,
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#334155",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          paddingBottom: 20,
          borderBottom:
            `3px solid ${accent}`,
          marginBottom: 24,
        }}
      >
        <Photo src={cv.photo} />

        <div
          style={{
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 27,
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            {cv.name ||
              "Your Name"}
          </h1>

          <p
            style={{
              margin: "5px 0",
              color: accent,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {cv.title ||
              "Student / Graduate"}
          </p>

          <ContactLine cv={cv} />
        </div>
      </header>

      <Summary
        cv={cv}
        accent={accent}
      />

      <Education
        cv={cv}
        accent={accent}
      />

      <Projects
        cv={cv}
        accent={accent}
      />

      <Experience
        cv={cv}
        accent={accent}
      />

      <Skills
        cv={cv}
        accent={accent}
        style="pill"
      />

      <Languages
        cv={cv}
        accent={accent}
      />
    </div>
  );
}

/* ==================================================
   MAIN COMPONENT
================================================== */

export default function CVPreview({
  cv = {},
  template = "professional",
}) {
  const selected =
    templates[template] ||
    templates.professional;

  const props = {
    cv,
    accent: selected.accent,
  };

  const TemplateComponent = {
    classic: ProfessionalTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
    tech: TechTemplate,
    corporate: CorporateTemplate,
    elegant: ElegantTemplate,
    academic: AcademicTemplate,
    student: StudentTemplate,
  }[selected.layout] || ProfessionalTemplate;

  return (
    <div
      id="cv-preview"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        background: "#ffffff",
        boxSizing: "border-box",
        overflow: "hidden",
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <TemplateComponent
        {...props}
      />
    </div>
  );
}