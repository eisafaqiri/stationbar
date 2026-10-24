"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function Motion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 900px)",
        tall: "(min-height: 820px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const desktop = Boolean(context.conditions.desktop);
        const pinHero = desktop || Boolean(context.conditions.tall);
        const ctx = gsap.context(() => {
          if (root.current?.querySelector(".night-hero")) {
            gsap.set(
              ".title-left,.title-right,.title-script,.hero-portrait,.hero-orbit,.hero-exit",
              { force3D: true },
            );
            gsap
              .timeline({ defaults: { ease: "power3.out" } })
              .from(".title-left", { x: -45, duration: 1.1 })
              .from(".title-right", { x: 45, duration: 1.1 }, 0)
              .from(
                ".hero-photo",
                { scale: 1.06, opacity: 0, duration: 1.3 },
                0,
              )
              .from(".title-script", { y: 20, rotate: -3, duration: 1 }, 0.15);
            const hero = gsap.timeline({
              defaults: { ease: "none", duration: 1 },
              scrollTrigger: {
                trigger: ".night-hero",
                start: pinHero ? "top top" : "top -70",
                end: pinHero ? (desktop ? "+=75%" : "+=48%") : "bottom 25%",
                pin: pinHero,
                scrub: desktop ? 0.75 : 0.5,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });
            hero
              .to(
                ".title-left",
                { xPercent: desktop ? -35 : -28, opacity: 0, duration: 0.7 },
                0,
              )
              .to(
                ".title-right",
                { xPercent: desktop ? 35 : 28, opacity: 0, duration: 0.7 },
                0,
              )
              .to(".title-script", { opacity: 0, duration: 0.35 }, 0)
              .to(
                ".hero-portrait",
                {
                  scale: desktop ? 1.3 : 1.13,
                  yPercent: desktop ? 6 : -3,
                  ease: "none",
                },
                0,
              )
              .to(
                ".hero-orbit",
                { scale: 1.2, rotation: 60, opacity: 0.2, ease: "none" },
                0,
              );
            if (pinHero)
              hero
                .to(
                  ".hero-intro,.hero-reserve,.scroll-disc,.hero-kicker,.hero-side-label,.hero-index",
                  { autoAlpha: 0, duration: 0.45 },
                  0,
                )
                .fromTo(
                  ".hero-exit",
                  { opacity: 0, y: 30 },
                  { opacity: 1, y: 0, duration: 0.45 },
                  0.55,
                );
            if (desktop) {
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: ".night-story",
                    start: "top top",
                    end: "+=95%",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                  },
                })
                .fromTo(
                  ".story-word",
                  { opacity: 0.22 },
                  { opacity: 1, stagger: 0.4, duration: 0.35 },
                  0,
                )
                .fromTo(
                  ".story-image",
                  {
                    clipPath: "inset(12% 8% 12% 8% round 160px)",
                    scale: 0.92,
                    rotateY: -10,
                  },
                  {
                    clipPath: "inset(0% 0% 0% 0% round 2px)",
                    scale: 1,
                    rotateY: 0,
                    duration: 1.3,
                    ease: "none",
                  },
                  0,
                )
                .to(
                  ".story-image img",
                  { scale: 1.12, duration: 1.3, ease: "none" },
                  0,
                )
                .to(
                  ".story-seal",
                  { rotation: 100, duration: 1.3, ease: "none" },
                  0,
                );
            } else {
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: ".story-copy",
                    start: "top 85%",
                    end: "center 40%",
                    scrub: 0.35,
                  },
                })
                .fromTo(
                  ".story-word",
                  { opacity: 0.22, x: -12 },
                  {
                    opacity: 1,
                    x: 0,
                    stagger: 0.3,
                    duration: 0.4,
                    ease: "none",
                  },
                );
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: ".story-photo-wrap",
                    start: "top 90%",
                    end: "center 40%",
                    scrub: 0.45,
                  },
                })
                .fromTo(
                  ".story-image",
                  {
                    clipPath: "inset(8% 8% 8% 8% round 120px)",
                    scale: 0.94,
                    rotateY: -8,
                  },
                  {
                    clipPath: "inset(0% 0% 0% 0% round 2px)",
                    scale: 1,
                    rotateY: 0,
                    ease: "none",
                  },
                  0,
                )
                .fromTo(
                  ".story-image img",
                  { scale: 1.16 },
                  { scale: 1, ease: "none" },
                  0,
                )
                .to(".story-seal", { rotation: 75, ease: "none" }, 0);
            }
            gsap
              .timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                  trigger: ".menu-heading-row",
                  start: "top 88%",
                  once: true,
                },
              })
              .from(".menu-heading-row .eyebrow", {
                opacity: 0,
                y: 12,
                duration: 0.6,
              })
              .from(
                ".menu-title-line",
                {
                  yPercent: 110,
                  rotation: 3,
                  transformOrigin: "left bottom",
                  duration: 1.1,
                  stagger: 0.16,
                },
                0.1,
              )
              .from(
                ".menu-heading-row > p",
                { opacity: 0, y: 20, duration: 0.8 },
                0.35,
              );
            gsap.utils
              .toArray<HTMLElement>(".menu-night-row")
              .forEach((row) => {
                gsap
                  .timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: {
                      trigger: row,
                      start: "top 92%",
                      once: true,
                    },
                  })
                  .from(
                    row.querySelector(".menu-row-rule"),
                    { scaleX: 0, transformOrigin: "left", duration: 1 },
                    0,
                  )
                  .from(
                    row.querySelector(".menu-night-number"),
                    { opacity: 0, y: 12, duration: 0.6 },
                    0.08,
                  )
                  .from(
                    row.querySelector("h3"),
                    {
                      opacity: 0,
                      x: desktop ? -32 : -16,
                      y: 14,
                      duration: 0.9,
                    },
                    0.12,
                  )
                  .from(
                    row.querySelector("p"),
                    { opacity: 0, y: 12, duration: 0.7 },
                    0.24,
                  )
                  .from(
                    row.querySelector(".row-tag"),
                    { opacity: 0, x: -12, duration: 0.7 },
                    0.3,
                  )
                  .from(
                    row.querySelector(".row-arrow"),
                    { opacity: 0, scale: 0.65, rotation: -45, duration: 0.8 },
                    0.2,
                  );
              });
            gsap.from(".night-menu-bottom > *", {
              opacity: 0,
              y: 18,
              stagger: 0.12,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".night-menu-bottom",
                start: "top 96%",
                once: true,
              },
            });
          }
          gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) =>
            gsap.from(el, {
              y: 25,
              opacity: 0,
              duration: 0.7,
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            }),
          );
        }, root);
        return () => ctx.revert();
      },
    );
    return () => mm.revert();
  }, []);
  return <div ref={root}>{children}</div>;
}
export function Atmosphere({ dark = false }: { dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const parent = el.parentElement;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const pointer = (e: PointerEvent) => {
      if (mq.matches || e.pointerType === "touch") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const halo = el.firstElementChild as HTMLElement | null;
        if (halo)
          halo.style.transform = `translate3d(${pointerX - r.left - 220}px, ${pointerY - r.top - 220}px, 0)`;
      });
    };
    parent?.addEventListener("pointermove", pointer);
    return () => {
      cancelAnimationFrame(frame);
      parent?.removeEventListener("pointermove", pointer);
    };
  }, []);
  return (
    <div
      ref={ref}
      className={"atmosphere " + (dark ? "dark" : "")}
      aria-hidden="true"
    >
      <div className="cursor-halo" />
      <div className="smoke-wisp smoke-one" />
      <div className="smoke-wisp smoke-two" />
    </div>
  );
}
