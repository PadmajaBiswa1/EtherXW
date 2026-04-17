import { useState, useRef, useEffect } from 'react';
import { useUIStore } from '@/store';
import { Tooltip } from '@/components/ui';

// Comprehensive font list organized by category
const FONT_CATEGORIES = {
  'Recommended': [
    'Crimson Pro',
    'Calibri',
    'Arial',
    'Trebuchet MS',
  ],
  'Serif': [
    'Times New Roman',
    'Garamond',
    'Georgia',
    'Bookman',
    'Palatino',
    'Cambria',
  ],
  'Sans-Serif': [
    'Arial',
    'Helvetica',
    'Verdana',
    'Calibri',
    'Segoe UI',
    'Tahoma',
    'Century Gothic',
  ],
  'Monospace': [
    'Courier New',
    'Courier',
    'Consolas',
    'Monaco',
    'Lucida Console',
    'JetBrains Mono',
  ],
  'Display/Script': [
    'Impact',
    'Comic Sans MS',
    'Lucida Handwriting',
    'Brush Script MT',
  ],
};

// Flatten for easier access
const ALL_FONTS = Object.values(FONT_CATEGORIES).flat();

export function FontFamilyPicker({ currentFont, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useUIStore();
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

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

  // Calculate dropdown position
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
    });
  }, [isOpen]);

  const handleFontSelect = (font) => {
    onSelect(font);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Filter fonts based on search term
  const filteredFonts = searchTerm
    ? ALL_FONTS.filter((f) =>
        f.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : ALL_FONTS;

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Font Picker Button */}
      <Tooltip text="Font Family" shortcut="Ctrl+D">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          title="Select font family"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 140,
            height: 28,
            padding: '2px 8px',
            background: 'var(--bg-elevated)',
            border: isOpen
              ? '1px solid var(--gold)'
              : '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontFamily: currentFont || 'Arial',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = 'var(--gold)';
              e.currentTarget.style.background = 'var(--bg-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--bg-elevated)';
            }
          }}
        >
          <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentFont || 'Arial'}
          </span>
          <span
            style={{
              fontSize: '8px',
              color: 'var(--text-secondary)',
              marginLeft: 4,
            }}
          >
            ▼
          </span>
        </button>
      </Tooltip>

      {/* Font Dropdown */}
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
            boxShadow: 'var(--shadow-md)',
            zIndex: 50001,
            minWidth: 240,
            maxHeight: 420,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Search Input */}
          <div
            style={{
              padding: '8px 10px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
            }}
          >
            <input
              autoFocus
              type="text"
              placeholder="Search fonts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: '11px',
                fontFamily: 'var(--font-ui)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--gold)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Font List with Categories */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
            className="font-list-scroll"
          >
            {searchTerm ? (
              // Search Results (flat list)
              filteredFonts.map((font) => (
                <button
                  key={font}
                  onClick={() => handleFontSelect(font)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background:
                      currentFont === font
                        ? 'rgba(212, 175, 55, 0.15)'
                        : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    color:
                      currentFont === font
                        ? 'var(--gold)'
                        : 'var(--text-primary)',
                    fontFamily: font,
                    fontSize: '13px',
                    fontWeight: currentFont === font ? 600 : 400,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (currentFont !== font) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentFont !== font) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {font}
                  {currentFont === font && (
                    <span
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--gold)',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))
            ) : (
              // Categorized list
              Object.entries(FONT_CATEGORIES).map(([category, fonts]) => (
                <div key={category}>
                  {/* Category Header */}
                  <div
                    style={{
                      padding: '6px 12px',
                      fontSize: '9px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-elevated)',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid var(--border)',
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    {category}
                  </div>

                  {/* Fonts in this category */}
                  {fonts.map((font) => (
                    <button
                      key={font}
                      onClick={() => handleFontSelect(font)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background:
                          currentFont === font
                            ? 'rgba(212, 175, 55, 0.15)'
                            : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--border)',
                        color:
                          currentFont === font
                            ? 'var(--gold)'
                            : 'var(--text-primary)',
                        fontFamily: font,
                        fontSize: '13px',
                        fontWeight: currentFont === font ? 600 : 400,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        if (currentFont !== font) {
                          e.currentTarget.style.background = 'var(--bg-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentFont !== font) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {font}
                      {currentFont === font && (
                        <span
                          style={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--gold)',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Custom scrollbar styling */}
      <style>{`
        .font-list-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .font-list-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .font-list-scroll::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 3px;
        }
        .font-list-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  );
}
