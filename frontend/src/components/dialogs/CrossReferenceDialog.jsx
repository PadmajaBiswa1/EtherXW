import { useState, useMemo } from 'react';
import { useUIStore } from '@/store';
import { useEditorStore } from '@/store';
import { Modal, Button, Stack, Label } from '@/components/ui';

export function CrossReferenceDialog() {
  const { closeDialog, captions, toast } = useUIStore();
  const { editor } = useEditorStore();
  const [selectedType, setSelectedType] = useState('Figure');
  const [selectedItem, setSelectedItem] = useState(null);

  // Extract headings from editor
  const headings = useMemo(() => {
    if (!editor) return [];
    const doc = editor.state.doc;
    const headingsList = [];
    let h1Count = 0, h2Count = 0, h3Count = 0;

    doc.forEach((node) => {
      if (node.type.name === 'heading') {
        const level = node.attrs.level;
        if (level === 1) h1Count++;
        else if (level === 2) h2Count++;
        else if (level === 3) h3Count++;

        headingsList.push({
          id: `heading-${headingsList.length}`,
          type: 'Heading',
          level,
          text: node.textContent,
          fullText: `Heading ${level}: ${node.textContent}`,
        });
      }
    });

    return headingsList;
  }, [editor]);

  // Get items to display based on selected type
  const items = useMemo(() => {
    if (selectedType === 'Figure' || selectedType === 'Table' || selectedType === 'Equation') {
      return captions.filter((c) => c.label === selectedType);
    } else if (selectedType === 'Heading') {
      return headings;
    }
    return [];
  }, [selectedType, captions, headings]);

  const handleInsert = () => {
    if (!selectedItem) {
      toast('Please select an item', 'warning');
      return;
    }

    if (editor) {
      let crossRefText = '';
      if (selectedItem.type === 'Heading') {
        crossRefText = `<a href="#${selectedItem.id}" style="text-decoration: underline; color: #0563c1;">${selectedItem.text}</a>`;
      } else {
        crossRefText = `<a href="#${selectedItem.id}" style="text-decoration: underline; color: #0563c1;">${selectedItem.label} ${selectedItem.number}</a>`;
      }

      editor.chain().focus().insertContent(crossRefText).run();
      toast('Cross-reference inserted', 'success');
    }

    handleClose();
  };

  const handleClose = () => {
    closeDialog('crossReference');
    setSelectedType('Figure');
    setSelectedItem(null);
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Cross-Reference">
      <Stack gap={16} style={{ padding: '16px', maxWidth: '500px' }}>
        {/* Reference Type */}
        <div>
          <Label>Reference Type</Label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setSelectedItem(null);
            }}
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
            <option value="Heading">Heading</option>
            <option value="Figure">Figure</option>
            <option value="Table">Table</option>
            <option value="Equation">Equation</option>
            <option value="Bookmark">Bookmark</option>
          </select>
        </div>

        {/* Items List */}
        <div>
          <Label>Select Item</Label>
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              maxHeight: 250,
              overflowY: 'auto',
              marginTop: 4,
            }}
          >
            {items.length === 0 ? (
              <p style={{ padding: 12, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                No {selectedType.toLowerCase()}s found in the document.
              </p>
            ) : (
              <div>
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      width: '100%',
                      padding: 12,
                      background: selectedItem?.id === item.id ? 'var(--gold)' : 'var(--bg-elevated)',
                      border: 'none',
                      borderBottom: index < items.length - 1 ? '1px solid var(--border)' : 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: 10,
                      fontFamily: 'var(--font-ui)',
                      color: selectedItem?.id === item.id ? '#000' : 'var(--text-primary)',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedItem?.id !== item.id) {
                        e.currentTarget.style.background = 'var(--bg-surface)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedItem?.id !== item.id) {
                        e.currentTarget.style.background = 'var(--bg-elevated)';
                      }
                    }}
                  >
                    {item.type === 'Heading' ? (
                      <span>{item.text}</span>
                    ) : (
                      <span>{item.label} {item.number}: {item.text}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        {selectedItem && (
          <div>
            <Label>Preview</Label>
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 12,
                fontSize: 10,
                fontFamily: 'var(--font-ui)',
                color: '#0563c1',
                textDecoration: 'underline',
              }}
            >
              {selectedItem.type === 'Heading' ? selectedItem.text : `${selectedItem.label} ${selectedItem.number}`}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInsert} disabled={!selectedItem}>
            Insert Reference
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
