import { useState, useRef, useEffect } from 'react';
import { Button, ColorSwatch, Divider } from '@/components/ui';
import { Tooltip } from '@/components/ui';

// MS Word-inspired color palettes
const THEME_COLORS = [
  { name: 'Black',       hex: '#000000' },
  { name: 'Dark Gray',   hex: '#333333' },
  { name: 'Gray',        hex: '#666666' },
  { name: 'Light Gray',  hex: '#999999' },
  { name: 'White',       hex: '#ffffff' },
  { name: 'Dark Red',    hex: '#c00000' },
  { name: 'Red',         hex: '#ff0000' },
  { name: 'Orange',      hex: '#ff6600' },
  { name: 'Yellow',      hex: '#ffcc00' },
  { name: 'Light Green', hex: '#92d050' },
  { name: 'Green',       hex: '#00b050' },
  { name: 'Dark Green',  hex: '#00802b' },
  { name: 'Dark Blue',   hex: '#1f4788' },
  { name: 'Blue',        hex: '#4472c4' },
  { name: 'Light Blue',  hex: '#b4c7e7' },
  { name: 'Purple',      hex: '#7030a0' },
];

const STANDARD_COLORS = [
  { name: 'Dark Red',      hex: '#9c0006' },
  { name: 'Red',           hex: '#ff0000' },
  { name: 'Orange',        hex: '#ff6600' },
  { name: 'Yellow',        hex: '#ffff00' },
  { name: 'Lime',          hex: '#92d050' },
  { name: 'Green',         hex: '#00b050' },
  { name: 'Dark Cyan',     hex: '#00b0f0' },
  { name: 'Cyan',          hex: '#00d8ff' },
  { name: 'Blue',          hex: '#0070c0' },
  { name: 'Indigo',        hex: '#002060' },
  { name: 'Purple',        hex: '#7030a0' },
  { name: 'Magenta',       hex: '#ff00ff' },
];

// Gradient color presets
const GRADIENT_COLORS = [
  { name: 'Sunset',         gradient: 'linear-gradient(90deg, #ff6600, #ffcc00)' },
  { name: 'Ocean',          gradient: 'linear-gradient(90deg, #0070c0, #00b0f0)' },
  { name: 'Forest',         gradient: 'linear-gradient(90deg, #00802b, #92d050)' },
  { name: 'Twilight',       gradient: 'linear-gradient(90deg, #7030a0, #4472c4)' },
  { name: 'Fire',           gradient: 'linear-gradient(90deg, #c00000, #ff6600)' },
  { name: 'Aurora',         gradient: 'linear-gradient(90deg, #9c27b0, #2196f3)' },
];

