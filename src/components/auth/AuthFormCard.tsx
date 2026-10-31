import type { ReactNode } from "react";

type AuthFormCardProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

export function AuthFormCard({ children, title, description }: AuthFormCardProps) {
  return (
    <section className="w-full rounded-3xl border border-[#e4e9e1] bg-white p-6 shadow-[0_24px_70px_-42px_rgba(15,46,34,0.3)] sm:p-8 lg:p-9">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1B7F4E]">
          Welcome to Rootine
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-[#17231c]">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-[#68746b]">{description}</p>}
      </div>
      {children}
    </section>
  );
}
