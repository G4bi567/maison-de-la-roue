// ═══════════════════════════════════════════════════════════════════
//  MAISON DE LA ROUE — Server
//  Zero deps · WebSocket hand-rolled · Roulette + Liar's Bar (Steam rules)
// ═══════════════════════════════════════════════════════════════════

const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const COFFRES_FILE = path.join(ROOT, 'coffres.json');

const STARTING_CHIPS = 500;
const BET_TIMER_MS = 30000;       // 30s
const SPIN_DURATION_MS = 6500;    // 6.5s
const PAYOUT_DURATION_MS = 5000;  // 5s display before next round

// ═══ Roulette wheel ═══
const WHEEL_ORDER = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const RED_SET = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const colorOf = n => n === 0 ? 'green' : RED_SET.has(n) ? 'red' : 'black';

// ═══ Player colors ═══
const PLAYER_COLORS = ['#f0cc5a','#ef3a58','#3b8bff','#2fd490','#b06dff','#ff8a3a','#5ce1e6','#ff6dc7'];
let colorCursor = 0;

// ═══ State ═══
const clients = new Map();   // ws -> { id, role, name }
const rouletteState = {
  phase: 'betting',   // betting | spinning | payout
  players: {},        // id -> { name, color, chips }
  bets: {},           // id -> [{kind, key, amount}]
  history: [],        // last spins {number, color}
  mode: 'virtual',    // virtual | real
  spinDeadline: Date.now() + BET_TIMER_MS,
  lastResult: null,
  lastClearedAt: 0,
};

const liarState = {
  phase: 'lobby',      // lobby | playing | shooting | ended
  players: {},         // id -> { name, avatar, color, eliminated, revolver: { chambers, bulletIdx } }
  order: [],
  currentRank: null,
  shooter: null,
  needLoserPick: false,
  round: 1,
  log: [],
};

// Give a fresh 6-chamber revolver to a player
function newRevolver() { return { chambers: 6, bulletIdx: Math.floor(Math.random() * 6) }; }
// After surviving a shot: remove one chamber (same bullet stays, now 1/5, 1/4...)
function survivedRevolver(rev) {
  const chambers = Math.max(2, rev.chambers - 1);
  return { chambers, bulletIdx: Math.floor(Math.random() * chambers) };
}

const RANKS = ['♠ Pique', '♣ Trèfle', '♥ Cœur', '♦ Carreau'];
const RANK_NAMES = { '🔴 Rouge': 'Rouge', '⚫ Noir': 'Noir' };

// ═══════════════════════════════════════════════════════════════════
//  Mini-games (Slot, Lucky Number, War)
// ═══════════════════════════════════════════════════════════════════
const miniGames = {
  mode: 'idle',         // idle | slot | lucky | war
  phase: 'idle',        // idle | betting | playing | result
  pot: 0,
  bets: {},             // id -> { amount, pick? }   (pick used by lucky)
  result: null,         // game-specific
  startedAt: 0,
  // SLOT
  slotPlayer: null,     // id of who triggered
  slotReels: null,      // ['🍒','💎','7️⃣']
  // LUCKY
  luckyTarget: null,    // 1-100
  // WAR
  warCards: {},         // id -> { rank, suit } (filled when card flipped)
  warWinnerIds: [],     // id(s) who win after this round
  // HORSE
  horsePositions: {},   // horseId -> 0..HORSE_TRACK_LEN
  horseWinner: null,    // horseId
};

const SLOT_SYMBOLS = ['🍒','🍋','🔔','💎','⭐','7️⃣'];
const SLOT_PAYOUTS = { '7️⃣':10, '💎':8, '⭐':6, '🔔':4, '🍋':3, '🍒':2 }; // 3-in-a-row multiplier on bet
const CARD_RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const CARD_SUITS = ['♠','♥','♦','♣'];
function cardValue(r){ return CARD_RANKS.indexOf(r); }

const HORSES = [
  { id:'h1', name:'Éclair',     emoji:'🐎', color:'#ff6170' },
  { id:'h2', name:'Tonnerre',   emoji:'🐴', color:'#5ec98a' },
  { id:'h3', name:'Mistral',    emoji:'🦓', color:'#f0cc5a' },
  { id:'h4', name:'Crépuscule', emoji:'🦄', color:'#9d4fd4' },
];
const HORSE_TRACK_LEN = 30;

function buildMiniGamesMsg() {
  return {
    type: 'mini-state',
    mode: miniGames.mode,
    phase: miniGames.phase,
    pot: miniGames.pot,
    bets: miniGames.bets,
    result: miniGames.result,
    slotPlayer: miniGames.slotPlayer,
    slotReels: miniGames.slotReels,
    luckyTarget: miniGames.luckyTarget,
    warCards: miniGames.warCards,
    warWinnerIds: miniGames.warWinnerIds,
    horsePositions: miniGames.horsePositions,
    horseWinner: miniGames.horseWinner,
    horses: HORSES,
    horseTrackLen: HORSE_TRACK_LEN,
    players: Object.fromEntries(Object.entries(rouletteState.players).map(([id,p])=>[id,{name:p.name,avatar:p.avatar,color:p.color,chips:p.chips}])),
  };
}
function broadcastMini() { broadcast(buildMiniGamesMsg()); }

