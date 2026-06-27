╔════════════════════════════════════════════════════════╗
║   MAISON DE LA ROUE — Casino Party App                 ║
║   FR · EN · PT  ·  Roulette · Liar's Bar               ║
╚════════════════════════════════════════════════════════╝

QUICK START
-----------
1. Install Node.js (https://nodejs.org) — version 18 or newer
2. Open a terminal in this folder
3. Run:   node server.js
4. The terminal will print URLs like:  http://192.168.x.x:3000
5. On the TV / big screen, open:       http://<that-ip>:3000/display
   (For Liar's Bar TV view:            http://<that-ip>:3000/liarbar)
6. On phones (same WiFi), open:        http://<that-ip>:3000
   They'll automatically see the mobile player UI.

PAGES
-----
  /              → Menu (desktop) or Phone UI (mobile)
  /phone         → Mobile player UI (Roulette + Liar's Bar)
  /display       → TV: Roulette table
  /liarbar       → TV: Liar's Bar (with revolver animation + gunshot)
  /leaderboard   → TV: Live chip ranking from "Mon Coffre"
  /rules         → Game rules (FR/EN/PT)
  /banque        → Winnings calculator
  /coffre        → "My Vault" — personal chip tracker, saved by server
  /admin         → Game Master panel (password: casino2026)

LANGUAGE
--------
Top-right corner of every page: FR / EN / PT buttons.
Choice is saved on each device.

LIAR'S BAR (Steam rules)
------------------------
The cards are PHYSICAL (real life). The app handles:
  - Whose turn it is, what rank to declare
  - 1-4 cards count selection
  - Believe / Bluff buttons
  - Players tap to declare the round-loser
  - 🔫 Revolver: fresh per round (1/6 → 1/5 → 1/4 …)
  - Gunshot sound + flash + screen-shake on BANG
  - Last survivor wins

ADMIN PASSWORD: casino2026  (change in admin.html + server.js)
STARTING CHIPS: 500          (change at top of server.js)

DATA
----
"Mon Coffre" entries are saved to coffres.json (created on first save).
Delete this file to reset everyone's tracker.

Have fun — Bonne soirée — Boa noite!
