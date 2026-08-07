# Screen

A lock-screen card-reveal tool for a mentalist, built as an installable PWA. It imitates a
stock iOS lock screen. You quietly enter a coded passcode; a named playing card silently
becomes the "wallpaper." You hand the phone to a spectator, and they see their card.

The design goal is that it must **not look like an app**. No branding, no splash, no
onboarding. At arm's length, in a dim room, it should be indistinguishable from a locked
phone.

---

## Install

It needs to be served over **HTTPS** (or `localhost`) for the service worker and offline
caching to work. `file://` opens fine for desktop rehearsal but the service worker won't
register there — that's expected and harmless.

### GitHub Pages (recommended)
1. Put all files (`index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`)
   in a repo, or a subfolder of one.
2. Enable Pages for that branch/folder. `start_url` and `scope` are relative, so it works
   from a subfolder.
3. On the **iPhone**, open the Pages URL in **Safari**.
4. Share button → **Add to Home Screen** → Add.
5. Launch it from the new home-screen icon (a dark, blank tile). It opens fullscreen with no
   Safari chrome.
6. Open it **once while online** so the service worker precaches everything. After that it
   runs fully offline — put the phone in airplane mode and it still works.

The home-screen icon and title are deliberately nondescript ("Screen", a dark tile). Rename
the icon on the home screen to anything forgettable ("Settings", a blank name) if you like.

---

## The code

Default is a **6-digit** passcode. **Only the first three digits mean anything** — the rest
are free decoys, so the code looks normal and you can vary it show to show.

```
V V   S   · · ·
│ │   │    └── ignored (decoys)
│ │   └─────── suit  (1 digit)
└─┴─────────── value (2 digits, always two)
```

### Value — two digits

| code | card | code | card | code | card | code | card |
|---|---|---|---|---|---|---|---|
| 01 | Ace | 02 | Two | 03 | Three | 04 | Four |
| 05 | Five | 06 | Six | 07 | Seven | 08 | Eight |
| 09 | Nine | 10 | Ten | 11 | Jack | 12 | Queen |
| 13 | King | | | | | | |

### Suit — one digit (default order **CHaSeD**, the card-magic standard)

| digit | suit |
|---|---|
| 1 | ♣ Clubs |
| 2 | ♥ Hearts |
| 3 | ♠ Spades |
| 4 | ♦ Diamonds |

Two alternate orders are selectable in Setup if you prefer them:

| order | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **CHaSeD** (default) | ♣ Clubs | ♥ Hearts | ♠ Spades | ♦ Diamonds |
| Bridge | ♠ Spades | ♥ Hearts | ♦ Diamonds | ♣ Clubs |
| Alphabetical | ♣ Clubs | ♦ Diamonds | ♥ Hearts | ♠ Spades |

### Worked examples (CHaSeD)

| you want | first 3 digits | full code (decoys are anything) |
|---|---|---|
| Ace of Spades | `013` | `013428` |
| Queen of Hearts | `122` | `122905` |
| King of Clubs | `131` | `131000` |
| Ten of Diamonds | `104` | `104716` |

**4-digit mode** (optional, in Setup): the code is `VVS` + one free decoy digit, e.g.
`1223` = Queen of Hearts.

Any code whose value isn't `01–13` or whose suit isn't `1–4` is **not** a card and triggers
the wrong-passcode behaviour.

---

## Performing

1. **Lock screen** is the resting state — looks like any locked phone.
2. Tap the screen (or swipe up) → the **passcode keypad** appears, with the wallpaper
   blurred behind it, exactly like iOS.
3. Enter your coded passcode.
   - A valid card **arms** silently. If *Sleep after arming* is on (default), the screen
     goes **black**, as if it went to sleep.
   - Hand the phone over. **The spectator taps it** and it "wakes" to their card sitting on
     the wallpaper. That handoff is the beat that sells it.
   - A code that isn't a card does the real iOS thing: the dots **shake**, a double buzz,
     and it clears. A spectator who jabs a random code gets exactly what a real phone gives.
4. To go again, reset (see below) and arm the next card.

### Setup
Enter the **setup passcode** (default `000000`) on the keypad to open Settings. It's styled
like iOS Settings and is the only screen meant to look like software. From there:

- passcode length (6 or 4)
- setup passcode
- **Lock screen style** — Auto-detect (default), iPhone, or Android (see below)
- **Fake status bar** (default on) — drawn signal/Wi-Fi/battery at the top (see below)
- **Wallpaper photo** — pick a photo from the device to use as the lock-screen background,
  or return to the dark default (see below)
