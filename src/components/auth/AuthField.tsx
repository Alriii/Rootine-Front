import type { InputHTMLAttributes } from "react";

type AuthFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  error?: string;
};

export function AuthField({ label, id, error, ...props }: AuthFieldProps) {
  const inputId = id ?? props.name;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-[#29372e]">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#17231c] outline-none transition placeholder:text-[#9aa49c] focus:border-[#1B7F4E] focus:ring-4 focus:ring-[#1B7F4E]/10 ${
          error ? "border-[#c2413b]" : "border-[#dfe6de]"
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}
