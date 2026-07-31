/* ============================================================
   RASTY — portfolio engine
   Vortex particle hero (simplex-noise flow field) + interactions.
   All motion respects prefers-reduced-motion. No dependencies.
   ============================================================ */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(pointer: fine)").matches;

  /* ============================================================
     DATA — the single place to edit your content.
     EDIT: descriptions were inferred from your htdocs project
     folders; tune them, and point `link` at live URLs or repos.
     ============================================================ */
  const PROJECTS = [
    {
      abbr: "AE", title: "AgilaEye",
      desc: "Real-time monitoring dashboard with live feeds, alerting and audit trails.",
      tags: ["PHP", "MySQL", "JavaScript", "WebSockets"], link: "#contact",
    },
    {
      abbr: "IF", title: "IntelliForm",
      desc: "Smart form builder with conditional logic, validation and response analytics.",
      tags: ["PHP", "MySQL", "JavaScript"], link: "#contact",
    },
    {
      abbr: "SL", title: "StockLedger",
      desc: "Inventory and stock-movement tracking built for small business operations.",
      tags: ["PHP", "MySQL", "Bootstrap"], link: "#contact",
    },
    {
      abbr: "CR", title: "CureRays CRMS",
      desc: "Clinic records management system covering patients, visits and billing.",
      tags: ["PHP", "Laravel", "MySQL"], link: "#contact",
    },
    {
      abbr: "FL", title: "FNB LIS",
      desc: "Laboratory information system managing specimens, results and releases.",
      tags: ["PHP", "MySQL", "JavaScript"], link: "#contact",
    },
    {
      abbr: "DP", title: "DigiPhoto Booth",
      desc: "Self-service photo booth with live capture, templates and print flow.",
      tags: ["JavaScript", "Canvas API", "PHP"], link: "#contact",
    },
  ];

  /* Miller's Law: 3 groups × 5 items */
  const STACK = [
    { name: "Frontend", items: ["JavaScript", "React", "Next.js", "Tailwind CSS", "HTML / CSS"] },
    { name: "Backend", items: ["PHP", "Laravel", "Node.js", "MySQL", "REST APIs"] },
    { name: "Tools & Ops", items: ["Git / GitHub", "Docker", "Apache / XAMPP", "Figma", "Postman"] },
  ];

  /* EDIT: your real roles and dates */
  const TIMELINE = [
    {
      dates: "2024 — NOW", role: "Freelance Full-Stack Developer",
      desc: "Designing and shipping client systems end to end — inventory, clinical records, laboratory pipelines and dashboards.",
    },
    {
      dates: "2023 — 2024", role: "Systems Developer",
      desc: "Built internal tools and operational software; owned schema design, APIs and deployment.",
    },
    {
      dates: "2022", role: "RastyFullStaxx begins",
      desc: "First production PHP applications went live. Never stopped shipping since.",
    },
  ];

  const MARQUEE = ["PHP", "LARAVEL", "MYSQL", "JAVASCRIPT", "REACT", "NEXT.JS", "TAILWIND", "NODE.JS", "PYTHON", "REST APIS", "GIT", "DOCKER"];

  const EMAIL = "gemrasty@gmail.com";

  /* ============================================================
     RENDER — inject data-driven sections
     ============================================================ */
  function render() {
    $("#work-grid").innerHTML = PROJECTS.map((p) => `
      <article class="card reveal">
        <div class="card__thumb"><span class="card__abbr">${p.abbr}</span></div>
        <div class="card__body">
          <h3 class="card__title">${p.title}</h3>
          <p class="card__desc">${p.desc}</p>
          <div class="card__tags">${p.tags.map((t) => `<span class="card__tag">${t}</span>`).join("")}</div>
        </div>
        <a class="card__link" href="${p.link}" aria-label="${p.title} — ask me about it"></a>
      </article>`).join("");

    $("#stack-grid").innerHTML = STACK.map((g) => `
      <div class="stack-group reveal">
        <h3 class="stack-group__name">${g.name}</h3>
        <ul>${g.items.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>`).join("");

    $("#timeline").innerHTML = TIMELINE.map((t) => `
      <li class="tl-item reveal">
        <p class="tl-item__dates">${t.dates}</p>
        <h3 class="tl-item__role">${t.role}</h3>
        <p class="tl-item__desc">${t.desc}</p>
      </li>`).join("");

    /* duplicated once for the seamless loop */
    $("#marquee-track").innerHTML = [...MARQUEE, ...MARQUEE]
      .map((m) => `<span class="marquee__item">${m}</span>`).join("");
  }

  /* ============================================================
     VORTEX — simplex-noise flow field (canvas 2D)
     Same algorithm as the hero you asked for, tuned navy.
     ============================================================ */
  function createNoise3D(random = Math.random) {
    const F3 = 1 / 3, G3 = 1 / 6;
    const grad3 = [1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1];
    const p = new Uint8Array(512);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 0; i < 255; i++) {
      const r = i + ~~(random() * (256 - i));
      const t = p[i]; p[i] = p[r]; p[r] = t;
    }
    for (let i = 256; i < 512; i++) p[i] = p[i - 256];

    return (xin, yin, zin) => {
      const s = (xin + yin + zin) * F3;
      const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
      const t = (i + j + k) * G3;
      const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);
      let i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0)      { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else               { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
      } else {
        if (y0 < z0)       { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0)  { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else               { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      }
      const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
      const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
      const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
      const ii = i & 255, jj = j & 255, kk = k & 255;
      let n = 0, t0, gi;
      t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 > 0) { gi = (p[ii + p[jj + p[kk]]] % 12) * 3; t0 *= t0; n += t0 * t0 * (grad3[gi] * x0 + grad3[gi + 1] * y0 + grad3[gi + 2] * z0); }
      t0 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t0 > 0) { gi = (p[ii + i1 + p[jj + j1 + p[kk + k1]]] % 12) * 3; t0 *= t0; n += t0 * t0 * (grad3[gi] * x1 + grad3[gi + 1] * y1 + grad3[gi + 2] * z1); }
      t0 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t0 > 0) { gi = (p[ii + i2 + p[jj + j2 + p[kk + k2]]] % 12) * 3; t0 *= t0; n += t0 * t0 * (grad3[gi] * x2 + grad3[gi + 1] * y2 + grad3[gi + 2] * z2); }
      t0 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t0 > 0) { gi = (p[ii + 1 + p[jj + 1 + p[kk + 1]]] % 12) * 3; t0 *= t0; n += t0 * t0 * (grad3[gi] * x3 + grad3[gi + 1] * y3 + grad3[gi + 2] * z3); }
      return 32 * n;
    };
  }

  function initVortex() {
    const canvas = $("#vortex");
    const stage = canvas.parentElement;
    const toggle = $("#vortex-toggle");
    const ctx = canvas.getContext("2d");
    const noise3D = createNoise3D();

    const COUNT = window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 400 : 600;
    const PROPS = 9, LEN = COUNT * PROPS;
    const RANGE_Y = 130, BASE_TTL = 50, RANGE_TTL = 150;
    const BASE_SPEED = 0.1, RANGE_SPEED = 1.5;
    const BASE_RADIUS = 1, RANGE_RADIUS = 2;
    const BASE_HUE = 200, RANGE_HUE = 80;          /* navy → cyan → violet */
    const NOISE_STEPS = 3, X_OFF = 0.00125, Y_OFF = 0.00125, Z_OFF = 0.0005;
    const TAU = Math.PI * 2;

    const props = new Float32Array(LEN);
    const center = [0, 0];
    let tick = 0, raf = 0, running = false, paused = false, inView = true;

    const rand = (n) => n * Math.random();
    const randRange = (n) => n - rand(2 * n);
    const lerp = (a, b, t) => (1 - t) * a + t * b;
    const fade = (t, m) => { const h = 0.5 * m; return Math.abs(((t + h) % m) - h) / h; };

    function resize() {
      canvas.width = stage.clientWidth;
      canvas.height = stage.clientHeight;
      center[0] = 0.5 * canvas.width;
      center[1] = 0.5 * canvas.height;
    }

    function initParticle(i) {
      props.set([
        rand(canvas.width),
        center[1] + randRange(RANGE_Y),
        0, 0, 0,
        BASE_TTL + rand(RANGE_TTL),
        BASE_SPEED + rand(RANGE_SPEED),
        BASE_RADIUS + rand(RANGE_RADIUS),
        BASE_HUE + rand(RANGE_HUE),
      ], i);
    }

    function step() {
      for (let i = 0; i < LEN; i += PROPS) {
        const x = props[i], y = props[i + 1];
        const n = noise3D(x * X_OFF, y * Y_OFF, tick * Z_OFF) * NOISE_STEPS * TAU;
        const vx = lerp(props[i + 2], Math.cos(n), 0.5);
        const vy = lerp(props[i + 3], Math.sin(n), 0.5);
        const speed = props[i + 6];
        const x2 = x + vx * speed, y2 = y + vy * speed;
        const life = props[i + 4], ttl = props[i + 5];

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineWidth = props[i + 7];
        ctx.strokeStyle = `hsla(${props[i + 8]}, 100%, 62%, ${fade(life, ttl)})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();

        props[i] = x2; props[i + 1] = y2;
        props[i + 2] = vx; props[i + 3] = vy;
        props[i + 4] = life + 1;
        if (x2 > canvas.width || x2 < 0 || y2 > canvas.height || y2 < 0 || life > ttl) initParticle(i);
      }
    }

    function glow() {
      ctx.save();
      ctx.filter = "blur(8px) brightness(200%)";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
      ctx.save();
      ctx.filter = "blur(4px) brightness(200%)";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }

    /* NOTE: the canvas stays transparent — the stage's CSS paints the navy.
       Filling it here would get amplified by the lighter+brightness glow. */
    function frame() {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step();
      glow();
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running || paused || !inView) return;
      running = true;
      raf = window.requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      window.cancelAnimationFrame(raf);
    }

    function staticFrame() {
      /* reduced motion: simulate ~90 steps once, no loop */
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let f = 0; f < 90; f++) { tick++; step(); }
      glow();
    }

    resize();
    for (let i = 0; i < LEN; i += PROPS) initParticle(i);

    /* stage-driven sizing: survives hidden-tab loads, mobile URL bars, late layout */
    new ResizeObserver(() => {
      if (canvas.width === stage.clientWidth && canvas.height === stage.clientHeight) return;
      resize();
      if (RM || paused) staticFrame();
    }).observe(stage);

    if (RM) {
      staticFrame();
      toggle.hidden = true;              /* nothing running to pause */
      return;
    }

    /* battery-friendly: only animate while the hero is on screen */
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) start(); else stop();
    }, { threshold: 0.05 }).observe(stage);

    toggle.addEventListener("click", () => {
      paused = !paused;
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.setAttribute("aria-label", paused ? "Resume background animation" : "Pause background animation");
      if (paused) { stop(); staticFrame(); } else start();
    });

    start();
  }

  /* ============================================================
     NAV — scrolled state, progress hairline, scrollspy
     ============================================================ */
  function initNav() {
    const nav = $("#nav");
    const progress = $("#progress");
    $("#fab").hidden = false;            /* visibility is class-driven from here */
    let queued = false;

    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        const y = window.scrollY;
        nav.classList.toggle("is-scrolled", y > 8);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        const fab = $("#fab");
        fab.classList.toggle("is-visible", y > 600);
        fab.style.pointerEvents = y > 600 ? "auto" : "none";
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* scrollspy — the nav always tells you where you are (Jakob) */
    const links = $$("[data-spy]");
    const byId = Object.fromEntries(links.map((l) => [l.getAttribute("href").slice(1), l]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.remove("is-active"));
        const link = byId[e.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["about", "work", "stack", "experience", "contact"].forEach((id) => spy.observe(document.getElementById(id)));

    $("#fab").addEventListener("click", () => window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }));

    /* mobile menu */
    const burger = $("#burger");
    const menu = $("#mobile-menu");
    function setMenu(open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
      document.body.style.overflow = open ? "hidden" : "";
    }
    burger.addEventListener("click", () => setMenu(menu.hidden));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) setMenu(false);
    });
  }

  /* ============================================================
     REVEALS — enter = rise + focus (opacity/translate/blur only)
     ============================================================ */
  function initReveals() {
    $$("[data-stagger]").forEach((group) => {
      $$(".reveal", group).forEach((el, i) => el.style.setProperty("--i", i));
    });
    const els = $$(".reveal");
    if (RM) { els.forEach((el) => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ============================================================
     COUNTERS
     ============================================================ */
  function initCounters() {
    const nums = $$("[data-count]");
    const run = (el) => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      if (RM) { el.textContent = target + suffix; return; }
      const t0 = performance.now(), DUR = 950;
      const tickFn = (now) => {
        const t = Math.min((now - t0) / DUR, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
        if (t < 1) window.requestAnimationFrame(tickFn);
      };
      window.requestAnimationFrame(tickFn);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    nums.forEach((el) => io.observe(el));
  }

  /* ============================================================
     TILT + SPOTLIGHT — desktop only, transform/opacity only
     ============================================================ */
  function initTilt() {
    if (!FINE || RM) return;
    $$(".card").forEach((card) => {
      let raf = 0;
      card.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          card.style.transform = `rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg)`;
          card.style.setProperty("--mx", `${px * 100}%`);
          card.style.setProperty("--my", `${py * 100}%`);
        });
      });
      card.addEventListener("pointerleave", () => {
        window.cancelAnimationFrame(raf);
        raf = 0;
        card.style.transform = "";
      });
    });
  }

  /* ============================================================
     MAGNETIC BUTTONS — small pull, spring-back via CSS transition
     ============================================================ */
  function initMagnets() {
    if (!FINE || RM) return;
    $$("[data-magnet]").forEach((el) => {
      let down = false;
      const apply = (dx, dy) => {
        el.style.transform = `translate(${dx}px, ${dy}px) scale(${down ? 0.97 : 1})`;
      };
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
        apply(Math.max(-10, Math.min(10, dx)), Math.max(-8, Math.min(8, dy)));
      });
      el.addEventListener("pointerdown", () => { down = true; el.style.transform += " scale(0.97)"; });
      el.addEventListener("pointerup", () => { down = false; });
      el.addEventListener("pointerleave", () => { down = false; el.style.transform = ""; });
    });
  }

  /* ============================================================
     CURSOR — dot + lagging ring
     ============================================================ */
  function initCursor() {
    if (!FINE || RM) return;
    const root = $("#cursor");
    const dot = $(".cursor__dot", root);
    const ring = $(".cursor__ring", root);
    let mx = -100, my = -100, rx = -100, ry = -100, active = false;

    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (!active) { active = true; loop(); }
    }, { passive: true });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(var(--cur-s))`;
      window.requestAnimationFrame(loop);
    }

    document.addEventListener("mouseover", (e) => {
      root.classList.toggle("is-hover", !!e.target.closest("a, button, [data-cursor], .card"));
    });
  }

  /* ============================================================
     COMMAND PALETTE — Ctrl/⌘+K. Keyboard-initiated → opens
     instantly, no animation. Tesler: it absorbs the nav.
     ============================================================ */
  function initPalette() {
    const overlay = $("#palette");
    const input = $("#palette-input");
    const list = $("#palette-list");
    let selected = 0, lastFocus = null, filtered = [];

    /* 7 commands — Miller's Law */
    const ACTIONS = [
      { label: "Go to About", hint: "section", keywords: "about bio", run: () => goTo("#about") },
      { label: "Go to Work", hint: "section", keywords: "projects work portfolio", run: () => goTo("#work") },
      { label: "Go to Stack", hint: "section", keywords: "stack skills tools tech", run: () => goTo("#stack") },
      { label: "Go to Experience", hint: "section", keywords: "experience timeline history", run: () => goTo("#experience") },
      { label: "Go to Contact", hint: "section", keywords: "contact email hire", run: () => goTo("#contact") },
      { label: "Copy email address", hint: "action", keywords: "copy email clipboard", run: copyEmail },
      { label: "Email me", hint: "action", keywords: "email send message mail", run: () => { window.location.href = `mailto:${EMAIL}`; } },
    ];

    function goTo(sel) {
      $(sel).scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" });
    }

    function renderList(q = "") {
      const query = q.trim().toLowerCase();
      filtered = ACTIONS.filter((a) => !query || (a.label + " " + a.keywords).toLowerCase().includes(query));
      selected = 0;
      list.innerHTML = filtered.length
        ? filtered.map((a, i) => `
          <li class="palette__item" id="cmd-${i}" role="option" aria-selected="${i === selected}">
            <span>${a.label}</span><span class="palette__item-hint">${a.hint}</span>
          </li>`).join("")
        : `<li class="palette__empty">No matches. Try &ldquo;work&rdquo; or &ldquo;email&rdquo;.</li>`;
      input.setAttribute("aria-activedescendant", filtered.length ? "cmd-0" : "");
      $$(".palette__item", list).forEach((li, i) => {
        li.addEventListener("mouseenter", () => select(i));
        li.addEventListener("click", () => runAction(i));
      });
    }

    function select(i) {
      selected = i;
      $$(".palette__item", list).forEach((li, j) => li.setAttribute("aria-selected", String(j === i)));
      input.setAttribute("aria-activedescendant", `cmd-${i}`);
      const li = $(`#cmd-${i}`);
      if (li) li.scrollIntoView({ block: "nearest" });
    }

    function runAction(i) {
      const a = filtered[i];
      if (!a) return;
      close();
      a.run();
    }

    function open() {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      input.value = "";
      renderList();
      input.focus();
    }
    function close() {
      overlay.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        overlay.hidden ? open() : close();
        return;
      }
      if (overlay.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); select(Math.min(selected + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); select(Math.max(selected - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); runAction(selected); }
      else if (e.key === "Tab") e.preventDefault();      /* focus stays in the palette */
    });

    input.addEventListener("input", () => renderList(input.value));
    $("[data-close]", overlay).addEventListener("click", close);
    $("#cmdk-hint").addEventListener("click", open);
  }

  /* ============================================================
     TOAST + COPY — Tesler: one click does the whole job
     ============================================================ */
  let toastTimer = 0;
  function showToast(msg) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function copyEmail() {
    const done = () => showToast("Email copied — talk soon.");
    const fail = () => showToast(`Copy failed — it's ${EMAIL}`);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(EMAIL).then(done, fail);
    } else {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? done() : fail(); }
      catch { fail(); }
      ta.remove();
    }
  }

  /* ============================================================
     HUD CLOCK
     ============================================================ */
  function initClock() {
    const el = $("#clock");
    const fmt = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const update = () => { el.textContent = `LOCAL ${fmt.format(new Date())}`; };
    update();
    window.setInterval(update, 1000);
  }

  /* ============================================================
     BOOT
     ============================================================ */
  render();
  initVortex();
  initNav();
  initReveals();
  initCounters();
  initTilt();
  initMagnets();
  initCursor();
  initPalette();
  initClock();
  $("#copy-email").addEventListener("click", copyEmail);
})();
