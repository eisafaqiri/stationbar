import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd(), false);
const errors = [];
try {
  const url = new URL(process.env.SITE_URL || "");
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    ["localhost", "127.0.0.1"].includes(url.hostname)
  )
    throw Error();
} catch {
  errors.push("Set SITE_URL to your real public HTTPS origin.");
}
if (process.env.SITE_INDEXABLE !== "true")
  errors.push("Set SITE_INDEXABLE=true for the public production deployment.");
for (const key of [
  "GMAIL_USER",
  "GMAIL_APP_PASSWORD",
  "CONTACT_ADMIN_EMAIL",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
]) {
  if (!process.env[key]?.trim()) errors.push(`Set ${key}.`);
}
if (errors.length) {
  console.error(
    "Production configuration is incomplete:\n" +
      errors.map((e) => `- ${e}`).join("\n"),
  );
  process.exitCode = 1;
} else
  console.log(
    "Required production settings are present. This does not verify Gmail credentials, DNS or Turnstile. Rebuild and test both mailboxes before launch.",
  );
