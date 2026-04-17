import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store';
import { FileMenuOverlay } from '@/components/FileMenuOverlay';
import { HomeTab }        from './tabs/HomeTab';
import { InsertTab }      from './tabs/InsertTab';
import { LayoutTab }      from './tabs/LayoutTab';
import { ReviewTab }      from './tabs/ReviewTab';
import { ViewTab }        from './tabs/ViewTab';
import { DrawTab }        from './tabs/DrawTab';
import { DesignTab }      from './tabs/DesignTab';
import { ReferencesTab }  from './tabs/ReferencesTab';
import { MailingsTab }    from './tabs/MailingsTab';
import { HelpTab }        from './tabs/HelpTab';

const TABS = [
  { id: 'file',       label: 'File' },
  { id: 'home',       label: 'Home' },
  { id: 'insert',     label: 'Insert' },
  { id: 'draw',       label: 'Draw' },
  { id: 'design',     label: 'Design' },
  { id: 'layout',     label: 'Layout' },
  { id: 'references', label: 'References' },
  { id: 'mailings',   label: 'Mailings' },
  { id: 'review',     label: 'Review' },
  { id: 'view',       label: 'View' },
  { id: 'help',       label: 'Help' },
];

const TAB_CONTENT = {
  home: HomeTab,
  insert: InsertTab,
  layout: LayoutTab,
  review: ReviewTab,
  view: ViewTab,
  draw: DrawTab,
  design: DesignTab,
  references: ReferencesTab,
  mailings: MailingsTab,
  help: HelpTab,
};

const ribbonStyles = `
  @keyframes ribbonHover {
    from { background-color: transparent; }
    to { background-color: rgba(212, 175, 55, 0.08); }
  }
`;

export function Ribbon() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, ribbonCollapsed, toggleRibbon, theme } = useUIStore();
  const [fileOverlayOpen, setFileOverlayOpen] = useState(false);
  
  const handleFileClick = () => {
    setFileOverlayOpen(true);
  };

  const handleCloseFileOverlay = () => {
    setFileOverlayOpen(false);
  };

  const handleTabClick = (tabId) => {
    if (tabId === 'file') {
      handleFileClick();
      return;
    }
    if (activeTab === tabId) {
      toggleRibbon();
    } else {
      setActiveTab(tabId);
      if (ribbonCollapsed) toggleRibbon();
    }
  };

  const Content = TAB_CONTENT[activeTab] || HomeTab;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      boxShadow: theme === 'dark' 
        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 1px 3px rgba(0, 0, 0, 0.1)',
    }}>
      <style>{ribbonStyles}</style>

      {/* Tab strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: 36,
        padding: '0 8px',
        gap: 0,
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, rgba(212, 175, 55, 0.02) 100%)',
      }}>
        {TABS.map((t) => {
          const active = t.id === activeTab;
          const isFile = t.id === 'file';
          return (
            <button key={t.id}
              onClick={() => handleTabClick(t.id)}
              title={`Switch to ${t.label} tab`}
              style={{
                background: (active && !isFile) ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: (active && !isFile) ? '2px solid var(--gold)' : '1px solid transparent',
                color: (active && !isFile) ? 'var(--gold)' : isFile ? 'var(--gold)' : 'var(--text-secondary)',
                fontFamily: isFile ? 'var(--font-ui)' : 'var(--font-ui)',
                fontSize: isFile ? 14 : 13,
                fontWeight: (active && !isFile) ? 700 : isFile ? 600 : 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '6px 16px',
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (!active || isFile) {
                  e.currentTarget.style.color = 'var(--gold)';
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active || isFile) {
                  e.currentTarget.style.background = active && !isFile ? 'rgba(212, 175, 55, 0.1)' : 'transparent';
                  e.currentTarget.style.color = isFile ? 'var(--gold)' : 'var(--text-secondary)';
                }
              }}
            >
              {t.label}
            </button>
          );
        })}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Collapse/Expand Button */}
        <button
          onClick={toggleRibbon}
          title={ribbonCollapsed ? 'Expand ribbon' : 'Collapse ribbon'}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 11,
            padding: '4px 10px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
            e.currentTarget.style.color = 'var(--gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          {ribbonCollapsed ? '⬇' : '⬆'}
        </button>
      </div>

      {/* Ribbon Content Area */}
      {!ribbonCollapsed && activeTab !== 'file' && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          minHeight: 'auto',
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 8,
          paddingRight: 8,
          overflow: 'visible',
          gap: 2,
          background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.02) 0%, var(--bg-surface) 100%)',
          borderTop: '1px solid rgba(212, 175, 55, 0.05)',
          position: 'relative',
        }}
          className="ribbon-content"
        >
          <Content />
        </div>
      )}

      {/* File Menu Overlay */}
      {fileOverlayOpen && <FileMenuOverlay onClose={handleCloseFileOverlay} />}
    </div>
  );
}
