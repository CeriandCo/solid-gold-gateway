import { useEffect, useState } from "react";
import { getRemaining, type Remaining } from "@/config/launch";

const pad = (n: number) => String(n).padStart(2, "0");

export function LaunchCountdown() {
  // Null until mounted so server and first client render match.
  const [left, setLeft] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setLeft(getRemaining(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    const onVisible = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const units: [number, string][] = left
    ? [[left.days, "Days"], [left.hours, "Hours"], [left.minutes, "Min"], [left.seconds, "Sec"]]
    : [];

  return (
    <section aria-label="TRUNK launch countdown" className="bg-launch-forest text-launch-parchment">
      <div className="site-container flex min-h-[64px] flex-col items-center justify-center gap-2 py-3 text-center sm:flex-row sm:gap-6 sm:text-left">
        {left?.done ? (
          <p className="font-aurum-display text-lg font-medium sm:text-xl">TRUNK has arrived. Explore what's possible.</p>
        ) : (
          <>
            <p className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
              <span className="font-aurum-display text-lg font-medium sm:text-xl">Something golden is coming.</span>
              <span className="font-launch text-xs text-launch-parchment/75 sm:text-sm">The countdown to TRUNK begins.</span>
            </p>
            <span aria-hidden="true" className="hidden h-6 w-px bg-gold/40 sm:block" />
            <div className="font-launch flex items-baseline gap-2 sm:gap-3" role="timer" aria-live="off">
              {units.length === 0 ? (
                <span className="text-sm text-launch-parchment/60">&nbsp;</span>
              ) : (
                units.map(([value, label], i) => (
                  <span key={label} className="flex items-baseline gap-2 sm:gap-3">
                    {i > 0 && <span aria-hidden="true" className="text-gold/50">:</span>}
                    <span className="flex items-baseline gap-1">
                      <span className="text-base font-medium tabular-nums text-gold sm:text-lg">{pad(value)}</span>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-launch-parchment/70 sm:text-[11px]">{label}</span>
                    </span>
                  </span>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
