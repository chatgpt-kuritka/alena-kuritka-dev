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

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    Vary: "Origin",
  };
  return headers;
}

function json(data: unknown, origin: string | null, status = 200): Response {
  return Response.json(data, { status, headers: corsHeaders(origin) });
}


export const Route = createFileRoute("/api/public/contact")({ server: { handlers: {
  OPTIONS: async ({ request }) => new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) }),
  POST: async ({ request }) => {
  const origin = request.headers.get("origin");
  if (origin) {
    const allowed = ["https://alena.kuritka.com", "https://www.alena.kuritka.com", "https://chatgpt-kuritka.github.io"];
    if (!allowed.includes(origin)) return new Response("Forbidden", { status: 403 });
  }
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 12_000) return json({ error: "Message is too large." }, origin, 413);
  const parsed = ContactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: "Please check the form and try again." }, origin, 400);
  if (parsed.data.website) return json({ ok: true }, origin);
  const address = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const salt = process.env['SUPABASE_URL'] ?? "contact";
  const ipHash = createHash("sha256").update(`${salt}:${address}`).digest("hex");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin.from("contact_messages").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if ((count ?? 0) >= 3) return json({ error: "Too many messages. Please try again later." }, origin, 429);
  const { data: inserted, error } = await supabaseAdmin.from("contact_messages").insert({ name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone || null, message: parsed.data.message, ip_hash: ipHash }).select("id").single();
  if (error) { console.error(`Contact message storage failed: ${error.message}`); return json({ error: "Message could not be sent. Please email me directly." }, origin, 500); }
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
  return json({ ok: true }, origin);
} } } });
