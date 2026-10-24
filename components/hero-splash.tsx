"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const SplashCursor = dynamic(
  () => import("@/components/react-bits/SplashCursor"),
  {
    ssr: false,
  },
);

const reducedQuery = "(prefers-reduced-motion: reduce)";
const mobileQuery = "(max-width: 700px), (pointer: coarse)";

function subscribe(callback: () => void) {
  const reduced = window.matchMedia(reducedQuery);
  const mobile = window.matchMedia(mobileQuery);
  reduced.addEventListener("change", callback);
  mobile.addEventListener("change", callback);
  return () => {
    reduced.removeEventListener("change", callback);
    mobile.removeEventListener("change", callback);
  };
}

function getMode() {
  if (window.matchMedia(reducedQuery).matches) return "off";
  return window.matchMedia(mobileQuery).matches ? "low" : "high";
}

export default function HeroSplash() {
  const mode = useSyncExternalStore<"off" | "low" | "high">(
    subscribe,
    getMode,
    () => "off",
  );
  if (mode === "off") return null;

  return (
    <SplashCursor
      rainbow={false}
      size={1}
      force={0.8}
      swirl={18}
      trail={0.85}
      clickSplash={false}
      colorSpeed={0.7}
      intensity={0.7}
      momentum={1}
      shading={0.4}
      glow={0}
      quality="low"
      intro
      contained
      zIndex={4}
      colors={["#e4e4e7"]}
    />
  );
}
