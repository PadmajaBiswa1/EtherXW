import { useState } from 'react';
import { useUIStore } from '@/store';
import { useEditorStore } from '@/store';
import { Modal, Button, Stack, Label } from '@/components/ui';

export function CitationDialog() {
  const { closeDialog, addCitation, citationStyle, toast } = useUIStore();
  const { editor } = useEditorStore();

  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [publisher, setPublisher] = useState('');
  const [url, setUrl] = useState('');
  const [citationType, setCitationType] = useState('Book');

  const handleInsert = () => {
    if (!author.trim() || !title.trim()) {
      toast('Author and Title are required', 'warning');
      return;
    }

    const citation = {
      author,
      title,
      year,
      publisher,
      url,
      type: citationType,
    };

    // Add to Zustand store
    addCitation(citation);

    // Format citation based on style
    let citationText = '';
    switch (citationStyle) {
      case 'APA':
        citationText = `${author} (${year})`;
        break;
      case 'MLA':
        citationText = `${author}`;
        break;
      case 'Chicago':
        citationText = `${author}, ${title} (${year})`;
        break;
      case 'Harvard':
        citationText = `${author} ${year}`;
        break;
      default:
        citationText = `${author} (${year})`;
    }

    // Insert at cursor position
    if (editor) {
      editor.chain().focus().insertContent(`<sup>${citationText}</sup>`).run();
    }

    toast('Citation inserted', 'success');
    handleClose();
  };

  const handleClose = () => {
    closeDialog('citation');
    // Reset form
    setAuthor('');
    setTitle('');
    setYear(new Date().getFullYear().toString());
    setPublisher('');
    setUrl('');
    setCitationType('Book');
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Insert Citation">
      <Stack gap={16} style={{ padding: '16px', maxWidth: '500px' }}>
        {/* Author */}
        <div>
          <Label>Author *</Label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 11,
              fontFamily: 'var(--font-ui)',
              marginTop: 4,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Title */}
        <div>
          <Label>Title *</Label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Publication title"
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 11,
              fontFamily: 'var(--font-ui)',
              marginTop: 4,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Year */}
        <div>
          <Label>Year</Label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Publication year"
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 11,
              fontFamily: 'var(--font-ui)',
              marginTop: 4,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Publisher */}
        <div>
          <Label>Publisher</Label>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder="Publisher name"
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 11,
              fontFamily: 'var(--font-ui)',
              marginTop: 4,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* URL */}
        <div>
          <Label>URL</Label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 11,
              fontFamily: 'var(--font-ui)',
              marginTop: 4,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Type */}
        <div>
          <Label>Type</Label>
          <select
            value={citationType}
            onChange={(e) => setCitationType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 11,
              fontFamily: 'var(--font-ui)',
              marginTop: 4,
              boxSizing: 'border-box',
            }}
          >
            <option value="Book">Book</option>
            <option value="Journal">Journal</option>
            <option value="Website">Website</option>
            <option value="Article">Article</option>
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInsert}>
            Insert Citation
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
