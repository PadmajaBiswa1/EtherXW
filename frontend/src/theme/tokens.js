// ═══════════════════════════════════════════════════════════════
//  EtherX Word — Design Tokens
// ═══════════════════════════════════════════════════════════════

export const GOLD = '#d4af37';

// Apply CSS custom properties to :root for the given theme mode
export function applyTheme(mode = 'dark') {
  const root = document.documentElement;
  const dark = mode === 'dark';

  const vars = {
    // ── Surfaces ────────────────────────────────────────────────
    '--bg-app':      dark ? '#080808' : '#e8e8e8',
    '--bg-surface':  dark ? '#111111' : '#ffffff',
    '--bg-elevated': dark ? '#181818' : '#f7f7f7',
    '--bg-hover':    dark ? '#1e1c14' : '#f5efd0',
    '--bg-active':   dark ? '#271f00' : '#f0e5a8',
    '--bg-page':     dark ? '#1a1a1a' : '#ffffff',
    '--bg-code':     dark ? '#161616' : '#f3f3f3',
    '--bg-th':       dark ? '#1c1c1c' : '#f9f6e8',
    '--bg-sidebar':  dark ? '#0e0e0e' : '#f0f0f0',

    // ── Borders ──────────────────────────────────────────────────
    '--border':        dark ? '#242424' : '#ddd',
    '--border-strong': dark ? '#333'    : '#bbb',
    '--border-gold':   'rgba(212,175,55,0.4)',

    // ── Text ─────────────────────────────────────────────────────
    '--text-primary':   dark ? '#ece8dc' : '#111',
    '--text-secondary': dark ? '#888'    : '#555',
    '--text-muted':     dark ? '#444'    : '#aaa',
    '--text-gold':      GOLD,
    '--text-heading':   dark ? '#e8d98a' : '#2a1f00',
    '--text-doc':       dark ? '#ddd8cc' : '#1a1a1a',
    '--text-on-gold':   '#0a0800',

    // ── Gold accent ───────────────────────────────────────────────
    '--gold':          GOLD,
    '--gold-hover':    '#e8c84a',
    '--gold-dim':      dark ? 'rgba(212,175,55,0.12)' : 'rgba(212,175,55,0.18)',
    '--gold-glow':     dark ? '0 0 16px rgba(212,175,55,0.25)' : '0 2px 12px rgba(212,175,55,0.3)',
    '--gold-border':   dark ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.5)',

    // ── Shadows ───────────────────────────────────────────────────
    '--shadow-sm':   dark ? '0 1px 4px rgba(0,0,0,.7)'  : '0 1px 4px rgba(0,0,0,.1)',
    '--shadow-md':   dark ? '0 4px 20px rgba(0,0,0,.9)' : '0 4px 20px rgba(0,0,0,.14)',
    '--shadow-page': dark ? '0 8px 40px rgba(0,0,0,.95)': '0 8px 40px rgba(0,0,0,.18)',

    // ── Fonts ─────────────────────────────────────────────────────
    '--font-ui': "'Segoe UI', sans-serif",
    '--font-body': "'Calibri', sans-serif",
    '--font-mono': "'Consolas', monospace",

    // ── Radius / transitions ──────────────────────────────────────
    '--radius-sm':    '3px',
    '--radius-md':    '6px',
    '--radius-lg':    '10px',
    '--radius-xl':    '16px',
    '--transition':   '140ms ease',
    '--transition-md':'260ms ease',
  };

  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.setAttribute('data-theme', mode);
}
