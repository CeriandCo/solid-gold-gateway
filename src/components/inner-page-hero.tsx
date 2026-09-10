import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InnerPageHeroProps = {
  id?: string;
  titleId: string;
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  actions: ReactNode;
  note?: ReactNode;
  imageSrc: string;
  imageAlt: string;
  imageVariant?: "standard" | "fractional" | "gifting" | "trust" | "learn" | "about";
  media?: ReactNode;
  className?: string;
};

export function InnerPageHero({
  id,
  titleId,
  eyebrow,
  title,
  body,
  actions,
  note,
  imageSrc,
  imageAlt,
  imageVariant = "standard",
  media,
  className,
}: InnerPageHeroProps) {
  return (
    <section id={id} className={cn("inner-page-hero", className)} aria-labelledby={titleId}>
      <img
        className={cn("inner-page-hero-image", `inner-page-hero-image--${imageVariant}`)}
        src={imageSrc}
        alt={imageAlt}
        fetchPriority="high"
      />
      {media}
      <div className="inner-page-hero-overlay" aria-hidden="true" />
      <div className="inner-page-hero-shell">
        <div className="inner-page-hero-copy">
          <p className="inner-page-hero-eyebrow">{eyebrow}</p>
          <h1 id={titleId}>{title}</h1>
          <span className="inner-page-hero-rule" aria-hidden="true" />
          <div className={cn("inner-page-hero-body", !body && "is-empty")} aria-hidden={!body || undefined}>
            {body}
          </div>
          <div className="inner-page-hero-action-area">
            <div className="inner-page-hero-actions">{actions}</div>
            <div className={cn("inner-page-hero-note", !note && "is-empty")}>{note}</div>
          </div>
        </div>
      </div>
      <style>{innerPageHeroStyles}</style>
    </section>
  );
}

export function InnerHeroSecondaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a className="inner-page-hero-secondary" href={href}>
      {children}
    </a>
  );
}

