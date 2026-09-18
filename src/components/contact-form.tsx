import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending"); setError("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/public/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Message could not be sent.");
      form.reset(); setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Message could not be sent."); setStatus("error");
    }
  }

  if (status === "success") return <div className="form-success" role="status"><span>Thank you, your message has been sent.</span><Button variant="link" onClick={() => setStatus("idle")}>Send another message</Button></div>;

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row"><label>Name<Input name="name" required maxLength={120} autoComplete="name" /></label><label>Email<Input name="email" type="email" required maxLength={254} autoComplete="email" /></label></div>
      <label>Phone <span>(optional)</span><Input name="phone" type="tel" maxLength={40} autoComplete="tel" /></label>
      <label>Message<Textarea name="message" required minLength={10} maxLength={5000} rows={7} /></label>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-submit"><Button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send message"}<ArrowUpRight /></Button>{status === "error" ? <p role="alert">{error}</p> : null}</div>
    </form>
  );
}
