import type { ReactNode } from "react";
export function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <span id={id + "-error"} role="alert" className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
