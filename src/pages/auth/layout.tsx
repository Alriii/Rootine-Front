import type { ReactNode } from "react";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { AuthIllustration } from "@/components/auth/AuthIllustration";

type AuthLayoutProps = {
  children: ReactNode;
  heading: string;
  description: string;
  successIllustration?: boolean;
};

export function AuthLayout({
  children,
  heading,
  description,
  successIllustration = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f7f2] px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
      <header className="mx-auto w-full max-w-7xl">
        <AuthBranding />
      </header>
      <main className="mx-auto grid w-full max-w-7xl items-center gap-8 pb-5 pt-7 sm:pt-10 lg:min-h-[calc(100vh-108px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-10">
        <section className="mx-auto w-full max-w-xl lg:mx-0">
          <h1 className="max-w-xl text-4xl font-bold leading-[1.12] tracking-[-0.04em] text-[#17231c] sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-[#68746b] sm:text-lg sm:leading-8">
            {description}
          </p>
          <AuthIllustration success={successIllustration} />
        </section>
        <div className="mx-auto w-full max-w-[470px]">{children}</div>
      </main>
    </div>
  );
}

export default AuthLayout;
