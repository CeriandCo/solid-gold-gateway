import { useEffect, useRef } from "react";

/**
 * Shared scroll-reveal.
 *
 * Contract: nothing is hidden by CSS alone. The scope root only receives
 * `.reveal-ready` once this hook runs, so with JS disabled (or reduced motion)
 * every section renders fully visible.
 *
 * Usage:
 *   const scope = useReveal();
 *   return <main ref={scope}>…</main>
 *
 * Mark content with `data-reveal`. Use `data-reveal="trigger"` when the element
 * should only receive `.is-visible` (to drive its own bespoke child animation)
 * without the shared fade + rise.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const scopeRef = useRef<T>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const nodes = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (nodes.length === 0) return;

    const show = (node: HTMLElement) => node.classList.add("is-visible");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      nodes.forEach(show);
      return;
    }

    // Stagger only inside a group of siblings, capped at 6 steps.
    const groupCounters = new Map<Element, number>();
    nodes.forEach((node) => {
      const parent = node.parentElement;
      if (!parent) return;
      const index = groupCounters.get(parent) ?? 0;
      groupCounters.set(parent, index + 1);
      if (index > 0) node.style.setProperty("--reveal-index", String(Math.min(index, 6)));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    scope.classList.add("reveal-ready");
    nodes.forEach((node) => observer.observe(node));

    // Safety net: never leave content stuck hidden if the observer misfires.
    const failSafe = window.setTimeout(() => nodes.forEach(show), 4000);

    return () => {
      window.clearTimeout(failSafe);
      observer.disconnect();
      scope.classList.remove("reveal-ready");
    };
  }, []);

  return scopeRef;
}

export default useReveal;
