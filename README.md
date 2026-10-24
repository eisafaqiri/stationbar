# Staionbar

Dark responsive Next.js website for Staionbar, Bahnhofplatz 1, 5610 Wohlen.

## Run

- `npm install`
- `npm run dev`
- `npm run build` / `npm start`
- `npm run lint`

## Pages

- `/`: exactly three sections, with a cinematic shisha hero, lounge introduction and menu links.
- `/menu`: all 172 supplied items, category filters, name/code/category search and CHF prices. Data comes from `menu/menu.js`; discounted prices are preserved.
- `/kontakt`: supplied Thursday–Sunday hours, phone/email links and Google Maps directions. No Monday–Wednesday hours are inferred.

## Motion and visual design

The design adapts the split typography, central focal image, circular details and scroll choreography of https://emmaus-agir-31.fr/ to a near-black, ember-orange lounge identity. No source or assets were copied from the reference.

GSAP drives desktop and mobile animations. Desktop has pinned hero expansion and a pinned lounge sequence with progressive text, image masking and rotation. Mobile uses shorter headline/hero transitions and scroll-scrubbed lounge text, image masking, depth and seal rotation. The hero only pins on mobile viewports at least 820px tall; short phones keep normal scrolling. Reduced-motion preferences disable animated sequences and pinning. Animation contexts revert on unmount and breakpoint changes.

The old procedural Three.js hookah and its dependencies were removed. The new hero is a layered photographic image with scroll-driven transforms, not a real-time 3D model.

No licensed React Bits Pro component or license is used. Fonts and images are locally hosted.

## Generated assets

Created with the built-in image-generation tool, then resized/compressed to WebP:

- `public/images/shisha-night.webp`: cinematic black steel hookah, crystal glass base, natural curling hose, silver smoke, orange rim light, nearly black studio background, no people/text/logos.
- `public/images/cocktail-night.webp`: amber negroni in faceted glass, ice and orange peel, dark stone surface, smoky black background and orange edge light, no people/text/logos.

These are illustrative campaign images, not photographs of the actual venue. The original menu component in `menu/MenuCard.jsx` remains an unused reference. Reservations remain subject to personal confirmation. The contact form sends admin and customer emails through Gmail SMTP; it does not create bookings.

## Hero SplashCursor
The user-supplied React Bits SplashCursor TS/CSS source is in `components/react-bits/`, mounted by `components/hero-splash.tsx`. The supplied source was integrated directly; no Pro license or shadcn initialization is required. Local adaptations move settings-ref updates into an effect and rename the shader-program helper to avoid React hook-name collisions.

The hero uses the requested rainbow, size 1, force 0.8, swirl 18, trail 0.85, colorSpeed 0.7, intensity 0.7, shading 0.4 and clickSplash false settings. It is contained to the hero, below text and above the photograph, and does not intercept pointer events. Mobile/coarse-pointer devices use the component's low-quality simulation. Reduced-motion users do not mount the canvas. The supplied component supports passive touch movement, pauses after idle trails fade, and releases WebGL resources and listeners on unmount.

## Production configuration and launch

An ignored `.env.local` has been created for local configuration. `.env.example` is the safe, versioned template. Enter secrets only in `.env.local` or your hosting provider's secret settings; never commit them or prefix mail secrets with `NEXT_PUBLIC_`.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Real public HTTPS origin, e.g. `https://your-domain.ch`, no path/query. Used by canonical URLs, structured data, social previews, sitemap and form origin checks. |
| `SITE_INDEXABLE` | Set to `true` only on the public production deployment. Defaults to `false` for previews. |
| `GMAIL_USER` | Gmail account used for SMTP authentication and the fixed From address. |
| `GMAIL_APP_PASSWORD` | Dedicated Gmail App Password, not the normal account password. |
| `CONTACT_ADMIN_EMAIL` | Admin inbox; defaults to `GMAIL_USER` at runtime. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public Cloudflare Turnstile site key, embedded during build. |
| `TURNSTILE_SECRET_KEY` | Server-only Turnstile secret; required for production delivery. |

