type AuthIllustrationProps = {
  success?: boolean;
};

export function AuthIllustration({ success = false }: AuthIllustrationProps) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto mt-8 flex h-[235px] w-full max-w-[410px] items-center justify-center sm:h-[285px] lg:mt-10"
    >
      <div className="absolute h-[205px] w-[270px] rotate-[-7deg] rounded-[36px] bg-[#dcebdd] sm:h-[235px] sm:w-[315px]" />
      <div className="absolute h-[190px] w-[275px] rotate-[5deg] rounded-[34px] border border-[#e6ece2] bg-[#f7f9f4] shadow-[0_24px_50px_-35px_rgba(15,46,34,0.4)] sm:h-[225px] sm:w-[325px]" />
      <div className="relative w-[270px] rounded-[26px] border border-[#e7ece5] bg-white p-5 shadow-[0_22px_48px_-30px_rgba(15,46,34,0.35)] sm:w-[305px] sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/rootine-logo-kit/svg/rootine-symbol-small-color.svg"
              alt=""
              className="h-10 w-10"
            />
            <div>
              <p className="text-sm font-bold text-[#183126]">
                {success ? "A fresh start" : "Your daily rhythm"}
              </p>
              <p className="mt-0.5 text-xs text-[#7b887e]">One small step at a time</p>
            </div>
          </div>
          {success && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6f4e8] text-[#1B7F4E]">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <path d="m5 10 3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>
        <div className="mt-5 space-y-2.5">
          {(success ? ["Make room for what matters", "Build a routine that feels right"] : ["Plan your next small win", "Keep your momentum growing"]).map((task, index) => (
            <div
              key={task}
              className="flex items-center gap-3 rounded-xl bg-[#f7f9f6] px-3 py-2.5"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  index === 0 && success
                    ? "border-[#1B7F4E] bg-[#1B7F4E] text-white"
                    : "border-[#cdd9ce] text-transparent"
                }`}
              >
                {index === 0 && success ? (
                  <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                    <path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#86b48c]" />
                )}
              </span>
              <span className="text-xs font-medium text-[#425248]">{task}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] text-[#7b887e]">
          <span>{success ? "Your journey starts here" : "Progress, not perfection"}</span>
          <span className="h-1.5 w-14 overflow-hidden rounded-full bg-[#e8eee6]">
            <span className="block h-full w-2/3 rounded-full bg-[#62a977]" />
          </span>
        </div>
      </div>
      <span className="absolute right-[5%] top-5 h-3 w-3 rounded-full bg-[#a7cda8] sm:right-[8%]" />
      <span className="absolute bottom-5 left-[7%] h-2.5 w-2.5 rounded-full bg-[#d6bb93]" />
    </div>
  );
}
