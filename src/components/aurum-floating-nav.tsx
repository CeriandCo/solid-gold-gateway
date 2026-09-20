import { Button } from "@/components/ui/button";
import { GoldButton } from "@/components/site-chrome";
import mandala from "@/assets/sqoot-pure-mandala.png.asset.json";
import { AURUM_USD } from "@/lib/aurum/price-format";
import { useAurumPrice } from "@/lib/aurum/use-aurum-price";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

const LINKS = [
  { label: "Price", id: "price" },
  { label: "Daily Note", id: "daily-note" },
  { label: "Weekly Brief", id: "weekly-brief" },
  { label: "Learn", id: "learn" },
  { label: "Calculator", id: "calculator" },
  { label: "Gifts", id: "gifts" },
  { label: "Subscribe", id: "subscribe" },
] as const;

export function AurumFloatingNav() {
  const { state, data } = useAurumPrice();
  const [pastHero, setPastHero] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const closeAndReturnFocus = () => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    const hero = document.getElementById("top");
    const footer = document.querySelector("footer.site-footer");
    if (!hero || !footer) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(entry ? !entry.isIntersecting && entry.boundingClientRect.bottom <= 0 : false),
      { threshold: 0 },
    );
    const footerObserver = new IntersectionObserver(
      ([entry]) => setFooterVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0 },
    );
    heroObserver.observe(hero);
    footerObserver.observe(footer);
    return () => {
      heroObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const visible = new Map<string, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry);
          else visible.delete(entry.target.id);
        });
        const nearest = [...visible.values()].sort(
          (a, b) => Math.abs(a.boundingClientRect.top - 24) - Math.abs(b.boundingClientRect.top - 24),
        )[0];
        if (nearest) setActiveSection(nearest.target.id);
      },
      { rootMargin: "-24px 0px -65% 0px", threshold: [0, 0.01] },
    );
    LINKS.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus({ preventScroll: true }));
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeAndReturnFocus();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeAndReturnFocus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (footerVisible && open) setOpen(false);
  }, [footerVisible, open]);

  const onPanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    if (links.length === 0) return;
    event.preventDefault();
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const next = current < 0 ? (direction > 0 ? 0 : links.length - 1) : (current + direction + links.length) % links.length;
    links[next]?.focus({ preventScroll: true });
  };

  const onAnchorClick = (_event: MouseEvent<HTMLAnchorElement>) => {
    closeAndReturnFocus();
  };

  const visible = pastHero && !footerVisible;
  const showPrice = state.status === "ready" && data;
  const showDelayedPrice = state.status === "stale" && data;

  return (
    <>
    <div ref={rootRef} className="aurum-floating-nav" data-visible={visible ? "true" : "false"}>
      {open ? (
        <nav
          ref={panelRef}
          id="aurum-floating-panel"
          className="aurum-floating-nav__panel"
          aria-label="AURUM sections"
          onKeyDown={onPanelKeyDown}
        >
          <ul>
            {LINKS.map(({ label, id }) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={onAnchorClick}>
                  <span>{label}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
          <GoldButton href="#subscribe" variant="primary" size="sm" icon="none" onClick={closeAndReturnFocus}>
            Subscribe
          </GoldButton>
        </nav>
      ) : null}

      <Button
        ref={triggerRef}
        type="button"
        className="aurum-floating-nav__trigger"
        aria-expanded={open}
        aria-controls="aurum-floating-panel"
        aria-label={`${open ? "Close" : "Open"} AURUM section navigation`}
        onClick={() => setOpen((current) => !current)}
      >
        <img src={mandala.url} alt="" aria-hidden="true" />
        {showPrice ? <span>{AURUM_USD.format(data.spot)}</span> : null}
        {showDelayedPrice ? (
          <span className="aurum-floating-nav__delayed"><small>Delayed</small>{AURUM_USD.format(data.spot)}</span>
        ) : null}
      </Button>
    </div>
    <noscript>
      <nav className="aurum-floating-nav__noscript" aria-label="AURUM sections">
        {LINKS.map(({ label, id }) => <a key={id} href={`#${id}`}>{label}</a>)}
      </nav>
    </noscript>
    </>
  );
}