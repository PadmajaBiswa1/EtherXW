import { useState } from 'react';
import { useUIStore } from '@/store';
import { useEditorStore } from '@/store';
import { Modal, Button, Stack, Label } from '@/components/ui';

export function CaptionDialog() {
  const { closeDialog, addCaption, toast } = useUIStore();
  const { editor } = useEditorStore();

  const [captionText, setCaptionText] = useState('');
  const [labelType, setLabelType] = useState('Figure');
  const [number, setNumber] = useState('1');

  const handleInsert = () => {
    if (!captionText.trim()) {
      toast('Caption text is required', 'warning');
      return;
    }

    const caption = {
      text: captionText,
      label: labelType,
      number: parseInt(number),
      timestamp: new Date(),
    };

    // Add to Zustand store
    addCaption(caption);

    // Insert formatted caption below the cursor
    if (editor) {
      const formattedCaption = `<p style="text-align: center; font-size: 10pt; margin-top: 6pt;"><i>${labelType} ${number}: ${captionText}</i></p>`;
      editor.chain().focus().insertContent(formattedCaption).run();
    }

    toast('Caption inserted', 'success');
    handleClose();
  };

  const handleClose = () => {
    closeDialog('caption');
    setCaptionText('');
    setLabelType('Figure');
    setNumber('1');
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Insert Caption">
      <Stack gap={16} style={{ padding: '16px', maxWidth: '500px' }}>
        {/* Caption Text */}
        <div>
          <Label>Caption Text *</Label>
          <textarea
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            placeholder="Enter caption text"
            rows={4}
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
              fontWeight: 'normal',
            }}
          />
        </div>

        {/* Label Type */}
        <div>
          <Label>Label</Label>
          <select
            value={labelType}
            onChange={(e) => setLabelType(e.target.value)}
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
            <option value="Figure">Figure</option>
            <option value="Table">Table</option>
            <option value="Equation">Equation</option>
          </select>
        </div>

        {/* Number */}
        <div>
          <Label>Number</Label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            min="1"
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

        {/* Preview */}
        <div>
          <Label>Preview</Label>
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              marginTop: 4,
              fontSize: 10,
              fontFamily: 'var(--font-ui)',
              color: 'var(--text-primary)',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            {labelType} {number}: {captionText || '(preview)'}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInsert}>
            Insert Caption
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
