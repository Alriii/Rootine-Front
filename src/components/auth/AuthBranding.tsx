import { Link } from "react-router";

export function AuthBranding() {
  return (
    <Link
      to="/login"
      aria-label="Rootine home"
      className="inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B7F4E]"
    >
      <img
        src="/rootine-logo-kit/svg/rootine-logo-horizontal-color.svg"
        alt="Rootine"
        className="h-10 w-auto"
      />
    </Link>
  );
}
