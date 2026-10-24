import { test } from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { validateContact } from "../lib/contact";
import { contactEmail, deliverContact } from "../lib/contact-email";
import { POST } from "../app/api/contact/route";
const valid = {
  name: "Test Gast",
  email: "guest@example.com",
  phone: "+41 76 123 45 67",
  topic: "Tischanfrage",
  message: "Ein Tisch für vier Personen, bitte.",
  consent: true,
};
test("validation rejects injection, missing consent, bad email and oversized messages", () => {
  assert.ok(validateContact(valid));
  for (const bad of [
    { consent: false },
    { email: "a@example.com\r\nBcc:other@example.com" },
    { name: "Test\nGuest" },
    { message: "x".repeat(5001) },
    { topic: "Unbekannt" },
    { phone: "<script>" },
    { email: "bad" },
  ])
    assert.equal(validateContact({ ...valid, ...bad }), null);
});
test("templates escape guest HTML and do not reflect messages to customer", () => {
  const data = {
    ...valid,
    message: '<img src=x onerror="alert(1)">',
    name: "<b>Gast</b>",
  };
  const admin = contactEmail(data, "admin", "TEST1234");
  const customer = contactEmail(data, "customer", "TEST1234");
  assert.ok(admin.html.includes("&lt;img"));
  assert.ok(!admin.html.includes("<img src=x"));
  assert.ok(customer.html.includes("&lt;b&gt;"));
  assert.ok(!customer.html.includes("onerror"));
  assert.ok(admin.text.includes(data.message));
});
test("delivery orders admin before customer, uses safe sender and correct reply-to", async () => {
  const sent: Parameters<Parameters<typeof deliverContact>[3]>[0][] = [];
  const result = await deliverContact(
    valid,
    "TEST1234",
    { sender: "sender@gmail.com", admin: "admin@example.com" },
    async (mail) => {
      sent.push(mail);
    },
  );
  assert.equal(result.confirmationSent, true);
  assert.deepEqual(
    sent.map((m) => m.to),
    ["admin@example.com", valid.email],
  );
  assert.equal(sent[0].replyTo, valid.email);
  assert.equal(sent[1].replyTo, "admin@example.com");
  assert.equal(sent[0].from.address, "sender@gmail.com");
});
test("admin failure stops customer delivery; confirmation failure preserves success", async () => {
  let count = 0;
  await assert.rejects(
    deliverContact(
      valid,
      "TEST",
      { sender: "sender@gmail.com", admin: "admin@example.com" },
      async () => {
        count++;
        throw Error("SMTP failure");
      },
    ),
  );
  assert.equal(count, 1);
  count = 0;
  const result = await deliverContact(
    valid,
    "TEST",
    { sender: "sender@gmail.com", admin: "admin@example.com" },
    async () => {
      if (++count === 2) throw Error("SMTP failure");
    },
  );
  assert.equal(result.confirmationSent, false);
});
test("production endpoint validates origin, body, configuration, captcha and delivery", async (t) => {
  const saved = { ...process.env };
  Object.assign(process.env, {
    NODE_ENV: "production",
    SITE_URL: "https://bar.example",
    GMAIL_USER: "sender@gmail.com",
    GMAIL_APP_PASSWORD: "test-only",
    CONTACT_ADMIN_EMAIL: "admin@example.com",
    TURNSTILE_SECRET_KEY: "test-only",
  });
  let sends = 0;
  let captchaValid = true;
  let smtpFailure = false;
  let confirmationFailure = false;
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      success: captchaValid,
      hostname: "bar.example",
      action: "contact",
    }),
  );
  t.mock.method(nodemailer, "createTransport", () => ({
    close() {},
    async sendMail() {
      sends++;
      if (smtpFailure || (confirmationFailure && sends % 2 === 0))
        throw Error("SMTP failure");
      return { accepted: ["recipient"], rejected: [] };
    },
  }));
  const request = (
    body: unknown = { ...valid, token: "test" },
    origin = "https://bar.example",
  ) =>
    new Request("https://bar.example/api/contact", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  try {
    assert.equal(
      (await POST(request(valid, "https://evil.example"))).status,
      403,
    );
    assert.equal(
      (await POST(request({ ...valid, consent: false }))).status,
      400,
    );
    assert.equal(
      (await POST(request({ ...valid, website: "spam" }))).status,
      400,
    );
    assert.equal(
      (await POST(request({ message: "x".repeat(25000) }))).status,
      413,
    );
    delete process.env.GMAIL_APP_PASSWORD;
    assert.equal((await POST(request())).status, 503);
    process.env.GMAIL_APP_PASSWORD = "test-only";
    delete process.env.TURNSTILE_SECRET_KEY;
    assert.equal((await POST(request())).status, 503);
    process.env.TURNSTILE_SECRET_KEY = "test-only";
    captchaValid = false;
    assert.equal((await POST(request())).status, 400);
    assert.equal(sends, 0);
    captchaValid = true;
    let response = await POST(request());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).confirmationSent, true);
    assert.equal(sends, 2);
    confirmationFailure = true;
    response = await POST(request());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).confirmationSent, false);
    smtpFailure = true;
    assert.equal((await POST(request())).status, 502);
    assert.equal((await POST(request())).status, 429);
  } finally {
    for (const key of Object.keys(process.env))
      if (!(key in saved)) delete process.env[key];
    Object.assign(process.env, saved);
  }
});
