"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { topics } from "@/lib/contact";
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>,
      ) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}
export default function ContactForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    reference?: string;
  } | null>(null);
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const locked = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!ready || !sitekey || !container.current || !window.turnstile) return;
    widget.current = window.turnstile.render(container.current, {
      sitekey,
      action: "contact",
      theme: "dark",
      size: "flexible",
      callback: (value: string) => {
        setToken(value);
        setCaptchaError(false);
      },
      "expired-callback": () => setToken(""),
      "error-callback": () => {
        setToken("");
        setCaptchaError(true);
      },
    });
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [ready, sitekey]);
  useEffect(() => {
    if (result) feedback.current?.focus();
  }, [result]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    locked.current = true;
    const form = event.currentTarget;
    const values = new FormData(form);
    setPending(true);
    setResult(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(values),
          consent: values.get("consent") === "on",
          token,
        }),
      });
      const body = await response.json();
      setResult({
        success: response.ok,
        message:
          body.message ||
          "Der Versand konnte nicht bestätigt werden. Bitte ruf uns an.",
        reference: body.reference,
      });
      if (response.ok) form.reset();
    } catch {
      setResult({
        success: false,
        message:
          "Der Versand konnte nicht bestätigt werden. Bitte prüfe dein Postfach oder ruf uns an, bevor du erneut sendest.",
      });
    } finally {
      setPending(false);
      locked.current = false;
      setToken("");
      if (widget.current) window.turnstile?.reset(widget.current);
    }
  }
  return (
    <section
      className="contact-form-section section-pad"
      aria-labelledby="contact-form-heading"
    >
      <div className="contact-form-intro">
        <span className="eyebrow">DEINE PLÄNE. UNSER POSTFACH.</span>
        <h2 id="contact-form-heading">
          Lass uns
          <br />
          <em>reden.</em>
        </h2>
        <p>
          Eine Frage, ein besonderer Anlass oder ein Abend mit deinen Leuten?
          Schreib uns – wir freuen uns auf deine Nachricht.
        </p>
        <a className="text-link" href="tel:+41762355000">
          Lieber direkt? Ruf uns an <ArrowUpRight size={18} />
        </a>
        <div className="contact-form-note">
          <span>GUT ZU WISSEN</span>
          <p>
            Eine Tischanfrage ist noch keine Reservierung. Dein Tisch ist erst
            nach unserer persönlichen Bestätigung reserviert.
          </p>
        </div>
      </div>
      <form className="contact-form" onSubmit={submit} aria-busy={pending}>
        <div className="contact-form-top">
          <span>01 — DEINE NACHRICHT</span>
          <small>* Pflichtfelder</small>
        </div>
        <fieldset disabled={pending}>
          <div className="contact-fields">
            <label>
              Dein Name *
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Vor- und Nachname"
              />
            </label>
            <label>
              E-Mail *
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="du@beispiel.ch"
              />
            </label>
            <label>
              Telefon <small>(optional)</small>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
                placeholder="+41 …"
              />
            </label>
            <label>
              Worum geht’s? *
              <select name="topic" defaultValue={topics[0]} required>
                {topics.map((topic) => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>
            </label>
            <label className="contact-field-wide">
              Deine Nachricht *
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={6}
                placeholder="Erzähl uns, was du vorhast …"
              />
            </label>
          </div>
          <div className="contact-honeypot" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="contact-consent">
            <input type="checkbox" name="consent" required />
            <span>
              Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung
              meiner Anfrage verwendet und über Google Gmail per E-Mail
              übermittelt werden. *
            </span>
          </label>
          <p className="contact-privacy">
            Deine Angaben werden für die Beantwortung deiner Anfrage genutzt.
            Bei Fragen zu deinen Daten erreichst du uns unter{" "}
            <a href="mailto:stationbar4@gmail.com">
              stationbar4@gmail.com
            </a>
            . Bitte sende keine sensiblen Daten.
          </p>
          {sitekey && (
            <>
              <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                onReady={() => setReady(true)}
                onError={() => setCaptchaError(true)}
              />
              <div ref={container} className="contact-captcha" />
              <p className="contact-privacy">
                Spam-Schutz durch Cloudflare Turnstile.{" "}
                <a
                  href="https://www.cloudflare.com/privacypolicy/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Datenschutz bei Cloudflare ↗
                </a>
              </p>
            </>
          )}
          {captchaError && (
            <p role="alert" className="contact-error">
              Die Sicherheitsprüfung konnte nicht geladen werden. Bitte lade die
              Seite neu oder ruf uns an.
            </p>
          )}
          <button
            className="button contact-submit"
            disabled={pending || Boolean(sitekey && !token)}
            type="submit"
          >
            {pending ? "Wird gesendet …" : "Nachricht senden"}
            <ArrowUpRight size={19} />
          </button>
        </fieldset>
        <noscript>
          <p>
            Bitte aktiviere JavaScript für das Formular oder schreibe an{" "}
            <a href="mailto:stationbar4@gmail.com">
              stationbar4@gmail.com
            </a>
            .
          </p>
        </noscript>
        {result && (
          <div
            ref={feedback}
            tabIndex={-1}
            role={result.success ? "status" : "alert"}
            className={`contact-feedback ${result.success ? "is-success" : "is-error"}`}
          >
            {result.success && <CheckCircle2 size={22} />}
            <div>
              <p>{result.message}</p>
              {result.reference && (
                <small>Deine Referenz: {result.reference}</small>
              )}
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
