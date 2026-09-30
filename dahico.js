/* =========================================================
   DAHICO · RCDC's cosmic guide (chatbot)
   Runs fully in the browser: no server, no API key.
   It answers from the content in js/data.js, so when you
   update data.js, Dahico learns it automatically.
   ========================================================= */
(function () {
  "use strict";

  const D = RCDC, U = window.RCDCUtil;
  const $ = (s) => document.querySelector(s);
  const fab = $("#dahicoFab"), box = $("#dahico"), body = $("#dahicoBody"), form = $("#dahicoForm"), input = $("#dahicoInput"), chipsEl = $("#dahicoChips");
  const C = D.contact;

  /* ---------- helpers ---------- */
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => " " + s.toLowerCase().replace(/[’'`]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9\s-]/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim() + " ";
  const has = (q, re) => re.test(q);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const lev = (a, b) => {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) m[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  };
  const bare = (name) => name.replace(/\b(Rtn|Rtr|PHF)\.?\s+/g, "");
  const formLink = `<a class="btnlink" href="${C.form}" target="_blank" rel="noopener">Open membership form ✦</a>`;
  const emailLink = `<a href="mailto:${C.email}">${C.email}</a>`;
  const phoneLink = `<a href="tel:${C.phoneIntl}">+91 75499 73518</a>`;
  const igLink = `<a href="${C.instagramUrl}" target="_blank" rel="noopener">@${C.instagram}</a>`;
  const section = (id, label) => `<a href="#${id}" data-jump>${label}</a>`;
  const evName = (n) => (n === "GBM" ? "General Body Meeting (GBM)" : n);
  const statusWord = (s) => (s === "done" ? "done ✅" : s === "today" ? "happening today 🎉" : "upcoming ✨");

  /* ---------- people index (Core Team, Board, guidance, Hall of Fame) ---------- */
  const keyOf = (n) => bare(n).toLowerCase();
  const byName = {};
  const addP = (name, role, photo, tier) => {
    const k = keyOf(name);
    const p = byName[k] || (byName[k] = { name, photo: null, roles: [], tiers: [], pres: [] });
    if (photo) p.photo = photo;
    if (name.startsWith("Rtn.")) p.name = name;
    if (role && !p.roles.includes(role)) p.roles.push(role);
    if (tier && !p.tiers.includes(tier)) p.tiers.push(tier);
  };
  D.core.forEach((m) => addP(m.name, m.role, m.photo, "Core Team"));
  D.bod.forEach((m) => addP(m.name, m.role, m.photo, "Board of Directors"));
  D.guidance.forEach((m) => addP(m.name, m.role, null, "Rotary & District Guidance"));
  D.pastPresidents.forEach((pp) => { addP(pp.name, null, null, null); byName[keyOf(pp.name)].pres.push(pp); });
  const people = Object.values(byName);
  people.forEach((p) => { p.role = p.roles.join(" & ") || "Past President of RCDC"; p.tokens = keyOf(p.name).split(" "); });
  const COMMON_WORDS = new Set(["love", "harsh", "jay", "hari", "shree", "jui"]);

  function personCard(p) {
    const img = p.photo ? `<img src="assets/team/${p.photo}.jpg" alt="">` : `<span class="ini">${U.initials(p.name)}</span>`;
    const avs = D.avenues.filter((a) => a.leads.includes(p.name)).map((a) => a.name);
    let extra = "";
    if (p.name.includes("Misaal")) extra = "<p>Leading RCDC into its next chapter with the vision of <b>Cosmic Renaissance</b>: growth, transformation, meaningful service, stronger connections and limitless possibilities.</p>";
    if (p.name.includes("Manaswi")) extra = "<p>She's also the go-to person for <b>membership queries</b>.</p>";
    if (p.name.includes("Harsh Kumawat")) extra = "<p>“Rtn. Rtr.” means he holds both Rotary and Rotaract membership.</p>";
    const pres = p.pres.length ? `<p>Hall of Fame: President ${p.pres.map((x) => `No. ${x.n}${x.year ? " (" + x.year + ")" : ""}`).join(" and ")}.</p>` : "";
    return `<div class="person">${img}<div><b>${p.name}</b><br>${p.role}${p.tiers.length ? `<br><small>${p.tiers.join(" · ")}${p.tiers.includes("Core Team") || p.tiers.includes("Board of Directors") ? " 2026–27" : ""}</small>` : ""}</div></div>` +
      (avs.length ? `<p>Avenue${avs.length > 1 ? "s" : ""}: ${avs.join(", ")}.</p>` : "") + pres + extra;
  }

  function findPeople(q) {
    const words = q.trim().split(" ");
    const scored = [];
    people.forEach((p) => {
      const full = " " + p.tokens.join(" ") + " ";
      let score = 0;
      if (q.includes(full)) score = 10;
      else {
        const [first, ...rest] = p.tokens; const last = rest[rest.length - 1];
        const firstExact = words.includes(first);
        const firstHit = firstExact || words.some((w) => w.length >= 5 && first.length >= 5 && lev(w, first) <= 1);
        const lastHit = last && words.some((w) => w === last || (w.length >= 5 && last.length >= 5 && lev(w, last) <= 1));
        if (firstHit && lastHit) score = 9;
        else if (firstHit && !COMMON_WORDS.has(first)) score = firstExact ? 6 : 5;
        else if (firstHit && COMMON_WORDS.has(first) && /\b(rtr|rtn|who is|who s|about)\b/.test(q)) score = 5;
        else if (lastHit) score = 3;
      }
      if (score) scored.push({ p, score });
    });
    if (!scored.length) return [];
    const top = Math.max(...scored.map((s) => s.score));
    return scored.filter((s) => s.score === top).map((s) => s.p);
  }

  const roleIs = (re) => people.filter((p) => re.test(p.role.toLowerCase()));
  const listPeople = (arr) => "<ul>" + arr.map((p) => `<li><b>${p.name}</b> · ${p.role}</li>`).join("") + "</ul>";

  /* ---------- events index ---------- */
  const evs = D.events.map((e) => ({ ...e, st: U.status(e.date) }));
  const namedEvents = {};
  evs.forEach((e) => e.name.split(" / ").forEach((n) => {
    const key = n.trim(); if (key === "GBM") return;
    (namedEvents[key] = namedEvents[key] || []).push(e);
  }));
  const EVENT_ALIASES = {
    "Installation Ceremony (Acensus)": ["acensus", "installation"],
    "Safar: District Trek": ["safar", "trek"],
    "Dhara: Seed Ball Plantation": ["dhara", "seed ball", "seedball"],
    "District Assembly": ["district assembly", "elixir"],
    "Population Day Awareness": ["population day"],
    "BOD Meeting: Bylaws": ["bylaws", "bod meeting", "board meeting"],
    "Ganpati with Grace 2.0": ["ganpati with grace", "grace 2"],
    "Om Morya Re": ["om morya", "morya"],
    "Around the World in Cocoa": ["cocoa", "around the world"],
    "Bombay Ki Baarish": ["baarish", "barish", "bombay ki"],
    "Yaaro ki Mehfil": ["yaaro", "yaaron", "mehfil"],
    "Prompt to Pitch": ["prompt to pitch", "prompt", "pitch"],
    "Beyond the Boardroom": ["beyond the boardroom", "boardroom"],
    "Janmashtami Campaign": ["janmashtami"],
    "Plant a Tree for Future": ["plant a tree", "tree plantation", "tree"],
    "Paper Boat": ["paper boat"],
    "Guess the Friend": ["guess the friend"],
    "Independence Day": ["independence"],
    "Annapurna": ["annapurna"],
    "Good Old Days": ["good old days"]
  };
  function findEvent(q) {
    for (const [name, aliases] of Object.entries(EVENT_ALIASES)) {
      if (aliases.some((a) => q.includes(" " + a))) return name;
    }
    for (const name of Object.keys(namedEvents)) if (q.includes(norm(name).trim())) return name;
    return null;
  }
  function describeEvent(name) {
    const list = namedEvents[name] || [];
    if (!list.length) return null;
    const dates = list.map((e) => U.fmt(e.date)).join("; ");
    const st = list.every((e) => e.st === "done") ? "done" : list.some((e) => e.st === "today") ? "today" : list.some((e) => e.st === "done") ? "ongoing" : "upcoming";
    let html = `<p><b>${name}</b> ${list.length > 1 ? "ran on" : st === "done" ? "was held on" : "is on"} ${dates}. Status: ${st === "ongoing" ? "partly done" : statusWord(st)}</p>`;
    const mem = D.memories.find((m) => norm(m.title).trim() === norm(name).trim());
    if (mem) html += `<p>${mem.text}</p>`;
    if (/Acensus/.test(name)) html += `<p>Acensus was the installation ceremony of our President, <b>Rtr. Misaal Thakker</b>, and the 2026–27 team.</p>`;
    if (/District Assembly/.test(name)) html += `<p>Our President was on stage at <b>Elixir</b>, the District Assembly & AARA Night, on 11 July 2026.</p>`;
    return html;
  }
  const monthIdx = { january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2, april: 3, apr: 3, may: 4, june: 5, jun: 5, july: 6, jul: 6, august: 7, aug: 7, september: 8, sep: 8, sept: 8, october: 9, oct: 9, november: 10, nov: 10, december: 11, dec: 11 };
  function eventsInMonth(m) {
    const list = evs.filter((e) => U.parseDate(e.date).getMonth() === m);
    if (!list.length) return `<p>I don't see anything on the RIY 2026–27 calendar for ${U.MONTHS[m]}.</p>`;
    const y = U.parseDate(list[0].date).getFullYear();
    return `<p>Here's <b>${U.MONTHS[m]} ${y}</b> on the RCDC calendar:</p><ul>` +
      list.map((e) => `<li>${U.parseDate(e.date).getDate()} ${U.MONTHS[m].slice(0, 3)} (${U.DAYS[U.parseDate(e.date).getDay()].slice(0, 3)}) · ${evName(e.name)} · <i>${e.st === "done" ? "done" : e.st === "today" ? "today!" : "upcoming"}</i></li>`).join("") + "</ul>";
  }
  const nextEv = (gbmOnly) => evs.find((e) => e.st !== "done" && (!gbmOnly || /GBM/.test(e.name)));
  const daysTo = (e) => Math.round((U.parseDate(e.date) - U.today()) / 86400000);

  /* ---------- avenue matching ---------- */
  const AV_KEYS = {
    fellowship: /\b(club service|fellowship|fun|friends|friendship|celebrations?)\b/,
    community: /\b(community service|community|social service|donation|grassroots)\b/,
    professional: /\b(professional|career|careers|workshops?|mentorship|networking|upskill|industry|pd)\b/,
    entrepreneurship: /\b(entrepreneur\w*|startups?|business|innovators?|innovation)\b/,
    international: /\b(international service|international|global|abroad|borders|cultural exchange)\b/,
    pr: /\b(pr|public relations|marketing|branding|outreach|public image)\b/,
    digital: /\b(digital media|digital|publications?|social media|editorials?|content|design|documentation|creative)\b/,
    partners: /\b(partners in service|partners|interact|collaborations?)\b/,
    youth: /\b(youth|member development|hrd|human resource|personal growth)\b/
  };
  const avHtml = (a) => `<p><b>${a.name}</b></p><p>${a.text}</p><p>Led by: ${a.leads.join(", ")}.</p><p>See it in ${section("avenues", "Avenues")}.</p>`;
  function hallOfFame() {
    const pp = D.pastPresidents;
    return `<p><b>RCDC Hall of Fame</b>: ${pp.length} presidencies across 36+ years. Rtr. Devang Patel and Rtr. Ketul Raghani each led the club twice.</p><ul>` +
      pp.map((p) => `<li>No. ${p.n} · ${p.name}${p.year ? " · " + p.year : ""}${p.current ? " (current)" : ""}</li>`).join("") + `</ul><p>Explore the timeline in ${section("legacy", "Legacy")}.</p>`;
  }

  /* ---------- intents (checked in order) ---------- */
  const intents = [
    { // greeting
      test: (q) => /^ (hi+|hello+|hey+|hola|namaste|namaskar|yo|hii+|heya|good (morning|afternoon|evening)|sup|wassup)( dahico| there| rcdc)? $/.test(q),
      reply: () => pick(["Hey there, star! ✦ I'm Dahico. Ask me about RCDC, our theme, the team, events or how to join.", "Hello! 👋 Welcome to the RCDC universe. What would you like to know?", "Namaste! ✨ I know everything about RCDC's Cosmic Renaissance year. Ask away!"]),
      chips: ["What is RCDC?", "How do I join?", "Next event?"]
    },
    { test: (q) => /\b(thank|thanks|thx|thankyou|ty|dhanyavad|shukriya)\b/.test(q), reply: () => pick(["Anytime! ✦ Keep shining.", "Happy to help! 🌟 Anything else?", "You're welcome! The universe is always open. ✨"]) },
    { test: (q) => /^ (bye|goodbye|see you|see ya|cya|good night|ok bye) $/.test(q), reply: () => "Bye for now! ✦ Hope to see you at a GBM soon." },
    { test: (q) => /\b(who are you|your name|what are you|what is dahico|who is dahico|are you (a )?(bot|human|ai))\b/.test(q),
      reply: () => "I'm <b>Dahico</b>, RCDC's cosmic guide ✦ I know the club's story, the Cosmic Renaissance theme, our nine avenues, the 2026–27 team, our past presidents, the events calendar and the Rotary family. I'm a friendly bot, not a human, so for anything I can't answer, the team is one email away: " + emailLink + ".",
      chips: ["What is RCDC?", "Who is the president?", "How do I join?"] },

    /* ----- Roles ----- */
    { test: (q) => /\b(ri|rotary international)\b.*\bpresident\b|\bpresident\b.*\b(ri|rotary international)\b|babalola|yinka|olayinka/.test(q),
      reply: () => "The <b>RI President for 2026–27</b> is Olayinka Hakeem Babalola of the Rotary Club of Trans Amadi, Port Harcourt, Nigeria. He is the second African president in Rotary's history and the first RI president whose Rotary journey began in Rotaract. His theme for the year is <b>“Create Lasting Impact.”</b>",
      chips: ["What is Rotary International?", "Rotary & Rotaract relationship"] },
    { test: (q) => /\b(past presidents|hall of fame|former presidents|all presidents|all the presidents|list of presidents|presidents list|legacy of presidents|how many presidents)\b/.test(q),
      reply: () => hallOfFame(), chips: ["Who was the first president?", "Who was president in 2015?", "Who is the president?"] },
    { test: (q) => /\bfirst president\b|\bfounding president\b/.test(q), reply: () => personCard(people.find((p) => p.pres.some((x) => x.n === 1))) + "<p>He heads our Hall of Fame as President No. 1.</p>" },
    { test: (q) => /\bpresident\b/.test(q) && /\b(19|20)\d\d\b/.test(q) && !/\b(ri|rotary)\b/.test(q),
      reply: (q) => { const y = q.match(/\b((?:19|20)\d\d)\b/)[1]; const yy = y.slice(2); const hits = D.pastPresidents.filter((p) => p.year && (p.year.startsWith(y) || p.year.endsWith("–" + yy)));
        return hits.length ? "<p>From our Hall of Fame:</p><ul>" + hits.map((p) => `<li><b>${p.year}</b> · ${p.name} (No. ${p.n})</li>`).join("") + "</ul>" : `I don't have a dated president for ${y}. Our records start with dated terms from 2001–02; the nine founding-era presidents don't have years listed.`; } },
    { test: (q) => /\b(immediate past president|ipp|previous president|last year s president|last president)\b/.test(q), reply: () => personCard(people.find((p) => /Immediate Past/.test(p.role))) },
    { test: (q) => /\b(vice president|vice presidents|vp|vps)\b/.test(q), reply: () => "RCDC has two <b>Vice Presidents</b> for 2026–27:" + listPeople(roleIs(/\bvice president\b/)) },
    { test: (q) => /\bpresident\b/.test(q) && /\b(rotary club|sponsor|rcmd|mumbai dahisar|rotary president)\b/.test(q), reply: () => "The President of our sponsor club, the <b>Rotary Club of Mumbai Dahisar</b>, for 2026–27 is <b>Rtn. Prakash Kamthe</b>." },
    { test: (q) => /\b(president|prez|head of (the )?club|club head|who leads|leader of rcdc|who runs)\b/.test(q),
      reply: () => personCard(people.find((p) => p.roles.includes("President"))) + `<p>Meet the whole team in ${section("team", "Team")}.</p>`,
      chips: ["Who is the secretary?", "Show the core team", "Past presidents"] },
    { test: (q) => /\b(joint secretary|jt secretary|jt sec|joint sec)\b/.test(q), reply: () => personCard(people.find((p) => /Joint Secretary/.test(p.role))) },
    { test: (q) => /\b(secretary|secy|sec)\b/.test(q), reply: () => personCard(people.find((p) => p.roles.includes("Secretary"))) },
    { test: (q) => /\b(treasurer|finance|accounts|funds)\b/.test(q), reply: () => personCard(people.find((p) => /Treasurer/.test(p.role))) },
    { test: (q) => /\b(sergeant|saa|sergeant at arms)\b/.test(q), reply: () => personCard(people.find((p) => /Sergeant/.test(p.role))) },
    { test: (q) => /\b(mentor|advisor|adviser)\b/.test(q), reply: () => personCard(people.find((p) => /Mentor/.test(p.role))) },
    { test: (q) => /\b(drr|district rotaract representative|district representative)\b/.test(q), reply: () => personCard(people.find((p) => /District Rotaract/.test(p.role))) + "<p>The DRR leads Rotaract across RID 3141, supported by Zonal Rotaract Representatives.</p>" },
    { test: (q) => /\b(zrr|zrrs|zonal)\b/.test(q), reply: () => "Zone 2, which includes RCDC, is guided by two <b>Zonal Rotaract Representatives</b>:" + listPeople(roleIs(/zonal/)) },
    { test: (q) => /\b(district governor|dg)\b/.test(q), reply: () => "Each district is led by a District Governor who serves a one-year term from 1 July to 30 June. The name of the 2026–27 District Governor for RID 3141 isn't on this site yet. For now, drop us a line at " + emailLink + "." },
    { test: (q) => /\b(editorial|editorials|editor|newsletter)\b/.test(q), reply: () => personCard(people.find((p) => /Editorials/.test(p.role))) },
    { test: (q) => /\b(partners in service|pis)\b/.test(q), reply: () => personCard(people.find((p) => /Partners-in-Service/.test(p.role))) },
    { test: (q) => /\b(pr|public relations|marketing)\b.*\b(director|head|who)\b|\b(who|director)\b.*\b(pr|public relations|marketing)\b/.test(q), reply: () => personCard(people.find((p) => /PR & Marketing/.test(p.role))) },
    { test: (q) => /\b(digital media|social media|digital communication)\b.*\b(director|head|who|team)\b|\b(who|director)\b.*\b(digital|social media)\b/.test(q), reply: () => "Our <b>Digital Media Directors</b> are:" + listPeople(roleIs(/digital media/)) + "<p>They're part of the Digital Media & Publications avenue, along with Rtr. Suhani Chavda (Editorials Director).</p>" },
    { test: (q) => /\b(hrd|human resource)\b/.test(q), reply: () => personCard(people.find((p) => /HRD/.test(p.role))) },

    /* ----- Team hierarchy ----- */
    { test: (q) => /\b(core team|core committee|office bearers)\b/.test(q),
      reply: () => "<p><b>Core Team 2026–27</b></p>" + listPeople(D.core) + `<p>See them in ${section("team", "Team")}.</p>`, chips: ["Show the Board of Directors", "Who is the president?"] },
    { test: (q) => /\b(board|bod|directors|team|committee|members of the board|leadership|who all)\b/.test(q) && !/\bbod meeting\b|bylaws/.test(q),
      reply: () => "<p>RCDC's team runs <b>Leadership → Core Team → Board of Directors</b>.</p><p><b>Core Team</b></p>" + listPeople(D.core) +
        "<p><b>Board of Directors</b></p>" + listPeople(D.bod) +
        "<p><b>Rotary & district guidance</b></p>" + listPeople(D.guidance),
      chips: ["Who is the president?", "What are the avenues?", "Past presidents"] },

    /* ----- Join / membership ----- */
    { test: (q) => /\b(age|how old|old enough|18|eligib|criteria|qualif|requirement)\b/.test(q),
      reply: () => `<p>Anyone <b>18 or older</b> can become a Rotaractor. (Rotary removed the upper age limit on 1 July 2020.)</p><p>Come to a General Body Meeting, meet the team and find your avenue!</p>${formLink}` },
    { test: (q) => /\b(fee|fees|cost|charges|price|paid|pay|subscription|dues)\b/.test(q),
      reply: () => `Membership fee details aren't listed on the website. Please ask the team directly: ${emailLink} or ${phoneLink}. Membership queries are handled by <b>${C.membershipLead}</b>.` },
    { test: (q) => /\b(join|joining|member|membership|apply|application|enrol|enroll|register|registration|sign up|signup|become|recruit|be a part|be part|become part|judna|jud|induct|form)\b/.test(q) && !/\bhow many\b/.test(q),
      reply: () => `<p><b>Your story could be the next chapter of RCDC.</b> ✦</p><ul><li>Anyone <b>18 or older</b> can become a Rotaractor.</li><li>Fill in the membership form below.</li><li>Come to a <b>General Body Meeting</b> (usually the first Sunday of the month), meet the team and find your avenue.</li></ul><p>Membership queries: <b>${C.membershipLead}</b> · ${emailLink} · ${phoneLink}</p>${formLink}`,
      chips: ["When is the next GBM?", "What are the avenues?", "What is a GBM?"] },

    /* ----- Contact ----- */
    { test: (q) => /\b(address|location|located|where is|office|venue|meet at|where are you|where do you meet|kaha)\b/.test(q),
      reply: () => `We don't share a postal address on the website. The best way to reach us is ${emailLink} or ${phoneLink}, and the team will tell you where the next meet-up is. ✦` },
    { test: (q) => /\b(reel|reels|video|videos|glimpse|clips?)\b/.test(q),
      reply: () => `We've put five of our Instagram reels in ${section("glimpse", "A Glimpse of RCDC")}. For everything else, follow ${igLink}.` },
    { test: (q) => /\b(instagram|insta|ig|socials|social handle|handle|follow)\b/.test(q),
      reply: () => `Follow RCDC on Instagram: ${igLink} ✦ That's where our reels, project stories and event updates go first.` },
    { test: (q) => /\b(facebook|linkedin|twitter|youtube)\b/.test(q),
      reply: () => `The website lists Instagram as our social channel: ${igLink}. You can also reach us at ${emailLink} or ${phoneLink}.` },
    { test: (q) => /\b(contact|email|e mail|mail|gmail|phone|number|call|mobile|whatsapp|reach|talk to|get in touch|website|site|url)\b/.test(q),
      reply: () => `<p>Here's how to reach RCDC:</p><ul><li>✉️ Email: ${emailLink}</li><li>📞 Phone: ${phoneLink}</li><li>📸 Instagram: ${igLink}</li><li>🌐 Website: <a href="https://${C.website}" target="_blank" rel="noopener">${C.website}</a></li><li>🙋 Membership queries: ${C.membershipLead}</li></ul>` },

    /* ----- Events ----- */
    { test: (q) => /\b(next|upcoming|coming up|soon|kab|when)\b/.test(q) && /\b(gbm|meeting)\b/.test(q),
      reply: () => { const n = nextEv(true); return n ? `The next <b>GBM</b> is on <b>${U.fmt(n.date)}</b>${daysTo(n) > 0 ? `, ${daysTo(n)} day${daysTo(n) > 1 ? "s" : ""} from today` : " (that's today!)"}. ✦` : "All GBMs for RIY 2026–27 are done. Stay tuned for the next Rotary year!"; } },
    { test: (q) => /\b(what is (a )?gbm|what s (a )?gbm|gbm means|meaning of gbm|full form of gbm|general body meeting)\b/.test(q) || / gbm $/.test(q),
      reply: () => { const n = nextEv(true); return `<p>A <b>GBM (General Body Meeting)</b> is our regular club meeting, held on the first Sunday of most months. It's the best way for newcomers to meet the team!</p>` + (n ? `<p>Next GBM: <b>${U.fmt(n.date)}</b>${daysTo(n) > 0 ? ` (in ${daysTo(n)} day${daysTo(n) > 1 ? "s" : ""})` : " (today!)"}.</p>` : ""); },
      chips: ["All upcoming GBMs", "How do I join?"] },
    { test: (q) => /\b(all|list|upcoming|remaining|future)\b.*\bgbms?\b|\bgbms\b/.test(q),
      reply: () => "<p>Upcoming <b>General Body Meetings</b>:</p><ul>" + evs.filter((e) => /GBM/.test(e.name) && e.st !== "done").map((e) => `<li>${U.fmt(e.date)}</li>`).join("") + "</ul>" },
    { test: (q) => !!findEvent(q), reply: (q) => describeEvent(findEvent(q)) || null },
    { test: (q) => /\b(this month|next month)\b/.test(q) || (Object.keys(monthIdx).some((m) => q.includes(" " + m + " ")) && !/\bmay i\b|\bi may\b/.test(q)),
      reply: (q) => {
        let m;
        if (q.includes("this month")) m = U.today().getMonth();
        else if (q.includes("next month")) m = (U.today().getMonth() + 1) % 12;
        else m = monthIdx[Object.keys(monthIdx).find((k) => q.includes(" " + k + " "))];
        return eventsInMonth(m);
      } },
    { test: (q) => /\b(next event|upcoming|whats next|what s next|what is next|coming up|next program|next project|next activity|happening)\b/.test(q),
      reply: () => { const up = evs.filter((e) => e.st !== "done").slice(0, 4); return up.length ? "<p>Coming up on the RCDC calendar:</p><ul>" + up.map((e) => `<li><b>${evName(e.name)}</b> · ${U.fmt(e.date)}</li>`).join("") + `</ul><p>Full list in the ${section("calendar", "Calendar")}.</p>` : "Every event on the RIY 2026–27 calendar is done! ✦"; } },
    { test: (q) => /\b(how many|number of|count)\b.*\b(event|events|project|projects|activities)\b/.test(q),
      reply: () => { const done = evs.filter((e) => e.st === "done").length, up = evs.length - done; return `So far this Rotary year, <b>${done}</b> event days on the calendar are done and <b>${up}</b> are upcoming. The year runs 1 July 2026 to 30 June 2027.`; } },
    { test: (q) => /\b(event|events|calendar|schedule|programs|programmes|activities|past events)\b/.test(q),
      reply: () => { const done = evs.filter((e) => e.st === "done"); const recent = done.slice(-4).reverse(); const n = nextEv(false);
        return `<p>The Rotary year runs <b>1 July to 30 June</b>. GBMs happen on the first Sunday of most months.</p><p>Recent highlights:</p><ul>${recent.map((e) => `<li>${evName(e.name)} · ${U.fmt(e.date, false)}</li>`).join("")}</ul>${n ? `<p>Next up: <b>${evName(n.name)}</b> on ${U.fmt(n.date)}.</p>` : ""}<p>See everything in the ${section("calendar", "Calendar")}.</p>`; },
      chips: ["Events in July", "Events in August", "Events in September"] },

    /* ----- Memories / projects ----- */
    { test: (q) => /\b(creativerse|dabba|potluck|canva)\b/.test(q), reply: () => memHtml("Creativerse") },
    { test: (q) => /\b(ganesh|ganpati|bappa|chaturthi|legacy project)\b/.test(q), reply: () => memHtml("Om Morya Re") + `<p>We also held <b>Ganpati with Grace 2.0</b> on ${U.fmt("2026-09-20")}.</p>` },
    { test: (q) => /\b(project|projects|memories|memory|stories|initiatives|what have you done|work done|campaign|campaigns)\b/.test(q),
      reply: () => "<p>Some RCDC stories we love:</p><ul>" + D.memories.map((m) => `<li><b>${m.title}</b> (${m.tag})</li>`).join("") + `</ul><p>Ask me about any of them, or scroll through ${section("impact", "Impact")}.</p>`,
      chips: ["Om Morya Re", "Ganpati with Grace 2.0", "Yaaro ki Mehfil", "Creativerse"] },

    /* ----- Achievements ----- */
    { test: (q) => /\b(achievement|achievements|award|awards|recognition|legacy|milestone|accomplish)\b/.test(q),
      reply: () => "<p><b>Milestones are numbers. Legacy is what remains.</b></p><ul>" + D.legacy.map((l) => `<li><b>${l.area}</b>: ${l.text}</li>`).join("") + "</ul><p>Our biggest achievement? <b>The people who came in as members and left as leaders.</b></p>" },

    /* ----- Games ----- */
    { test: (q) => /\b(which orbit|which avenue|suit me|where do i fit|game|games|play|spin|wheel|memory match)\b/.test(q),
      reply: () => `Head to ${section("play", "Play")}. <b>Spin the wheel</b> picks an avenue for you, and <b>RCDC Memory Match</b> tests how fast you can pair up our symbols. ✦` },

    /* ----- Avenues ----- */
    { test: (q) => /\b(avenue|avenues|orbit|orbits|verticals|departments|wings|domains|areas of work)\b/.test(q) && !Object.values(AV_KEYS).some((re) => re.test(q)),
      reply: () => "<p><b>Nine avenues. One universe of impact.</b></p><ol>" + D.avenues.map((a) => `<li>${a.name}</li>`).join("") + "</ol><p>Ask me about any one of them!</p>",
      chips: ["Community Service", "Entrepreneurship Development", "PR & Marketing", "Which avenue suits me?"] },
    { test: (q) => Object.values(AV_KEYS).some((re) => re.test(q)),
      reply: (q) => { const id = Object.keys(AV_KEYS).find((k) => AV_KEYS[k].test(q)); return avHtml(D.avenues.find((a) => a.id === id)); } },

    /* ----- Theme ----- */
    { test: (q) => /\b(explore|create|lead|connect|impact)\b/.test(q) && /\b(mean|meaning|stand|word|universe)\b/.test(q),
      reply: () => "<p><b>Our Universe</b></p><ul>" + D.universe.map((u) => `<li><b>${u.word}</b>: ${u.meaning}</li>`).join("") + "</ul>" },
    { test: (q) => /\b(logo|emblem|symbol)\b/.test(q),
      reply: () => `<p>The RCDC logo stands for the spirit that holds the club together.</p><ul><li><b>Friendship</b>: a ring of people holding hands.</li><li><b>Equality</b>: every figure the same size and distance apart, so everyone has a place.</li><li><b>Leadership</b>: the light at the centre of the lotus, where ideas turn into action.</li><li><b>Impact</b>: the homes, schools, city and nature around the circle.</li></ul><p>Explore it in ${section("theme", "Theme")}.</p>` },
    { test: (q) => /\b(theme|cosmic|renaissance|beyond the beginning|universe|constellation)\b/.test(q),
      reply: () => `<p><b>Cosmic Renaissance</b> is RCDC's theme for RIY 2026–27: <i>A new universe. A new chapter. Limitless possibilities.</i></p><p>It represents a year of rebirth, exploration, transformation and limitless potential. Every member is a celestial force with their own light, orbit and purpose; together we form a constellation where individual brilliance becomes collective impact.</p><p>“We don't wait for a new universe. We create one.”</p><p>Watch the theme film in ${section("theme", "Cosmic Renaissance")}.</p>`,
      chips: ["What do Explore, Create, Lead mean?", "Who is the president?"] },

    /* ----- Mission / journey / about ----- */
    { test: (q) => /\b(mission|vision|goal|goals|aim|purpose)\b/.test(q),
      reply: () => "<p><b>Our mission:</b> to create a generation that doesn't just witness change, but leads it.</p><p>We give young people a platform to serve communities, develop leadership, discover opportunities and build meaningful connections, through experiences that teach, challenge, inspire and transform.</p><p>Where we're going: <i>What can we create? Who can we impact? How far can we go together?</i> The answer lies in our members.</p>" },
    { test: (q) => /\b(journey|history|how old is|since when|legacy of|38th|installation number|founded rcdc|started)\b/.test(q) && !/\brotary\b|\brotaract (began|started)/.test(q),
      reply: () => "<p>RCDC's journey spans <b>36+ years</b> and 35 presidencies, shaped by generations of Rotaractors who gave their time, creativity and passion. 2026–27 marks our <b>38th installation</b>.</p><p>Every project adds a chapter. Every member adds a story. Every collaboration expands our universe. We aren't starting from scratch. We're building on a legacy.</p>" },
    { test: (q) => /\b(values|identity|culture)\b/.test(q),
      reply: () => "<p>RCDC is more than a name. It's a movement of people who choose to show up:</p><ul>" + D.identity.map((i) => `<li>${i}</li>`).join("") + "</ul>" },
    { test: (q) => /\b(motto|slogan|tagline|serve create lead connect)\b/.test(q), reply: () => "Our motto is <b>Serve. Create. Lead. Connect.</b> ✦" },

    /* ----- Rotary family ----- */
    { test: (q) => /\b(rtn rtr|rtn|what does rtr|rtr mean|meaning of rtr|title)\b/.test(q),
      reply: () => "<p><b>Rtr.</b> stands for Rotaractor and <b>Rtn.</b> for Rotarian. Rotaractors are encouraged to join a Rotary club too and can hold both memberships at once, which is where the title <b>“Rtn. Rtr.”</b> comes from.</p>" },
    { test: (q) => /\b(sponsor|sponsored|parent club|mumbai dahisar)\b/.test(q),
      reply: () => "RCDC is sponsored by and partnered with the <b>Rotary Club of Mumbai Dahisar</b>, led in 2026–27 by Rotary President <b>Rtn. Prakash Kamthe</b>. It's a partnership, not a hierarchy: the Rotary club mentors, guides and serves alongside us, while we run our own club, funds and projects." },
    { test: (q) => /\b(polio)\b/.test(q), reply: () => "Rotary has led the fight to end polio since <b>1985</b>, and India was certified polio-free in <b>2014</b>. 💛" },
    { test: (q) => /\b(areas of focus|focus areas|seven areas|7 areas|causes)\b/.test(q),
      reply: () => "<p>Rotary's work is organised around <b>seven areas of focus</b>:</p><ul><li>Peacebuilding and conflict prevention</li><li>Disease prevention and treatment</li><li>Water and sanitation</li><li>Maternal and child health</li><li>Basic education and literacy</li><li>Community economic development</li><li>The environment</li></ul>" },
    { test: (q) => /\b(rotary foundation|foundation|global grant|grants)\b/.test(q), reply: () => "The <b>Rotary Foundation</b> is Rotary's charitable arm, funding everything from local projects to large global grants. Since 1 July 2022, eligible Rotaract clubs can sponsor global grants too." },
    { test: (q) => /\b(create lasting impact|ri theme|rotary theme)\b/.test(q), reply: () => "The RI theme for 2026–27 is <b>“Create Lasting Impact”</b>, set by RI President Olayinka Hakeem Babalola." },
    { test: (q) => /\b(paul harris|founder of rotary|who founded|who started rotary|when was rotary|rotary founded|1905)\b/.test(q), reply: () => "Rotary was started by <b>Paul Harris</b> in <b>Chicago in 1905</b>, so professionals from different fields could build lasting friendships and give back. Today it has 1.2 million+ members, with headquarters in Evanston, Illinois." },
    { test: (q) => /\b(rotaract (began|started|history|born|founded)|first rotaract|1968|when was rotaract|history of rotaract|2019|2020|2022|council on legislation)\b/.test(q),
      reply: () => "<p><b>Rotaract's story</b></p><ul>" + D.rotary.partnership.timeline.map(([y, t]) => `<li><b>${y}</b>: ${t}</li>`).join("") + "</ul><p>Today there are ~9,000 Rotaract clubs with ~120,000 members in more than 180 countries.</p>" },
    { test: (q) => /\b(difference|relationship|rotary and rotaract|rotaract and rotary|rotary vs|vs rotary)\b/.test(q),
      reply: () => D.rotary.partnership.body[1] },
    { test: (q) => /\b(district|3141|rid|zone|zone 2)\b/.test(q),
      reply: () => "<p>RCDC is part of <b>RI District 3141</b> (Mumbai), one of the most active districts in India, and sits in <b>Zone 2</b>.</p><p>2026–27: DRR <b>Rtr. PHF Shree Hari Nair</b>; Zone 2 ZRRs <b>Rtr. Amar Singh</b> and <b>Rtr. Ambresh Shukla</b>.</p><p>The chain: Rotary International → District 3141 → Zone 2 → Rotaract Club of Dahisar Coast.</p>" },
    { test: (q) => /\b(rotary year|riy|rotary calendar)\b/.test(q), reply: () => "The Rotary year (RIY) runs from <b>1 July to 30 June</b>. We're in <b>RIY 2026–27</b>, the year of Cosmic Renaissance." },
    { test: (q) => /\b(rotaract|what is rotaract)\b/.test(q) && !/\brcdc\b|dahisar/.test(q),
      reply: () => "<p><b>Rotaract</b> began in 1968 as a Rotary youth programme and is now a global movement in 180+ countries, with ~9,000 clubs and ~120,000 members. Since 2019 it's a membership type of Rotary International itself.</p><p>Anyone 18 or older can join. RCDC is a Rotaract club in District 3141, sponsored by the Rotary Club of Mumbai Dahisar.</p>",
      chips: ["What is RCDC?", "How do I join?"] },
    { test: (q) => /\b(rotary international|rotary|ri)\b/.test(q),
      reply: () => "<p><b>Rotary International</b> is a global network of volunteers taking action in their communities and around the world. Founded in 1905 in Chicago by Paul Harris; 1.2 million+ members; HQ in Evanston, Illinois.</p><p>Its mission: provide service to others, promote integrity, and advance world understanding, goodwill and peace.</p>",
      chips: ["Rotary's areas of focus", "Who is the RI President?", "Rotary & Rotaract relationship"] },

    /* ----- About RCDC (broad) ----- */
    { test: (q) => /\b(rcdc|dahisar coast|what is (this|the) club|about (the )?club|about you|what do you do|tell me about|who are you guys|what is rotaract club)\b/.test(q),
      reply: () => `<p>The <b>Rotaract Club of Dahisar Coast (RCDC)</b> is the youth wing of the <b>Rotary Club of Mumbai Dahisar</b>: a youth-driven community built on friendship, leadership, service and impact.</p><p>We're part of Rotaract District 3141 (Zone 2). From social-impact campaigns and community service to workshops, creative collaborations and fellowship, we create spaces where members can learn, lead, connect and serve.</p><p>2026–27 is our 38th installation, under the theme <b>Cosmic Renaissance</b>.</p>`,
      chips: ["What's the theme?", "Who is the president?", "How do I join?"] }
  ];

  function memHtml(title) {
    const m = D.memories.find((x) => x.title === title);
    let html = `<p><b>${m.title}</b> · ${m.tag}</p><p>${m.text}</p>`;
    if (namedEvents[title]) html += `<p>Dates: ${namedEvents[title].map((e) => U.fmt(e.date)).join("; ")}.</p>`;
    return html;
  }

  /* ---------- retrieval fallback over all site text ---------- */
  const chunks = [];
  const addChunk = (text) => chunks.push({ text, toks: new Set(norm(text).trim().split(" ").filter((w) => w.length > 2)) });
  document.querySelectorAll("main p, main blockquote, main li, main h2, main h3").forEach((el) => { const t = el.textContent.trim(); if (t.length > 40) addChunk(t); });
  D.avenues.forEach((o) => addChunk(o.name + ". " + o.text));
  D.memories.forEach((m) => addChunk(m.title + ". " + m.text));
  Object.values(D.rotary).forEach((r) => r.body.forEach(addChunk));
  const STOP = new Set(["the", "and", "for", "are", "you", "what", "who", "how", "does", "did", "can", "about", "tell", "with", "this", "that", "your", "our", "rcdc", "club", "is", "was", "have", "has", "there", "which", "when", "where", "why", "any", "all", "from", "into", "please", "know", "want", "will", "would", "should", "could"]);
  function retrieve(q) {
    const qt = q.trim().split(" ").filter((w) => w.length > 2 && !STOP.has(w));
    if (!qt.length) return null;
    let best = null, bestScore = 0;
    chunks.forEach((c) => {
      let s = 0; qt.forEach((w) => { if (c.toks.has(w)) s += 1; else if (w.length > 4 && [...c.toks].some((t) => t.startsWith(w.slice(0, 5)))) s += 0.5; });
      s = s / Math.sqrt(qt.length);
      if (s > bestScore) { bestScore = s; best = c; }
    });
    return bestScore >= 0.9 ? best.text : null;
  }

  function answer(raw) {
    const q = norm(raw);
    if (q.trim().length === 0) return { html: "Say something, star! ✦" };
    // person names take priority when a name is clearly mentioned
    const found = findPeople(q);
    if (found.length === 1) return { html: personCard(found[0]), chips: ["Show the team", "Past presidents"] };
    if (found.length > 1 && found.length <= 4 && !/\b(president|secretary|treasurer)\b/.test(q)) return { html: "I found a few people with that name:" + listPeople(found) + "Ask me about any one by full name!" };
    for (const it of intents) {
      if (it.test(q)) {
        const html = it.reply(q);
        if (html) return { html, chips: it.chips };
      }
    }
    const r = retrieve(q);
    if (r) return { html: `<p>Here's what I found on that ✦</p><p>${esc(r)}</p>`, chips: ["How do I join?", "Next event?"] };
    return {
      html: `Hmm, that one's beyond my orbit 🪐 I know about RCDC, our theme, the team, past presidents, events, avenues, projects and the Rotary family. For anything else, reach the team at ${emailLink} or ${phoneLink}.`,
      chips: ["What is RCDC?", "Show the team", "Next event?", "How do I join?"]
    };
  }

  /* ---------- UI ---------- */
  const DEFAULT_CHIPS = ["What is RCDC?", "How do I join?", "Next event?", "Who is the president?", "What are the avenues?", "Past presidents", "Instagram", "Contact details"];
  function setChips(list) {
    chipsEl.innerHTML = (list || DEFAULT_CHIPS).map((c) => `<button type="button">${esc(c)}</button>`).join("");
  }
  function addMsg(html, who) {
    const d = document.createElement("div");
    d.className = "msg msg--" + who; d.innerHTML = html;
    body.appendChild(d); body.scrollTop = body.scrollHeight;
    return d;
  }
  let busy = false;
  function ask(text) {
    text = text.trim(); if (!text || busy) return;
    busy = true;
    addMsg(esc(text), "user");
    const t = addMsg('<span class="typing"><i></i><i></i><i></i></span>', "bot");
    t.style.padding = "0";
    const res = answer(text);
    const delay = Math.min(1400, 450 + res.html.length * 1.2);
    setTimeout(() => { t.remove(); addMsg(res.html, "bot"); setChips(res.chips); busy = false; }, delay);
  }

  let opened = false;
  function openChat(open) {
    box.classList.toggle("is-open", open);
    box.setAttribute("aria-hidden", !open);
    fab.setAttribute("aria-expanded", open);
    if (open && !opened) {
      opened = true;
      addMsg("<p>Hey there, star! ✦ I'm <b>Dahico</b>, RCDC's cosmic guide.</p><p>Ask me about the club, the <b>Cosmic Renaissance</b> theme, the team, our past presidents, events, avenues, or how to join.</p>", "bot");
      setChips();
    }
    if (open && window.matchMedia("(hover: hover)").matches) setTimeout(() => input.focus(), 350);
  }
  fab.addEventListener("click", () => openChat(!box.classList.contains("is-open")));
  $("#dahicoClose").addEventListener("click", () => openChat(false));
  document.querySelectorAll("[data-open-chat]").forEach((b) => b.addEventListener("click", () => openChat(true)));
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); input.value = ""; });
  chipsEl.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); });
  body.addEventListener("click", (e) => { const a = e.target.closest("[data-jump]"); if (a && window.innerWidth < 700) openChat(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("is-open")) openChat(false); });

  // Expose for testing in the browser console: Dahico.answer("how do i join")
  window.Dahico = { answer: (t) => answer(t).html };
})();
