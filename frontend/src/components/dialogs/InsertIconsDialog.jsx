import { useState } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Button, Input, Modal } from '@/components/ui';

export function InsertIconsDialog() {
  const { closeDialog } = useUIStore();
  const { editor } = useEditorStore();
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [category, setCategory] = useState('common');
  const [searchTerm, setSearchTerm] = useState('');

  // Icon categories with SVG data
  const ICONS = {
    common: [
      { id: 'check', label: 'Check', svg: '<circle cx="12" cy="12" r="10" stroke="var(--gold)" fill="none"/><path d="M9 12l2 2 4-4" stroke="var(--gold)" fill="none" stroke-linecap="round"/>' },
      { id: 'x', label: 'Close', svg: '<circle cx="12" cy="12" r="10" stroke="var(--gold)" fill="none"/><path d="M8 8l8 8M16 8l-8 8" stroke="var(--gold)" stroke-linecap="round"/>' },
      { id: 'star', label: 'Star', svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" fill="var(--gold)"/>' },
      { id: 'heart', label: 'Heart', svg: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="var(--gold)"/>' },
      { id: 'flag', label: 'Flag', svg: '<path d="M4 15s1-1 5-1 5.08 1 9 1 5-1 5-1V3s-1 1-5 1-5.08-1-9-1-5 1-5 1z" stroke="var(--gold)" fill="none" stroke-linecap="round"/><line x1="4" y1="22" x2="4" y2="15" stroke="var(--gold)"/>' },
      { id: 'bell', label: 'Bell', svg: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="var(--gold)" fill="none" stroke-linecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="var(--gold)" fill="none" stroke-linecap="round"/>' },
      { id: 'info', label: 'Info', svg: '<circle cx="12" cy="12" r="10" stroke="var(--gold)" fill="none"/><line x1="12" y1="16" x2="12" y2="12" stroke="var(--gold)"/><line x1="12" y1="8" x2="12.01" y2="8" stroke="var(--gold)"/>' },
      { id: 'alert', label: 'Alert', svg: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="var(--gold)" fill="none" stroke-linecap="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="var(--gold)"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="var(--gold)"/>' },
    ],
    arrows: [
      { id: 'arrow-up', label: 'Up', svg: '<line x1="12" y1="19" x2="12" y2="5" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/><polyline points="5 12 12 5 19 12" stroke="var(--gold)" fill="none" stroke-width="2" stroke-linecap="round"/>' },
      { id: 'arrow-down', label: 'Down', svg: '<line x1="12" y1="5" x2="12" y2="19" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/><polyline points="19 12 12 19 5 12" stroke="var(--gold)" fill="none" stroke-width="2" stroke-linecap="round"/>' },
      { id: 'arrow-left', label: 'Left', svg: '<line x1="19" y1="12" x2="5" y2="12" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/><polyline points="12 19 5 12 12 5" stroke="var(--gold)" fill="none" stroke-width="2" stroke-linecap="round"/>' },
      { id: 'arrow-right', label: 'Right', svg: '<line x1="5" y1="12" x2="19" y2="12" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/><polyline points="12 5 19 12 12 19" stroke="var(--gold)" fill="none" stroke-width="2" stroke-linecap="round"/>' },
      { id: 'arrow-up-down', label: 'Up/Down', svg: '<line x1="12" y1="5" x2="12" y2="19" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/><polyline points="5 8 12 5 19 8" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/><polyline points="5 16 12 19 19 16" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/>' },
    ],
    shapes: [
      { id: 'circle', label: 'Circle', svg: '<circle cx="12" cy="12" r="10" stroke="var(--gold)" fill="none" stroke-width="2"/>' },
      { id: 'square', label: 'Square', svg: '<rect x="3" y="3" width="18" height="18" stroke="var(--gold)" fill="none" stroke-width="2"/>' },
      { id: 'triangle', label: 'Triangle', svg: '<polygon points="12,2 22,20 2,20" stroke="var(--gold)" fill="none" stroke-width="2"/>' },
      { id: 'diamond', label: 'Diamond', svg: '<polygon points="12,2 22,12 12,22 2,12" stroke="var(--gold)" fill="none" stroke-width="2"/>' },
      { id: 'hexagon', label: 'Hexagon', svg: '<polygon points="13 2 20 6.5 20 17.5 13 22 6 17.5 6 6.5" stroke="var(--gold)" fill="none" stroke-width="2"/>' },
    ],
    symbols: [
      { id: 'copyright', label: 'Copyright', svg: '<circle cx="12" cy="12" r="10" stroke="var(--gold)" fill="none"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3s3 1 3 3a3 3 0 0 1-5.83 1" stroke="var(--gold)" fill="none" stroke-linecap="round"/>' },
      { id: 'registered', label: 'Registered', svg: '<circle cx="12" cy="12" r="10" stroke="var(--gold)" fill="none"/><path d="M10 9h4a2 2 0 0 1 2 2v4M10 9v6" stroke="var(--gold)" fill="none" stroke-linecap="round"/>' },
      { id: 'trademark', label: 'Trademark', svg: '<path d="M7 9l2.5 4L12 9M17 8l-2 5-2-5M6 19h12" stroke="var(--gold)" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
      { id: 'degree', label: 'Degree', svg: '<circle cx="12" cy="6" r="2.5" fill="var(--gold)"/><path d="M12 12v10" stroke="var(--gold)" stroke-width="2" stroke-linecap="round"/>' },
      { id: 'bullet', label: 'Bullet', svg: '<circle cx="12" cy="12" r="2" fill="var(--gold)"/>' },
    ],
  };

  const allIcons = Object.values(ICONS).flat();
  const filteredIcons = (ICONS[category] || []).filter(icon =>
    icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInsert = () => {
    if (!selectedIcon) return;

    const icon = selectedIcon;
    const iconHtml = `<svg width="32" height="32" viewBox="0 0 24 24" style="display: inline-block; margin: 0 4px; vertical-align: middle;" data-icon-id="${icon.id}">${icon.svg}</svg>`;
    
    editor?.chain().insertContent(iconHtml).run();
    closeDialog('insertIcons');
  };

  return (
    <Modal title="Insert Icons" onClose={() => closeDialog('insertIcons')}>
      <div style={{ minWidth: 520, maxHeight: '70vh', overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search */}
        <Input
          type="search"
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        {/* Categories */}
        <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          {Object.keys(ICONS).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 12px',
                background: category === cat ? 'var(--gold)' : 'var(--bg-surface)',
                color: category === cat ? '#000' : 'var(--text-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => {
                if (category !== cat) {
                  e.currentTarget.style.borderColor = 'var(--gold)';
                  e.currentTarget.style.color = 'var(--gold)';
                }
              }}
              onMouseLeave={(e) => {
                if (category !== cat) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Icons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
          gap: 8,
        }}>
          {filteredIcons.map(icon => (
            <button
              key={icon.id}
              onClick={() => setSelectedIcon(icon)}
              style={{
                padding: 12,
                background: selectedIcon?.id === icon.id ? 'var(--bg-gold)' : 'var(--bg-surface)',
                border: selectedIcon?.id === icon.id ? '2px solid var(--gold)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => {
                if (selectedIcon?.id !== icon.id) {
                  e.currentTarget.style.borderColor = 'var(--gold)';
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIcon?.id !== icon.id) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--bg-surface)';
                }
              }}
              title={icon.label}
            >
              <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={24} height={24} viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: icon.svg }} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', maxWidth: '100%' }}>
                {icon.label}
              </span>
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
            No icons found
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Button variant="secondary" onClick={() => closeDialog('insertIcons')}>Cancel</Button>
          <Button variant="primary" onClick={handleInsert} disabled={!selectedIcon}>
            Insert Icon
          </Button>
        </div>
      </div>
    </Modal>
  );
}
