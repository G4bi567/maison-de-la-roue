// ═══════════════════════════════════════════════════════════
//  Language switcher (FR / EN / PT top-right buttons)
//  Auto-injects itself on every page that loads this script.
// ═══════════════════════════════════════════════════════════

(function injectLangSwitcher() {
  if (!window.I18N) { console.warn('I18N not loaded'); return; }

  const css = `
    .lang-switcher {
      position: fixed; top: 12px; right: 12px; z-index: 9999;
      display: flex; gap: 4px;
      background: rgba(14, 10, 20, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 8px; padding: 4px;
      font-family: "JetBrains Mono", monospace;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
    .lang-btn {
      background: transparent; border: none; cursor: pointer;
      color: rgba(245, 234, 208, 0.55);
      font-family: inherit; font-weight: 800; font-size: 11px;
      letter-spacing: 0.15em; padding: 6px 10px; border-radius: 4px;
      transition: all 0.15s;
    }
    .lang-btn:hover { color: #f0cc5a; }
    .lang-btn.active {
      background: linear-gradient(180deg, #f0cc5a, #d4af37);
      color: #201703;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function render() {
    const cur = I18N.current;
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === cur);
    });
  }

  function build() {
    if (document.querySelector('.lang-switcher')) return;
    const wrap = document.createElement('div');
    wrap.className = 'lang-switcher';
    ['fr', 'en', 'pt'].forEach(lang => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn';
      btn.dataset.lang = lang;
      btn.textContent = lang.toUpperCase();
      btn.addEventListener('click', () => I18N.set(lang));
      wrap.appendChild(btn);
    });
    document.body.appendChild(wrap);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
  document.addEventListener('langchange', render);
})();


// ═══════════════════════════════════════════════════════════
//  Tiny sound library
//  Uses Web Audio API to synthesize effects (no audio files needed).
//  Call: SFX.click(), SFX.gunshot(), SFX.empty(), SFX.win(), SFX.ball()
// ═══════════════════════════════════════════════════════════
const SFX = (function() {
  let ctx = null;
  let muted = localStorage.getItem('sfx_muted') === '1';

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function noise(duration, freq, type, gainStart, gainEnd) {
    if (muted) return;
    const c = ensure(); if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainStart, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(gainEnd, 0.0001), c.currentTime + duration);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  }

  function whiteBurst(duration, gainStart) {
    if (muted) return;
    const c = ensure(); if (!c) return;
    const bufferSize = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Faster decay = more "shot-like"
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const src = c.createBufferSource();
    const gain = c.createGain();
    gain.gain.value = gainStart;
    src.buffer = buffer;
    src.connect(gain).connect(c.destination);
    src.start();
  }

  return {
    get muted() { return muted; },
    setMuted(b) { muted = b; localStorage.setItem('sfx_muted', b ? '1' : '0'); },
    toggle()    { this.setMuted(!muted); },

    click()   { noise(0.05, 600, 'square', 0.08, 0.001); },
    win()     {
      noise(0.12, 523, 'triangle', 0.2, 0.01);
      setTimeout(() => noise(0.12, 659, 'triangle', 0.2, 0.01), 100);
      setTimeout(() => noise(0.2,  784, 'triangle', 0.25, 0.01), 200);
    },
    ball()    { noise(0.05, 80, 'square', 0.12, 0.001); },
    // Liar's Bar — the only two we promised
    gunshot() {
      // Sharp white-noise burst + low boom
      whiteBurst(0.18, 0.7);
      noise(0.25, 90, 'sawtooth', 0.5, 0.001);
      setTimeout(() => whiteBurst(0.08, 0.3), 80);
    },
    empty() {
      // Soft click — "the trigger fell on empty"
      noise(0.04, 220, 'square', 0.18, 0.001);
      setTimeout(() => noise(0.04, 140, 'square', 0.12, 0.001), 50);
    },
    drumroll() {
      // Short tension build before the trigger
      if (muted) return;
      const c = ensure(); if (!c) return;
      for (let i = 0; i < 8; i++) {
        setTimeout(() => whiteBurst(0.04, 0.15), i * 70);
      }
    },
    // ─── Cinematic Liar's Bar sounds ───
    cylinderSpin() {
      // Metallic click-click-click of revolver cylinder rotating, slowing down
      if (muted) return;
      const c = ensure(); if (!c) return;
      const clicks = 14;
      for (let i = 0; i < clicks; i++) {
        const t = Math.pow(i / clicks, 1.5) * 1800; // ease-out timing
        setTimeout(() => {
          // sharp metallic tick
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = 'square';
          osc.frequency.value = 1800 + Math.random()*400;
          gain.gain.setValueAtTime(0.06, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.02);
          osc.connect(gain).connect(c.destination);
          osc.start();
          osc.stop(c.currentTime + 0.03);
        }, t);
      }
    },
    hammerCock() {
      // Two-stage click: small spring + heavy clunk
      if (muted) return;
      const c = ensure(); if (!c) return;
      noise(0.04, 900, 'square', 0.15, 0.001);
      setTimeout(() => noise(0.06, 220, 'square', 0.25, 0.001), 70);
    },
    heartbeat(bpm) {
      // Single heartbeat thump (lub-dub). Caller spaces them.
      if (muted) return;
      const c = ensure(); if (!c) return;
      // lub
      noise(0.12, 55, 'sine', 0.5, 0.001);
      // dub
      setTimeout(() => noise(0.10, 48, 'sine', 0.42, 0.001), 130);
    },
    bangCinematic() {
      // Full layered gunshot: hammer drop → muzzle blast → echo
      if (muted) return;
      const c = ensure(); if (!c) return;
      // 1) Hammer impact
      noise(0.02, 1500, 'square', 0.2, 0.001);
      // 2) Sharp blast — 30ms later
      setTimeout(() => {
        whiteBurst(0.22, 1.0);
        noise(0.30, 70, 'sawtooth', 0.85, 0.001);
        noise(0.18, 140, 'square', 0.5, 0.001);
      }, 30);
      // 3) Low boom resonance
      setTimeout(() => noise(0.5, 45, 'sine', 0.6, 0.001), 80);
      // 4) Echo / ringout
      setTimeout(() => whiteBurst(0.15, 0.3), 220);
      setTimeout(() => whiteBurst(0.10, 0.15), 420);
    },
    deathTone() {
      // Sad descending tone after a bang
      if (muted) return;
      const c = ensure(); if (!c) return;
      noise(0.6, 220, 'triangle', 0.25, 0.001);
      setTimeout(() => noise(0.6, 165, 'triangle', 0.22, 0.001), 200);
      setTimeout(() => noise(1.0, 110, 'sine',    0.20, 0.001), 500);
    },
    survivorFanfare() {
      // Triumphant chord for winner
      if (muted) return;
      [262, 330, 392, 523].forEach((f, i) => setTimeout(() => noise(0.5, f, 'triangle', 0.18, 0.001), i*80));
    },
  };
})();

if (typeof window !== 'undefined') window.SFX = SFX;