1. Enable 2-Step Verification for the Gmail account and create a dedicated App Password. See https://nodemailer.com/guides/using-gmail and https://support.google.com/accounts/answer/185833. Configure the sending account and admin recipient above.
2. Create a Cloudflare Turnstile widget for your real hostnames and supply both keys. The server verifies the hostname and `contact` action. See https://developers.cloudflare.com/turnstile/get-started/ and https://developers.cloudflare.com/turnstile/get-started/server-side-validation/.
3. Set the real `SITE_URL` and enable indexing on production. Configure the same environment values in the host before building. Rebuild when changing SEO settings or the public Turnstile key.
4. Run `npm ci`, `npm run check:production`, `npm test`, `npm run lint`, and `npm run build`. Deploy on a Node.js host supporting outbound Gmail SMTP (port 465). Static export cannot run the form. Use `npm start` behind HTTPS; configure a request timeout of at least 60 seconds and an upstream body-size limit.
5. Test the real domain on desktop/mobile, complete Turnstile, submit an owned test address, and check **both inboxes and spam folders**. Reply to the admin email to verify Reply-To reaches the guest. SMTP acceptance does not prove inbox delivery.
6. Check `/robots.txt`, `/sitemap.xml`, canonical tags, `/opengraph-image`, and Google Rich Results Test. Submit the sitemap in Google Search Console and connect the verified Google Business Profile. Choose a single canonical host and redirect aliases at your host. Rankings and rich results are not guaranteed.

`npm run check:production` intentionally fails with the supplied empty configuration. The app still builds for previews. Until a domain is supplied and indexing is enabled, robots disallows crawling, page metadata is noindex, and the sitemap is empty. Local preview canonical URLs use localhost.

### Contact delivery and operational limits

- Required name, email, topic, message and processing acknowledgement; optional phone. Server validation is authoritative. JSON bodies are capped at 24 KB, messages at 5,000 characters.
- Origin checks, a honeypot, production Turnstile verification, and bounded process-local throttling (3 requests per email and 30 overall per 15 minutes). This throttle resets on restart and is not shared across instances. Configure deployment-level rate limiting for `/api/contact` when using multiple workers/instances; Turnstile remains enforced on every production request.
- Fixed authenticated sender, guest Reply-To on admin email, admin Reply-To on customer email. Customer confirmation excludes the free-text message to reduce reflection abuse. HTML escapes guest values; both templates include plain text and a reference.
- The admin email must be accepted before a confirmation is attempted. If confirmation fails, the form reports that the request was received and asks the guest not to resend. No database or durable retry queue is included; Gmail is the record of accepted requests. A timeout can leave SMTP delivery uncertain, so the form directs guests to call rather than blindly retry.
- No message bodies, addresses or credentials are logged; failures log only a reference. Monitor server errors and Gmail sending limits. Gmail can restrict automated SMTP sessions; confirm your actual hosting environment works before launch.
- The inline data-use notice identifies Gmail and Turnstile. The owner should supply their complete privacy/legal information, retention practices and business operator details before publishing; no operator identity or retention period has been invented.

### SEO and verification

Home, Menu and Kontakt have unique titles/descriptions, canonical URLs, Open Graph and Twitter metadata. The homepage includes BarOrPub JSON-LD using the supplied address, phone, email and Thursday-Sunday hours only. The complete menu is rendered in the initial HTML fallback for crawlers. A branded 1200x630 social image is generated locally without external assets. Security response headers disable framing and MIME sniffing and restrict unused browser permissions.

`npm test` exercises invalid/injected input, escaped email content, delivery order and Reply-To, admin failure, confirmation-only failure, and production request guards using mocked SMTP and Turnstile. It sends no real email. Browser visual review and real Gmail/Turnstile acceptance must be performed after configuration.

Dependency audit at implementation: `npm audit --omit=dev` reported zero advisories. Full audit reported five high-severity findings in the development-only ESLint/fast-glob/micromatch/braces chain; the offered automatic fix would downgrade Next's ESLint configuration to an incompatible major version, so it was not applied.
