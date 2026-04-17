import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EtherXLogo } from '@/components/ui/EtherXLogo';
import { useTheme } from '@/hooks/useTheme';
import { useUIStore, useDocumentStore, useEditorStore } from '@/store';
import { useAutoSave } from '@/hooks/useAutoSave';
import { Button, Input, Select, Label } from '@/components/ui/index';
import { exportToPdf, exportToDocx, exportToHtml, exportToText } from '@/services/export';

const TEMPLATES = [
  { id: 'blank',    title: 'Blank Document',  desc: 'Start with a clean page',      category: 'blank' },
  { id: 'report',   title: 'Business Report', desc: 'Professional report layout',    category: 'business' },
  { id: 'letter',   title: 'Formal Letter',   desc: 'Letterhead + structure',        category: 'business' },
  { id: 'resume',   title: 'Résumé',          desc: 'Clean one-page résumé',         category: 'personal' },
  { id: 'proposal', title: 'Proposal',        desc: 'Project proposal layout',       category: 'business' },
  { id: 'invoice',  title: 'Invoice',         desc: 'Business invoice template',     category: 'business' },
  { id: 'reminder', title: 'Important Reminder', desc: 'Personal reminder template', category: 'personal' },
  { id: 'thesis',   title: 'Thesis',          desc: 'Academic thesis format',        category: 'academic' },
  { id: 'contract', title: 'Contract',        desc: 'Legal contract template',       category: 'legal' },
];

const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'blank', label: 'Blank' },
  { id: 'business', label: 'Business' },
  { id: 'personal', label: 'Personal' },
  { id: 'academic', label: 'Academic' },
  { id: 'legal', label: 'Legal' },
];

const INITIAL_DOCS = [
  { id: '1', title: 'Q4 Strategy Report',     updated: '2 hours ago',  pages: 8,  pinned: false },
  { id: '2', title: 'Product Roadmap 2025',   updated: 'Yesterday',    pages: 12, pinned: true  },
  { id: '3', title: 'Client Proposal — Apex', updated: '3 days ago',   pages: 5,  pinned: false },
  { id: '4', title: 'Meeting Notes — Oct',    updated: '5 days ago',   pages: 2,  pinned: false },
  { id: '5', title: 'Brand Guidelines',       updated: 'Last week',    pages: 18, pinned: true  },
];

const SIDEBAR_ITEMS = [
  { key: 'home',       label: 'Home' },
  { key: 'new',        label: 'New' },
  { key: 'open',       label: 'Open' },
  { key: 'save',       label: 'Save' },
  { key: 'save-as',    label: 'Save As' },
  { key: 'print',      label: 'Print' },
  { key: 'export',     label: 'Export' },
  { key: 'share',      label: 'Share' },
  { key: 'info',       label: 'Info' },
  { key: 'stats',      label: 'Statistics' },
  { key: 'settings',   label: 'Settings' },
  { key: 'close',      label: 'Close' },
];

