import { useState } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Button, Select, Modal } from '@/components/ui';

export function InsertCrossReferenceDialog() {
  const { closeDialog } = useUIStore();
  const { editor } = useEditorStore();
  const [refType, setRefType] = useState('heading');
  const [refFormat, setRefFormat] = useState('page');

  const refTypes = [
    { value: 'heading', label: 'Heading' },
    { value: 'bookmark', label: 'Bookmark' },
    { value: 'footnote', label: 'Footnote' },
    { value: 'endnote', label: 'Endnote' },
    { value: 'table', label: 'Table' },
    { value: 'figure', label: 'Figure' },
  ];

  const refFormats = [
    { value: 'page', label: 'Page number' },
    { value: 'text', label: 'Text' },
    { value: 'full', label: 'Full context' },
    { value: 'label', label: 'Label and pagenumber' },
  ];

  const handleInsert = () => {
    const refHtml = `<span style="color: var(--gold); text-decoration: underline; font-style: italic; cursor: pointer;" data-ref-type="${refType}" data-ref-format="${refFormat}">[Reference: ${refType} - ${refFormat}]</span>`;
    
    editor?.chain().insertContent(refHtml).run();
    closeDialog('crossReference');
  };

  return (
    <Modal title="Insert Cross-Reference" onClose={() => closeDialog('crossReference')}>
      <div style={{ minWidth: 380, maxHeight: '70vh', overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
            Reference type
          </label>
          <Select value={refType} onChange={(e) => setRefType(e.target.value)}>
            {refTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
            Insert reference to
          </label>
          <Select value={refFormat} onChange={(e) => setRefFormat(e.target.value)}>
            {refFormats.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </Select>
        </div>

        <div style={{
          padding: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--text-muted)'
        }}>
          <strong>Preview:</strong> Cross-reference to {refType} ({refFormat})
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => closeDialog('crossReference')}>Cancel</Button>
          <Button variant="primary" onClick={handleInsert}>Insert Cross-Reference</Button>
        </div>
      </div>
    </Modal>
  );
}
