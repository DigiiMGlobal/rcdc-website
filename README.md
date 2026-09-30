# RCDC Website · Rotaract Club of Dahisar Coast (RIY 2026–27)

A one-page site with the Cosmic Renaissance theme, two mini games and **Dahico**, the built-in chatbot.

## Open it in VS Code

1. Unzip this folder.
2. In VS Code: **File → Open Folder…** and pick `rcdc-website`.
3. Install the **Live Server** extension (by Ritwick Dey) if you don't have it.
4. Right-click `index.html` → **Open with Live Server**.

Use Live Server rather than double-clicking the file: the Instagram reels need the page served over http to load.

## Page order

Home → 36+ years transition (reveals the team photo) → About → Theme (film, Our Universe, logo meaning) → Avenues → Impact (stories, moments) → Team (Leadership → Core Team → Board of Directors) → Legacy (Hall of Fame) → Glimpse (Instagram reels) → Play (Spin the Wheel, Memory Match) → Calendar → Rotary Family → Contact

## Files

```
rcdc-website/
├── index.html        ← page structure and section copy
├── css/style.css     ← design system: colours, type, spacing, animation, mobile
├── js/data.js        ← ALL editable content (team, avenues, past presidents, reels, calendar, contact)
├── js/main.js        ← hero, scroll effects, avenues, team, timeline, reels, calendar, gallery
├── js/games.js       ← Spin the Wheel + RCDC Memory Match
├── js/dahico.js      ← the Dahico chatbot
└── assets/
    ├── fonts/        ← self-hosted fonts (no Google Fonts needed, works offline)
    ├── images/       ← event photos (each in two sizes: full and -800 for phones)
    ├── team/         ← portraits
    └── video/        ← theme.mp4 (pop-up film with sound) + bg-loop.mp4 (silent background)
```

## Common edits (all in `js/data.js`)

| To change… | Edit |
|---|---|
| Core Team / Board of Directors | `core` and `bod` |
| Avenue text or directors | `avenues` (the `leads` names must match the team lists) |
| Hall of Fame | `pastPresidents` (set `current: true` on the sitting president) |
| Instagram reels | `reels`: the ID from each reel link, e.g. `instagram.com/reel/DdymC56q8eu/` → `DdymC56q8eu` |
| Events | `events` (`YYYY-MM-DD`). Done/Upcoming updates by itself from today's date |
| Photo wall | `gallery`: add `name.jpg` and `name-800.jpg` to `assets/images/` |
| Contact / Instagram handle | `contact` |

Dahico reads the same file, so its answers update automatically.

## Going live

Upload the whole folder to any static host (Netlify drag-and-drop, Vercel, GitHub Pages, or your domain hosting). No server or database needed.