const innerPageHeroStyles = `
.inner-page-hero{position:relative;width:100%;height:clamp(560px,80vh,820px);overflow:hidden;color:var(--warm-white);background:var(--forest)}
.inner-page-hero-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;animation:innerHeroSettle 1.2s cubic-bezier(.22,1,.36,1) both}
.inner-page-hero-image--fractional{object-position:right center}.inner-page-hero-image--gifting{object-position:center}.inner-page-hero-image--trust{object-position:right center}.inner-page-hero-image--learn{object-position:right center}.inner-page-hero-image--about{object-position:right center}
.inner-page-hero>.about-hero-mandala{position:absolute;z-index:1;left:clamp(-267px,-10.4167vw,-107px);top:clamp(71px,6.9444vw,178px);width:clamp(441px,45.1389vw,1156px);height:clamp(441px,45.1389vw,1156px);object-fit:contain;opacity:.12;mix-blend-mode:screen}.inner-page-hero>.about-hero-bar{position:absolute;z-index:3;left:59.375%;top:6.7%;width:clamp(485px,33.6806vw,862px);height:90.8%;object-fit:contain;transform:rotate(4deg);filter:drop-shadow(0 25px 38px rgba(0,0,0,.42))}
.inner-page-hero>.kc-play{z-index:3}
.inner-page-hero-overlay{position:absolute;z-index:2;inset:0;background:linear-gradient(90deg,rgba(7,25,15,.98) 0%,rgba(7,25,15,.94) 26%,rgba(7,25,15,.77) 40%,rgba(7,25,15,.37) 54%,rgba(7,25,15,.06) 69%,transparent 80%)}
.inner-page-hero-shell{position:absolute;z-index:4;inset:0;padding-block:clamp(54px,7vh,76px);padding-inline:calc(max(0px,(100% - var(--container))/2) + var(--gutter))}
.inner-page-hero-copy{width:clamp(476px,46.5278vw,1191px);max-width:52%;height:100%;display:flex;flex-direction:column}
.inner-page-hero-eyebrow{height:18px;margin:0 0 16px;color:var(--gold);font-family:"Inter",Arial,sans-serif;font-size:clamp(11px,.9vw,14px);font-weight:600;line-height:18px;letter-spacing:.18em;text-transform:uppercase}
.inner-page-hero h1{max-width:clamp(484px,47.2222vw,1209px);margin:0;color:var(--warm-white);font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(40px,4.0278vw,103px);font-weight:500;line-height:.98;letter-spacing:-.025em}
.inner-page-hero h1 span{display:block}.inner-page-hero h1 em{font-style:normal;color:var(--gold)}
.inner-page-hero-rule{display:block;width:clamp(41px,4.0278vw,103px);height:2px;flex:none;margin-top:clamp(20px,2vw,40px);margin-bottom:clamp(14px,1.4vw,26px);background:var(--gold)}
.inner-page-hero-body{min-height:56px;max-width:540px;color:color-mix(in srgb,var(--warm-white) 94%,transparent);font-family:"Inter",Arial,sans-serif;font-size:clamp(16px,1.25vw,20px);font-weight:400;line-height:1.55;letter-spacing:0}.inner-page-hero-body.is-empty{visibility:hidden}
.inner-page-hero-body>span{display:block}
.inner-page-hero-action-area{min-height:94px;margin-top:auto;padding-top:20px}.inner-page-hero-actions{min-height:54px;display:flex;align-items:center;gap:16px}.inner-page-hero-note{height:20px;margin-top:12px;color:color-mix(in srgb,var(--warm-white) 80%,transparent);font-family:"Inter",Arial,sans-serif;font-size:13px;line-height:20px}.inner-page-hero-note.is-empty{visibility:hidden}
.inner-page-hero-secondary{display:inline-flex;height:54px;align-items:center;justify-content:center;gap:10px;padding-inline:32px;border:1px solid var(--gold);border-radius:2px;color:var(--warm-white);font-family:"Inter",Arial,sans-serif;font-size:14px;font-weight:600;line-height:1;transition:color .22s,background-color .22s,transform .22s}.inner-page-hero-secondary:hover{color:var(--forest-deep);background:var(--gold);transform:translateY(-1px)}.inner-page-hero-secondary:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.inner-page-hero-eyebrow,.inner-page-hero h1,.inner-page-hero-rule,.inner-page-hero-body,.inner-page-hero-action-area{opacity:0;transform:translateY(18px);animation:innerHeroRise 680ms cubic-bezier(.22,1,.36,1) forwards}.inner-page-hero h1{animation-delay:90ms}.inner-page-hero-rule{animation-delay:180ms}.inner-page-hero-body{animation-delay:270ms}.inner-page-hero-action-area{animation-delay:360ms}
@keyframes innerHeroSettle{from{transform:scale(1.02)}to{transform:scale(1)}}@keyframes innerHeroRise{to{opacity:1;transform:none}}
@media(max-width:1023px){.inner-page-hero-shell{padding-inline:40px}.inner-page-hero-copy{width:56%;max-width:560px}.inner-page-hero-image--gifting{object-position:60% center}}
@media(max-width:767px){.inner-page-hero{height:620px}.inner-page-hero-image{object-position:75% center}.inner-page-hero-image--fractional{object-position:right center}.inner-page-hero-image--gifting{object-position:66% center}.inner-page-hero-image--trust{object-position:78% center}.inner-page-hero-image--learn{object-position:68% center}.inner-page-hero-image--about{object-position:center}.inner-page-hero>.about-hero-mandala{left:-170px;top:30px;width:480px;height:480px}.inner-page-hero>.about-hero-bar{left:auto;right:-45px;top:auto;bottom:-4px;width:390px;height:48%;transform:rotate(4deg)}.inner-page-hero>.kc-play{left:auto;right:24px;top:auto;bottom:24px;translate:0 0;width:64px;height:64px}.inner-page-hero-overlay{background:linear-gradient(90deg,rgba(7,25,15,.98) 0%,rgba(7,25,15,.91) 54%,rgba(7,25,15,.48) 78%,rgba(7,25,15,.18) 100%)}.inner-page-hero-shell{padding:42px 20px 34px}.inner-page-hero-copy{width:100%;max-width:360px}.inner-page-hero-eyebrow{margin-bottom:12px}.inner-page-hero h1{max-width:340px;font-size:clamp(36px,10.7vw,44px)}.inner-page-hero-rule{width:42px;margin-top:18px;margin-bottom:14px}.inner-page-hero-body{min-height:68px;max-width:330px;font-size:15px}.inner-page-hero-action-area{min-height:92px;padding-top:16px}.inner-page-hero-actions{gap:10px}.inner-page-hero-actions>a{min-width:0;padding-inline:18px;font-size:12px}.inner-page-hero-note{font-size:12px}}
@media(max-width:380px){.inner-page-hero-actions{gap:8px}.inner-page-hero-actions>a{padding-inline:14px;font-size:11px}}
@media(prefers-reduced-motion:reduce){.inner-page-hero-image,.inner-page-hero-eyebrow,.inner-page-hero h1,.inner-page-hero-rule,.inner-page-hero-body,.inner-page-hero-action-area{animation:none!important;opacity:1;transform:none}}
`;