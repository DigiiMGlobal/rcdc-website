/* =========================================================
   RCDC · Site interactions
   Everything here is rendered from js/data.js.
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const D = RCDC;

  /* ---------- Shared helpers (also used by games.js and dahico.js) ---------- */
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const status = (s) => { const d = parseDate(s).getTime(), t = today().getTime(); return d < t ? "done" : d === t ? "today" : "upcoming"; };
  const fmt = (s, withDay = true) => { const d = parseDate(s); return (withDay ? DAYS[d.getDay()] + ", " : "") + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear(); };
  const initials = (name) => name.replace(/\b(Rtn|Rtr|PHF)\.?\s+/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
  const allPeople = [...D.core, ...D.bod];
  const photoOf = (name) => { const p = allPeople.find((x) => x.name.replace("Rtn. ", "") === name.replace("Rtn. ", "") && x.photo); return p ? p.photo : null; };
  const avatar = (name, cls = "") => { const ph = photoOf(name); return ph ? `<img class="${cls}" src="assets/team/${ph}.jpg" alt="" loading="lazy" />` : `<span class="mono-av ${cls}" aria-hidden="true">${initials(name)}</span>`; };
  const img = (n, alt, sizes = "(max-width: 700px) 90vw, 40vw", lazy = true) =>
    `<img src="assets/images/${n}-800.jpg" srcset="assets/images/${n}-800.jpg 800w, assets/images/${n}.jpg 1800w" sizes="${sizes}" alt="${alt}"${lazy ? ' loading="lazy"' : ""} />`;
  const ICON = { users: "i-users", heart: "i-heart", briefcase: "i-briefcase", rocket: "i-rocket", globe: "i-globe", megaphone: "i-megaphone", camera: "i-camera", handshake: "i-handshake", sprout: "i-sprout", spark: "i-spark" };
  const icon = (k) => `<svg><use href="#${ICON[k] || "i-spark"}"/></svg>`;

  window.RCDCUtil = { MONTHS, DAYS, parseDate, today, status, fmt, initials, photoOf, icon, reduceMotion };

  /* ---------- Preloader ---------- */
  const preloader = $("#preloader");
  let loaded = false;
  const finishLoad = () => {
    if (loaded) return; loaded = true;
    preloader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    setTimeout(() => $(".hero").classList.add("is-in"), 120);
    setTimeout(() => $(".hero").classList.add("is-ready"), 1900);
  };
  window.addEventListener("load", () => setTimeout(finishLoad, 350));
  setTimeout(finishLoad, 3000);

  /* ---------- Starfield (subtle, sits over the background film) ---------- */
  const canvas = $("#starfield"), ctx = canvas.getContext("2d");
  let W, H, DPR, stars = [], shooters = [], mouseX = innerWidth / 2, mouseY = innerHeight / 2, sy = 0, running = true;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR; H = canvas.height = innerHeight * DPR;
    const count = Math.min(260, Math.round((innerWidth * innerHeight) / 7000));
    stars = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * 0.8 + 0.2, r: (Math.random() * 1.1 + 0.25) * DPR, tw: Math.random() * 6.3, ts: 0.01 + Math.random() * 0.025, c: Math.random() < 0.8 ? "#ffffff" : "#F7DC94" }));
  }
  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    const px = (mouseX / innerWidth - 0.5) * 24 * DPR, py = (mouseY / innerHeight - 0.5) * 24 * DPR;
    for (const s of stars) {
      s.tw += s.ts;
      let y = (s.y - sy * 0.12 * s.z * DPR + py * s.z) % H; if (y < 0) y += H;
      ctx.globalAlpha = (0.45 + Math.sin(s.tw) * 0.35) * s.z + 0.1; ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x + px * s.z, y, s.r * (0.6 + s.z * 0.6), 0, 6.283); ctx.fill();
    }
    if (!reduceMotion && Math.random() < 0.004 && shooters.length < 1) shooters.push({ x: W * (0.3 + Math.random() * 0.7), y: Math.random() * H * 0.4, vx: -(7 + Math.random() * 5) * DPR, vy: (2 + Math.random() * 2) * DPR, life: 1 });
    shooters = shooters.filter((s) => s.life > 0);
    for (const s of shooters) {
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12);
      g.addColorStop(0, "rgba(247,220,148," + s.life + ")"); g.addColorStop(1, "rgba(247,220,148,0)");
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.4 * DPR;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12); ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life -= 0.016;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  resize(); addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => { running = !document.hidden && !reduceMotion; if (running) requestAnimationFrame(draw); });
  if (reduceMotion) { draw(); running = false; } else requestAnimationFrame(draw);

  /* ---------- Cursor glow + hero parallax ---------- */
  const glow = $("#cursorGlow");
  let gx = 0, gy = 0;
  addEventListener("pointermove", (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  if (finePointer && !reduceMotion) {
    const layers = $$(".hero__title .hw");
    const deckEl = $("#deck");
    (function loop() {
      gx += (mouseX - gx) * 0.12; gy += (mouseY - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      if (sy < innerHeight) {
        const nx = mouseX / innerWidth - 0.5, ny = mouseY / innerHeight - 0.5;
        layers.forEach((l) => l.style.setProperty("--px", (nx * +l.dataset.depth).toFixed(1) + "px"));
        if (deckEl) deckEl.style.transform = `rotateY(${(nx * 8).toFixed(2)}deg) rotateX(${(-ny * 6).toFixed(2)}deg)`;
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Nav ---------- */
  const nav = $("#nav"), progress = $("#scrollProgress"), toTop = $("#toTop"), menu = $("#mobileMenu"), burger = $("#burger");
  let lastY = 0;
  const toggleMenu = (open) => {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("no-scroll", open);
  };
  burger.addEventListener("click", () => toggleMenu(!menu.classList.contains("is-open")));
  $$("#mobileMenu a").forEach((a, i) => { a.style.setProperty("--i", i); a.addEventListener("click", () => toggleMenu(false)); });
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  const links = $$(".nav__links a");
  const secObs = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => secObs.observe(s));

  /* ---------- Hero: pillars + photo deck ---------- */
  const pillarSpans = $$("#pillars span");
  let pi = 0;
  const lightPillar = () => { pillarSpans.forEach((s, i) => s.classList.toggle("is-on", i === pi)); pi = (pi + 1) % pillarSpans.length; };
  lightPillar(); if (!reduceMotion) setInterval(lightPillar, 1600); else pillarSpans.forEach((s) => s.classList.add("is-on"));

  const deck = $("#deck"), deckCap = $("#deckCap");
  deck.innerHTML = D.heroDeck.map((c, i) => `<figure class="deck__card" data-i="${i}">${img(c.src, c.cap, "(max-width: 960px) 90vw, 500px", i > 2)}</figure>`).join("");
  const cards = $$(".deck__card", deck);
  let top = 0, deckTimer;
  function layoutDeck() {
    cards.forEach((c, i) => {
      const pos = (i - top + cards.length) % cards.length;
      c.dataset.pos = pos < 3 ? pos : "hide";
    });
    deckCap.textContent = D.heroDeck[top].cap;
  }
  function nextCard() {
    const leaving = cards[top];
    leaving.classList.add("is-leaving");
    top = (top + 1) % cards.length;
    layoutDeck();
    setTimeout(() => leaving.classList.remove("is-leaving"), 650);
  }
  const restartDeck = () => { clearInterval(deckTimer); if (!reduceMotion) deckTimer = setInterval(nextCard, 4200); };
  layoutDeck(); restartDeck();
  deck.addEventListener("click", () => { nextCard(); restartDeck(); });
  $("#deckNext").addEventListener("click", () => { nextCard(); restartDeck(); });

  /* ---------- Statement transition (scroll-scrubbed) ---------- */
  const stmt = $("#story"), stmtText = $("#stmtText"), stmtWords = $$(".sw", stmtText), stmtPhoto = $("#stmtPhoto");
  const useStatementScrub = !reduceMotion;
  if (!useStatementScrub) stmt.classList.add("is-static");
  function updateStatement() {
    if (!useStatementScrub) return;
    const r = stmt.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = Math.max(0, Math.min(1, -r.top / total));
    // words light up during the first 45%
    const wp = Math.min(1, p / 0.42);
    stmtWords.forEach((w, i) => w.classList.toggle("is-lit", wp > (i + 0.5) / stmtWords.length));
    // photo grows from 45% → 95%
    const q = Math.max(0, Math.min(1, (p - 0.45) / 0.45));
    const e = 1 - Math.pow(1 - q, 3);
    const finalW = Math.min(innerWidth * (innerWidth < 700 ? 0.94 : 0.9), (innerHeight - 120) * 1.5);
    const startW = finalW * 0.34;
    stmtPhoto.style.setProperty("--pw", (startW + (finalW - startW) * e).toFixed(1) + "px");
    stmtPhoto.style.setProperty("--po", Math.min(1, q * 3).toFixed(3));
    stmtPhoto.style.setProperty("--prad", (28 - 12 * e).toFixed(1) + "px");
    stmtPhoto.style.setProperty("--cap", Math.max(0, (e - 0.7) / 0.3).toFixed(3));
    stmtText.style.setProperty("--ts", (1 - 0.12 * e).toFixed(3));
    stmtText.style.setProperty("--to", (1 - 0.85 * e).toFixed(3));
  }

  /* ---------- About ---------- */
  $("#identityList").innerHTML = D.identity.map((t) => `<li>${t}</li>`).join("");

  /* ---------- Theme: universe words + emblem hotspots ---------- */
  $("#universeList").innerHTML = D.universe.map((u) => `<li tabindex="0"><b>${u.word}</b><span>${u.meaning}</span></li>`).join("");
  $$("#universeList li").forEach((li) => li.addEventListener("click", () => {
    const on = li.classList.contains("is-on");
    $$("#universeList li").forEach((x) => x.classList.remove("is-on"));
    if (!on) li.classList.add("is-on");
  }));
  const spots = $$(".hotspot"), pillarItems = $$("#pillarList li");
  const setSpot = (i) => {
    spots.forEach((s) => s.classList.toggle("is-on", +s.dataset.spot === i));
    pillarItems.forEach((p) => p.classList.toggle("is-on", +p.dataset.spot === i));
  };
  spots.forEach((s) => { s.addEventListener("mouseenter", () => setSpot(+s.dataset.spot)); s.addEventListener("click", () => setSpot(+s.dataset.spot)); s.addEventListener("focus", () => setSpot(+s.dataset.spot)); });
  pillarItems.forEach((p) => { p.addEventListener("mouseenter", () => setSpot(+p.dataset.spot)); p.addEventListener("click", () => setSpot(+p.dataset.spot)); });
  setSpot(0);

  /* ---------- Avenues explorer ---------- */
  const avList = $("#avList"), avPanel = $("#avPanel");
  const peopleChips = (names) => `<div class="av__people">${names.map((n) => `<span class="person-chip">${avatar(n)}${n}</span>`).join("")}</div>`;
  const avBody = (a, i) => `
    <p>${a.text}</p>
    <div class="av__leads"><span>Led by</span>${peopleChips(a.leads)}</div>`;
  avList.innerHTML = D.avenues.map((a, i) => `
    <div class="av__item" style="--c:${a.color}">
      <button class="av__tab" role="tab" id="avtab-${a.id}" aria-selected="false" aria-controls="avPanel" data-i="${i}">
        <span class="av__num">${String(i + 1).padStart(2, "0")}</span>
        <span class="av__ico">${icon(a.icon)}</span>
        <span class="av__name">${a.name}</span>
        <svg class="av__chev"><use href="#i-chev"/></svg>
      </button>
      <div class="av__drawer" id="avdrawer-${a.id}"><div class="av__drawer-in">${avBody(a, i)}</div></div>
    </div>`).join("");
  const avTabs = $$(".av__tab", avList);
  const isAccordion = () => window.matchMedia("(max-width: 960px)").matches;
  let avCurrent = -1;
  function selectAvenue(i, fromUser) {
    const a = D.avenues[i];
    if (isAccordion()) {
      const same = avCurrent === i && fromUser;
      avTabs.forEach((t, k) => {
        const open = k === i && !same;
        t.setAttribute("aria-selected", open);
        const dr = $("#avdrawer-" + D.avenues[k].id);
        dr.style.height = open ? dr.firstElementChild.offsetHeight + "px" : "0px";
      });
      avCurrent = same ? -1 : i;
      return;
    }
    avCurrent = i;
    avTabs.forEach((t, k) => t.setAttribute("aria-selected", k === i));
    avPanel.style.setProperty("--c", a.color);
    avPanel.setAttribute("aria-labelledby", "avtab-" + a.id);
    avPanel.innerHTML = `<div class="av__swap">
      <div class="av__big">${String(i + 1).padStart(2, "0")}</div>
      <h3>${a.name}</h3>
      ${avBody(a, i)}
    </div>`;
  }
  avTabs.forEach((t) => {
    t.addEventListener("click", () => selectAvenue(+t.dataset.i, true));
    t.addEventListener("mouseenter", () => { if (!isAccordion() && finePointer) selectAvenue(+t.dataset.i); });
  });
  avList.addEventListener("keydown", (e) => {
    if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const idx = avTabs.indexOf(document.activeElement); if (idx < 0) return;
    const n = (idx + (e.key === "ArrowDown" ? 1 : -1) + avTabs.length) % avTabs.length;
    avTabs[n].focus(); selectAvenue(n);
  });
  if (!isAccordion()) selectAvenue(0);
  let wasAcc = isAccordion();
  addEventListener("resize", () => {
    const acc = isAccordion(); if (acc === wasAcc) return; wasAcc = acc;
    $$(".av__drawer").forEach((d) => (d.style.height = "0px"));
    avCurrent = -1; avTabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    if (!acc) selectAvenue(0);
  });
  window.RCDCSelectAvenue = (id) => { const i = D.avenues.findIndex((a) => a.id === id); if (i > -1) { selectAvenue(i); } };

  /* ---------- Impact ---------- */
  $("#stories").innerHTML = D.memories.map((m, i) => m.img
    ? `<article class="story story--photo reveal" style="--d:${(i % 2) * 90}ms">
        <div class="story__media"><span class="story__tag">${m.tag}</span>${img(m.img, m.alt, "(max-width: 960px) 92vw, 590px")}</div>
        <div class="story__body"><h4>${m.title}</h4><p>${m.text}</p></div>
      </article>`
    : `<article class="story story--type reveal" style="--c:${i === 2 ? "#E0529C" : "#3FC1C9"};--d:${(i % 2) * 90}ms">
        <div><span class="story__tag">${m.tag}</span><h4>${m.title}</h4><p>${m.text}</p></div>
        <div class="story__causes">${m.causes.map((c) => `<span>${c}</span>`).join("")}</div>
      </article>`).join("");
  $("#legacyAreas").innerHTML = D.legacy.map((l) => `<div><b>${l.area}</b><p>${l.text}</p></div>`).join("");

  const RATIO = { "jingle-boxes": 2.216, "garba": 1.778, "om-morya-re": 1.778, "district-assembly": 0.562, "team-2026-27": 1.5, "acensus-collar": 1.5, "goals-summit": 1.5 };
  const gallery = $("#gallery");
  gallery.innerHTML = D.gallery.map((g, i) => `<button data-i="${i}" style="--ar:${RATIO[g.src] || 1.333}" aria-label="Open photo: ${g.cap}">${img(g.src, g.cap, "(max-width: 700px) 80vw, 560px")}<span>${g.cap}</span></button>`).join("");
  let down = false, sx = 0, sl = 0, moved = false;
  gallery.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = gallery.scrollLeft; });
  addEventListener("pointerup", () => { down = false; gallery.classList.remove("is-dragging"); });
  gallery.addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; gallery.classList.add("is-dragging"); } gallery.scrollLeft = sl - dx; });
  $$("[data-strip]").forEach((b) => b.addEventListener("click", () => {
    const el = $("#" + b.dataset.strip); el.scrollBy({ left: +b.dataset.dir * el.clientWidth * 0.7, behavior: reduceMotion ? "auto" : "smooth" });
  }));

  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let lbi = 0;
  const openLb = (i) => { lbi = (i + D.gallery.length) % D.gallery.length; const g = D.gallery[lbi]; lbImg.src = `assets/images/${g.src}.jpg`; lbImg.alt = g.cap; lbCap.textContent = g.cap; lb.classList.add("is-open"); document.body.classList.add("no-scroll"); };
  const closeLb = () => { if (!lb.classList.contains("is-open")) return; lb.classList.remove("is-open"); document.body.classList.remove("no-scroll"); };
  gallery.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b && !moved) openLb(+b.dataset.i); });
  $("#lbPrev").addEventListener("click", () => openLb(lbi - 1));
  $("#lbNext").addEventListener("click", () => openLb(lbi + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest("[data-close]")) closeLb(); });

  const doneDays = D.events.filter((e) => status(e.date) === "done").length;
  $("#doneCount").dataset.count = doneDays;
  const countObs = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || "";
    countObs.unobserve(el);
    if (reduceMotion) { el.textContent = end + suf; return; }
    const t0 = performance.now();
    (function step(t) { const p = Math.min(1, (t - t0) / 1500); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); })(t0);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countObs.observe(el));

  /* ---------- Team ---------- */
  $("#coreGrid").innerHTML = D.core.filter((m) => m.role !== "President").map((m, i) => `
    <article class="core-card reveal" style="--d:${(i % 3) * 80}ms">
      <div class="core-card__photo">${m.photo ? `<img src="assets/team/${m.photo}.jpg" alt="${m.name}, ${m.role}" loading="lazy" />` : `<span class="mono-av" style="width:100%;height:100%;font-size:3rem;border-radius:0">${initials(m.name)}</span>`}</div>
      <div class="core-card__info"><span>${m.role}</span><b>${m.name}</b></div>
    </article>`).join("");
  $("#bodGrid").innerHTML = D.bodGroups.map((g) => {
    const av = D.avenues.find((a) => a.id === g.avenue);
    const people = D.bod.filter((b) => b.avenue === g.avenue);
    return `<div class="bod-group reveal" style="--c:${av.color}">
      <div class="bod-group__head">${icon(av.icon)}${g.label}</div>
      <div class="bod-people">${people.map((p) => `<div class="bod-person">${avatar(p.name)}<div><b>${p.name}</b><small>${p.role}</small></div></div>`).join("")}</div>
    </div>`;
  }).join("");
  $("#guidance").innerHTML = D.guidance.map((g, i) => `<div class="guide reveal" style="--d:${i * 70}ms"><span class="mono-av">${initials(g.name)}</span><div><b>${g.name}</b><span>${g.role}</span></div></div>`).join("");

  /* ---------- Legacy timeline ---------- */
  $("#eras").innerHTML = D.eras.map((era) => {
    const list = D.pastPresidents.filter((p) => p.n >= era.from && p.n <= era.to);
    return `<div class="era">
      <div class="era__head reveal"><b>${era.title}</b><span>${era.sub} · ${list.length} presidencies</span></div>
      <ol class="era__list">${list.map((p) => `
        <li class="pp reveal${p.current ? " pp--current" : ""}">
          <span class="pp__n">No. ${String(p.n).padStart(2, "0")}</span>
          <span class="pp__y${p.year ? "" : " none"}">${p.year || "Founding era"}</span>
          <span class="pp__name">${p.name}${p.n === 34 ? "<small>Immediate Past President</small>" : ""}</span>
          ${p.current ? `<span class="pp__now"><i></i>Now leading</span>` : ""}
        </li>`).join("")}</ol>
    </div>`;
  }).join("");
  const railFill = $("#railFill"), timeline = $("#timeline");
  function updateRail() {
    const r = timeline.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / r.height));
    railFill.style.setProperty("--p", p.toFixed(3));
  }

  /* ---------- Glimpse: Instagram reels ---------- */
  const reelsEl = $("#reels");
  reelsEl.innerHTML = D.reels.map((id, i) => {
    const url = `https://www.instagram.com/reel/${id}/`;
    return `<article class="reel reveal" style="--d:${i * 70}ms">
      <div class="phone">
        <div class="phone__screen">
          <blockquote class="instagram-media" data-instgrm-permalink="${url}?utm_source=ig_embed" data-instgrm-version="14"></blockquote>
          <div class="reel-fallback">
            <span class="mono">RCDC reel ${String(i + 1).padStart(2, "0")}</span>
            <svg class="ig-glyph"><use href="#i-instagram"/></svg>
            <div><b>Watch it on Instagram.</b></div>
            <a class="btn btn--gold btn--sm" href="${url}" target="_blank" rel="noopener">Open reel <svg><use href="#i-ext"/></svg></a>
          </div>
        </div>
      </div>
      <div class="reel__meta"><span class="mono">Reel ${String(i + 1).padStart(2, "0")}</span><a href="${url}" target="_blank" rel="noopener">Watch on Instagram <svg><use href="#i-ext"/></svg></a></div>
    </article>`;
  }).join("");
  let igLoaded = false;
  function loadInstagram() {
    if (igLoaded) return; igLoaded = true;
    const s = document.createElement("script");
    s.async = true; s.src = "https://www.instagram.com/embed.js";
    s.onload = () => { if (window.instgrm) window.instgrm.Embeds.process(); watchEmbeds(); };
    document.body.appendChild(s);
  }
  function watchEmbeds() {
    // When Instagram swaps a blockquote for its iframe, hide our fallback card for that phone.
    const check = () => $$(".phone", reelsEl).forEach((ph) => { if (ph.querySelector("iframe")) ph.classList.add("is-embedded"); });
    check();
    new MutationObserver(check).observe(reelsEl, { childList: true, subtree: true });
  }
  new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { loadInstagram(); o.disconnect(); } }, { rootMargin: "600px" }).observe(reelsEl);

  /* ---------- Calendar ---------- */
  const months = [];
  D.events.forEach((e) => { const k = e.date.slice(0, 7); if (!months.includes(k)) months.push(k); });
  let activeMonth = "all";
  const hideGbm = $("#hideGbm");
  const isGbmOnly = (e) => /^GBM$/i.test(e.name.trim());
  const monthLabel = (k, short) => { const [y, m] = k.split("-").map(Number); return short ? MONTHS[m - 1].slice(0, 3) + " ’" + String(y).slice(2) : MONTHS[m - 1] + " " + y; };
  $("#monthChips").innerHTML = `<button class="is-active" data-m="all">All year</button>` + months.map((k) => `<button data-m="${k}">${monthLabel(k, true)}</button>`).join("");
  $$("#monthChips button").forEach((b) => b.addEventListener("click", () => { activeMonth = b.dataset.m; $$("#monthChips button").forEach((x) => x.classList.toggle("is-active", x === b)); renderCal(); }));
  hideGbm.addEventListener("change", renderCal);
  const nextEvent = D.events.find((e) => status(e.date) !== "done");
  function renderCal() {
    const list = D.events.filter((e) => (activeMonth === "all" || e.date.startsWith(activeMonth)) && !(hideGbm.checked && isGbmOnly(e)));
    if (!list.length) { $("#calList").innerHTML = `<div class="cal-empty">Only GBMs this month. Switch off “Hide GBMs” to see them.</div>`; return; }
    let html = "", cur = "", i = 0;
    list.forEach((e) => {
      const k = e.date.slice(0, 7);
      if (k !== cur) { cur = k; html += `<div class="cal-month">${monthLabel(k)}</div>`; }
      const st = status(e.date), d = parseDate(e.date);
      const pill = st === "done" ? `<span class="pill pill--done">Done</span>` : st === "today" ? `<span class="pill pill--today">Today</span>` : `<span class="pill pill--up">Upcoming</span>`;
      const sub = isGbmOnly(e) ? "General Body Meeting" : /GBM/.test(e.name) ? "Includes the General Body Meeting" : "";
      html += `<div class="event ${st === "done" ? "is-done" : ""} ${nextEvent && e === nextEvent ? "is-next" : ""}" style="--i:${Math.min(i++, 20)}">
        <div class="event__date"><b>${String(d.getDate()).padStart(2, "0")}</b><small>${DAYS[d.getDay()].slice(0, 3)}</small></div>
        <div class="event__name">${e.name}${sub ? `<small>${sub}</small>` : ""}</div>${pill}</div>`;
    });
    $("#calList").innerHTML = html;
  }
  renderCal();
  const nextUp = $("#nextUp");
  if (nextEvent) {
    const isToday = status(nextEvent.date) === "today";
    nextUp.innerHTML = `<div><div class="nextup__label">${isToday ? "Happening today" : "Next up"}</div><div class="nextup__name">${nextEvent.name === "GBM" ? "General Body Meeting" : nextEvent.name}</div><div class="nextup__date">${fmt(nextEvent.date)}</div></div>
      ${isToday ? "" : `<div class="countdown" aria-label="Countdown"><div><b id="cdD">0</b><small>days</small></div><div><b id="cdH">0</b><small>hrs</small></div><div><b id="cdM">0</b><small>min</small></div><div><b id="cdS">0</b><small>sec</small></div></div>`}`;
    if (!isToday) {
      const target = parseDate(nextEvent.date).getTime();
      const tick = () => {
        let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
        $("#cdD").textContent = Math.floor(s / 86400); s %= 86400;
        $("#cdH").textContent = String(Math.floor(s / 3600)).padStart(2, "0"); s %= 3600;
        $("#cdM").textContent = String(Math.floor(s / 60)).padStart(2, "0");
        $("#cdS").textContent = String(s % 60).padStart(2, "0");
      };
      tick(); setInterval(tick, 1000);
    }
  } else {
    nextUp.innerHTML = `<div><div class="nextup__label">RIY 2026–27</div><div class="nextup__name">What a year it has been ✦</div><div class="nextup__date">Every event on this calendar is done. Stay tuned for the next chapter.</div></div>`;
  }

  /* ---------- Rotary tabs ---------- */
  function renderRotary(key) {
    const r = D.rotary[key];
    $("#rotaryPanel").innerHTML = `
      <div><h3>${r.title}</h3><div class="facts">${r.facts.map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join("")}</div></div>
      <div class="rpanel__body">${r.body.map((p) => `<p>${p}</p>`).join("")}
      ${r.timeline ? `<ol class="rtimeline">${r.timeline.map(([y, t]) => `<li><b>${y}</b>${t}</li>`).join("")}</ol>` : ""}</div>`;
    const p = $("#rotaryPanel"); p.style.animation = "none"; void p.offsetWidth; p.style.animation = "";
  }
  $$("#rotaryTabs .tab").forEach((t) => t.addEventListener("click", () => {
    $$("#rotaryTabs .tab").forEach((x) => { x.classList.toggle("is-active", x === t); x.setAttribute("aria-selected", x === t); });
    renderRotary(t.dataset.key);
  }));
  renderRotary("global");

  /* ---------- Background film + theme film modal ---------- */
  const bg = $("#bgVideo"), modal = $("#filmModal"), film = $("#filmVideo");
  const playBg = () => { if (bg && !reduceMotion && !modal.classList.contains("is-open")) bg.play().catch(() => {}); };
  if (reduceMotion && bg) { bg.removeAttribute("autoplay"); bg.pause(); }
  playBg();
  ["touchstart", "click", "scroll"].forEach((ev) => addEventListener(ev, playBg, { once: true, passive: true }));
  document.addEventListener("visibilitychange", () => { if (document.hidden) bg.pause(); else playBg(); });
  const openFilm = () => { modal.classList.add("is-open"); document.body.classList.add("no-scroll"); bg.pause(); film.play().catch(() => {}); };
  const closeFilm = () => { if (!modal.classList.contains("is-open")) return; modal.classList.remove("is-open"); document.body.classList.remove("no-scroll"); film.pause(); playBg(); };
  $$("[data-open-film]").forEach((b) => b.addEventListener("click", openFilm));
  $$("#filmModal [data-close]").forEach((b) => b.addEventListener("click", closeFilm));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeFilm(); closeLb(); if (menu.classList.contains("is-open")) toggleMenu(false); }
    if (lb.classList.contains("is-open")) { if (e.key === "ArrowLeft") openLb(lbi - 1); if (e.key === "ArrowRight") openLb(lbi + 1); }
  });

  /* ---------- Scroll loop ---------- */
  let ticking = false;
  function onScroll() {
    sy = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? sy / max : 0})`;
    nav.classList.toggle("is-scrolled", sy > 30);
    if (!menu.classList.contains("is-open")) {
      if (sy > 600 && sy > lastY + 6) nav.classList.add("is-hidden");
      else if (sy < lastY - 6 || sy < 600) nav.classList.remove("is-hidden");
    }
    lastY = sy;
    toTop.classList.toggle("is-visible", sy > 1000);
    updateStatement(); updateRail();
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- Reveal on scroll ---------- */
  const revObs = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); revObs.unobserve(en.target); }
  }), { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal, .img-reveal").forEach((el) => revObs.observe(el));

  /* ---------- Magnetic buttons (desktop only) ---------- */
  if (finePointer && !reduceMotion) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.22}px)`; });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  onScroll();
})();
