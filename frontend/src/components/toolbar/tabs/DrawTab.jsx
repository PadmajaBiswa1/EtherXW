import { useState, useRef } from 'react';
import { useEditorStore, useUIStore } from '@/store';
import { RibbonGroup } from '../RibbonGroup';
import { Button, Tooltip } from '@/components/ui';

/* ── SVG ICON COMPONENTS ── */
const SelectIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6-6 6 6M12 3v18m9-6l-6 6-6-6"/>
  </svg>
);

const LassoIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M6 3c0 5 3 8 6 10M12 13c3 2 6 3 7 8M9 16l8 4"/>
  </svg>
);

const BallpointPenIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 20s1-1 2-1 2 1 2 1M8 20l8-16M16 20l-4-8"/>
  </svg>
);

const PencilIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7m0 0l8-8m0 8L12 3"/>
  </svg>
);

const HighlighterIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 9l3-3h12l3 3v12H3V9z"/>
    <line x1="6" y1="15" x2="18" y2="15" stroke="var(--gold)"/>
  </svg>
);

const EraserIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM9 9h6m-6 4h6"/>
  </svg>
);

const ReplayIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 7v6h6M21 17v-6h-6"/>
    <path d="M18.8 4.3A8 8 0 0 0 5 12m14 8a8 8 0 0 1-13.8 4.3"/>
  </svg>
);

const ConvertIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 8h16M4 16h16M9 3v6M15 3v6M9 15v6M15 15v6"/>
  </svg>
);

const ClearIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M15 9l-6 6M9 9l6 6"/>
  </svg>
);