export function HomePage({ isOverlay = false, onClose = null }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { setFileMenuOpen } = useUIStore();
  const { title: docTitle, content: docContent, wordCount, charCount, pageCount, setStats, author: docAuthor, subject: docSubject, keywords: docKeywords, description: docDescription, createdAt, updatedAt, lastSaved } = useDocumentStore();
  const { editor } = useEditorStore();
  const { autoSave } = useAutoSave();

  const [activeSection, setActiveSection] = useState('home');
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [templateCategory, setTemplateCategory] = useState('all');
  const [searchDocs, setSearchDocs] = useState('');
  const [docs_pinned, setDocsPinned] = useState(INITIAL_DOCS.filter(d => d.pinned));

  const user = (() => { try { return JSON.parse(localStorage.getItem('etherx_user')); } catch { return null; } })();

  const handleClose = () => {
    if (isOverlay && onClose) {
      onClose();
    } else {
      setFileMenuOpen(false);
      navigate('/doc/new');
    }
  };

  const handleEscape = (e) => {
    if (isOverlay && e.key === 'Escape') {
      onClose?.();
    }
  };

  useEffect(() => {
    if (isOverlay) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOverlay]);

  const filteredTemplates = templateCategory === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === templateCategory);

  const filteredDocs = docs.filter(d => d.title.toLowerCase().includes(searchDocs.toLowerCase()));


  return (
    <div onClick={(e) => e.target === e.currentTarget ? null : null} 
      style={{
        height: isOverlay ? '100%' : '100vh',
        width: '100%',
        display: 'flex',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}>
      
      {/* ═════════════════════════════════════════════════════════════════
          LEFT SIDEBAR
          ═════════════════════════════════════════════════════════════════ */}
      <div style={{
        width: 220,
        flexShrink: 0,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        
        {/* Header */}
        <div style={{
          padding: '16px 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 68,
          flexShrink: 0,
        }}>
          {isOverlay ? (
            <img src="/assets/etherxwordlogo.png" alt="EtherxWord" style={{
              height: 90,
              width: 'auto',
              objectFit: 'contain',
            }} />
          ) : (
            <div style={{ width: 160, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <EtherXLogo />
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: '8px',
        }}>
          {SIDEBAR_ITEMS.map((item, idx) => {
            const isActive = activeSection === item.key;
            const isDanger = item.key === 'close';
            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.key === 'close') {
                    handleClose();
                  } else {
                    setActiveSection(item.key);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--bg-active)' : 'transparent',
                  border: isActive ? '1px solid var(--gold-border)' : '1px solid transparent',
                  borderLeft: isActive ? '3px solid var(--gold)' : '3px solid transparent',
                  color: isDanger ? '#e05c5c' : isActive ? 'var(--gold)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  textAlign: 'left',
                  width: '100%',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = isDanger ? 'rgba(224,92,92,0.08)' : 'var(--bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <SidebarIcon icon={item.key} />
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Info Section */}
        {isOverlay && (
          <div style={{
            padding: '12px',
            borderTop: '1px solid var(--border)',
            fontSize: 10,
            color: 'var(--text-muted)',
          }}>
            <div style={{ marginBottom: 8, textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>📄 {docTitle || 'Untitled'}</div>
              <div style={{ fontSize: 9, opacity: 0.8 }}>
                {wordCount} words · {pageCount} page{pageCount !== 1 ? 's' : ''}
              </div>
            </div>
            <Button onClick={onClose} variant="outline" size="sm" style={{ width: '100%' }}>
              ← Back to Editor
            </Button>
          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          RIGHT CONTENT PANEL
          ═════════════════════════════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {isOverlay && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border)',
            height: 50,
            flexShrink: 0,
          }}>
            <Button onClick={onClose} variant="ghost" size="sm" style={{ color: 'var(--text-secondary)' }}>
              ← Editor
            </Button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeSection === 'home' && <PanelHome navigate={(path) => { if (isOverlay) onClose?.(); navigate(path); }} docs={docs_pinned} filteredDocs={filteredDocs} setActiveSection={setActiveSection} />}
          {activeSection === 'new' && <PanelNew templateCategory={templateCategory} setTemplateCategory={setTemplateCategory} filteredTemplates={filteredTemplates} navigate={(path) => { if (isOverlay) onClose?.(); navigate(path); }} />}
          {activeSection === 'open' && <PanelOpen searchDocs={searchDocs} setSearchDocs={setSearchDocs} filteredDocs={filteredDocs} navigate={(path) => { if (isOverlay) onClose?.(); navigate(path); }} />}
          {activeSection === 'save' && <PanelSave docTitle={docTitle} lastSaved={lastSaved} autoSave={autoSave} />}
          {activeSection === 'save-as' && <PanelSaveAs docTitle={docTitle} />}
          {activeSection === 'print' && <PanelPrint editor={editor} />}
          {activeSection === 'export' && <PanelExport docTitle={docTitle} docContent={docContent} />}
          {activeSection === 'share' && <PanelShare />}
          {activeSection === 'info' && <PanelInfo docTitle={docTitle} createdAt={createdAt} updatedAt={updatedAt} lastSaved={lastSaved} />}
          {activeSection === 'stats' && <PanelStats wordCount={wordCount} charCount={charCount} pageCount={pageCount} editor={editor} />}
          {activeSection === 'settings' && <PanelSettings />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR ICONS (Gold SVGs)
   ═══════════════════════════════════════════════════════════════════════════ */
function SidebarIcon({ icon }) {
  const G = '#d4af37';
  const S = 18;

  const icons = {
    home: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    new: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
        <line x1="12" y1="12" x2="12" y2="20" />
        <line x1="8" y1="16" x2="16" y2="16" />
      </svg>
    ),
    open: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h7l2 3h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z" />
      </svg>
    ),
    save: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
    'save-as': (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2" />
        <path d="M16 3h-5a2 2 0 0 0-2 2v4M12 12v8" />
        <line x1="9" y1="16" x2="15" y2="16" />
      </svg>
    ),
    print: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    ),
    export: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    share: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    info: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    stats: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M17 5H9.5a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5H17" />
        <path d="M6 12h2M9 9h2M12 8h2" />
      </svg>
    ),
    settings: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m2.12-2.12l4.24-4.24" />
      </svg>
    ),
    close: (
      <svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  };

  return icons[icon] || null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: HOME
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelHome({ navigate, docs, filteredDocs, setActiveSection }) {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 8 }}>
        Start Here
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 36 }}>
        Create a new document or access your recent files
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        
        {/* Recent Documents */}
        <div>
          <PanelLabel>Recent Documents</PanelLabel>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredDocs.slice(0, 4).map(doc => (
              <DocCard key={doc.id} doc={doc} navigate={navigate} />
            ))}
          </div>
          <Button onClick={() => setActiveSection('open')} variant="outline" size="sm" style={{ marginTop: 12, width: '100%' }}>
            View All Recent →
          </Button>
        </div>

        {/* Template Categories */}
        <div>
          <PanelLabel>Template Categories</PanelLabel>
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['Blank', 'Business', 'Letter', 'Resume', 'Proposal', 'Invoice'].map((cat, i) => (
              <button key={i} onClick={() => setActiveSection('new')}
                style={{
                  padding: '16px 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: NEW (Template Gallery)
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelNew({ templateCategory, setTemplateCategory, filteredTemplates, navigate }) {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 1400, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 24 }}>
        New Document
      </h1>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--border)',
        paddingBottom: 16,
        marginBottom: 32,
      }}>
        {TEMPLATE_CATEGORIES.map(cat => (
          <button key={cat.id}
            onClick={() => setTemplateCategory(cat.id)}
            style={{
              padding: '6px 14px',
              background: templateCategory === cat.id ? 'var(--bg-active)' : 'transparent',
              border: 'none',
              borderBottom: templateCategory === cat.id ? '2px solid var(--gold)' : 'none',
              color: templateCategory === cat.id ? 'var(--gold)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              fontWeight: templateCategory === cat.id ? 600 : 500,
              cursor: 'pointer',
              transition: 'all var(--transition)',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (templateCategory !== cat.id) {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (templateCategory !== cat.id) {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16,
      }}>
        {filteredTemplates.map(template => (
          <button key={template.id}
            onClick={() => navigate('/doc/new')}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 220,
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold)';
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--gold-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-surface)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: 60,
              height: 80,
              background: 'var(--gold-dim)',
              borderRadius: 'var(--radius-md)',
            }} />
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
              {template.title}
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-muted)' }}>
              {template.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: OPEN
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelOpen({ searchDocs, setSearchDocs, filteredDocs, navigate }) {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 24 }}>
        Open Document
      </h1>

      <Input
        placeholder="Search documents…"
        value={searchDocs}
        onChange={setSearchDocs}
        width="100%"
        style={{ marginBottom: 24 }}
      />

      <PanelLabel style={{ marginBottom: 12 }}>Recent Documents</PanelLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {filteredDocs.map(doc => (
          <DocRow key={doc.id} doc={doc} navigate={navigate} />
        ))}
      </div>

      <Button variant="outline" style={{ width: '100%' }}>
        📁 Browse for more files…
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: SAVE
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelSave({ docTitle, lastSaved, autoSave }) {
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSaveNow = async () => {
    setSaveStatus('saving');
    await autoSave();
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div style={{ padding: '40px 48px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 32 }}>
        Save
      </h1>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        marginBottom: 24,
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.05em', marginBottom: 8, textTransform: 'uppercase' }}>
            Current Document
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            {docTitle || 'Untitled'}
          </div>
        </div>

        {lastSaved && (
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Last saved: {new Date(lastSaved).toLocaleString()}
          </div>
        )}

        <Button onClick={handleSaveNow} variant="primary" style={{ width: '100%' }}>
          {saveStatus === 'saving' ? '💾 Saving...' : saveStatus === 'saved' ? '✓ Saved!' : '💾 Save Now'}
        </Button>
      </div>

      {saveStatus === 'saved' && (
        <div style={{
          padding: 12,
          background: 'rgba(40,167,69,0.1)',
          border: '1px solid rgba(40,167,69,0.3)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          color: '#a3e6b0',
        }}>
          ✓ Document saved successfully!
        </div>
      )}

      <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '.05em', textTransform: 'uppercase' }}>
          Auto-save Status
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)' }}>
          ✓ Auto-save is enabled and your document is automatically saved to the cloud.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: SAVE AS
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelSaveAs({ docTitle }) {
  const [title, setTitle] = useState(docTitle || 'Untitled');
  const [format, setFormat] = useState('docx');

  return (
    <div style={{ padding: '40px 48px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 32 }}>
        Save As
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <Label>Document Title</Label>
          <Input value={title} onChange={setTitle} placeholder="Enter document title" width="100%" />
        </div>

        <div>
          <Label>Format</Label>
          <Select
            value={format}
            onChange={setFormat}
            options={[
              { value: 'docx', label: 'Word Document (.docx)' },
              { value: 'pdf', label: 'PDF (.pdf)' },
              { value: 'html', label: 'Web Page (.html)' },
              { value: 'txt', label: 'Plain Text (.txt)' },
            ]}
            width="100%"
          />
        </div>

        <div>
          <Label>Location</Label>
          <div style={{
            padding: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            color: 'var(--text-muted)',
          }}>
            📂 This Computer / Documents
          </div>
        </div>

        <Button variant="primary" style={{ width: '100%' }}>
          Save as {format.toUpperCase()}
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: PRINT
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelPrint({ editor }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 32 }}>
        Print
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32 }}>
        
        {/* Settings */}
        <div>
          <PanelLabel style={{ marginBottom: 12 }}>Print Settings</PanelLabel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Printer</div>
              <Select options={[{ value: 'default', label: 'Default Printer' }]} width="100%" />
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Copies</div>
              <Input type="number" value="1" onChange={() => {}} width="100%" />
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Pages</div>
              <Select options={[
                { value: 'all', label: 'All pages' },
                { value: 'current', label: 'Current page' },
              ]} width="100%" />
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Orientation</div>
              <Select options={[
                { value: 'portrait', label: 'Portrait' },
                { value: 'landscape', label: 'Landscape' },
              ]} width="100%" />
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Paper Size</div>
              <Select options={[
                { value: 'letter', label: 'Letter (8.5" x 11")' },
                { value: 'a4', label: 'A4 (210 x 297mm)' },
              ]} width="100%" />
            </div>

            <Button onClick={handlePrint} variant="primary" style={{ marginTop: 8, width: '100%' }}>
              🖨 Print
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <PanelLabel style={{ marginBottom: 12 }}>Preview</PanelLabel>
          <div style={{
            width: '100%',
            height: 600,
            background: '#fafafa',
            border: '8px solid #ccc',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            overflowY: 'auto',
            fontFamily: "'Calibri', sans-serif",
            fontSize: 11,
            lineHeight: 1.6,
            color: '#333',
          }}>
            <div style={{ padding: 20, background: 'white', minHeight: '100%' }}>
              <p>📄 Page 1 of Document</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelExport({ docTitle, docContent }) {
  const handleExportPdf = async () => {
    const contentEl = document.querySelector('.ProseMirror') || document.body;
    await exportToPdf(docTitle, contentEl);
  };

  const handleExportDocx = async () => {
    await exportToDocx(docTitle, docContent || '<p>Document content</p>');
  };

  const handleExportHtml = async () => {
    await exportToHtml(docTitle, docContent || '<p>Document content</p>');
  };

  const handleExportText = async () => {
    await exportToText(docTitle, docContent || 'Document content');
  };

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 8 }}>
        Export Document
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32 }}>
        Save your document in different formats
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        <ExportCard
          icon="📄"
          title="Word Document"
          desc="Save as .docx"
          onClick={handleExportDocx}
        />
        <ExportCard
          icon="🔴"
          title="PDF Document"
          desc="Save as .pdf"
          onClick={handleExportPdf}
        />
        <ExportCard
          icon="🌐"
          title="Web Page"
          desc="Save as .html"
          onClick={handleExportHtml}
        />
        <ExportCard
          icon="📝"
          title="Plain Text"
          desc="Save as .txt"
          onClick={handleExportText}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: SHARE
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelShare() {
  const [shareLink, setShareLink] = useState('https://etherxword.app/doc/abc123xyz');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '40px 48px', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 32 }}>
        Share Document
      </h1>

      {/* Share Link */}
      <div style={{ marginBottom: 40 }}>
        <PanelLabel style={{ marginBottom: 12 }}>Shared Link</PanelLabel>
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 8,
        }}>
          <Input value={shareLink} onChange={() => {}} width="100%" style={{ flex: 1 }} />
          <Button onClick={handleCopyLink} variant="primary" size="md">
            {copied ? '✓ Copied!' : 'Copy Link'}
          </Button>
        </div>
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          padding: 8,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          fontSize: 11,
          color: 'var(--text-secondary)',
        }}>
          <input type="checkbox" checked={true} style={{ cursor: 'pointer' }} />
          <span>Anyone with link can view</span>
        </div>
      </div>

      {/* Invite by Email */}
      <div style={{ marginBottom: 32 }}>
        <PanelLabel style={{ marginBottom: 12 }}>Invite People</PanelLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={setInviteEmail}
            width="100%"
          />
          <Select
            value={inviteRole}
            onChange={setInviteRole}
            options={[
              { value: 'viewer', label: 'Viewer - Can view only' },
              { value: 'commenter', label: 'Commenter - Can comment' },
              { value: 'editor', label: 'Editor - Can edit' },
            ]}
            width="100%"
          />
          <Button variant="primary" style={{ width: '100%' }}>
            Send Invite
          </Button>
        </div>
      </div>

      {/* Shared With */}
      <div>
        <PanelLabel style={{ marginBottom: 12 }}>Shared With</PanelLabel>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {['alice@example.com', 'bob@example.com'].map(email => (
            <div key={email} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              fontSize: 12,
            }}>
              <span>{email}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Editor</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: INFO
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelInfo({ docTitle, createdAt, updatedAt, lastSaved }) {
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div style={{ padding: '40px 48px', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 32 }}>
        Document Properties
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
        
        <div>
          <Label>Title</Label>
          <Input value={docTitle} onChange={() => {}} placeholder="Document title" width="100%" />
        </div>

        <div>
          <Label>Author</Label>
          <Input value={author} onChange={setAuthor} placeholder="Your name" width="100%" />
        </div>

        <div>
          <Label>Subject</Label>
          <Input value={subject} onChange={setSubject} placeholder="Subject" width="100%" />
        </div>

        <div>
          <Label>Keywords</Label>
          <Input value={keywords} onChange={setKeywords} placeholder="Separate with commas" width="100%" />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={description}
            onChange={setDescription}
            placeholder="Document description"
            rows={4}
            width="100%"
          />
        </div>

        <Button variant="primary" style={{ width: '100%' }}>
          Save Properties
        </Button>
      </div>

      {/* Read-only info */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
        <PanelLabel style={{ marginBottom: 12 }}>Document Information</PanelLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, fontFamily: 'var(--font-ui)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Created:</span>
            <span>{new Date(createdAt).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Last Modified:</span>
            <span>{new Date(updatedAt).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Last Saved:</span>
            <span>{lastSaved ? new Date(lastSaved).toLocaleString() : 'Not saved'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>File Size:</span>
            <span>~256 KB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: STATISTICS
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelStats({ wordCount, charCount, pageCount, editor }) {
  const getCharCountWithoutSpaces = (text) => {
    return text.replace(/\s/g, '').length;
  };

  const getParagraphCount = (text) => {
    return text.split('\n').filter(p => p.trim()).length;
  };

  const getSentenceCount = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    return sentences.length;
  };

  const getLineCount = (text) => {
    return text.split('\n').length;
  };

  const text = editor?.getText?.() || '';
  const charWithoutSpaces = getCharCountWithoutSpaces(text);
  const paragraphs = getParagraphCount(text);
  const sentences = getSentenceCount(text);
  const lines = getLineCount(text);
  const readingTime = Math.ceil(wordCount / 200);

  const stats = [
    { label: 'Pages', value: pageCount },
    { label: 'Words', value: wordCount },
    { label: 'Characters (with spaces)', value: charCount },
    { label: 'Characters (without spaces)', value: charWithoutSpaces },
    { label: 'Paragraphs', value: paragraphs },
    { label: 'Lines', value: lines },
    { label: 'Sentences', value: sentences },
    { label: 'Reading Time', value: `${readingTime} min` },
  ];

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 8 }}>
        Document Statistics
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32 }}>
        Real-time statistics about your document
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--gold)',
              marginBottom: 8,
              fontFamily: "'Calibri', monospace",
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '.05em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-ui)',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" style={{ width: '100%' }}>
        ⟲ Refresh Statistics
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL: SETTINGS
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelSettings() {
  const { theme, toggleTheme } = useTheme();
  const { setFontSize } = useEditorStore();
  const [fontSize, setFontSizeLocal] = useState(12);
  const [autoSaveInterval, setAutoSaveInterval] = useState(300);
  const [spellCheck, setSpellCheck] = useState(true);
  const [defaultFont, setDefaultFont] = useState('calibri');

  return (
    <div style={{ padding: '40px 48px', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.06em', marginBottom: 32 }}>
        Settings
      </h1>

      {/* Appearance */}
      <SettingsSection title="Appearance">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12 }}>Theme</span>
          <Button onClick={toggleTheme} variant="outline" size="sm">
            {theme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode'}
          </Button>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>Default Font Size</div>
          <input
            type="range"
            min="10"
            max="16"
            value={fontSize}
            onChange={(e) => {
              setFontSizeLocal(e.target.value);
              setFontSize(e.target.value);
            }}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            {fontSize}pt
          </div>
        </div>
      </SettingsSection>

      {/* Editor */}
      <SettingsSection title="Editor">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12 }}>Auto-save</span>
          <input type="checkbox" checked={true} style={{ cursor: 'pointer' }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>Auto-save Interval (seconds)</div>
          <Input
            type="number"
            value={autoSaveInterval}
            onChange={(v) => setAutoSaveInterval(v)}
            width="100%"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12 }}>Spell Check</span>
          <input
            type="checkbox"
            checked={spellCheck}
            onChange={(e) => setSpellCheck(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </SettingsSection>

      {/* Document Defaults */}
      <SettingsSection title="Document Defaults">
        <div>
          <Label>Default Font Family</Label>
          <Select
            value={defaultFont}
            onChange={setDefaultFont}
            options={[
              { value: 'calibri', label: 'Calibri' },
              { value: 'times', label: 'Times New Roman' },
              { value: 'arial', label: 'Arial' },
              { value: 'georgia', label: 'Georgia' },
            ]}
            width="100%"
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <Label>Default Font Size</Label>
          <Select
            value={fontSize}
            onChange={(v) => {
              setFontSizeLocal(v);
              setFontSize(v);
            }}
            options={[
              { value: '10', label: '10pt' },
              { value: '11', label: '11pt' },
              { value: '12', label: '12pt (default)' },
              { value: '14', label: '14pt' },
              { value: '16', label: '16pt' },
            ]}
            width="100%"
          />
        </div>
      </SettingsSection>

      <Button variant="primary" style={{ width: '100%', marginTop: 32 }}>
        Save All Settings
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */
function PanelLabel({ children, style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-ui)',
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--text-muted)',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      ...style,
    }}>
      {children}
    </div>
  );
}