function resetMini(newMode) {
  miniGames.mode = newMode || 'idle';
  miniGames.phase = newMode ? 'betting' : 'idle';
  miniGames.pot = 0;
  miniGames.bets = {};
  miniGames.result = null;
  miniGames.startedAt = Date.now();
  miniGames.slotPlayer = null;
  miniGames.slotReels = null;
  miniGames.luckyTarget = null;
  miniGames.warCards = {};
  miniGames.warWinnerIds = [];
  miniGames.horsePositions = {};
  miniGames.horseWinner = null;
}

function handleMiniBet(sock, msg) {
  const info = clients.get(sock); if (!info || !info.id) return;
  if (miniGames.phase !== 'betting') return;
  const id = info.id;
  const p = rouletteState.players[id]; if (!p) return;
  const amount = Math.max(1, Math.min(p.chips, parseInt(msg.amount,10) || 0));
  if (!amount) return;
  const pick = msg.pick;  // for lucky number (1-100)
  // refund any existing bet first
  if (miniGames.bets[id]) {
    p.chips += miniGames.bets[id].amount;
    miniGames.pot -= miniGames.bets[id].amount;
  }
  p.chips -= amount;
  miniGames.pot += amount;
  miniGames.bets[id] = { amount, pick };
  broadcastMini();
  broadcastRouletteState();
}

function handleMiniStart(sock, msg) {
  // Admin starts a new game: { mode: 'slot' | 'lucky' | 'war' }
  if (!isAdminSock(sock)) return;
  const mode = msg.mode;
  if (!['slot','lucky','war','horse'].includes(mode)) return;
  resetMini(mode);
  if (mode === 'lucky') miniGames.luckyTarget = 1 + Math.floor(Math.random()*100);
  if (mode === 'horse') {
    for (const h of HORSES) miniGames.horsePositions[h.id] = 0;
  }
  broadcastMini();
}

function handleMiniResolve(sock) {
  // Admin closes betting and resolves
  if (!isAdminSock(sock)) return;
  if (miniGames.phase !== 'betting') return;
  miniGames.phase = 'playing';
  broadcastMini();
  if (miniGames.mode === 'slot') resolveSlot();
  else if (miniGames.mode === 'lucky') resolveLucky();
  else if (miniGames.mode === 'war') resolveWar();
  else if (miniGames.mode === 'horse') resolveHorse();
}

function isAdminSock(sock) {
  const info = clients.get(sock);
  return info && info.role === 'admin';
}

function resolveSlot() {
  // Spin: each better gets their own spin (independent payouts)
  // Simpler: one shared spin, all betters share or lose based on result
  // Going with shared spin = more dramatic on TV.
  const reels = [
    SLOT_SYMBOLS[Math.floor(Math.random()*SLOT_SYMBOLS.length)],
    SLOT_SYMBOLS[Math.floor(Math.random()*SLOT_SYMBOLS.length)],
    SLOT_SYMBOLS[Math.floor(Math.random()*SLOT_SYMBOLS.length)],
  ];
  setTimeout(() => {
    miniGames.slotReels = reels;
    // Determine multiplier
    let mult = 0;
    if (reels[0]===reels[1] && reels[1]===reels[2]) mult = SLOT_PAYOUTS[reels[0]] || 5;
    else if (reels[0]===reels[1] || reels[1]===reels[2] || reels[0]===reels[2]) mult = 1; // matched pair = chips back (1x)
    // Payout each better
    const payouts = {};
    for (const [id, bet] of Object.entries(miniGames.bets)) {
      const win = bet.amount * mult;
      if (win > 0 && rouletteState.players[id]) {
        rouletteState.players[id].chips += win;
        payouts[id] = win;
      } else payouts[id] = 0;
    }
    miniGames.result = { reels, mult, payouts };
    miniGames.phase = 'result';
    broadcastMini();
    broadcastRouletteState();
    broadcastLeaderboard();
  }, 3500);  // 3.5s spin time
}

