"use client";
/* Port of the Studio design's behaviour layer (smooth scroll, cursor, loader, route wipe, scroll choreography, sliders).
   Markup is rendered by server components; this only attaches behaviour and never rewrites React-owned text. */
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Swiper from "swiper";
import { Autoplay, FreeMode, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

const GLY = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

const labelFor = (path: string) => {
  if (path === "/") return "Home";
  const seg = path.split("/").filter(Boolean)[0] || "";
  const map: Record<string, string> = {
    about: "About",
    services: "Services",
    portfolio: "Portfolio",
    blog: "Blog",
    training: "Training",
    career: "Career",
    contact: "Contact",
    "privacy-policy": "Privacy",
    "terms-and-conditions": "Terms",
    "free-consultation": "Consultation",
  };
  return map[seg] || seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
};

export default function StudioRuntime() {
  const pathname = usePathname();
  const router = useRouter();
  const S = useRef<{
    lenis: Lenis | null;
    busy: boolean;
    pending: string | null;
    root: HTMLElement | null;
    reduce: boolean;
    fine: boolean;
    first: boolean;
    vel: number;
    current: string | null;
  }>({
    lenis: null,
    busy: false,
    pending: null,
    root: null,
    reduce: false,
    fine: false,
    first: true,
    vel: 0,
    current: null,
  });

  /* ---------- persistent: runs once ---------- */
  useEffect(() => {
    const st = S.current;
    const root = document.querySelector<HTMLElement>("[data-stu-root]");
    if (!root) return;
    st.root = root;
    st.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    st.fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof DocumentEventMap>(
      t: Document | Window,
      k: string,
      fn: (e: any) => void,
      o?: AddEventListenerOptions | boolean
    ) => {
      t.addEventListener(k, fn, o);
      cleanups.push(() => t.removeEventListener(k, fn, o));
    };

    /* smooth scroll */
    if (!st.reduce) {
      const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      st.lenis = lenis;
      lenis.on("scroll", (e: any) => {
        st.vel = e.velocity || 0;
        ScrollTrigger.update();
      });
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        st.lenis = null;
      });
    }

    /* menu */
    const burger = root.querySelector<HTMLButtonElement>(".burger");
    const menu = root.querySelector<HTMLElement>("#menu");
    const setMenu = (open: boolean) => {
      if (!menu || !burger) return;
      menu.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (st.lenis) open ? st.lenis.stop() : st.lenis.start();
      if (open && !st.reduce)
        gsap.fromTo(".stu .menu li a", { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, delay: 0.2 });
    };
    on(document, "click", (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(".burger")) setMenu(!menu?.classList.contains("is-open"));
      else if (t.closest(".menu a")) setMenu(false);
    });
    on(document, "keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape" && menu?.classList.contains("is-open")) {
        setMenu(false);
        burger?.focus();
      }
    });

    /* copy buttons */
    on(document, "click", (e: MouseEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>(".copy");
      if (!b) return;
      const v = b.dataset.copy || "";
      const label = b.querySelector("small");
      const done = (ok: boolean) => {
        if (!label) return;
        label.textContent = ok ? "Copied" : "Select";
        b.classList.toggle("is-done", ok);
        setTimeout(() => {
          label.textContent = "Copy";
          b.classList.remove("is-done");
        }, 1600);
      };
      try {
        navigator.clipboard?.writeText(v).then(() => done(true), () => done(false)) ?? done(false);
      } catch {
        done(false);
      }
    });

    /* in-page scroll links */
    on(document, "click", (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>("[data-scroll]");
      if (!a) return;
      e.preventDefault();
      const t = document.querySelector(a.dataset.scroll || "");
      if (!t) return;
      if (st.lenis) st.lenis.scrollTo(t as HTMLElement, { offset: -100, duration: 1.4 });
      else t.scrollIntoView({ behavior: st.reduce ? "auto" : "smooth" });
    });

    /* cursor, preview, magnetic, tilt */
    const ring = root.querySelector<HTMLElement>(".cursor-ring");
    const dot = root.querySelector<HTMLElement>(".cursor");
    const preview = root.querySelector<HTMLElement>(".preview");
    const pImg = preview?.querySelector("img");
    if (st.fine && ring && dot && preview && pImg) {
      const dx = gsap.quickTo(dot, "x", { duration: 0.12 });
      const dy = gsap.quickTo(dot, "y", { duration: 0.12 });
      const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
      const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
      const px = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
      const py = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });
      on(window, "pointermove", (e: PointerEvent) => {
        dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); px(e.clientX); py(e.clientY);
      });
      const label = ring.querySelector("span") as HTMLElement;
      on(document, "pointerover", (e: PointerEvent) => {
        const t = e.target as HTMLElement;
        const pv = t.closest<HTMLElement>("[data-preview]");
        const link = t.closest("a, button");
        const cu = t.closest<HTMLElement>("[data-cursor]");
        if (pv) {
          label.textContent = "View";
          (pImg as HTMLImageElement).src = pv.dataset.preview || "";
          preview.classList.add("is-on");
          ring.classList.add("is-view");
          ring.classList.remove("is-link");
          gsap.to(preview, { scale: 1, rotate: gsap.utils.random(-5, 5), duration: 0.5, ease: "power3" });
        } else if (cu) {
          if (preview.classList.contains("is-on")) { preview.classList.remove("is-on"); gsap.to(preview, { scale: 0.7, duration: 0.2 }); }
          label.textContent = cu.dataset.cursor || "View";
          ring.classList.add("is-view");
        } else {
          /* the hovered row can be removed by a page change without a pointerout, so always drop a stale preview */
          if (preview.classList.contains("is-on")) { preview.classList.remove("is-on"); ring.classList.remove("is-view"); gsap.to(preview, { scale: 0.7, duration: 0.2 }); }
          if (link) ring.classList.add("is-link");
        }
      });
      on(document, "click", (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest("[data-preview]") && preview.classList.contains("is-on")) {
          preview.classList.remove("is-on"); ring.classList.remove("is-view");
        }
      });
      on(document, "pointerout", (e: PointerEvent) => {
        const t = e.target as HTMLElement;
        const rel = e.relatedTarget as Node | null;
        const pv = t.closest<HTMLElement>("[data-preview]");
        const link = t.closest("a, button");
        if (pv && !pv.contains(rel)) {
          preview.classList.remove("is-on");
          ring.classList.remove("is-view");
          gsap.to(preview, { scale: 0.7, duration: 0.4 });
        }
        if (link && !link.contains(rel)) ring.classList.remove("is-link");
        const cu = t.closest("[data-cursor]");
        if (cu && !cu.contains(rel) && !pv) ring.classList.remove("is-view");
      });
      on(document, "pointermove", (e: PointerEvent) => {
        const t = (e.target as HTMLElement).closest<HTMLElement>(".tilt");
        if (!t) return;
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
      });
      on(document, "pointerout", (e: PointerEvent) => {
        const t = (e.target as HTMLElement).closest<HTMLElement>(".tilt");
        if (t && !t.contains(e.relatedTarget as Node)) t.style.transform = "";
      });
    }
    /* card spotlight follows the pointer */
    on(
      document,
      "pointermove",
      (e: PointerEvent) => {
        const c = (e.target as HTMLElement).closest?.<HTMLElement>(".v5stack .panel, .course, .office");
        if (!c) return;
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      },
      { passive: true }
    );

    /* back-to-top with progress ring */
    const toTop = root.querySelector<HTMLButtonElement>(".totop");
    const fg = toTop?.querySelector<SVGCircleElement>(".totop__fg");
    if (toTop && fg) {
      const C = 2 * Math.PI * 22;
      fg.style.strokeDasharray = String(C);
      const upd = () => {
        const h = document.documentElement.scrollHeight - innerHeight;
        const p = h > 0 ? Math.min(1, scrollY / h) : 0;
        fg.style.strokeDashoffset = (C * (1 - p)).toFixed(1);
        toTop.classList.toggle("is-on", scrollY > innerHeight * 0.8);
      };
      on(window, "scroll", upd, { passive: true });
      upd();
      const up = () => {
        if (st.lenis) st.lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: st.reduce ? "auto" : "smooth" });
      };
      toTop.addEventListener("click", up);
      cleanups.push(() => toTop.removeEventListener("click", up));
    }

    /* clocks */
    const clock = () =>
      document.querySelectorAll<HTMLElement>("[data-tz]").forEach((n) => {
        try {
          n.textContent = new Intl.DateTimeFormat("en-GB", { timeZone: n.dataset.tz, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
        } catch {}
      });
    const clockTimer = setInterval(clock, 1000);
    cleanups.push(() => clearInterval(clockTimer));

    /* marquee driven by scroll velocity */
    let mqx = 0, skew = 0;
    const mqTick = () => {
      const mq = document.querySelector<HTMLElement>(".mq__track");
      if (!mq) return;
      const v = st.vel || 0;
      if (!st.reduce) mqx -= 1.2 + Math.abs(v) * 0.35;
      const half = mq.scrollWidth / 2;
      if (half > 0 && -mqx >= half) mqx += half;
      skew += ((st.reduce ? 0 : Math.max(-12, Math.min(12, v * 0.6))) - skew) * 0.1;
      mq.style.transform = `translate3d(${mqx}px,0,0) skewX(${-skew}deg)`;
    };
    gsap.ticker.add(mqTick);
    cleanups.push(() => gsap.ticker.remove(mqTick));

    /* drag guard: a press-move-release on a link (slider drag) must never count as a click */
    let pressAt: { x: number; y: number } | null = null;
    on(document, "pointerdown", (e: PointerEvent) => { pressAt = { x: e.clientX, y: e.clientY }; }, true);
    on(
      document,
      "click",
      (e: MouseEvent) => {
        if (!pressAt || e.detail === 0 || !(e.target as HTMLElement).closest?.("a[href], button")) return;
        if (Math.hypot(e.clientX - pressAt.x, e.clientY - pressAt.y) > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
    on(document, "dragstart", (e: DragEvent) => { if ((e.target as HTMLElement).closest?.(".swiper")) e.preventDefault(); }, true);

    /* route transitions: wipe over the page, navigate, wipe away */
    on(
      document,
      "click",
      (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
        if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin) return;
        const next = url.pathname + url.search;
        if (url.pathname === location.pathname && !url.search) {
          if (url.hash) return;
          e.preventDefault();
          return;
        }
        if (st.reduce) return; // default Next navigation
        e.preventDefault();
        if (st.busy) { st.pending = next; return; }
        st.busy = true;
        const lbl = root.querySelector<HTMLElement>(".wipe__label");
        if (lbl) lbl.textContent = labelFor(url.pathname);
        gsap.set(".stu .wipe i", { transformOrigin: "bottom" });
        gsap
          .timeline({ onComplete: () => router.push(next) })
          .to(".stu .wipe i", { scaleY: 1, duration: 0.6, ease: "expo.inOut", stagger: 0.06 })
          .to(lbl, { opacity: 1, duration: 0.25 }, "-=.25");
      },
      true
    );

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- per route ---------- */
  useEffect(() => {
    const st = S.current;
    const root = st.root;
    if (!root) return;
    const reduce = st.reduce, fine = st.fine;
    const isHome = pathname === "/";
    const page = root.querySelector<HTMLElement>(".page");
    const cleanups: Array<() => void> = [];

    /* nav state */
    root.querySelectorAll<HTMLElement>("[data-nav]").forEach((a) => {
      const h = a.dataset.nav || "";
      const on = h === "/" ? isHome : pathname === h || pathname.startsWith(h + "/");
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    const videoHead = !isHome && !!root.querySelector(".pagehead--video");
    root.classList.toggle("on-dark", isHome || videoHead);
    const bar = root.querySelector<HTMLElement>(".progress");
    if (bar) bar.style.transform = "scaleX(0)";
    if (st.lenis) st.lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    /* swipers */
    const swipers: Swiper[] = [];
    const gut = () => Math.max(24, (innerWidth - 1440) / 2 + 24);
    const mk = (sel: string, extra: any) => {
      const el = root.querySelector<HTMLElement>(sel);
      if (!el) return null;
      const common: any = {
        modules: [FreeMode, Mousewheel, Keyboard],
        slidesPerView: "auto",
        spaceBetween: 20,
        grabCursor: true,
        slidesOffsetBefore: gut(),
        slidesOffsetAfter: gut(),
        mousewheel: { forceToAxis: true },
        keyboard: { enabled: true, onlyInViewport: true },
      };
      const sw = new Swiper(el, { ...common, ...extra });
      swipers.push(sw);
      return sw;
    };
    const work = mk("#wkSwiper", {
      speed: 1000,
      watchSlidesProgress: true,
      freeMode: { enabled: true, momentumRatio: 0.55, momentumVelocityRatio: 0.7 },
      on: {
        progress: (sw: Swiper) => {
          sw.slides.forEach((sl: HTMLElement) => {
            const im = sl.querySelector("img") as HTMLElement | null;
            if (im) im.style.transform = `translate3d(${((sl as any).progress * 4).toFixed(2)}%,0,0) scale(1.1)`;
          });
          const b = root.querySelector<HTMLElement>("#wkBar");
          if (b) b.style.transform = `scaleX(${Math.max(0.04, Math.min(1, sw.progress))})`;
        },
        setTransition: (sw: Swiper, d: number) =>
          sw.slides.forEach((sl: HTMLElement) => {
            const im = sl.querySelector("img") as HTMLElement | null;
            if (im) im.style.transitionDuration = d + "ms";
          }),
        resize: (sw: Swiper) => {
          sw.params.slidesOffsetBefore = gut();
          sw.params.slidesOffsetAfter = gut();
          sw.update();
        },
      },
    });
    const blog = mk("#blSwiper", {
      speed: 800,
      on: {
        resize: (sw: Swiper) => {
          sw.params.slidesOffsetBefore = gut();
          sw.params.slidesOffsetAfter = gut();
          sw.update();
        },
      },
    });
    /* about: team slider, auto-advances right to left and pauses on hover; the failure of this optional widget must never block the page */
    const teamEl = root.querySelector<HTMLElement>("#teamSwiper");
    if (teamEl) {
      try {
        const pad = parseFloat(getComputedStyle(teamEl.closest(".wrap") || teamEl).paddingLeft) || 24;
        const ts = new Swiper(teamEl, {
          modules: [Autoplay, Keyboard],
          slidesPerView: "auto",
          spaceBetween: 20,
          grabCursor: true,
          slidesOffsetBefore: pad,
          slidesOffsetAfter: pad,
          speed: 900,
          loop: true,
          loopAdditionalSlides: 3,
          keyboard: { enabled: true, onlyInViewport: true },
          autoplay: st.reduce ? false : { delay: 2400, disableOnInteraction: false, pauseOnMouseEnter: true },
        });
        swipers.push(ts);
      } catch (err) {
        console.error("team slider failed", err);
      }
    }
    const bind = (id: string, fn: () => void) => {
      const b = root.querySelector<HTMLElement>(id);
      if (b) { b.addEventListener("click", fn); cleanups.push(() => b.removeEventListener("click", fn)); }
    };
    bind("#wkPrev", () => work?.slidePrev());
    bind("#wkNext", () => work?.slideNext());
    bind("#blPrev", () => blog?.slidePrev());
    bind("#blNext", () => blog?.slideNext());

    /* testimonial slider */
    root.querySelectorAll<HTMLElement>(".tslider").forEach((box) => {
      const figs = box.querySelectorAll<HTMLElement>(".q");
      if (figs.length < 2) return;
      const dots = box.querySelectorAll<HTMLElement>(".tslider__dots i");
      const count = box.querySelector<HTMLElement>(".tslider__count");
      let cur = 0, timer: any = null, sx: number | null = null;
      const pad = (n: number) => String(n).padStart(2, "0");
      const to = (n: number) => {
        const prev = cur;
        cur = (n + figs.length) % figs.length;
        if (prev === cur) return;
        figs.forEach((f, i) => {
          f.classList.toggle("is-on", i === cur);
          if (i === cur) f.removeAttribute("aria-hidden"); else f.setAttribute("aria-hidden", "true");
        });
        dots.forEach((d, i) => d.classList.toggle("is-on", i === cur));
        if (count) count.textContent = `${pad(cur + 1)} / ${pad(figs.length)}`;
        if (!reduce) {
          const f = figs[cur];
          gsap.fromTo(f.querySelector("blockquote"), { y: 40, opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.out" });
          gsap.fromTo(f.querySelector("figcaption"), { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 });
        }
      };
      const restart = () => {
        clearInterval(timer);
        if (!reduce) timer = setInterval(() => { if (box.offsetParent) to(cur + 1); }, 7000);
      };
      box.querySelectorAll<HTMLElement>(".tsb").forEach((b) => {
        const h = () => { to(cur + Number(b.dataset.d)); restart(); };
        b.addEventListener("click", h);
        cleanups.push(() => b.removeEventListener("click", h));
      });
      const pd = (e: PointerEvent) => { sx = e.clientX; };
      const pu = (e: PointerEvent) => {
        if (sx === null) return;
        const dx = e.clientX - sx; sx = null;
        if (Math.abs(dx) > 50) { to(cur + (dx < 0 ? 1 : -1)); restart(); }
      };
      box.addEventListener("pointerdown", pd);
      box.addEventListener("pointerup", pu);
      cleanups.push(() => { box.removeEventListener("pointerdown", pd); box.removeEventListener("pointerup", pu); clearInterval(timer); });
      restart();
    });

    /* hero video controls */
    const hv = root.querySelector<HTMLVideoElement>("#heroVid");
    const vb = root.querySelector<HTMLButtonElement>("#vidBtn");
    if (hv && vb) {
      const setV = (play: boolean) => {
        if (play) hv.play()?.catch(() => {}); else hv.pause();
        const s = vb.querySelector("span"); if (s) s.textContent = play ? "Pause" : "Play";
        vb.setAttribute("aria-pressed", String(!play));
        vb.setAttribute("aria-label", play ? "Pause background video" : "Play background video");
      };
      if (reduce) { hv.removeAttribute("autoplay"); setV(false); }
      const h = () => setV(hv.paused);
      vb.addEventListener("click", h);
      const io = new IntersectionObserver((es) => {
        if (vb.getAttribute("aria-pressed") === "true") return;
        if (es[0].isIntersecting) hv.play()?.catch(() => {}); else hv.pause();
      });
      io.observe(hv);
      cleanups.push(() => { vb.removeEventListener("click", h); io.disconnect(); });
    }

    /* magnetic buttons */
    if (fine) {
      root.querySelectorAll<HTMLElement>(".magnetic").forEach((m) => {
        const mx = gsap.quickTo(m, "x", { duration: 0.5, ease: "elastic.out(1,.4)" });
        const my = gsap.quickTo(m, "y", { duration: 0.5, ease: "elastic.out(1,.4)" });
        const mv = (e: PointerEvent) => { const r = m.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.3); };
        const lv = () => { mx(0); my(0); };
        m.addEventListener("pointermove", mv);
        m.addEventListener("pointerleave", lv);
        cleanups.push(() => { m.removeEventListener("pointermove", mv); m.removeEventListener("pointerleave", lv); });
      });
      root.querySelectorAll(".wk__img").forEach((n) => n.classList.add("tilt"));
      /* hero light */
      const hvid = root.querySelector<HTMLElement>(".hero__video");
      const hero = root.querySelector<HTMLElement>(".v5hero");
      if (hvid && hero && !hvid.querySelector(".hero__spot")) {
        const spot = document.createElement("div");
        spot.className = "hero__spot";
        hvid.appendChild(spot);
        const mv = (e: PointerEvent) => { const r = hvid.getBoundingClientRect(); hvid.style.setProperty("--hx", e.clientX - r.left + "px"); hvid.style.setProperty("--hy", e.clientY - r.top + "px"); };
        hero.addEventListener("pointermove", mv);
        cleanups.push(() => { hero.removeEventListener("pointermove", mv); spot.remove(); });
      }
    }

    /* scramble on small labels */
    const scramble = (node: HTMLElement & { _sc?: boolean }) => {
      if (node._sc || node.children.length) return;
      const fin = node.textContent || "";
      if (!fin.trim()) return;
      node._sc = true;
      let f = 0;
      const total = 20;
      const step = () => {
        const pr = f / total;
        let out = "";
        for (let i = 0; i < fin.length; i++) out += fin[i] === " " || i < fin.length * pr ? fin[i] : GLY[(Math.random() * GLY.length) | 0];
        node.textContent = out;
        if (f++ < total) requestAnimationFrame(step); else { node.textContent = fin; node._sc = false; }
      };
      step();
    };
    if (!reduce && "IntersectionObserver" in window) {
      const sio = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { scramble(en.target as any); sio.unobserve(en.target); } }), { threshold: 0.6 });
      root.querySelectorAll<HTMLElement>(".v5head > .mono, .eyebrow > span, .hero__kicker").forEach((n) => { if (!n.children.length) sio.observe(n); });
      cleanups.push(() => sio.disconnect());
    }

    /* image trail over the marquee */
    const mqSec = root.querySelector<HTMLElement>(".mq");
    if (mqSec && fine && !reduce) {
      const srcs = Array.from(root.querySelectorAll<HTMLElement>("#homeWork [data-preview]")).map((a) => a.dataset.preview || "").filter(Boolean);
      if (srcs.length) {
        let idx = 0, last = { x: -999, y: -999 };
        mqSec.setAttribute("data-cursor", "Move");
        const mv = (e: PointerEvent) => {
          const r = mqSec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          if (Math.hypot(x - last.x, y - last.y) < 100) return;
          last = { x, y };
          const im = document.createElement("img");
          im.className = "trail"; im.alt = ""; im.src = srcs[idx++ % srcs.length];
          im.style.left = x + "px"; im.style.top = y + "px";
          mqSec.appendChild(im);
          gsap.fromTo(im, { scale: 0.3, opacity: 0, rotate: gsap.utils.random(-14, 14) }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" });
          gsap.to(im, { scale: 0.25, opacity: 0, y: 70, duration: 0.8, ease: "power2.in", delay: 0.5, onComplete: () => im.remove() });
        };
        mqSec.addEventListener("pointermove", mv);
        cleanups.push(() => mqSec.removeEventListener("pointermove", mv));
      }
    }

    /* scroll choreography */
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => { if (bar && /^\/blog\/.+/.test(pathname)) bar.style.transform = `scaleX(${s.progress})`; } });
    }, root);
    /* The below-the-fold choreography creates ~50 ScrollTriggers, each reading layout right after the
       previous one wrote styles (forced reflow). Build it after first paint, in idle time. */
    const build = () => {
      if (reduce || !page) return;
      const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
      q(".media--par img").forEach((im) => gsap.fromTo(im, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: im.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
      q(".reveal-clip").forEach((m) => gsap.from(m, { clipPath: "inset(18% 10% 18% 10% round 28px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: m, start: "top 88%" } }));
      q(".eyebrow, .v5head > .mono").forEach((n) => gsap.from(n, { y: 24, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 92%" } }));
      q(".rw, .v5head .h-lg").forEach((n) => {
        const parts = n.querySelectorAll(".ch");
        gsap.from(parts.length ? parts : n, { yPercent: parts.length ? 110 : 0, y: parts.length ? 0 : 40, opacity: parts.length ? 1 : 0, duration: 1.3, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: n, start: "top 88%" } });
      });
      q(".statement").forEach((n) => { const ws = n.querySelectorAll(".w"); if (ws.length) gsap.to(ws, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: n, start: "top 82%", end: "bottom 55%", scrub: true } }); else gsap.from(n, { y: 50, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 86%" } }); });
      q(".lead--fade").forEach((n) => gsap.to(n.querySelectorAll(".w"), { opacity: 1, duration: 0.9, stagger: 0.035, ease: "power2.out", delay: 0.5 }));
      q(".lead, .svc__body > p, .rows p, .wk__meta").forEach((n) => {
        if (n.closest(".pagehead, .hero") || n.classList.contains("lead--fade")) return;
        gsap.from(n, { filter: "blur(10px)", opacity: 0, y: 18, duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 92%" } });
      });
      q(".tslider, .person, .post, .work li, .rows > div, .course, .office, .jobs li, .why > div, .job__block, .svc__body, .case").forEach((n) =>
        gsap.from(n, { y: 50, opacity: 0.25, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 94%" } })
      );
      q("[data-count]").forEach((n) => {
        const end = Number(n.dataset.count), o = { v: 0 };
        ScrollTrigger.create({ trigger: n, start: "top 88%", once: true, onEnter: () => gsap.fromTo(o, { v: 0 }, { v: end, duration: 2, ease: "power3.out", onUpdate: () => { n.textContent = Math.round(o.v).toLocaleString("en-US"); }, onComplete: () => { n.textContent = end.toLocaleString("en-US"); } }) });
      });
      if (!isHome && root.querySelector(".pagehead--video")) {
        ScrollTrigger.create({ trigger: ".stu .pagehead--video", start: "top top", end: "bottom 80px", toggleClass: { targets: root, className: "on-dark" } });
      }
      if (isHome) {
        gsap.to(".stu .hero h1", { yPercent: -16, scale: 0.95, transformOrigin: "left bottom", ease: "none", scrollTrigger: { trigger: ".stu .hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".stu .manifesto .w", { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: ".stu .manifesto p", start: "top 80%", end: "bottom 50%", scrub: true } });
        gsap.fromTo(".stu .hero__video", { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(4% 2.5% 0% 2.5% round 32px)", ease: "none", scrollTrigger: { trigger: ".stu .v5hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.fromTo(".stu .hero__video video, .stu .hero__video img:not(.trail)", { yPercent: 0 }, { yPercent: 16, ease: "none", scrollTrigger: { trigger: ".stu .v5hero", start: "top top", end: "bottom top", scrub: true } });
        ScrollTrigger.create({ trigger: ".stu .v5hero", start: "top top", end: "bottom 80px", toggleClass: { targets: root, className: "on-dark" } });
        const panels = gsap.utils.toArray<HTMLElement>(".stu #reelTrack .panel");
        panels.forEach((pn, i) => {
          pn.style.setProperty("--i", String(i));
          if (i === panels.length - 1) return;
          gsap.fromTo(pn, { scale: 1, filter: "brightness(1)" }, { scale: 0.92, filter: "brightness(.9)", ease: "none", scrollTrigger: { trigger: panels[i + 1], start: "top 75%", end: "top 120px", scrub: true } });
        });
        gsap.from(".stu #wkSwiper .swiper-slide", { x: 160, opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: "#wkSwiper", start: "top 85%" } });
        gsap.from(".stu #blSwiper .swiper-slide", { x: 120, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: "#blSwiper", start: "top 88%" } });
        gsap.from(".stu .tmq", { opacity: 0, y: 40, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".stu .tmq", start: "top 90%" } });
      }
      gsap.from(".stu #footer .finale__big span", { yPercent: 40, opacity: 0.2, duration: 1.4, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: "#footer", start: "top 80%" } });
      gsap.from(".stu #footer > .wrap:first-child", { yPercent: -12, ease: "none", scrollTrigger: { trigger: "#footer", start: "top bottom", end: "top 20%", scrub: true } });
    };
    let buildId = 0;
    const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, o?: { timeout: number }) => number);
    if (ric) buildId = ric(() => ctx.add(build), { timeout: 1500 });
    else buildId = window.setTimeout(() => ctx.add(build), 400);

    const intro = () => {
      if (reduce) return;
      if (isHome) {
        gsap.timeline()
          .from(".stu .hero .ch", { yPercent: 115, rotate: 6, duration: 1.2, ease: "expo.out", stagger: 0.025 })
          .from(".stu .hero__kicker, .stu .hero__foot > *", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, "-=.9");
      } else {
        const tl = gsap.timeline();
        tl.from(".stu .page-title .ch", { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.05 })
          .from(".stu .pagehead__crumb, .stu .pagehead .lead, .stu .pagehead .pill, .stu .pagehead .tags", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, "-=.8");
        if (root.querySelector(".bleed")) tl.from(".stu .bleed", { clipPath: "inset(30% 8% 0% 8% round 28px)", duration: 1.4, ease: "expo.inOut" }, "-=1");
      }
    };

    const refresh = () => ScrollTrigger.refresh();
    const rt = setTimeout(refresh, 300);

    /* first load: loader; later: lift the wipe */
    const loader = root.querySelector<HTMLElement>(".loader");
    if (st.first) {
      st.first = false;
      const phone = window.matchMedia("(max-width: 767px)").matches;
      if (reduce || !loader) { if (loader) loader.style.display = "none"; }
      else if (phone) {
        /* no loader on phones: show the page straight away and play the intro */
        loader.style.display = "none";
        gsap.timeline().add(intro).from(".stu .top .wrap > *", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, "<");
      } else {
        loader.style.animation = "none";
        // failsafe: never let the loader outlive the animation if frames are throttled (background tab)
        const failsafe = setTimeout(() => { loader.style.display = "none"; }, 4500);
        cleanups.push(() => clearTimeout(failsafe));
        const count = { v: 0 };
        const cEl = loader.querySelector<HTMLElement>(".loader__count");
        const lb = loader.querySelector<HTMLElement>(".loader__bar i");
        gsap.timeline()
          .from(".stu .loader .gems5 i", { scale: 0, rotate: 90, duration: 0.6, ease: "back.out(2)", stagger: 0.07 })
          .to(count, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: () => { if (cEl) cEl.textContent = String(Math.round(count.v)); if (lb) lb.style.width = count.v + "%"; } }, "<")
          .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" })
          .set(loader, { display: "none" })
          .add(intro, "-=.45")
          .from(".stu .top .wrap > *", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, "<");
      }
    } else if (!reduce) {
      const lbl = root.querySelector<HTMLElement>(".wipe__label");
      gsap.set(".stu .wipe i", { transformOrigin: "top" });
      gsap.timeline({ onComplete: () => { st.busy = false; if (st.pending && st.pending !== location.pathname) { const n = st.pending; st.pending = null; (document.querySelector(`a[href="${n}"]`) as HTMLElement | null)?.click() ?? router.push(n); } else st.pending = null; } })
        .to(lbl, { opacity: 0, duration: 0.2 }, "+=.15")
        .to(".stu .wipe i", { scaleY: 0, duration: 0.7, ease: "expo.inOut", stagger: 0.06 }, "<")
        .add(intro, "-=.45");
    }
    st.current = pathname;

    return () => {
      clearTimeout(rt);
      const cic = (window as any).cancelIdleCallback as undefined | ((id: number) => void);
      if (cic) cic(buildId);
      clearTimeout(buildId);
      cleanups.forEach((fn) => fn());
      swipers.forEach((s) => s.destroy(true, true));
      ctx.revert();
    };
  }, [pathname, router]);

  return null;
}
