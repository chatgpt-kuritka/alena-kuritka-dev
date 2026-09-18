import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional().default(""),
});

export const Route = createFileRoute("/api/public/contact")({ server: { handlers: { POST: async ({ request }) => {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 12_000) return Response.json({ error: "Message is too large." }, { status: 413 });
  const parsed = ContactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please check the form and try again." }, { status: 400 });
  if (parsed.data.website) return Response.json({ ok: true });
  const address = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const salt = process.env['SUPABASE_URL'] ?? "contact";
  const ipHash = createHash("sha256").update(`${salt}:${address}`).digest("hex");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin.from("contact_messages").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if ((count ?? 0) >= 3) return Response.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  const { data: inserted, error } = await supabaseAdmin.from("contact_messages").insert({ name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone || null, message: parsed.data.message, ip_hash: ipHash }).select("id").single();
  if (error) { console.error(`Contact message storage failed: ${error.message}`); return Response.json({ error: "Message could not be sent. Please email me directly." }, { status: 500 }); }
  try {
    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    await sendTemplateEmail("contact-notification", "alenakuritka@gmail.com", {
      templateData: { name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone, message: parsed.data.message },
      idempotencyKey: `contact-notification-${inserted.id}`,
      replyTo: parsed.data.email,
    });
  } catch (cause) {
    console.error(`Contact notification email failed: ${cause instanceof Error ? cause.message : String(cause)}`);
  }
  return Response.json({ ok: true });
} } } });
