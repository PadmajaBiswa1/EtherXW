import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore, useEditorStore } from '@/store';
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
import { TableDesignTab } from './tabs/TableDesignTab';
import { TableLayoutTab } from './tabs/TableLayoutTab';

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
  'table-design': TableDesignTab,
  'table-layout': TableLayoutTab,
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
  const { editor } = useEditorStore();
  const [fileOverlayOpen, setFileOverlayOpen] = useState(false);
  const [isInTable, setIsInTable] = useState(false);

  // Monitor editor state for table context
  useEffect(() => {
    if (!editor) return;

    const updateTableState = () => {
      setIsInTable(editor.isActive('table'));
    };

    // Update on editor selection change
    editor.on('selectionUpdate', updateTableState);
    editor.on('update', updateTableState);

    // Initial check
    updateTableState();

    return () => {
      try {
        editor.off('selectionUpdate', updateTableState);
        editor.off('update', updateTableState);
      } catch (e) {
        // Editor may have been destroyed
      }
    };
  }, [editor]);

  // Base tabs (always visible)
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

  // Contextual table tabs (shown when cursor in table)
  const TABLE_TABS = [
    { id: 'table-design', label: 'Table Design' },
    { id: 'table-layout', label: 'Table Layout' },
  ];

  // All tabs including contextual ones
  const allTabs = isInTable ? [...TABS, ...TABLE_TABS] : TABS;
  
  // Validate active tab is still in visible tabs
  const validActiveTab = allTabs.some(t => t.id === activeTab) ? activeTab : 'home';

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
    if (validActiveTab === tabId) {
      toggleRibbon();
    } else {
      setActiveTab(tabId);
      if (ribbonCollapsed) toggleRibbon();
    }
  };

  const Content = TAB_CONTENT[validActiveTab] || HomeTab;

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
        {allTabs.map((t) => {
          const active = t.id === validActiveTab;
          const isFile = t.id === 'file';
          const isTableTab = t.id.startsWith('table-');
          return (
            <button key={t.id}
              onClick={() => handleTabClick(t.id)}
              title={`Switch to ${t.label} tab`}
              style={{
                background: (active && !isFile) ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: (active && !isFile) ? '2px solid var(--gold)' : '1px solid transparent',
                color: (active && !isFile) ? 'var(--gold)' : isFile ? 'var(--gold)' : isTableTab ? 'var(--text-muted)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                fontSize: isFile ? 14 : isTableTab ? 12 : 13,
                fontWeight: (active && !isFile) ? 700 : isFile ? 600 : isTableTab ? 500 : 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '6px 16px',
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
                userSelect: 'none',
                borderLeft: isTableTab ? '1px solid rgba(212, 175, 55, 0.2)' : 'none',
                paddingLeft: isTableTab ? '12px' : '16px',
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
                  e.currentTarget.style.color = isFile ? 'var(--gold)' : isTableTab ? 'var(--text-muted)' : 'var(--text-secondary)';
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
      {!ribbonCollapsed && validActiveTab !== 'file' && (
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
