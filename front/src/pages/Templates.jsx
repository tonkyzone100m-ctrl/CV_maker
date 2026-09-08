import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TemplateCard from "../components/TemplateCard";
import { useAuth } from "../context/auth";

const templates = [
  {
    type: "professional",
    name: "Professional",
    description:
      "A clean and traditional layout designed for corporate and professional applications.",
    popular: true,
  },
  {
    type: "modern",
    name: "Modern",
    description:
      "A bold contemporary CV designed to make your experience stand out.",
    popular: true,
  },
  {
    type: "minimal",
    name: "Minimal",
    description:
      "Simple, elegant and highly readable for a clean professional impression.",
  },
  {
    type: "creative",
    name: "Creative",
    description:
      "A visually distinctive layout for designers, developers and creative professionals.",
  },
  {
    type: "executive",
    name: "Executive",
    description:
      "A premium leadership-focused layout for managers, executives and senior professionals.",
    popular: true,
  },
  {
    type: "tech",
    name: "Tech",
    description:
      "A modern technology-focused CV designed for developers, engineers and IT professionals.",
  },
  {
    type: "corporate",
    name: "Corporate",
    description:
      "A structured and polished layout ideal for finance, business, administration and consulting.",
  },
  {
    type: "elegant",
    name: "Elegant",
    description:
      "A sophisticated design combining refined typography with a professional visual hierarchy.",
  },
  {
    type: "academic",
    name: "Academic",
    description:
      "A detailed academic CV designed for researchers, lecturers, graduates and education professionals.",
  },
  {
    type: "student",
    name: "Student",
    description:
      "A simple career-starter CV designed for students, interns and recent graduates.",
  },
];

export default function Templates() {
  const { isAuthenticated } = useAuth();
  const createPath = isAuthenticated
    ? "/create-cv"
    : "/login?redirect=%2Fcreate-cv";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
              CV Templates
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Choose a template that gets you noticed.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-500">
              Start with a professionally designed CV template and customize
              every section to match your career.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.type} {...template} />
            ))}
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="mx-auto max-w-4xl rounded-3xl bg-slate-900 px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-bold">
              Ready to build your CV?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Choose a template and create a professional CV in minutes.
            </p>

            <Link
              to={createPath}
              className="mt-7 inline-block rounded-xl bg-green-600 px-7 py-3 font-bold text-white shadow-lg transition hover:bg-green-700"
            >
              Start Building
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}