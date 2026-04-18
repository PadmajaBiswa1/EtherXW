import { useState } from 'react';
import { useUIStore } from '@/store';
import { Modal, Button, Stack, Label } from '@/components/ui';

export function PageBordersDialog() {
  const { closeDialog } = useUIStore();
  const [borderStyle, setBorderStyle] = useState('box');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState(1);

  const applyBorder = () => {
    // Find the page container - try multiple selectors
    let pageWrapper = document.querySelector('[class*="page-wrapper"]') || 
                      document.querySelector('.page-editor') ||
                      document.querySelector('[class*="page-content"]') ||
                      document.querySelector('.ProseMirror')?.closest('[class*="page"]');
    
    if (!pageWrapper) {
      // If still not found, try to find the editor container
      const editor = document.querySelector('.ProseMirror');
      if (editor) {
        pageWrapper = editor.parentElement;
      }
    }

    if (!pageWrapper) {
      closeDialog('pageBorders');
      return;
    }

    if (borderStyle === 'none') {
      pageWrapper.style.border = 'none';
      pageWrapper.style.boxShadow = 'none';
    } else if (borderStyle === 'box') {
      pageWrapper.style.border = `${borderWidth}px solid ${borderColor}`;
      pageWrapper.style.boxShadow = 'none';
    } else if (borderStyle === '3d') {
      pageWrapper.style.border = `${borderWidth}px solid ${borderColor}`;
      pageWrapper.style.boxShadow = `inset 0 ${borderWidth * 2}px ${borderWidth * 4}px rgba(0,0,0,0.2)`;
    } else if (borderStyle === 'shadow') {
      pageWrapper.style.border = `${borderWidth}px solid ${borderColor}`;
      pageWrapper.style.boxShadow = `0 ${borderWidth * 2}px ${borderWidth * 4}px rgba(0,0,0,0.15)`;
    }

    closeDialog('pageBorders');
  };

  return (
    <Modal title="Page Borders" onClose={() => closeDialog('pageBorders')} width={420}>
      <Stack gap={12}>
        <div>
          <Label>Border Style</Label>
          <select
            value={borderStyle}
            onChange={(e) => setBorderStyle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 12,
              fontFamily: 'var(--font-ui)',
              cursor: 'pointer',
            }}
          >
            <option value="none">No Border</option>
            <option value="box">Box</option>
            <option value="shadow">Shadow</option>
            <option value="3d">3D</option>
          </select>
        </div>

        {borderStyle !== 'none' && (
          <>
            <div>
              <Label>Color</Label>
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                style={{
                  width: '100%',
                  height: 40,
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                }}
              />
            </div>

            <div>
              <Label>Width: {borderWidth}px</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Button variant="outline" onClick={() => closeDialog('pageBorders')}>Cancel</Button>
          <Button variant="primary" onClick={applyBorder}>Apply Borders</Button>
        </div>
      </Stack>
    </Modal>
  );
}
