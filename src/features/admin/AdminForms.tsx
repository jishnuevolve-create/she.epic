"use client";
import { useActionState } from "react";
import { adminMutation, signIn, type ActionState } from "./actions";
export function AdminForm({
  children,
  label = "Save",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(adminMutation, {});
  return (
    <form action={action}>
      {children}
      <button className="button" disabled={pending}>
        {pending ? "Saving…" : label}
      </button>
      {state.error && (
        <p role="alert" className="error-message">
          {state.error}
        </p>
      )}
      {state.success && <p role="status">{state.success}</p>}
    </form>
  );
}
export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(signIn, {});
  return (
    <form action={action} className="form-panel">
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error && (
        <p role="alert" className="error-message">
          {state.error}
        </p>
      )}
      <button className="button" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
