import { useEffect, useRef } from "react";

export function useNearestPanelScroll<T extends HTMLElement>(isOpen: boolean) {
  const panelRef = useRef<T>(null);
  const wasOpen = useRef(isOpen);

  useEffect(() => {
    const justOpened = isOpen && !wasOpen.current;
    wasOpen.current = isOpen;
    if (!justOpened) return;

    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      if (rect.bottom > window.innerHeight && rect.top > 0) {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        panel.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  return panelRef;
}