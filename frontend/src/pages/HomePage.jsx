import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EtherXLogo } from '@/components/ui/EtherXLogo';
import { useTheme } from '@/hooks/useTheme';

const TEMPLATES = [
  { id: 'blank',    icon: <BlankIcon />,    title: 'Blank Document',  desc: 'Start with a clean page' },
  { id: 'report',   icon: <ReportIcon />,   title: 'Business Report', desc: 'Professional report layout' },
  { id: 'letter',   icon: <LetterIcon />,   title: 'Formal Letter',   desc: 'Letterhead + structure' },
  { id: 'resume',   icon: <ResumeIcon />,   title: 'Résumé',          desc: 'Clean one-page résumé' },
  { id: 'proposal', icon: <ProposalIcon />, title: 'Proposal',        desc: 'Project proposal layout' },
  { id: 'invoice',  icon: <InvoiceIcon />,  title: 'Invoice',         desc: 'Business invoice template' },
];

const INITIAL_DOCS = [
  { id: '1', title: 'Q4 Strategy Report',     updated: '2 hours ago',  pages: 8,  pinned: false, favorite: false },
  { id: '2', title: 'Product Roadmap 2025',   updated: 'Yesterday',    pages: 12, pinned: true,  favorite: true  },
  { id: '3', title: 'Client Proposal — Apex', updated: '3 days ago',   pages: 5,  pinned: false, favorite: true  },
  { id: '4', title: 'Meeting Notes — Oct',    updated: '5 days ago',   pages: 2,  pinned: false, favorite: false },
  { id: '5', title: 'Brand Guidelines',       updated: 'Last week',    pages: 18, pinned: true,  favorite: false },
];

