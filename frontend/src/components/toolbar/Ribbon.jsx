import { useUIStore } from '@/store';
import { HomeTab }   from './tabs/HomeTab';
import { InsertTab } from './tabs/InsertTab';
import { LayoutTab } from './tabs/LayoutTab';
import { ReviewTab } from './tabs/ReviewTab';
import { ViewTab }   from './tabs/ViewTab';

const TABS = [
  { id: 'home',   label: 'Home'   },
  { id: 'insert', label: 'Insert' },
  { id: 'layout', label: 'Layout' },
  { id: 'review', label: 'Review' },
  { id: 'view',   label: 'View'   },
];

const TAB_CONTENT = { home: HomeTab, insert: InsertTab, layout: LayoutTab, review: ReviewTab, view: ViewTab };

export function Ribbon() {
  const { activeTab, setActiveTab, ribbonCollapsed, toggleRibbon } = useUIStore();
  const Content = TAB_CONTENT[activeTab] || HomeTab;

  return (
    <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
      {/* Tab strip */}
      <div style={{ display: 'flex', alignItems: 'center', height: 30, padding: '0 6px', gap: 0, borderBottom: '1px solid var(--border)' }}>
        {TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button key={t.id}
              onClick={() => { if (active) toggleRibbon(); else { setActiveTab(t.id); if (ribbonCollapsed) toggleRibbon(); } }}
              style={{
                background:   active ? 'var(--bg-active)' : 'transparent',
                border:       'none',
                borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
                color:        active ? 'var(--gold)' : 'var(--text-secondary)',
                fontFamily:   'var(--font-ui)', fontSize: 12, fontWeight: active ? 700 : 400,
                letterSpacing: '.06em', textTransform: 'uppercase',
                padding: '0 14px', height: '100%', cursor: 'pointer',
                transition: 'var(--transition)', outline: 'none',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--text-secondary)'; }}>
              {t.label}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button onClick={toggleRibbon} title={ribbonCollapsed ? 'Expand ribbon' : 'Collapse ribbon'}
          style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:10, padding:'4px 10px' }}>
          {ribbonCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {/* Tab content */}
      {!ribbonCollapsed && (
        <div style={{
          display: 'flex', alignItems: 'center', height: 60,
          padding: '0 6px', overflowX: 'auto', overflowY: 'hidden', gap: 2,
        }}>
          <Content />
        </div>
      )}
    </div>
  );
}
