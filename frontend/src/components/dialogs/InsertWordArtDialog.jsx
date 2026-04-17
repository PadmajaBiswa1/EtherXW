import { useState } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Button, Input, Modal } from '@/components/ui';

export function InsertWordArtDialog() {
  const { closeDialog } = useUIStore();
  const { editor } = useEditorStore();
  const [text, setText] = useState('Your Text Here');
  const [style, setStyle] = useState('gradient');

  const styles = [
    { id: 'gradient', label: 'Gold Gradient', css: 'background: linear-gradient(45deg, var(--gold), #f4d574); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;' },
    { id: 'shadow', label: 'Shadow', css: 'color: var(--gold); text-shadow: 2px 2px 4px rgba(0,0,0,0.5);' },
    { id: 'outline', label: 'Outline', css: 'color: transparent; -webkit-text-stroke: 2px var(--gold);' },
    { id: 'italic', label: 'Italic Slant', css: 'color: var(--gold); font-style: italic; font-size: 32px; font-weight: 700; transform: skew(-10deg);' },
    { id: 'bold', label: 'Bold', css: 'color: var(--gold); font-weight: 900; font-size: 32px;' },
  ];

  const handleInsert = () => {
    const selectedStyle = styles.find(s => s.id === style);
    const wordArtHtml = `<div style="text-align: center; padding: 20px; ${selectedStyle.css} font-size: 28px; margin: 20px 0; cursor: move;" data-wordart="true">${text}</div>`;
    
    editor?.chain().insertContent(wordArtHtml).run();
    closeDialog('wordArt');
  };

  return (
    <Modal title="Insert WordArt" onClose={() => closeDialog('wordArt')}>
      <div style={{ minWidth: 420, maxHeight: '70vh', overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
            WORDART STYLES
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {styles.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                style={{
                  padding: 16, background: style === s.id ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  border: style === s.id ? '2px solid var(--gold)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.1s',
                }}
              >
                <div style={{ ...JSON.parse(`{${s.css.replace(/;/g, ';').split(';').filter(p => p.trim()).map(p => `"${p.split(':')[0].trim()}":"${p.split(':')[1].trim()}"`).join(',')}}`) || {}, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Aa</span>
                </div>
                <p style={{ fontSize: 11, marginTop: 6, color: 'var(--text-muted)' }}>{s.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
            Text
          </label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter WordArt text"
          />
        </div>

        <div style={{
          padding: 16, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', textAlign: 'center', minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ ...JSON.parse(`{${styles.find(s => s.id === style).css.replace(/;/g, ';').split(';').filter(p => p.trim()).map(p => `"${p.split(':')[0].trim()}":"${p.split(':')[1].trim()}"`).join(',')}}`) || {}, fontSize: 20, fontWeight: 600 }}>
            {text}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => closeDialog('wordArt')}>Cancel</Button>
          <Button variant="primary" onClick={handleInsert}>Insert WordArt</Button>
        </div>
      </div>
    </Modal>
  );
}
