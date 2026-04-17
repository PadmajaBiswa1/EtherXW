import { useState } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Button, Input, Label, Modal } from '@/components/ui';

export function InsertBookmarkDialog() {
  const { closeDialog } = useUIStore();
  const { editor } = useEditorStore();
  const [bookmarkName, setBookmarkName] = useState('');
  const [error, setError] = useState('');

  const isValid = bookmarkName.trim().length > 0 && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(bookmarkName);

  const handleInsert = () => {
    if (!isValid) {
      setError('Bookmark name must start with a letter or underscore and contain only alphanumeric characters and underscores.');
      return;
    }

    const bookmarkHtml = `<span id="bookmark-${bookmarkName}" style="color: var(--gold); font-weight: 600; text-decoration: underline dashed; cursor: help;" title="Bookmark: ${bookmarkName}">[${bookmarkName}]</span>`;
    
    editor?.chain().insertContent(bookmarkHtml).run();
    closeDialog('bookmark');
    setBookmarkName('');
    setError('');
  };

  return (
    <Modal title="Insert Bookmark" onClose={() => closeDialog('bookmark')}>
      <div style={{ minWidth: 360, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Label>Bookmark Name</Label>
          <Input
            value={bookmarkName}
            onChange={(e) => {
              setBookmarkName(e.target.value);
              setError('');
            }}
            placeholder="e.g., Chapter1, Section2"
            autoFocus
          />
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
            Use letters, numbers, and underscores. Start with a letter or underscore.
          </p>
        </div>

        {error && (
          <div style={{ padding: 8, background: 'rgba(220, 53, 69, 0.1)', border: '1px solid #dc3545', borderRadius: 'var(--radius-md)', fontSize: 12, color: '#dc3545' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => closeDialog('bookmark')}>Cancel</Button>
          <Button variant="primary" onClick={handleInsert} disabled={!isValid}>
            Insert Bookmark
          </Button>
        </div>
      </div>
    </Modal>
  );
}