function resolveLucky() {
  const target = miniGames.luckyTarget;
  // Find pick closest to target
  let best = null, bestDist = Infinity;
  for (const [id, bet] of Object.entries(miniGames.bets)) {
    if (bet.pick == null) continue;
    const d = Math.abs(bet.pick - target);
    if (d < bestDist) { bestDist = d; best = id; }
    else if (d === bestDist) { best = null; } // tie = split? we'll just take first
  }
  // Find ALL winners with same min distance (handles ties as split pot)
  const winners = Object.entries(miniGames.bets)
    .filter(([id,bet]) => bet.pick != null && Math.abs(bet.pick - target) === bestDist)
    .map(([id]) => id);
  const share = winners.length ? Math.floor(miniGames.pot / winners.length) : 0;
  const payouts = {};
  for (const id of winners) {
    if (rouletteState.players[id]) {
      rouletteState.players[id].chips += share;
      payouts[id] = share;
    }
  }
  miniGames.result = { target, winners, payouts, distance: bestDist };
  miniGames.phase = 'result';
  setTimeout(() => { broadcastMini(); broadcastRouletteState(); broadcastLeaderboard(); }, 800); // small reveal delay
}

function resolveWar() {
  // Deal a random card to each better
  const cards = {};
  for (const id of Object.keys(miniGames.bets)) {
    cards[id] = { rank: CARD_RANKS[Math.floor(Math.random()*CARD_RANKS.length)], suit: CARD_SUITS[Math.floor(Math.random()*CARD_SUITS.length)] };
  }
  miniGames.warCards = cards;
  // Find highest
  let maxVal = -1;
  for (const c of Object.values(cards)) maxVal = Math.max(maxVal, cardValue(c.rank));
  const winners = Object.entries(cards).filter(([,c]) => cardValue(c.rank) === maxVal).map(([id])=>id);
  const share = winners.length ? Math.floor(miniGames.pot / winners.length) : 0;
  const payouts = {};
  for (const id of winners) {
    if (rouletteState.players[id]) {
      rouletteState.players[id].chips += share;
      payouts[id] = share;
    }
  }
  miniGames.warWinnerIds = winners;
  miniGames.result = { winners, payouts };
  miniGames.phase = 'result';
  setTimeout(() => { broadcastMini(); broadcastRouletteState(); broadcastLeaderboard(); }, 1500); // card flip drama
}

function resolveHorse() {
  // Race loop: each tick, each horse advances by 0-3 randomly
  // Broadcast positions every tick. First to HORSE_TRACK_LEN wins.
  let winnerHorse = null;
  const tick = () => {
    if (winnerHorse) return;
    for (const h of HORSES) {
      // Random advance 0-3 spaces per tick
      miniGames.horsePositions[h.id] += Math.floor(Math.random() * 4);
      if (miniGames.horsePositions[h.id] >= HORSE_TRACK_LEN) {
        miniGames.horsePositions[h.id] = HORSE_TRACK_LEN;
        if (!winnerHorse) winnerHorse = h.id;
      }
    }
    broadcastMini();
    if (winnerHorse) {
      // Finish: pay out bets on winning horse
      const winners = Object.entries(miniGames.bets).filter(([,b]) => b.pick === winnerHorse).map(([id])=>id);
      const totalWinnerStake = winners.reduce((sum, id) => sum + miniGames.bets[id].amount, 0);
      const payouts = {};
      if (totalWinnerStake > 0) {
        // proportional split of pot
        for (const id of winners) {
          const share = Math.floor(miniGames.pot * (miniGames.bets[id].amount / totalWinnerStake));
          if (rouletteState.players[id]) {
            rouletteState.players[id].chips += share;
            payouts[id] = share;
          }
        }
      }
      miniGames.horseWinner = winnerHorse;
      miniGames.result = { winnerHorse, winners, payouts };
      miniGames.phase = 'result';
      setTimeout(() => { broadcastMini(); broadcastRouletteState(); broadcastLeaderboard(); }, 1500);
    } else {
      setTimeout(tick, 350);
    }
  };
  setTimeout(tick, 1000);  // 1s build-up before they start
}

// ═══════════════════════════════════════════════════════════════════
//  Coffres storage (local JSON file, or Supabase if env vars set)
// ═══════════════════════════════════════════════════════════════════
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);
let coffres = {};

function loadCoffres() {
  // local file path always works as fallback / dev
  try {
    if (fs.existsSync(COFFRES_FILE)) coffres = JSON.parse(fs.readFileSync(COFFRES_FILE, 'utf8'));
  } catch (e) { console.error('Failed loading coffres:', e); coffres = {}; }
}

function saveCoffresLocal() {
  try { fs.writeFileSync(COFFRES_FILE, JSON.stringify(coffres, null, 2)); }
  catch (e) { console.error('Failed saving coffres locally:', e); }
}