const NAV = [
  { key: 'home',      icon: '', label: 'Home' },
  { key: 'new',       icon: '', label: 'New' },
  { key: 'recent',    icon: '', label: 'Recent' },
  { key: 'pinned',    icon: '', label: 'Pinned' },
  { key: 'favorites', icon: '', label: 'Favorites' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeNav, setActiveNav]   = useState('home');
  const [docs, setDocs]             = useState(INITIAL_DOCS);
  const [search, setSearch]         = useState('');
  const [contextMenu, setContextMenu] = useState(null); // { docId, x, y }
  const [hoveredDoc, setHoveredDoc] = useState(null);

  const user = (() => { try { return JSON.parse(localStorage.getItem('etherx_user')); } catch { return null; } })();

  const togglePin      = (id) => setDocs((d) => d.map((doc) => doc.id === id ? { ...doc, pinned: !doc.pinned } : doc));
  const toggleFavorite = (id) => setDocs((d) => d.map((doc) => doc.id === id ? { ...doc, favorite: !doc.favorite } : doc));
  const removeDoc      = (id) => setDocs((d) => d.filter((doc) => doc.id !== id));

  const handleContextMenu = (e, docId) => {
    e.preventDefault();
    setContextMenu({ docId, x: e.clientX, y: e.clientY });
  };

  const closeContext = () => setContextMenu(null);

  const filtered = docs.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    if (activeNav === 'pinned')    return d.pinned    && matchSearch;
    if (activeNav === 'favorites') return d.favorite  && matchSearch;
    if (activeNav === 'recent')    return matchSearch;
    return matchSearch;
  });

  const pinned    = docs.filter((d) => d.pinned);
  const favorites = docs.filter((d) => d.favorite);

  const ctxDoc = contextMenu ? docs.find((d) => d.id === contextMenu.docId) : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div onClick={closeContext} style={{ height: '100vh', width: '100vw', display: 'flex', background: 'var(--bg-app)', color: 'var(--text-primary)', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: 220, flexShrink: 0, background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        padding: '16px 0',
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img
            src="/assets/etherxwordlogo.png"
            alt="EtherX Word"
            style={{ height: 100, objectFit: 'contain' }}
          />
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
          {NAV.map(({ key, icon, label }) => (
            <button key={key} onClick={() => setActiveNav(key)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 'var(--radius-md)',
              background: activeNav === key ? 'rgba(212,175,55,0.12)' : 'none',
              border: activeNav === key ? '1px solid rgba(212,175,55,0.25)' : '1px solid transparent',
              color: activeNav === key ? 'var(--gold)' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 13,
              fontWeight: activeNav === key ? 600 : 400,
              transition: 'var(--transition)', textAlign: 'left', width: '100%',
            }}
              onMouseEnter={(e) => { if (activeNav !== key) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={(e) => { if (activeNav !== key) e.currentTarget.style.background = 'none'; }}>
              <span style={{ fontSize: 15 }}>{icon}</span>
              {label}
              {key === 'pinned'    && pinned.length    > 0 && <span style={badge}>{pinned.length}</span>}
              {key === 'favorites' && favorites.length > 0 && <span style={badge}>{favorites.length}</span>}
            </button>
          ))}
        </div>

        {/* User + theme */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg,#d4af37,#b8941e)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, color: '#0a0800',
              }}>{user.name?.[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'var(--text-muted)' }}>{user.email}</div>
              </div>
            </div>
          )}
          <button onClick={toggleTheme} style={{
            width: '100%', padding: '6px 0', background: 'var(--bg-elevated)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: 11,
          }}>{theme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode'}</button>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* ── HOME view ── */}
        {(activeNav === 'home' || activeNav === 'new') && (
          <div style={{ padding: '48px 56px', maxWidth: 900, width: '100%', margin: '0 auto' }}>

            {/* Greeting */}
            <div style={{ marginBottom: 40 }}>
              <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 4 }}>
                {greeting()}{user ? `, ${user.name.split(' ')[0]}` : ''}.
              </h1>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>What would you like to create today?</p>
            </div>

            {/* Templates */}
            <div style={{ marginBottom: 52 }}>
              <SectionLabel>New Document</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(138px,1fr))', gap: 12, marginTop: 14 }}>
                {TEMPLATES.map((t) => (
                  <button key={t.id} onClick={() => navigate('/doc/new')} style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '18px 14px',
                    cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--gold-glow)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:36, height:36, background:'var(--gold-dim)', borderRadius:'var(--radius-sm)' }}>
                      {t.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{t.title}</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pinned section on home */}
            {pinned.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <SectionLabel>📌 Pinned</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
                  {pinned.map((doc) => (
                    <DocRow key={doc.id} doc={doc} hovered={hoveredDoc === doc.id}
                      onHover={setHoveredDoc} onNavigate={() => navigate(`/doc/${doc.id}`)}
                      onPin={togglePin} onFavorite={toggleFavorite} onRemove={removeDoc}
                      onContextMenu={handleContextMenu} />
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <SectionLabel>Recent</SectionLabel>
                <SearchBox value={search} onChange={setSearch} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {docs.filter((d) => d.title.toLowerCase().includes(search.toLowerCase())).map((doc) => (
                  <DocRow key={doc.id} doc={doc} hovered={hoveredDoc === doc.id}
                    onHover={setHoveredDoc} onNavigate={() => navigate(`/doc/${doc.id}`)}
                    onPin={togglePin} onFavorite={toggleFavorite} onRemove={removeDoc}
                    onContextMenu={handleContextMenu} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RECENT / PINNED / FAVORITES views ── */}
        {(activeNav === 'recent' || activeNav === 'pinned' || activeNav === 'favorites') && (
          <div style={{ padding: '48px 56px', maxWidth: 900, width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 20, fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '.06em' }}>
                {activeNav === 'recent' ? '🕐 Recent' : activeNav === 'pinned' ? '📌 Pinned' : '⭐ Favorites'}
              </h1>
              <SearchBox value={search} onChange={setSearch} />
            </div>

            {filtered.length === 0 ? (
              <EmptyState activeNav={activeNav} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {filtered.map((doc) => (
                  <DocRow key={doc.id} doc={doc} hovered={hoveredDoc === doc.id}
                    onHover={setHoveredDoc} onNavigate={() => navigate(`/doc/${doc.id}`)}
                    onPin={togglePin} onFavorite={toggleFavorite} onRemove={removeDoc}
                    onContextMenu={handleContextMenu} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Context Menu ── */}
      {contextMenu && ctxDoc && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999,
          background: 'var(--bg-surface)', border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          minWidth: 190, overflow: 'hidden',
        }}>
          {[
            { icon: '📂', label: 'Open',                    action: () => { navigate(`/doc/${ctxDoc.id}`); closeContext(); } },
            { icon: ctxDoc.pinned    ? '📌 Unpin' : '📌', label: ctxDoc.pinned ? 'Unpin'            : 'Pin to top',     action: () => { togglePin(ctxDoc.id);      closeContext(); } },
            { icon: ctxDoc.favorite  ? '⭐' : '☆',         label: ctxDoc.favorite ? 'Remove favorite' : 'Add to favorites', action: () => { toggleFavorite(ctxDoc.id); closeContext(); } },
            null,
            { icon: '🗑', label: 'Remove from list',        action: () => { removeDoc(ctxDoc.id);     closeContext(); }, danger: true },
          ].map((item, i) =>
            item === null
              ? <div key={i} style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              : (
                <button key={i} onClick={item.action} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '9px 14px', background: 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-ui)', fontSize: 13,
                  color: item.danger ? '#e05c5c' : 'var(--text-primary)',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = item.danger ? 'rgba(224,92,92,0.1)' : 'var(--bg-elevated)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  <span>{item.icon}</span>{item.label}
                </button>
              )
          )}
        </div>
      )}
    </div>
  );
}

/* ── DocRow ── */
function DocRow({ doc, hovered, onHover, onNavigate, onPin, onFavorite, onRemove, onContextMenu }) {
  return (
    <div onMouseEnter={() => onHover(doc.id)} onMouseLeave={() => onHover(null)}
      onContextMenu={(e) => onContextMenu(e, doc.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '11px 14px',
        background: hovered ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: `1px solid ${hovered ? 'var(--border-gold)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)', transition: 'var(--transition)', cursor: 'pointer',
      }}>

      {/* Doc icon */}
      <span style={{ fontSize: 22, flexShrink: 0 }}>📄</span>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }} onClick={onNavigate}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {doc.title}
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-muted)' }}>
          {doc.updated} · {doc.pages} page{doc.pages !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
        {/* Pin */}
        <IconBtn title={doc.pinned ? 'Unpin' : 'Pin to top'} active={doc.pinned} onClick={(e) => { e.stopPropagation(); onPin(doc.id); }}>
          📌
        </IconBtn>
        {/* Favorite */}
        <IconBtn title={doc.favorite ? 'Remove favorite' : 'Add to favorites'} active={doc.favorite} onClick={(e) => { e.stopPropagation(); onFavorite(doc.id); }}>
          {doc.favorite ? '⭐' : '☆'}
        </IconBtn>
        {/* Open */}
        <IconBtn title="Open" onClick={(e) => { e.stopPropagation(); onNavigate(); }}>
          →
        </IconBtn>
      </div>

      {/* Persistent badges */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {doc.pinned    && <span style={{ fontSize: 12 }} title="Pinned">📌</span>}
        {doc.favorite  && <span style={{ fontSize: 12 }} title="Favorite">⭐</span>}
      </div>
    </div>
  );
}

/* ── IconBtn ── */
function IconBtn({ children, onClick, title, active }) {
  return (
    <button onClick={onClick} title={title} style={{
      background: active ? 'rgba(212,175,55,0.15)' : 'none',
      border: `1px solid ${active ? 'rgba(212,175,55,0.4)' : 'transparent'}`,
      borderRadius: 'var(--radius-sm)', padding: '3px 7px',
      cursor: 'pointer', fontSize: 13, color: active ? 'var(--gold)' : 'var(--text-muted)',
      transition: 'var(--transition)',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--border-gold)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = active ? 'rgba(212,175,55,0.15)' : 'none'; e.currentTarget.style.borderColor = active ? 'rgba(212,175,55,0.4)' : 'transparent'; }}>
      {children}
    </button>
  );
}

/* ── Helpers ── */
function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
      {children}
    </div>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search documents…"
      style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', padding: '5px 12px',
        fontSize: 12, fontFamily: 'var(--font-ui)', color: 'var(--text-primary)',
        outline: 'none', width: 200,
      }}
      onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
      onBlur={(e) => e.target.style.borderColor = 'var(--border)'} />
  );
}

function EmptyState({ activeNav }) {
  const msgs = {
    pinned:    { icon: '📌', text: 'No pinned documents yet.', sub: 'Hover a document and click 📌 to pin it.' },
    favorites: { icon: '⭐', text: 'No favorites yet.',        sub: 'Hover a document and click ☆ to favorite it.' },
    recent:    { icon: '🕐', text: 'No documents found.',      sub: 'Create a new document to get started.' },
  };
  const m = msgs[activeNav] || msgs.recent;
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{m.icon}</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{m.text}</div>
      <div style={{ fontSize: 12 }}>{m.sub}</div>
    </div>
  );
}

const badge = {
  marginLeft: 'auto', background: 'rgba(212,175,55,0.2)',
  color: 'var(--gold)', borderRadius: 10, padding: '1px 7px',
  fontSize: 10, fontWeight: 700,
};

const G = '#d4af37'; // gold
const S = 20;        // icon size

function BlankIcon() {
  return (
    <svg width={S} height={S} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="13" height="17" rx="2" stroke={G} strokeWidth="1.4"/>
      <path d="M5 6h7M5 9h7M5 12h4" stroke={G} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M13 1v4h4" stroke={G} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width={S} height={S} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="16" height="18" rx="2" stroke={G} strokeWidth="1.4"/>
      <rect x="5" y="9" width="2" height="5" fill={G} opacity="0.8"/>
      <rect x="9" y="7" width="2" height="7" fill={G} opacity="0.8"/>
      <rect x="13" y="5" width="2" height="9" fill={G} opacity="0.8"/>
      <path d="M5 6h7" stroke={G} strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

function LetterIcon() {
  return (
    <svg width={S} height={S} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke={G} strokeWidth="1.4"/>
      <path d="M2 5l8 6 8-6" stroke={G} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg width={S} height={S} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="16" height="18" rx="2" stroke={G} strokeWidth="1.4"/>
      <circle cx="10" cy="6" r="2.2" stroke={G} strokeWidth="1.2"/>
      <path d="M5 13c0-2.2 2.2-3.5 5-3.5s5 1.3 5 3.5" stroke={G} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M5 15.5h6M5 17h4" stroke={G} strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

function ProposalIcon() {
  return (
    <svg width={S} height={S} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="16" height="18" rx="2" stroke={G} strokeWidth="1.4"/>
      <path d="M5 5h10M5 8h10M5 11h6" stroke={G} strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="14" cy="14" r="3.5" fill="none" stroke={G} strokeWidth="1.2"/>
      <path d="M13 14l1 1 2-2" stroke={G} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function InvoiceIcon() {
  return (
    <svg width={S} height={S} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="1" width="16" height="18" rx="2" stroke={G} strokeWidth="1.4"/>
      <path d="M5 5h6M5 8h10M5 11h10M12 14h3" stroke={G} strokeWidth="1.1" strokeLinecap="round"/>
      <text x="5.5" y="16.5" fill={G} fontSize="5" fontWeight="700" fontFamily="serif">$</text>
    </svg>
  );
}