function DocCard({ doc, navigate }) {
  return (
    <button
      onClick={() => navigate(`/doc/${doc.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all var(--transition)',
        textAlign: 'left',
        width: '100%',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.background = 'var(--bg-elevated)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--bg-surface)';
      }}
    >
      <span style={{ fontSize: 18 }}>📄</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {doc.title}
        </div>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 10,
          color: 'var(--text-muted)',
        }}>
          {doc.updated} • {doc.pages} page{doc.pages !== 1 ? 's' : ''}
        </div>
      </div>
    </button>
  );
}

function DocRow({ doc, navigate }) {
  return (
    <div
      onClick={() => navigate(`/doc/${doc.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all var(--transition)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.background = 'var(--bg-elevated)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--bg-surface)';
      }}
    >
      <span style={{ fontSize: 18 }}>📄</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 2,
        }}>
          {doc.title}
        </div>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 10,
          color: 'var(--text-muted)',
        }}>
          {doc.updated} • {doc.pages} page{doc.pages !== 1 ? 's' : ''}
        </div>
      </div>
      <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>→</span>
    </div>
  );
}

function ExportCard({ icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 24,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all var(--transition)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.background = 'var(--bg-elevated)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--gold-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--bg-surface)';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: 36 }}>{icon}</div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text-primary)',
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        color: 'var(--text-muted)',
      }}>
        {desc}
      </div>
      <Button onClick={() => {}} variant="primary" size="sm" style={{ marginTop: 8 }}>
        Export
      </Button>
    </button>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <PanelLabel style={{ marginBottom: 16 }}>{title}</PanelLabel>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {children}
      </div>
    </div>
  );
}
