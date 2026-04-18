import { useState } from 'react';
import { useUIStore } from '@/store';
import { Modal, Button, Stack, Label } from '@/components/ui';

const PRESET_TEXTS = [
  { value: 'CONFIDENTIAL', label: 'CONFIDENTIAL' },
  { value: 'DRAFT', label: 'DRAFT' },
  { value: 'DO NOT COPY', label: 'DO NOT COPY' },
  { value: 'URGENT', label: 'URGENT' },
  { value: 'APPROVED', label: 'APPROVED' },
];

export function WatermarkDialog() {
  const { closeDialog, watermarkEnabled, watermarkText: storeText, watermarkOpacity: storeOpacity, watermarkFontSize: storeFontSize, setWatermarkEnabled, setWatermarkText: setStoreText, setWatermarkOpacity: setStoreOpacity, setWatermarkFontSize: setStoreFontSize } = useUIStore();
  const [watermarkType, setWatermarkType] = useState(watermarkEnabled ? 'text' : 'none');
  const [textMode, setTextMode] = useState('preset');
  const [presetText, setPresetText] = useState(storeText);
  const [customText, setCustomText] = useState('');
  const [opacity, setOpacity] = useState(storeOpacity);
  const [fontSize, setFontSize] = useState(storeFontSize);

  const getWatermarkText = () => textMode === 'preset' ? presetText : customText;

  const applyWatermark = () => {
    if (watermarkType === 'text' && getWatermarkText().trim()) {
      // Save to store for persistence
      setWatermarkEnabled(true);
      setStoreText(getWatermarkText());
      setStoreOpacity(opacity);
      setStoreFontSize(fontSize);

      // Remove existing watermarks from all pages
      document.querySelectorAll('#watermark-layer').forEach(el => el.remove());

      // Get all page containers
      const pages = document.querySelectorAll('[id^="document-page"]');
      
      if (pages.length === 0) {
        console.error('Could not find any page elements');
        closeDialog('watermark');
        return;
      }

      // Apply watermark to each page
      pages.forEach((pageWrapper, index) => {
        // Ensure position: relative for absolute positioning to work
        if (getComputedStyle(pageWrapper).position === 'static') {
          pageWrapper.style.position = 'relative';
        }

        // Create a watermark container that covers the entire page
        const watermarkLayer = document.createElement('div');
        watermarkLayer.id = 'watermark-layer';
        watermarkLayer.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
          overflow: hidden;
        `;

        // Create the SVG watermark
        const watermarkSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        watermarkSVG.setAttribute('width', '100%');
        watermarkSVG.setAttribute('height', '100%');
        watermarkSVG.setAttribute('viewBox', '0 0 1200 1400');
        watermarkSVG.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        watermarkSVG.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        `;

        // Create the text element
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '600');
        text.setAttribute('y', '700');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', fontSize);
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('fill-opacity', `${opacity / 100}`);
        text.setAttribute('fill', 'rgba(192, 192, 192, 1)');
        text.setAttribute('transform', `rotate(-45 600 700)`);
        text.setAttribute('font-style', 'italic');
        text.textContent = getWatermarkText();

        watermarkSVG.appendChild(text);
        watermarkLayer.appendChild(watermarkSVG);

        // Insert at the beginning so it stays behind content
        pageWrapper.insertBefore(watermarkLayer, pageWrapper.firstChild);
      });

    } else if (watermarkType === 'none') {
      // Save to store
      setWatermarkEnabled(false);
      document.querySelectorAll('#watermark-layer').forEach(el => el.remove());
    }

    closeDialog('watermark');
  };

  return (
    <Modal title="Watermark" onClose={() => closeDialog('watermark')} width={450}>
      <Stack gap={14}>
        {/* Watermark Type Selection */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer' }}>
            <input
              type="radio"
              value="text"
              checked={watermarkType === 'text'}
              onChange={(e) => setWatermarkType(e.target.value)}
              style={{ cursor: 'pointer', accentColor: 'var(--gold)', width: 16, height: 16 }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Text Watermark</span>
          </label>

          {watermarkType === 'text' && (
            <div style={{ marginLeft: 24, background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
              {/* Text Mode Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => setTextMode('preset')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: textMode === 'preset' ? 'var(--gold)' : 'var(--bg-surface)',
                    color: textMode === 'preset' ? '#000' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 11,
                    transition: 'all 0.1s',
                  }}
                >
                  Preset Text
                </button>
                <button
                  onClick={() => setTextMode('custom')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: textMode === 'custom' ? 'var(--gold)' : 'var(--bg-surface)',
                    color: textMode === 'custom' ? '#000' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 11,
                    transition: 'all 0.1s',
                  }}
                >
                  Custom Text
                </button>
              </div>

              {/* Preset Text Selection */}
              {textMode === 'preset' && (
                <div>
                  <Label>Select text:</Label>
                  <select
                    value={presetText}
                    onChange={(e) => setPresetText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      fontFamily: 'var(--font-ui)',
                      cursor: 'pointer',
                    }}
                  >
                    {PRESET_TEXTS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Text Input */}
              {textMode === 'custom' && (
                <div>
                  <Label>Enter custom text:</Label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                    placeholder="e.g., CONFIDENTIAL"
                    maxLength={30}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      fontFamily: 'var(--font-ui)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    {customText.length}/30 characters
                  </div>
                </div>
              )}
            </div>
          )}

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              value="none"
              checked={watermarkType === 'none'}
              onChange={(e) => setWatermarkType(e.target.value)}
              style={{ cursor: 'pointer', accentColor: 'var(--gold)', width: 16, height: 16 }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>No Watermark</span>
          </label>
        </div>

        {/* Watermark Properties */}
        {watermarkType === 'text' && (
          <Stack gap={12}>
            <div>
              <Label>Font Size: {fontSize}px</Label>
              <input
                type="range"
                min="60"
                max="200"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div>
              <Label>Opacity: {opacity}%</Label>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* Preview */}
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              minHeight: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                fontSize: `${Math.min(fontSize / 2, 60)}px`,
                fontWeight: 'bold',
                color: `rgba(192, 192, 192, ${opacity / 100})`,
                transform: 'rotate(-45deg)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                fontStyle: 'italic',
              }}>
                {getWatermarkText() || '(Preview)'}
              </div>
            </div>
          </Stack>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Button variant="outline" onClick={() => closeDialog('watermark')}>Cancel</Button>
          <Button
            variant="primary"
            onClick={applyWatermark}
            disabled={watermarkType === 'text' && !getWatermarkText().trim()}
          >
            Apply Watermark
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