export function TextColorPicker({ onSelect, currentColor, editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(currentColor || '#000000');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [previewColor, setPreviewColor] = useState(null);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const previewTimeoutRef = useRef(null);

  // Sync customColor when currentColor changes
  useEffect(() => {
    if (currentColor) {
      setCustomColor(currentColor);
    }
  }, [currentColor]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Calculate dropdown position when opened
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
    });
  }, [isOpen]);

  // Clean up preview timeout
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  const handleColorSelect = (color) => {
    onSelect(color);
    setPreviewColor(null);
    setIsOpen(false);
  };

  const handleColorHover = (color) => {
    // Debounce preview to avoid excessive updates
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    previewTimeoutRef.current = setTimeout(() => {
      if (editor) {
        setPreviewColor(color);
        // Temporarily apply color for preview
        editor.chain().setColor(color).run();
      }
    }, 80);
  };

  const handleColorHoverEnd = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    if (previewColor && editor) {
      setPreviewColor(null);
      // Revert to original color
      editor.chain().setColor(currentColor || '#000000').run();
    }
  };

  const handleMoreColors = () => {
    // Trigger native color picker
    const input = document.createElement('input');
    input.type = 'color';
    input.value = customColor;
    input.addEventListener('change', (e) => {
      handleColorSelect(e.target.value);
    });
    input.click();
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Color Button */}
      <Tooltip text="Text Color (A↓)" shortcut="Alt+H+F+C">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          title="Text Color"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 28,
            padding: 0,
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }
          }}
        >
          {/* Letter A icon */}
          <span style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginRight: -2,
          }}>
            A
          </span>
          {/* Color indicator bar under A */}
          <div
            style={{
              position: 'absolute',
              bottom: 2,
              left: 6,
              right: 6,
              height: 3,
              backgroundColor: previewColor || currentColor || '#000000',
              borderRadius: '1px',
              transition: 'background-color 0.15s ease',
            }}
          />
          {/* Dropdown arrow */}
          <span
            style={{
              fontSize: '8px',
              color: 'var(--text-secondary)',
              marginLeft: 2,
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            }}
          >
            ▼
          </span>
        </button>
      </Tooltip>

      {/* Dropdown Palette - Fixed positioning to escape container clipping */}
      {isOpen && (
        <div
          className="anim-fade-in"
          style={{
            position: 'fixed',
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.2)',
            zIndex: 50001,
            padding: '12px',
            minWidth: 260,
            maxWidth: 300,
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Theme Colors Section */}
          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 8,
                letterSpacing: '0.05em',
              }}
            >
              Theme Colors
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: 6,
              }}
            >
              {THEME_COLORS.map((color) => (
                <div key={color.hex} style={{ position: 'relative' }}>
                  <button
                    onClick={() => handleColorSelect(color.hex)}
                    onMouseEnter={() => handleColorHover(color.hex)}
                    onMouseLeave={handleColorHoverEnd}
                    title={color.name}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      background: color.hex,
                      border:
                        currentColor === color.hex
                          ? '2px solid var(--gold)'
                          : '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.15s ease',
                      boxShadow:
                        currentColor === color.hex
                          ? '0 0 8px rgba(212, 175, 55, 0.4)'
                          : 'none',
                    }}
                    onMouseEnterCapture={(e) => {
                      if (currentColor !== color.hex) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow =
                          '0 0 8px rgba(212, 175, 55, 0.3)';
                      }
                    }}
                    onMouseLeaveCapture={(e) => {
                      if (currentColor !== color.hex) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {currentColor === color.hex && (
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: color.hex === '#ffffff' ? '#000' : '#fff',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* Standard Colors Section */}
          <div style={{ marginBottom: 12, marginTop: 12 }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 8,
                letterSpacing: '0.05em',
              }}
            >
              Standard Colors
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: 4,
              }}
            >
              {STANDARD_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleColorSelect(color.hex)}
                  onMouseEnter={() => handleColorHover(color.hex)}
                  onMouseLeave={handleColorHoverEnd}
                  title={color.name}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: color.hex,
                    border:
                      currentColor === color.hex
                        ? '2px solid var(--gold)'
                        : '1px solid var(--border)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnterCapture={(e) => {
                    if (currentColor !== color.hex) {
                      e.currentTarget.style.transform = 'scale(1.15)';
                    }
                  }}
                  onMouseLeaveCapture={(e) => {
                    if (currentColor !== color.hex) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <Divider />

          {/* Gradient Colors Section */}
          <div style={{ marginBottom: 12, marginTop: 12 }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 8,
                letterSpacing: '0.05em',
              }}
            >
              Gradient Colors
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 6,
              }}
            >
              {GRADIENT_COLORS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    // For gradients, apply the first color as a solid
                    const firstColor = item.gradient.match(/#[0-9a-f]{6}/i)?.[0] || '#ff6600';
                    handleColorSelect(firstColor);
                  }}
                  title={item.name}
                  style={{
                    width: '100%',
                    height: '32px',
                    background: item.gradient,
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 0 8px rgba(212, 175, 55, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#fff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Divider />

          {/* More Colors Section */}
          <div style={{ marginTop: 12 }}>
            <button
              onClick={handleMoreColors}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg-hover)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-active)';
                e.currentTarget.style.borderColor = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              More Colors...
            </button>
          </div>

          {/* Current Color Display */}
          <div
            style={{
              marginTop: 12,
              padding: '8px',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                background: customColor,
                border: '1px solid var(--border)',
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                Current Color
              </div>
              <input
                type="text"
                value={customColor.toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(val)) {
                    setCustomColor(val);
                    onSelect(val);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '3px 6px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '2px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
