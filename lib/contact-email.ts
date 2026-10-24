import type { ContactData } from "./contact";
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );

export function contactEmail(
  data: ContactData,
  audience: "admin" | "customer",
  reference: string,
) {
  const admin = audience === "admin";
  const title = admin ? "Ein neues Hallo." : "Schön, von dir zu hören.";
  const intro = admin
    ? "Eine neue Kontaktanfrage ist eingegangen. Antworte direkt auf diese E-Mail, um den Gast zu erreichen."
    : `Hallo ${data.name}, danke für deine Nachricht. Wir haben deine Anfrage erhalten und melden uns bei dir. Eine Tischanfrage ist erst nach unserer persönlichen Bestätigung verbindlich.`;
  const details = admin
    ? [
        ["Name", data.name],
        ["E-Mail", data.email],
        ["Telefon", data.phone || "Nicht angegeben"],
        ["Anliegen", data.topic],
      ]
    : [["Anliegen", data.topic]];
  // Do not reflect arbitrary message content into an unverified recipient's confirmation.
  const message = admin
    ? `<div style="padding:24px;background:#f5f1eb;border-left:3px solid #cf552b;white-space:pre-wrap;overflow-wrap:anywhere;color:#292c27;line-height:1.7">${escapeHtml(data.message)}</div>`
    : "";
  const rows = details
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 12px 10px 0;color:#6a6c64;vertical-align:top">${label}</td><td style="padding:10px 0;color:#20231e;overflow-wrap:anywhere">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const text = `${title}\n\n${intro}\n\nReferenz: ${reference}\n${details.map(([label, value]) => `${label}: ${value}`).join("\n")}\n${admin ? `\nNachricht:\n${data.message}\n` : ""}\nStaionbar · Bahnhofplatz 1 · 5610 Wohlen\n076 235 50 00\n${admin ? "" : "Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren."}`;
  const html = `<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#ece9e3;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${admin ? "Neue Anfrage über das Kontaktformular" : "Deine Nachricht ist bei der Staionbar angekommen."}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:32px 12px"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#fffdf9"><tr><td style="background:#11130f;padding:36px 30px;border-bottom:4px solid #ef6d3f"><div style="color:#fff8ec;font-size:38px;letter-spacing:-2px;font-weight:bold">staionbar</div><div style="color:#c7c8bc;font-size:11px;letter-spacing:3px;margin-top:12px">SHISHA. DRINKS. GOOD COMPANY.</div></td></tr><tr><td style="padding:36px 30px"><p style="color:#b34824;font-size:11px;letter-spacing:2px">${admin ? "NEUE KONTAKTANFRAGE" : "DEINE ANFRAGE IST DA"}</p><h1 style="font-size:32px;line-height:1.15;color:#20231e;margin:18px 0">${title}</h1><p style="font-size:16px;line-height:1.7;color:#55594e">${escapeHtml(intro)}</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;margin:24px 0">${rows}</table>${message}<p style="font-size:12px;color:#74776e;margin-top:24px">Referenz: ${escapeHtml(reference)}</p><p style="color:#55594e;line-height:1.6;font-size:14px">Bis bald am Bahnhofplatz.<br><strong>Dein Staionbar-Team</strong></p></td></tr><tr><td style="padding:24px 30px;background:#f2efe8;color:#686b60;font-size:12px;line-height:1.8">STAIONBAR · Bahnhofplatz 1 · 5610 Wohlen<br><a style="color:#33382c" href="tel:+41762355000">076 235 50 00</a>${admin ? "" : "<br>Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren."}</td></tr></table></td></tr></table></body></html>`;
  return {
    subject: admin
      ? `Kontaktanfrage: ${data.topic} [${reference}]`
      : `Deine Anfrage bei der Staionbar [${reference}]`,
    html,
    text,
  };
}

type Send = (mail: {
  from: { name: string; address: string };
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
  disableFileAccess: boolean;
  disableUrlAccess: boolean;
}) => Promise<unknown>;
export async function deliverContact(
  data: ContactData,
  reference: string,
  config: { sender: string; admin: string },
  send: Send,
) {
  const common = {
    from: { name: "Staionbar", address: config.sender },
    disableFileAccess: true,
    disableUrlAccess: true,
  };
  await send({
    ...common,
    to: config.admin,
    replyTo: data.email,
    ...contactEmail(data, "admin", reference),
  });
  try {
    await send({
      ...common,
      to: data.email,
      replyTo: config.admin,
      ...contactEmail(data, "customer", reference),
    });
    return { confirmationSent: true };
  } catch {
    return { confirmationSent: false };
  }
}
