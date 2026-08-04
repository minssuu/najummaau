"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const revealSelector = [
  ".landing-label",
  ".landing-logo",
  ".landing-copy",
  ".entry-card",
  ".landing-foot",
  ".faction-hero-copy > *",
  ".faction-side",
  ".section-title",
  ".identity-grid > div",
  ".person-card",
  ".interest-list article",
  ".deal-heading",
  ".deal-pieces article",
  ".history-list article",
  ".character-copy > *",
  ".character-visual",
  ".story-prose p",
  ".character-relations article",
  ".faction-footer > *",
].join(",");

export default function PageMotion({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.remove("is-leaving");

    const elements = Array.from(root.querySelectorAll<HTMLElement>(revealSelector));
    elements.forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7%" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  function handleNavigation(event: React.MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target as HTMLElement;
    const anchor = target.closest<HTMLAnchorElement>("a[href]");
    if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const next = `${destination.pathname}${destination.search}${destination.hash}`;
    if (current === next || (destination.pathname === window.location.pathname && destination.hash)) return;

    event.preventDefault();
    if (rootRef.current?.classList.contains("is-leaving")) return;
    rootRef.current?.classList.add("is-leaving");
    timerRef.current = window.setTimeout(() => window.location.assign(destination.href), 360);
  }

  return (
    <div
      ref={rootRef}
      className="page-motion"
      onClickCapture={handleNavigation}
    >
      <div className="page-curtain" aria-hidden="true" />
      <div className="page-frame" key={pathname}>{children}</div>
    </div>
  );
}
