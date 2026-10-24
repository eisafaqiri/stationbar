import nodemailer from "nodemailer";
import { randomUUID } from "node:crypto";
import { validateContact } from "@/lib/contact";
import { deliverContact } from "@/lib/contact-email";

// Node.js is the default runtime; cacheComponents disallows segment runtime overrides.
const attempts = new Map<string, { count: number; expires: number }>();
function limited(key: string, limit = 3) {
  const now = Date.now();
  for (const [entry, value] of attempts)
    if (value.expires <= now) attempts.delete(entry);
  const current = attempts.get(key);
  if (current && current.count >= limit) return true;
  if (!current && attempts.size >= 10000) return true;
  attempts.set(key, {
    count: (current?.count || 0) + 1,
    expires: current?.expires || now + 15 * 60 * 1000,
  });
  return false;
}
const reply = (status: number, message: string, extra = {}) =>
  Response.json(
    { message, ...extra },
    { status, headers: { "Cache-Control": "no-store" } },
  );
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expected =
    process.env.SITE_URL ||
    (process.env.NODE_ENV !== "production" ? new URL(request.url).origin : "");
  if (!expected || origin !== new URL(expected).origin)
    return reply(403, "Bitte sende die Anfrage direkt über unsere Website.");
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply(415, "Ungültiges Anfrageformat.");
  let input: Record<string, unknown>;
  try {
    // Bound the actual streamed body, not just a client-supplied Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, "Bitte fülle das Formular aus.");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 24000) {
        await reader.cancel();
        return reply(413, "Deine Nachricht ist zu lang.");
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!input || typeof input !== "object" || Array.isArray(input))
      return reply(400, "Ungültige Anfrage.");
  } catch {
    return reply(400, "Ungültige Anfrage.");
  }
  if (input.website)
    return reply(400, "Die Anfrage konnte nicht gesendet werden.");
  const data = validateContact(input);
  if (!data)
    return reply(
      400,
      "Bitte prüfe deine Angaben und bestätige den Datenschutzhinweis.",
    );
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const admin = process.env.CONTACT_ADMIN_EMAIL?.trim() || user;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (
    !user ||
    !pass ||
    !admin ||
    (process.env.NODE_ENV === "production" && !secret)
  )
    return reply(
      503,
      "Das Formular ist gerade nicht verfügbar. Bitte ruf uns unter +41 76 455 80 88 an.",
    );
  if (secret) {
    if (
      typeof input.token !== "string" ||
      input.token.length > 2048 ||
      !input.token
    )
      return reply(400, "Bitte bestätige die Sicherheitsprüfung.");
    try {
      const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: new URLSearchParams({ secret, response: input.token }),
          signal: AbortSignal.timeout(8000),
        },
      );
      const verification = await response.json();
      if (
        !response.ok ||
        !verification.success ||
        verification.hostname !== new URL(expected).hostname ||
        verification.action !== "contact"
      )
        return reply(
          400,
          "Die Sicherheitsprüfung ist abgelaufen. Bitte versuche es erneut.",
        );
    } catch {
      return reply(
        503,
        "Die Sicherheitsprüfung ist gerade nicht verfügbar. Bitte versuche es später erneut.",
      );
    }
  }
  if (limited(data.email.toLowerCase()) || limited("global", 30))
    return reply(
      429,
      "Zu viele Anfragen. Bitte versuche es in 15 Minuten erneut.",
    );
  const reference = randomUUID().slice(0, 8).toUpperCase();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  try {
    const result = await deliverContact(
      data,
      reference,
      { sender: user, admin },
      async (mail) => {
        const info = await transport.sendMail(mail);
        if (!info.accepted.length || info.rejected.length)
          throw new Error("Recipient rejected");
      },
    );
    if (!result.confirmationSent)
      console.warn("Contact confirmation failed", { reference });
    return reply(
      200,
      result.confirmationSent
        ? "Danke! Deine Anfrage wurde gesendet. Eine Bestätigung ist auf dem Weg zu dir."
        : "Deine Anfrage wurde gesendet. Die Bestätigungs-E-Mail konnte nicht verschickt werden. Bitte sende die Anfrage nicht erneut – wir melden uns bei dir.",
      { reference, ...result },
    );
  } catch {
    console.error("Contact admin delivery failed", { reference });
    return reply(
      502,
      "Der Versand konnte nicht bestätigt werden. Bitte ruf uns unter +41 76 455 80 88 an.",
    );
  } finally {
    transport.close();
  }
}
