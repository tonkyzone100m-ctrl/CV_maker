export default function BrandLogo({
  compact = false,
  className = "",
}) {
  if (compact) {
    return (
      <span
        className={`relative block h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 ${className}`}
        aria-label="CV Maker"
      >
        <img
          src="/cv-maker-logo.png"
          alt=""
          className="absolute left-1/2 top-0 h-[72px] w-[72px] max-w-none -translate-x-1/2 object-contain"
        />
      </span>
    );
  }

  return (
    <img
      src="/cv-maker-logo.png"
      alt="CV Maker"
      className={`h-auto w-full object-contain ${className}`}
    />
  );
}
