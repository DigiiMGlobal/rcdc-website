/* =========================================================
   RCDC · Play: Spin the Wheel + Memory Match
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = RCDC, U = window.RCDCUtil;
  const reduceMotion = U.reduceMotion;

  /* ---------- Confetti (tiny, canvas based) ---------- */
  const PALETTE = ["#E6BC5C", "#F7DC94", "#E0529C", "#A48BF0", "#3FC1C9", "#ffffff"];
  function confetti(canvas, count = 110) {
    if (reduceMotion || !canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = canvas.width = canvas.offsetWidth * dpr, h = canvas.height = canvas.offsetHeight * dpr;
    const parts = Array.from({ length: count }, () => ({
      x: w / 2, y: h / 2, vx: (Math.random() - 0.5) * 16 * dpr, vy: (-Math.random() * 13 - 4) * dpr,
      s: (Math.random() * 6 + 4) * dpr, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
      c: PALETTE[Math.floor(Math.random() * PALETTE.length)], star: Math.random() < 0.25
    }));
    const t0 = performance.now();
    (function frame(t) {
      const age = (t - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => {
        p.vy += 0.42 * dpr; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.max(0, 1 - age / 2.2); ctx.fillStyle = p.c;
        if (p.star) { ctx.font = `${p.s * 2}px sans-serif`; ctx.fillText("✦", -p.s, p.s); } else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (age < 2.3) requestAnimationFrame(frame); else ctx.clearRect(0, 0, w, h);
    })(t0);
  }
  window.RCDCConfetti = confetti;

  /* =========================================================
     1 · SPIN THE WHEEL
     ========================================================= */
  const wheel = $("#wheelSvg"), pointer = $("#wheelPointer"), spinBtn = $("#spinBtn"), result = $("#wheelResult");
  const AV = D.avenues, N = AV.length, SEG = 360 / N;
  const polar = (r, deg) => { const a = (deg - 90) * Math.PI / 180; return [r * Math.cos(a), r * Math.sin(a)]; };
  let svg = `<defs>
      <radialGradient id="wg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#2a2270"/><stop offset="100%" stop-color="#0d1238"/></radialGradient>
    </defs>
    <circle r="118" fill="#0B0F2A"/>
    <g id="wheelRotor">`;
  AV.forEach((a, i) => {
    const a0 = i * SEG, a1 = (i + 1) * SEG, R = 104;
    const [x0, y0] = polar(R, a0), [x1, y1] = polar(R, a1);
    const fill = i % 2 ? "#161C4E" : "#211A5C";
    const mid = a0 + SEG / 2;
    svg += `<g class="seg" data-i="${i}">
      <path d="M0 0 L${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z" fill="${fill}" stroke="rgba(230,188,92,.55)" stroke-width=".8"/>
      <g transform="rotate(${mid - 90})">
        <text x="38" y="2.4" fill="#F7DC94" style="font-family:Figtree,sans-serif;font-weight:700;font-size:7.4px">${a.short}</text>
        <text class="seg-num" x="94" y="2" fill="${a.color}" text-anchor="end">${String(i + 1).padStart(2, "0")}</text>
      </g>
    </g>`;
  });
  svg += `</g><circle r="104" fill="none" stroke="#E6BC5C" stroke-width="1.2"/>
    <circle r="112" fill="none" stroke="#E6BC5C" stroke-width="7"/>`;
  for (let i = 0; i < 18; i++) { const [x, y] = polar(112, i * 20); svg += `<circle class="bulb" data-b="${i}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.1" fill="#0B0F2A"/>`; }
  wheel.innerHTML = svg;
  const rotor = $("#wheelRotor"), bulbs = $$(".bulb", wheel), segs = $$(".seg", wheel);
  let angle = 0, spinning = false, lastSeg = -1;
  const setBulbs = (phase) => bulbs.forEach((b, i) => b.setAttribute("fill", (i + phase) % 2 ? "#F7DC94" : "#0B0F2A"));
  setBulbs(0);
  const segUnderPointer = (ang) => Math.floor((((-ang) % 360) + 360) % 360 / SEG);

  spinBtn.addEventListener("click", () => {
    if (spinning) return;
    spinning = true; spinBtn.disabled = true;
    segs.forEach((s) => s.classList.remove("is-win"));
    result.innerHTML = `<p class="muted">The cosmos is deciding…</p>`;
    const pick = Math.floor(Math.random() * N);
    const mid = pick * SEG + SEG / 2 + (Math.random() - 0.5) * SEG * 0.6;
    const start = angle;
    let target = -mid; while (target <= start) target += 360;
    target += 360 * 5;
    const dur = reduceMotion ? 1 : 4800, t0 = performance.now();
    (function frame(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      angle = start + (target - start) * e;
      rotor.setAttribute("transform", `rotate(${angle.toFixed(2)})`);
      const s = segUnderPointer(angle);
      if (s !== lastSeg) { lastSeg = s; pointer.classList.remove("tick"); void pointer.offsetWidth; pointer.classList.add("tick"); }
      setBulbs(Math.floor(t / 90) % 2);
      if (p < 1) requestAnimationFrame(frame);
      else finish(pick);
    })(t0);
  });
  function finish(i) {
    angle = angle % 360;
    rotor.setAttribute("transform", `rotate(${angle.toFixed(2)})`);
    const a = AV[i];
    segs[i].classList.add("is-win");
    let flash = 0; const fl = setInterval(() => { setBulbs(flash++ % 2); if (flash > 7) { clearInterval(fl); setBulbs(0); } }, 120);
    if (navigator.vibrate) try { navigator.vibrate([20, 40, 20]); } catch (e) {}
    confetti($("#wheelConfetti"));
    result.innerHTML = `<div class="res" style="--c:${a.color}">
      <small>You belong in avenue ${String(i + 1).padStart(2, "0")}</small>
      <b>${a.name}</b>
      <p>${a.text.split(". ")[0]}.</p>
      <a href="#avenues" data-av="${a.id}">Explore this avenue →</a>
    </div>`;
    spinning = false; spinBtn.disabled = false; spinBtn.textContent = "AGAIN";
  }
  result.addEventListener("click", (e) => { const l = e.target.closest("[data-av]"); if (l && window.RCDCSelectAvenue) window.RCDCSelectAvenue(l.dataset.av); });

  /* =========================================================
     2 · MEMORY MATCH
     ========================================================= */
  const sym = (id) => `<svg><use href="#${id}"/></svg>`;
  const PAIRS = [
    { k: "emblem", html: `<img src="assets/images/cosmic-logo.webp" alt="" />`, label: "Our emblem" },
    { k: "rcdc", html: `<span class="mono-word">RCDC</span>`, label: "Dahisar Coast" },
    { k: "sas", html: `<span class="tiny">Service<br>Above<br>Self</span>`, label: "" },
    { k: "community", html: sym("i-heart"), label: "Community", c: "#C93B84" },
    { k: "fellowship", html: sym("i-users"), label: "Fellowship", c: "#1E98A0" },
    { k: "leadership", html: sym("i-spark"), label: "Leadership", c: "#A57A1E" },
    { k: "international", html: sym("i-globe"), label: "International", c: "#3E6FD6" },
    { k: "entrepreneur", html: sym("i-rocket"), label: "Entrepreneur", c: "#D26A26" }
  ];
  const grid = $("#memGrid"), timeEl = $("#memTime"), movesEl = $("#memMoves"), matchedEl = $("#memMatched"), done = $("#memDone");
  let open = [], matched = 0, moves = 0, lock = false, timer = null, secs = 0;
  const fmtTime = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let best = null;
  try { best = JSON.parse(localStorage.getItem("rcdc-memory-best") || "null"); } catch (e) { best = null; }

  function newGame() {
    clearInterval(timer); timer = null; secs = 0; moves = 0; matched = 0; open = []; lock = false;
    timeEl.textContent = "0:00"; movesEl.textContent = "0"; matchedEl.textContent = "0/8";
    done.hidden = true;
    const deck = shuffle([...PAIRS, ...PAIRS]);
    grid.innerHTML = deck.map((p, i) => `
      <button class="mem-card" data-k="${p.k}" aria-label="Hidden card ${i + 1}" style="${p.c ? `--c:${p.c}` : ""}">
        <span class="mem-card__face mem-card__back" aria-hidden="true">✦</span>
        <span class="mem-card__face mem-card__front" aria-hidden="true">${p.html}${p.label ? `<span class="lbl">${p.label}</span>` : ""}</span>
      </button>`).join("");
  }
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".mem-card");
    if (!card || lock || card.classList.contains("is-flipped") || card.classList.contains("is-matched")) return;
    if (!timer) timer = setInterval(() => { secs++; timeEl.textContent = fmtTime(secs); }, 1000);
    card.classList.add("is-flipped");
    card.setAttribute("aria-label", "Card: " + (PAIRS.find((p) => p.k === card.dataset.k).label || "Service Above Self"));
    open.push(card);
    if (open.length < 2) return;
    moves++; movesEl.textContent = moves;
    const [a, b] = open;
    if (a.dataset.k === b.dataset.k) {
      setTimeout(() => { a.classList.add("is-matched"); b.classList.add("is-matched"); }, 250);
      open = []; matched++; matchedEl.textContent = matched + "/8";
      if (matched === PAIRS.length) setTimeout(win, 700);
    } else {
      lock = true;
      setTimeout(() => { a.classList.add("is-wrong"); b.classList.add("is-wrong"); }, 450);
      setTimeout(() => {
        [a, b].forEach((c) => { c.classList.remove("is-flipped", "is-wrong"); c.setAttribute("aria-label", "Hidden card"); });
        open = []; lock = false;
      }, 950);
    }
  });
  function win() {
    clearInterval(timer);
    const msgs = ["You've got the RCDC spirit. ✨", "Matched. Connected. Ready to serve."];
    $("#memMsg").textContent = msgs[Math.floor(Math.random() * msgs.length)];
    const isBest = !best || moves < best.moves || (moves === best.moves && secs < best.secs);
    if (isBest) { best = { moves, secs }; try { localStorage.setItem("rcdc-memory-best", JSON.stringify(best)); } catch (e) {} }
    $("#memScore").textContent = `${moves} moves · ${fmtTime(secs)}` + (isBest ? " · new best!" : ` · best ${best.moves} moves`);
    done.hidden = false;
    requestAnimationFrame(() => confetti($("#memConfetti"), 140));
  }
  $("#memRestart").addEventListener("click", newGame);
  $("#memAgain").addEventListener("click", newGame);
  newGame();
})();