export function DrawTab() {
  const { editor } = useEditorStore();
  const { drawingTool, setDrawingTool, drawingColor, setDrawingColor, drawingSize, setDrawingSize, drawingHistory, setDrawingHistory } = useUIStore();
  const colorPickerRef = useRef(null);
  const [colorOpen, setColorOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const sizeButtonRef = useRef(null);

  if (!editor) return null;

  const COLORS = [
    '#d4af37', // Gold
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
  ];

  const SIZES = [1, 2, 3, 5, 8, 12, 15, 20];

  const handleToolClick = (tool) => {
    if (drawingTool === tool) {
      setDrawingTool(null); // Toggle off
    } else {
      setDrawingTool(tool);
    }
  };

  const handleClear = () => {
    setDrawingHistory([]);
    const canvas = document.getElementById('drawing-layer-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleReplay = () => {
    if (window.drawingLayerReplay) {
      window.drawingLayerReplay();
    }
  };

  const isDrawingActive = drawingTool && drawingTool !== 'select' && drawingTool !== 'lasso';

  return (
    <>
      {/* ──────────────────── TOOLS GROUP ──────────────────── */}
      <RibbonGroup label="Tools">
        <Tooltip text="Select" shortcut="Esc">
          <Button
            onClick={() => handleToolClick('select')}
            style={{
              background: drawingTool === 'select' ? 'var(--gold)' : 'var(--bg-surface)',
              color: drawingTool === 'select' ? '#000' : 'var(--text-primary)',
              border: drawingTool === 'select' ? '2px solid var(--gold)' : '1px solid var(--border)',
              padding: '6px 8px',
            }}
          >
            <SelectIcon />
          </Button>
        </Tooltip>

        <Tooltip text="Lasso Select">
          <Button
            onClick={() => handleToolClick('lasso')}
            style={{
              background: drawingTool === 'lasso' ? 'var(--gold)' : 'var(--bg-surface)',
              color: drawingTool === 'lasso' ? '#000' : 'var(--text-primary)',
              border: drawingTool === 'lasso' ? '2px solid var(--gold)' : '1px solid var(--border)',
              padding: '6px 8px',
            }}
          >
            <LassoIcon />
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* ──────────────────── PENS GROUP ──────────────────── */}
      <RibbonGroup label="Pens">
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Tooltip text="Ballpoint Pen">
            <Button
              onClick={() => handleToolClick('ballpoint')}
              style={{
                background: drawingTool === 'ballpoint' ? 'var(--gold)' : 'var(--bg-surface)',
                color: drawingTool === 'ballpoint' ? '#000' : 'var(--text-primary)',
                border: drawingTool === 'ballpoint' ? '2px solid var(--gold)' : '1px solid var(--border)',
                padding: '6px 8px',
              }}
            >
              <BallpointPenIcon />
            </Button>
          </Tooltip>

          <Tooltip text="Pencil">
            <Button
              onClick={() => handleToolClick('pencil')}
              style={{
                background: drawingTool === 'pencil' ? 'var(--gold)' : 'var(--bg-surface)',
                color: drawingTool === 'pencil' ? '#000' : 'var(--text-primary)',
                border: drawingTool === 'pencil' ? '2px solid var(--gold)' : '1px solid var(--border)',
                padding: '6px 8px',
              }}
            >
              <PencilIcon />
            </Button>
          </Tooltip>

          <Tooltip text="Highlighter">
            <Button
              onClick={() => handleToolClick('highlighter')}
              style={{
                background: drawingTool === 'highlighter' ? 'var(--gold)' : 'var(--bg-surface)',
                color: drawingTool === 'highlighter' ? '#000' : 'var(--text-primary)',
                border: drawingTool === 'highlighter' ? '2px solid var(--gold)' : '1px solid var(--border)',
                padding: '6px 8px',
              }}
            >
              <HighlighterIcon />
            </Button>
          </Tooltip>

          <Tooltip text="Eraser">
            <Button
              onClick={() => handleToolClick('eraser')}
              style={{
                background: drawingTool === 'eraser' ? 'var(--gold)' : 'var(--bg-surface)',
                color: drawingTool === 'eraser' ? '#000' : 'var(--text-primary)',
                border: drawingTool === 'eraser' ? '2px solid var(--gold)' : '1px solid var(--border)',
                padding: '6px 8px',
              }}
            >
              <EraserIcon />
            </Button>
          </Tooltip>
        </div>
      </RibbonGroup>

      {/* ──────────────────── PEN OPTIONS (Show when tool active) ──────────────────── */}
      {isDrawingActive && (
        <RibbonGroup label="Pen Options" style={{ minWidth: 200 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Color Picker */}
            <div style={{ position: 'relative' }} ref={colorPickerRef}>
              <button
                onClick={() => setColorOpen(!colorOpen)}
                style={{
                  width: 28,
                  height: 28,
                  background: drawingColor,
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                title="Pen Color"
              />
              
              {colorOpen && (() => {
                const rect = colorPickerRef.current?.getBoundingClientRect?.();
                return (
                  <div style={{
                    position: 'fixed',
                    top: rect ? rect.bottom + 4 : 'auto',
                    left: rect ? rect.left : 0,
                    zIndex: 10000,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    padding: 8,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 6,
                  }}>
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setDrawingColor(color);
                          setColorOpen(false);
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          background: color,
                          border: drawingColor === color ? '3px solid var(--gold)' : '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'all 0.1s',
                        }}
                        onMouseEnter={(e) => {
                          if (drawingColor !== color) {
                            e.currentTarget.style.borderColor = 'var(--gold)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (drawingColor !== color) {
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }
                        }}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Size Control */}
            <div style={{ position: 'relative' }} ref={sizeButtonRef}>
              <button
                onClick={() => setSizeOpen(!sizeOpen)}
                style={{
                  padding: '4px 8px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                {drawingSize}px
              </button>

              {sizeOpen && (() => {
                const rect = sizeButtonRef.current?.getBoundingClientRect?.();
                return (
                  <div style={{
                    position: 'fixed',
                    top: rect ? rect.bottom + 4 : 'auto',
                    left: rect ? rect.left : 0,
                    zIndex: 10000,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    padding: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}>
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setDrawingSize(size);
                          setSizeOpen(false);
                        }}
                        style={{
                          padding: '6px 10px',
                          background: drawingSize === size ? 'var(--bg-gold)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 12,
                          color: 'var(--text-primary)',
                          textAlign: 'left',
                          borderRadius: 'var(--radius-sm)',
                          transition: 'all 0.1s',
                        }}
                        onMouseEnter={(e) => {
                          if (drawingSize !== size) {
                            e.currentTarget.style.background = 'var(--bg-elevated)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (drawingSize !== size) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        {size} px
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </RibbonGroup>
      )}

      {/* ──────────────────── REPLAY GROUP ──────────────────── */}
      {drawingHistory.length > 0 && (
        <RibbonGroup label="Replay">
          <Tooltip text="Replay Drawing" shortcut="Ctrl+R">
            <Button onClick={handleReplay} style={{ padding: '6px 8px' }}>
              <ReplayIcon />
            </Button>
          </Tooltip>
        </RibbonGroup>
      )}

      {/* ──────────────────── DRAWING EDIT GROUP ──────────────────── */}
      {drawingHistory.length > 0 && (
        <RibbonGroup label="Edit Drawing">
          <Tooltip text="Clear Drawing">
            <Button onClick={handleClear} style={{ padding: '6px 8px' }}>
              <ClearIcon />
            </Button>
          </Tooltip>
        </RibbonGroup>
      )}

      {/* ──────────────────── CONVERT GROUP ──────────────────── */}
      <RibbonGroup label="Convert">
        <div style={{ display: 'flex', gap: 3 }}>
          <Tooltip text="Ink to Text (Coming Soon)">
            <Button disabled style={{ padding: '6px 8px', opacity: 0.5 }}>
              <ConvertIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Ink to Shape (Coming Soon)">
            <Button disabled style={{ padding: '6px 8px', opacity: 0.5 }}>
              ◆
            </Button>
          </Tooltip>
          <Tooltip text="Ink to Math (Coming Soon)">
            <Button disabled style={{ padding: '6px 8px', opacity: 0.5 }}>
              ∑
            </Button>
          </Tooltip>
        </div>
      </RibbonGroup>
    </>
  );
}