- suit order (CHaSeD / Bridge / Alphabetical)
- **Sleep after arming** (default on)
- **Multi-card sequence** (default off) — queue several cards for a routine (see below)
- **Show card name** under the card (default off — leave off in performance)
- **Wrong-code shake** (default on)
- **Wrong-code lockout** (default on) — the iOS "iPhone Unavailable" screen (see below)
- **Show notifications** — fake lock-screen notifications for realism (default on), plus
  **editable** app name / message / time for each (see below)
- a live reference showing the current format, the value table, the current suit digits, and
  a worked Ace-of-Spades example

### iPhone vs Android look
The lock screen auto-detects the device and renders the matching style: an iOS lock screen
on iPhone/iPad, and a Pixel-style Android lock screen (two-line clock, Material notification
pills, phone/camera shortcuts) on Android. You can force one look in Setup → *Lock screen
style* — handy for rehearsing on a desktop, which otherwise defaults to the iOS look.

### Fake status bar
A drawn status bar (cellular signal, Wi-Fi, battery) sits at the very top, styled per
platform — Android also shows a battery percentage. On a real *installed* iPhone the OS draws
its own status bar there (with the real time and battery), so the app **automatically hides
its fake one** in that case to avoid doubling up; the fake bar is what you see in the browser
and on Android. If the battery API is available (Android/Chrome) it shows the real charge;
otherwise a plausible fixed level. Toggle it off in Setup.

### Fake notifications
A few believable, generic notifications sit on the resting lock screen to sell the illusion.
They're **automatically hidden the moment a card is armed**, so the reveal is always clean.
Toggle them off entirely in Setup, or **edit each one** (app name, message, time) in the
Notifications section — leave a row blank to drop it. Keep them believable-but-generic; don't
impersonate a real person or brand. (Defaults: Messages / Reminders / Calendar.)

### Wrong-code lockout
After 5 wrong codes the screen shows the real iOS **"iPhone Unavailable — Try again in 0:59"**
countdown (Android shows a 30-second "Try again later"), blocking further entry until it
elapses. It's more authentic *and* a built-in stall if a spectator jabs at random codes.
A successful card or the setup passcode resets the counter, and the **panic reset clears the
lockout instantly** — so it can't strand you mid-show. Toggle it off in Setup if you'd rather
just have the shake.

### Multi-card sequence (for routines)
Off by default. When on, entering a card code **adds it to a queue** (a light buzz confirms)
and returns you to the keypad to enter the next one. When the queue is ready, tap **Cancel**
to begin — it arms the first card and sleeps as usual. After the reveal, **tap the top-right
corner** to silently advance to the next queued card; it wraps around after the last. (On
desktop, the **→** key advances.) The panic reset clears the queue.

### Photo wallpaper
By default the app draws its own dark wallpaper. For maximum cover you can set your **own
photo** as the lock-screen background (Setup → *Wallpaper photo* → Choose…), ideally the same
image as your real phone's lock screen. The photo is downscaled and stored on the device
(`localStorage`), so it stays fully offline — no upload, no network. During a reveal the
wallpaper (photo or default) is darkened automatically so the card always reads clearly.
Tap *Dark default* to remove the photo.

### The cards are on-device
The 52 card faces are not image files — they're drawn as vector graphics by the app itself,
in code. The service worker caches that code on the first visit, so every card renders
offline with no network requests and nothing to download. Airplane mode changes nothing.

Settings are saved on the device and survive relaunch.

### The panic button
**Press and hold the bottom-left corner for 3 seconds**, from any screen, to reset instantly
to a clean lock screen (no card armed). The phone gives a short buzz when it fires, so you
know it worked without looking. Use it if you fumble a code or need to reset between
spectators.

### Desktop rehearsal
- Click to open the keypad; number keys act as the keypad.
- **Esc** = the panic reset.
- Tap/click the black sleep screen to wake it.

---

## Notes & tips

- **Match the phone's real clock style.** The clock and date use the system font and update
  live, so they read as real. On the actual device the system font *is* the real thing.
- **Set your phone's real wallpaper to something dark and plain.** The app draws its own dark
  wallpaper, but keeping your OS lock screen dark too means nothing jars if the app is ever
  backgrounded.
- **Rehearse the handoff.** With *Sleep after arming* on, the screen is black at the moment
  you hand it over — that's intentional. The spectator waking it themselves is the strongest
  version of the reveal.
- **Vary the decoys** between shows so a repeat spectator never sees the same "passcode."
- Fully offline after the first online load. No network requests at runtime, no external
  fonts, images, or CDNs — safe in a venue with no signal and airplane mode on.

---

## Files

| file | purpose |
|---|---|
| `index.html` | the entire app — inline styles and script, all four screens, card SVGs |
| `manifest.json` | PWA manifest (fullscreen, portrait, black theme, relative scope) |
| `sw.js` | service worker, cache-first, precaches all files for offline use |
| `icon-192.png`, `icon-512.png` | deliberately dark, blank home-screen icons |
