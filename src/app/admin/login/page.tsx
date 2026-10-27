import { LoginForm } from "@/features/admin/AdminForms";
export default function Login() {
  return (
    <div style={{ maxWidth: 500, marginInline: "auto" }}>
      <span className="eyebrow">STUDIO ACCESS</span>
      <h1 style={{ fontSize: "4rem" }}>Welcome back.</h1>
      <LoginForm />
    </div>
  );
}
