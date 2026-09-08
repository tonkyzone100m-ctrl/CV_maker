export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CV Maker. Build your future.
      </div>
    </footer>
  );
}