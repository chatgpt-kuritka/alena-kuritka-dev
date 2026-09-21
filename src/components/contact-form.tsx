import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n";

export function ContactForm() {
  const t = useT();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending"); setError("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    const apiBase = import.meta.env['VITE_CONTACT_API_URL'] ?? "/api/public/contact";
    try {
      const response = await fetch(apiBase, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? t.form.error);
      form.reset(); setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.form.error); setStatus("error");
    }
  }

  if (status === "success") return <div className="form-success" role="status"><span>{t.form.success}</span><Button variant="link" onClick={() => setStatus("idle")}>{t.form.another}</Button></div>;

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row"><label>{t.form.name}<Input name="name" required maxLength={120} autoComplete="name" /></label><label>{t.form.email}<Input name="email" type="email" required maxLength={254} autoComplete="email" /></label></div>
      <label>{t.form.phone} <span>{t.form.optional}</span><Input name="phone" type="tel" maxLength={40} autoComplete="tel" /></label>
      <label>{t.form.message}<Textarea name="message" required minLength={10} maxLength={5000} rows={7} /></label>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-submit"><Button type="submit" disabled={status === "sending"}>{status === "sending" ? t.form.sending : t.form.send}<ArrowUpRight /></Button>{status === "error" ? <p role="alert">{error}</p> : null}</div>
    </form>
  );
}