// Supabase REST helpers (no SDK, no deps)
function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + '/rest/v1' + path);
    const opts = {
      method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal',
      },
    };
    const lib = url.protocol === 'https:' ? require('https') : require('http');
    const req = lib.request(url, opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('Supabase ' + res.statusCode + ': ' + data));
        try { resolve(data ? JSON.parse(data) : null); } catch (e) { resolve(null); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function loadCoffresSupabase() {
  try {
    const rows = await supabaseRequest('GET', '/coffres?select=*');
    coffres = {};
    if (Array.isArray(rows)) {
      for (const r of rows) {
        coffres[r.id] = { name: r.name, chips: r.chips || {}, history: r.history || [], updatedAt: Number(r.updated_at) || 0 };
      }
    }
    console.log('Loaded ' + Object.keys(coffres).length + ' coffres from Supabase');
  } catch (e) { console.error('Supabase load failed, falling back to local:', e.message); loadCoffres(); }
}

async function saveCoffreSupabase(id, data) {
  try {
    await supabaseRequest('POST', '/coffres', {
      id, name: data.name, chips: data.chips, history: data.history, updated_at: data.updatedAt,
    });
  } catch (e) { console.error('Supabase save failed:', e.message); }
}

function saveCoffres(specificId) {
  saveCoffresLocal();
  if (USE_SUPABASE && specificId && coffres[specificId]) {
    saveCoffreSupabase(specificId, coffres[specificId]);
  }
}

if (USE_SUPABASE) {
  console.log('▶ Supabase storage enabled');
  loadCoffresSupabase();
} else {
  loadCoffres();
}

// ═══════════════════════════════════════════════════════════════════
//  HTTP server (serves static files + REST endpoints)
// ═══════════════════════════════════════════════════════════════════
const MIME = {
  '.html':'text/html;charset=utf-8',
  '.js'  :'application/javascript;charset=utf-8',
  '.css' :'text/css;charset=utf-8',
  '.json':'application/json;charset=utf-8',
};
function serveFile(res, filepath, statusCode=200) {
  fs.readFile(filepath, (err, data) => {
    if (err) { res.writeHead(404); res.end('404'); return; }
    const ext = path.extname(filepath);
    res.writeHead(statusCode, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}
function isMobile(ua) { return /Mobile|Android|iPhone|iPad/i.test(ua || ''); }

const server = http.createServer((req, res) => {
  const u = req.url.split('?')[0];

  // REST: coffre
  if (u.startsWith('/api/coffre/')) {
    const id = u.slice('/api/coffre/'.length);
    if (req.method === 'GET') {
      const data = coffres[id];
      if (!data) { res.writeHead(404); res.end('{}'); return; }
      res.writeHead(200, { 'Content-Type': MIME['.json'] });
      res.end(JSON.stringify(data));
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', c => { body += c; if (body.length > 200000) req.destroy(); });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          coffres[id] = { name: String(data.name||'').slice(0,30), chips: data.chips||{}, history: (data.history||[]).slice(0,50), updatedAt: Date.now() };
          saveCoffres(id);
          res.writeHead(200, { 'Content-Type': MIME['.json'] });
          res.end(JSON.stringify({ ok:true }));
          broadcastLeaderboard();
        } catch (e) { res.writeHead(400); res.end('{}'); }
      });
      return;
    }
  }

  // REST: leaderboard
  if (u === '/api/leaderboard' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': MIME['.json'] });
    res.end(JSON.stringify({ leaderboard: buildLeaderboard() }));
    return;
  }

  // Routes
  let file;
  if (u === '/' )           file = isMobile(req.headers['user-agent']) ? 'phone.html' : 'index.html';
  else if (u === '/phone')      file = 'phone.html';
  else if (u === '/display')    file = 'display.html';
  else if (u === '/liarbar')    file = 'liarbar.html';
  else if (u === '/admin')      file = 'admin.html';
  else if (u === '/coffre')     file = 'coffre.html';
  else if (u === '/leaderboard') file = 'leaderboard.html';
  else if (u === '/rules')      file = 'rules.html';
  else if (u === '/banque')     file = 'banque.html';
  else if (u === '/games')      file = 'games.html';
  else if (u === '/i18n.js')        file = 'i18n.js';
  else if (u === '/lang-switcher.js') file = 'lang-switcher.js';
  else if (u === '/qr.js')          file = 'qr.js';
  else { res.writeHead(404); res.end('404 not found'); return; }

  serveFile(res, path.join(ROOT, file));
});

// ═══════════════════════════════════════════════════════════════════
//  WebSocket (hand-rolled, no deps)
// ═══════════════════════════════════════════════════════════════════
function wsAccept(key) {
  return crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
}
function wsEncode(data) {
  const payload = Buffer.from(data);
  const len = payload.length;
  let header;
  if (len < 126) header = Buffer.from([0x81, len]);
  else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81; header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81; header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, payload]);
}
function wsDecode(buf) {
  // Returns { text, rest } or null if incomplete
  if (buf.length < 2) return null;
  const second = buf[1];
  const masked = (second & 0x80) === 0x80;
  let len = second & 0x7f;
  let offset = 2;
  if (len === 126) { if (buf.length < 4) return null; len = buf.readUInt16BE(2); offset = 4; }
  else if (len === 127) { if (buf.length < 10) return null; len = Number(buf.readBigUInt64BE(2)); offset = 10; }
  let mask;
  if (masked) { if (buf.length < offset + 4) return null; mask = buf.slice(offset, offset + 4); offset += 4; }
  if (buf.length < offset + len) return null;
  const payload = Buffer.alloc(len);
  for (let i = 0; i < len; i++) payload[i] = masked ? buf[offset + i] ^ mask[i % 4] : buf[offset + i];
  return { text: payload.toString('utf8'), rest: buf.slice(offset + len) };
}

