import { useState } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Button, Select, Modal } from '@/components/ui';

export function InsertDropCapDialog() {
  const { closeDialog } = useUIStore();
  const { editor } = useEditorStore();
  const [position, setPosition] = useState('left');
  const [lines, setLines] = useState(3);

  const positions = [
    { value: 'left', label: 'In margin' },
    { value: 'inline', label: 'Dropped' },
  ];

  const handleInsert = () => {
    const firstChar = 'A';
    const dropCapHtml = position === 'left'
      ? `<div style="float: left; font-size: 48px; font-weight: 700; color: var(--gold); line-height: 40px; padding-right: 8px; margin-top: -2px;">${firstChar}</div>`
      : `<div style="display: inline-block; font-size: 48px; font-weight: 700; color: var(--gold); line-height: 40px; height: ${lines * 24}px; padding-right: 8px;">${firstChar}</div>`;
    
    editor?.chain().insertContent(dropCapHtml).run();
    closeDialog('dropCap');
  };

  return (
    <Modal title="Drop Cap" onClose={() => closeDialog('dropCap')}>
      <div style={{ minWidth: 360, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
            Position
          </label>
          <Select value={position} onChange={(e) => setPosition(e.target.value)}>
            {positions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>
        </div>

        {position === 'inline' && (
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
              Lines to drop: {lines}
            </label>
            <input
              type="range"
              min="2"
              max="7"
              value={lines}
              onChange={(e) => setLines(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        )}

        <div style={{
          padding: 16, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', textAlign: 'center', minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-serif)', fontSize: 14
        }}>
          <div style={{ float: 'left', fontWeight: 700, color: 'var(--gold)', lineHeight: 'normal', paddingRight: 8, fontSize: 48 }}>A</div>
          <p>Sample text with drop cap.</p>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => closeDialog('dropCap')}>Cancel</Button>
          <Button variant="primary" onClick={handleInsert}>Insert Drop Cap</Button>
        </div>
      </div>
    </Modal>
  );
}
