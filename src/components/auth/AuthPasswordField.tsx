import { useState } from "react";
import type { InputHTMLAttributes } from "react";

type AuthPasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> & {
  label: string;
  error?: string;
  hideLabel?: boolean;
};

export function AuthPasswordField({ label, id, error, hideLabel = false, ...props }: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? props.name;
  const errorId = `${inputId}-error`;

  return (
    <div>
      {!hideLabel && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-[#29372e]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-12 w-full rounded-xl border bg-white px-4 pr-16 text-sm text-[#17231c] outline-none transition placeholder:text-[#9aa49c] focus:border-[#1B7F4E] focus:ring-4 focus:ring-[#1B7F4E]/10 ${
            error ? "border-[#c2413b]" : "border-[#dfe6de]"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute inset-y-0 right-3 my-auto h-9 rounded-lg px-2 text-xs font-semibold text-[#64746a] hover:bg-[#f3f7f2] hover:text-[#1B7F4E] focus-visible:outline-2 focus-visible:outline-[#1B7F4E]"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}
