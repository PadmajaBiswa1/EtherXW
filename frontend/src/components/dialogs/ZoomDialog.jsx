import React, { useState } from 'react';
import { useUIStore } from '@/store';

const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200];

export function ZoomDialog() {
  const { zoom, setZoom, closeDialog } = useUIStore();
  const [customZoom, setCustomZoom] = useState(zoom);

  const handlePreset = (value) => {
    setZoom(value);
    closeDialog('zoom');
  };

  const handleCustom = () => {
    const parsed = parseInt(customZoom, 10);
    if (parsed >= 10 && parsed <= 400) {
      setZoom(parsed);
      closeDialog('zoom');
    }
  };

  const handlePageWidth = () => {
    // Calculate zoom to fit page width (roughly 85%)
    setZoom(85);
    closeDialog('zoom');
  };

  const handleWholePage = () => {
    // Calculate zoom to fit whole page (roughly 60%)
    setZoom(60);
    closeDialog('zoom');
  };

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('zoom')} />
      <div className="dialog-container" style={{ maxWidth: '400px' }}>
        <div className="dialog-header">
          <h2>Zoom</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('zoom')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#b0b0b0',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div className="dialog-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Preset buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {ZOOM_PRESETS.map(preset => (
              <button
                key={preset}
                onClick={() => handlePreset(preset)}
                style={{
                  padding: '8px 12px',
                  background: zoom === preset ? '#d4af37' : '#1a1a1a',
                  color: zoom === preset ? '#000' : '#e0e0e0',
                  border: zoom === preset ? 'none' : '1px solid #404040',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '11px',
                }}
              >
                {preset}%
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #404040', paddingTop: '12px' }}>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Custom Percentage
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                min="10"
                max="400"
                value={customZoom}
                onChange={(e) => setCustomZoom(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #404040',
                  borderRadius: '3px',
                  color: '#e0e0e0',
                  fontSize: '11px',
                }}
              />
              <button
                onClick={handleCustom}
                style={{
                  padding: '8px 16px',
                  background: '#d4af37',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '11px',
                }}
              >
                OK
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #404040', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={handlePageWidth}
              style={{
                padding: '8px 12px',
                background: '#1a1a1a',
                color: '#e0e0e0',
                border: '1px solid #404040',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '11px',
                textAlign: 'left',
              }}
            >
              Page Width
            </button>
            <button
              onClick={handleWholePage}
              style={{
                padding: '8px 12px',
                background: '#1a1a1a',
                color: '#e0e0e0',
                border: '1px solid #404040',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '11px',
                textAlign: 'left',
              }}
            >
              Whole Page
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '10px', color: '#888', paddingTop: '8px' }}>
            Current: {zoom}%
          </div>
        </div>
      </div>
    </div>
  );
}