server.on('upgrade', (req, sock) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) { sock.destroy(); return; }
  sock.write([
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    'Sec-WebSocket-Accept: ' + wsAccept(key),
    '', ''
  ].join('\r\n'));

  let buf = Buffer.alloc(0);
  sock.on('data', chunk => {
    buf = Buffer.concat([buf, chunk]);
    while (true) {
      const frame = wsDecode(buf);
      if (!frame) break;
      buf = frame.rest;
      try { onMessage(sock, JSON.parse(frame.text)); }
      catch (e) { /* ignore bad frames */ }
    }
  });
  sock.on('close', () => onClose(sock));
  sock.on('error', () => onClose(sock));

  clients.set(sock, { id: null, role: null });
});

function send(sock, obj) {
  try { sock.write(wsEncode(JSON.stringify(obj))); }
  catch (e) {}
}
function broadcast(obj, filterFn) {
  for (const [sock, info] of clients) {
    if (filterFn && !filterFn(info)) continue;
    send(sock, obj);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  Message handling
// ═══════════════════════════════════════════════════════════════════
function onMessage(sock, msg) {
  const info = clients.get(sock);
  if (!info) return;

  switch (msg.type) {
    case 'hello': handlePhoneHello(sock, msg); break;
    case 'display-hello':
      info.role = 'display';
      send(sock, buildRouletteStateMsg());
      send(sock, { type:'leaderboard', leaderboard: buildLeaderboard() });
      break;
    case 'liar-display-hello':
      info.role = 'liar-display';
      send(sock, buildLiarStateMsg());
      break;
    case 'mini-display-hello':
      info.role = 'mini-display';
      send(sock, buildMiniGamesMsg());
      break;
    case 'admin-hello':
      if (msg.password !== 'casino2026') { send(sock, { type:'admin-denied' }); return; }
      info.role = 'admin';
      send(sock, buildRouletteStateMsg());
      send(sock, buildMiniGamesMsg());
      break;
    case 'place-bet': handlePlaceBet(sock, msg); break;
    case 'undo-bet':  handleUndoBet(sock); break;

    case 'force-spin':         if (info.role==='admin') triggerSpin(); break;
    case 'admin-toggle-mode':  if (info.role==='admin') { rouletteState.mode = (msg.mode==='real'?'real':'virtual'); broadcastRouletteState(); } break;
    case 'admin-submit-result':if (info.role==='admin') triggerSpin(parseInt(msg.winner)); break;
    case 'admin-set-chips':    if (info.role==='admin' && rouletteState.players[msg.target]) { rouletteState.players[msg.target].chips = Math.max(0, parseInt(msg.amount)||0); broadcastRouletteState(); } break;
    case 'admin-kick':         if (info.role==='admin') {
      delete rouletteState.players[msg.target];
      delete rouletteState.bets[msg.target];
      broadcastRouletteState();
    } break;

    // ─── Liar's Bar messages ───
    case 'liar-join':           handleLiarJoin(sock, msg); break;
    case 'liar-start':          handleLiarStart(); break;
    case 'liar-play':           handleLiarPlay(sock, msg); break;
    case 'liar-believe':        handleLiarBelieve(sock); break;
    case 'liar-bluff':          handleLiarBluff(sock, msg); break;
    case 'liar-declare-loser':  handleLiarDeclareLoser(msg); break;
    case 'liar-pull-trigger':   handleLiarPullTrigger(sock); break;
    case 'liar-reset':          resetLiarGame(); break;

    // ─── Mini-games (Slot, Lucky, War) ───
    case 'mini-start':   handleMiniStart(sock, msg); break;
    case 'mini-bet':     handleMiniBet(sock, msg); break;
    case 'mini-resolve': handleMiniResolve(sock); break;
    case 'mini-end':     if (info.role==='admin') { resetMini(null); broadcastMini(); } break;
  }
}

function onClose(sock) {
  clients.delete(sock);
  // Note: we don't remove the player from state — they may reconnect
}

// ═══════════════════════════════════════════════════════════════════
//  Phone (roulette) handlers
// ═══════════════════════════════════════════════════════════════════
function handlePhoneHello(sock, msg) {
  const info = clients.get(sock);
  if (!info) return;
  const id = String(msg.id || '').slice(0, 60);
  const name = String(msg.name || '').trim().slice(0, 14) || 'Anonymous';
  const avatar = String(msg.avatar || '🎩').slice(0, 4);
  if (!id) return;
  info.id = id; info.role = 'phone';
  if (!rouletteState.players[id]) {
    rouletteState.players[id] = { name, avatar, color: PLAYER_COLORS[colorCursor++ % PLAYER_COLORS.length], chips: STARTING_CHIPS };
    rouletteState.bets[id] = [];
  } else {
    rouletteState.players[id].name = name;
    rouletteState.players[id].avatar = avatar;
  }
  send(sock, buildRouletteStateMsg());
  send(sock, buildLiarStateMsg());
  send(sock, buildMiniGamesMsg());
  broadcastRouletteState();
}

function handlePlaceBet(sock, msg) {
  const info = clients.get(sock); if (!info || !info.id) return;
  if (rouletteState.phase !== 'betting') return;
  const player = rouletteState.players[info.id]; if (!player) return;
  const amount = parseInt(msg.amount) || 0;
  if (amount <= 0 || amount > player.chips) return;
  const kind = msg.kind === 'number' ? 'number' : 'outside';
  const key = String(msg.key);
  player.chips -= amount;
  rouletteState.bets[info.id] = rouletteState.bets[info.id] || [];
  rouletteState.bets[info.id].push({ kind, key, amount });
  broadcastRouletteState();
}

function handleUndoBet(sock) {
  const info = clients.get(sock); if (!info || !info.id) return;
  if (rouletteState.phase !== 'betting') return;
  const bets = rouletteState.bets[info.id]; if (!bets || !bets.length) return;
  const last = bets.pop();
  const player = rouletteState.players[info.id];
  if (player) player.chips += last.amount;
  broadcastRouletteState();
}

// ═══════════════════════════════════════════════════════════════════
//  Roulette spin
// ═══════════════════════════════════════════════════════════════════
function triggerSpin(winnerOverride) {
  if (rouletteState.phase !== 'betting') return;
  rouletteState.phase = 'spinning';
  const winner = (typeof winnerOverride === 'number' && winnerOverride >= 0 && winnerOverride <= 36)
    ? winnerOverride
    : Math.floor(Math.random() * 37);
  broadcast({ type:'spin-start', winner });
  broadcastRouletteState();
  setTimeout(() => endSpin(winner), SPIN_DURATION_MS);
}

function endSpin(winner) {
  const color = colorOf(winner);
  rouletteState.lastResult = { number: winner, color };
  rouletteState.history.push({ number: winner, color });
  if (rouletteState.history.length > 20) rouletteState.history.shift();
  // Payouts
  for (const id of Object.keys(rouletteState.bets)) {
    const player = rouletteState.players[id]; if (!player) continue;
    for (const bet of rouletteState.bets[id]) {
      const payout = computePayout(bet, winner);
      if (payout > 0) player.chips += payout;
    }
    rouletteState.bets[id] = [];
  }
  rouletteState.phase = 'payout';
  broadcast({ type:'spin-end', result: rouletteState.lastResult });
  broadcastRouletteState();
  setTimeout(() => {
    rouletteState.phase = 'betting';
    rouletteState.spinDeadline = Date.now() + BET_TIMER_MS;
    rouletteState.lastClearedAt = Date.now();
    broadcastRouletteState();
  }, PAYOUT_DURATION_MS);
}

function computePayout(bet, winner) {
  const { kind, key, amount } = bet;
  if (kind === 'number') {
    return parseInt(key) === winner ? amount * 36 : 0;  // includes original stake (35:1 + 1)
  }
  // outside
  const col = colorOf(winner);
  switch (key) {
    case 'red':    return col === 'red' ? amount * 2 : 0;
    case 'black':  return col === 'black' ? amount * 2 : 0;
    case 'even':   return winner > 0 && winner % 2 === 0 ? amount * 2 : 0;
    case 'odd':    return winner > 0 && winner % 2 === 1 ? amount * 2 : 0;
    case 'low':    return winner >= 1 && winner <= 18 ? amount * 2 : 0;
    case 'high':   return winner >= 19 && winner <= 36 ? amount * 2 : 0;
    case 'dozen1': return winner >= 1 && winner <= 12 ? amount * 3 : 0;
    case 'dozen2': return winner >= 13 && winner <= 24 ? amount * 3 : 0;
    case 'dozen3': return winner >= 25 && winner <= 36 ? amount * 3 : 0;
    case 'col1':   return winner > 0 && winner % 3 === 1 ? amount * 3 : 0;
    case 'col2':   return winner > 0 && winner % 3 === 2 ? amount * 3 : 0;
    case 'col3':   return winner > 0 && winner % 3 === 0 ? amount * 3 : 0;
  }
  return 0;
}

// Auto-spin in virtual mode
setInterval(() => {
  if (rouletteState.mode === 'virtual' && rouletteState.phase === 'betting' && Date.now() >= rouletteState.spinDeadline) {
    triggerSpin();
  }
}, 500);

// ═══════════════════════════════════════════════════════════════════
//  Liar's Bar (Steam-style rules)
// ═══════════════════════════════════════════════════════════════════

function handleLiarJoin(sock, msg) {
  const info = clients.get(sock); if (!info || !info.id) return;
  if (liarState.phase !== 'lobby') return;  // can only join in lobby
  const id = info.id;
  const name = String(msg.name || rouletteState.players[id]?.name || 'Anon').slice(0, 14);
  if (!liarState.players[id]) {
    const color = rouletteState.players[id]?.color || PLAYER_COLORS[colorCursor++ % PLAYER_COLORS.length];
    const avatar = rouletteState.players[id]?.avatar || '🎩';
    liarState.players[id] = { name, avatar, color, eliminated: false, revolver: newRevolver() };
    liarState.order.push(id);
  }
  broadcastLiarState();
}

function handleLiarStart() {
  if (liarState.phase !== 'lobby') return;
  const playerIds = Object.keys(liarState.players);
  if (playerIds.length < 2) return;
  // Give each player a fresh revolver at game start
  for (const id of playerIds) {
    liarState.players[id].revolver = newRevolver();
    liarState.players[id].eliminated = false;
  }
  liarState.phase = 'playing';
  liarState.round = 1;
  liarState.currentRank = RANKS[Math.floor(Math.random() * RANKS.length)];
  liarState.shooter = null;
  liarState.needLoserPick = false;
  liarState.log = [{ key:'liar.log.start', vars:{ R: liarState.currentRank } }];
  broadcastLiarState();
}

function handleLiarPlay(sock, msg) {
  // "Done playing" — just advance the turn. Cards are physical, we don't track them.
  const info = clients.get(sock); if (!info || !info.id) return;
  if (liarState.phase !== 'playing') return;
  if (liarState.needLoserPick) return;
  const aliveOrder = liarState.order.filter(id => !liarState.players[id].eliminated);
  if (!aliveOrder.length) return;
  const currentId = aliveOrder[liarState.turnIdx % aliveOrder.length];
  if (info.id !== currentId) return;
  // Advance turn
  liarState.turnIdx = (liarState.turnIdx + 1) % aliveOrder.length;
  liarState.lastPlay = null;
  liarState.log.push({ key:'liar.log.played', vars:{ P: liarState.players[info.id].name } });
  if (liarState.log.length > 30) liarState.log.shift();
  broadcastLiarState();
}

function handleLiarBelieve(sock) {
  // Keep for backwards compat but no longer used in simplified flow
  const info = clients.get(sock); if (!info || !info.id) return;
  if (liarState.phase !== 'playing') return;
  broadcastLiarState();
}

function handleLiarBluff(sock, msg) {
  const info = clients.get(sock); if (!info || !info.id) return;
  if (liarState.phase !== 'playing') return;
  if (liarState.needLoserPick) return;
  const caller = liarState.players[info.id];
  if (!caller || caller.eliminated) return;
  const target = msg && msg.target ? String(msg.target) : null;
  if (!target || !liarState.players[target] || liarState.players[target].eliminated) return;
  // Store who accused whom — now everyone flips cards physically
  // and someone taps who shoots (caller if wrong, target if caught lying)
  liarState.liarpick = { callerId: info.id, targetId: target };
  liarState.needLoserPick = true;
  liarState.log.push({ key:'liar.log.bluff', vars:{ P: caller.name, T: liarState.players[target].name } });
  if (liarState.log.length > 30) liarState.log.shift();
  broadcastLiarState();
}

function handleLiarDeclareLoser(msg) {
  if (liarState.phase !== 'playing' || !liarState.needLoserPick) return;
  const target = String(msg.target || '');
  const p = liarState.players[target];
  if (!p || p.eliminated) return;
  if (!p.revolver) p.revolver = newRevolver();
  liarState.needLoserPick = false;
  liarState.liarpick = null;
  liarState.phase = 'shooting';
  liarState.shooter = target;
  liarState.log.push({ key:'liar.log.lost', vars:{ P: p.name, C: p.revolver.chambers } });
  if (liarState.log.length > 30) liarState.log.shift();
  broadcastLiarState();
}

function handleLiarPullTrigger(sock) {
  const info = clients.get(sock); if (!info || !info.id) return;
  if (liarState.phase !== 'shooting') return;
  if (info.id !== liarState.shooter) return;

  const shooterId = liarState.shooter;
  const shooter = liarState.players[shooterId];
  const rev = shooter.revolver;

  // Pick a random chamber from the remaining ones
  const fired = Math.floor(Math.random() * rev.chambers);
  const isBang = fired === rev.bulletIdx;

  // Broadcast result to TV and phones (with full revolver info for animation)
  broadcast({
    type: 'liar-trigger-result',
    result: isBang ? 'bang' : 'click',
    bulletIdx: rev.bulletIdx,
    chambers: rev.chambers,
    firedChamber: fired,
    shooter: shooterId,
  });

  setTimeout(() => {
    if (isBang) {
      // BANG — player eliminated, get a fresh revolver for next game
      shooter.eliminated = true;
      shooter.revolver = newRevolver();  // reset for next game
      liarState.log.push({ key:'liar.log.bang', vars:{ P: shooter.name } });
    } else {
      // CLICK — survived, one fewer chamber (more dangerous next time)
      shooter.revolver = survivedRevolver(rev);
      liarState.log.push({ key:'liar.log.click', vars:{ P: shooter.name, C: shooter.revolver.chambers } });
    }
    if (liarState.log.length > 30) liarState.log.shift();

    // Check game end
    const alive = Object.values(liarState.players).filter(p => !p.eliminated);
    if (alive.length <= 1) {
      liarState.phase = 'ended';
      liarState.shooter = null;
      if (alive.length === 1) liarState.log.push({ key:'liar.log.win', vars:{ P: alive[0].name } });
      broadcastLiarState();
      return;
    }

    // Next round
    liarState.phase = 'playing';
    liarState.shooter = null;
    liarState.needLoserPick = false;
    liarState.round++;
    liarState.currentRank = RANKS[Math.floor(Math.random() * RANKS.length)];
    broadcastLiarState();
  }, 2500);
}

function resetLiarGame() {
  liarState.phase = 'lobby';
  liarState.players = {};
  liarState.order = [];
  liarState.currentRank = null;
  liarState.shooter = null;
  liarState.needLoserPick = false;
  liarState.liarpick = null;
  liarState.round = 1;
  liarState.log = [];
  broadcastLiarState();
}

// ═══════════════════════════════════════════════════════════════════
//  Broadcasters
// ═══════════════════════════════════════════════════════════════════
function buildRouletteStateMsg() {
  return {
    type: 'state',
    phase: rouletteState.phase,
    players: rouletteState.players,
    bets: rouletteState.bets,
    history: rouletteState.history,
    mode: rouletteState.mode,
    spinDeadline: rouletteState.spinDeadline,
    lastResult: rouletteState.lastResult,
    lastClearedAt: rouletteState.lastClearedAt,
  };
}
function buildLiarStateMsg() {
  // Expose shooter's revolver at top level for TV display convenience
  const shooter = liarState.shooter;
  const shooterRevolver = shooter && liarState.players[shooter] ? liarState.players[shooter].revolver : null;
  return {
    type: 'liar-state',
    phase: liarState.phase,
    players: liarState.players,  // each has .revolver: { chambers, bulletIdx }
    order: liarState.order,
    currentRank: liarState.currentRank,
    shooter: liarState.shooter,
    chambers: shooterRevolver ? shooterRevolver.chambers : 6,  // for TV display
    needLoserPick: liarState.needLoserPick,
    liarpick: liarState.liarpick || null,
    round: liarState.round,
    log: liarState.log,
  };
}
function broadcastRouletteState() {
  const m = buildRouletteStateMsg();
  for (const [sock, info] of clients) {
    if (info.role === 'phone' || info.role === 'display' || info.role === 'admin') send(sock, m);
  }
}
function broadcastLiarState() {
  const m = buildLiarStateMsg();
  for (const [sock, info] of clients) {
    if (info.role === 'phone' || info.role === 'liar-display') send(sock, m);
  }
}
function buildLeaderboard() {
  return Object.entries(coffres)
    .map(([deviceId, data]) => {
      const total = Object.entries(data.chips||{}).reduce((s,[v,q]) => s + parseInt(v) * parseInt(q||0), 0);
      const count = Object.values(data.chips||{}).reduce((s,q) => s + parseInt(q||0), 0);
      return { deviceId, name: data.name || '—', total, count };
    })
    .filter(p => p.name && p.name !== '—' && p.total > 0)
    .sort((a, b) => b.total - a.total);
}
function broadcastLeaderboard() {
  const m = { type:'leaderboard', leaderboard: buildLeaderboard() };
  for (const [sock, info] of clients) {
    if (info.role === 'display' || info.role === 'admin') send(sock, m);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  Start
// ═══════════════════════════════════════════════════════════════════
server.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   MAISON DE LA ROUE — Casino Server        ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('Listening on port ' + PORT);
  console.log('');
  console.log('On your phone, open one of:');
  // Print local IPs for convenience
  const os = require('os');
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log('  → http://' + iface.address + ':' + PORT);
      }
    }
  }
});
