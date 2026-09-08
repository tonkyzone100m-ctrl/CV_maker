import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/auth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const createPath = isAuthenticated
    ? "/create-cv"
    : "/login?redirect=%2Fcreate-cv";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Simple • Professional • Fast
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight">
              Build a CV that gets you noticed.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Create beautiful, professional CVs in minutes with modern
              templates, live previews and easy PDF export.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={createPath}
                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
              >
                Create My CV
              </Link>

              <Link
                to="/templates"
                className="rounded-xl border bg-white px-7 py-3 font-semibold hover:bg-slate-100"
              >
                Explore Templates
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-200 p-8 shadow-xl">
            <div className="mx-auto max-w-md bg-white p-8 shadow-xl">
              <h2 className="text-3xl font-bold">JOHN DOE</h2>
              <p className="mt-1 font-medium text-blue-600">
                Software Developer
              </p>

              <div className="my-5 border-b" />

              <h3 className="font-bold uppercase tracking-wide">
                Profile
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Passionate software developer experienced in building
                modern web applications and digital solutions.
              </p>

              <h3 className="mt-6 font-bold uppercase tracking-wide">
                Experience
              </h3>

              <p className="mt-2 text-sm font-semibold">
                Frontend Developer
              </p>

              <p className="text-sm text-slate-500">
                ABC Technologies
              </p>

              <h3 className="mt-6 font-bold uppercase tracking-wide">
                Skills
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                {["React", "JavaScript", "Git", "UI/UX"].map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-slate-100 px-3 py-1 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
            {[
              ["01", "Choose a template", "Start with a professional design."],
              ["02", "Build your CV", "Add your experience, education and skills."],
              ["03", "Download & apply", "Export your CV and start applying."],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-2xl border p-7">
                <span className="text-sm font-bold text-blue-600">
                  {number}
                </span>
                <h3 className="mt-3 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}