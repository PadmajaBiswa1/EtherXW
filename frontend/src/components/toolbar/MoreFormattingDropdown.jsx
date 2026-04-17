import { useState, useRef, useEffect } from 'react';
import { Button, Divider } from '@/components/ui';
import { Tooltip } from '@/components/ui';

export function MoreFormattingDropdown({ 
  editor, 
  activeStyle, 
  textCase, 
  charSpacing, 
  lineSpacing,
  onTextCaseChange,
  onCharSpacingChange,
  onLineSpacingChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

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

  if (!editor) return null;

  const run = (fn) => { fn(); editor.view.focus(); };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <Tooltip text="More Formatting Options" shortcut="Alt+H+F+M">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          title="More Formatting"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 24,
            padding: 0,
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: 'bold',
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
          ⋯
        </button>
      </Tooltip>

      {/* Dropdown Menu */}
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
            padding: '8px',
            minWidth: 200,
          }}
        >
          {/* Line Spacing */}
          <div style={{ marginBottom: 8 }}>
            <label
              style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 4,
                letterSpacing: '0.05em',
              }}
            >
              Line Spacing
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {['1', '1.5', '2', '2.5'].map((spacing) => (
                <button
                  key={spacing}
                  onClick={() => {
                    onLineSpacingChange(spacing);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    background: lineSpacing === spacing ? 'var(--bg-active)' : 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: lineSpacing === spacing ? 'var(--gold)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (lineSpacing !== spacing) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = lineSpacing === spacing ? 'var(--bg-active)' : 'var(--bg-elevated)';
                  }}
                >
                  {spacing}x
                </button>
              ))}
            </div>
          </div>

          <Divider />

          {/* Character Spacing */}
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <label
              style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 4,
                letterSpacing: '0.05em',
              }}
            >
              Character Spacing
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {['0', '0.05em', '0.1em', '0.3em'].map((spacing) => {
                const labels = { '0': 'Normal', '0.05em': 'Tight', '0.1em': 'Condensed', '0.3em': 'Loose' };
                return (
                  <button
                    key={spacing}
                    onClick={() => {
                      onCharSpacingChange(spacing);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      background: charSpacing === spacing ? 'var(--bg-active)' : 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      color: charSpacing === spacing ? 'var(--gold)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (charSpacing !== spacing) {
                        e.currentTarget.style.background = 'var(--bg-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = charSpacing === spacing ? 'var(--bg-active)' : 'var(--bg-elevated)';
                    }}
                  >
                    {labels[spacing]}
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* Text Case */}
          <div style={{ marginTop: 8 }}>
            <label
              style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 4,
                letterSpacing: '0.05em',
              }}
            >
              Text Case
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { val: 'none', label: 'Normal' },
                { val: 'uppercase', label: 'UPPERCASE' },
                { val: 'lowercase', label: 'lowercase' },
                { val: 'capitalize', label: 'Capitalize' },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => {
                    onTextCaseChange(val);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    background: textCase === val ? 'var(--bg-active)' : 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: textCase === val ? 'var(--gold)' : 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (textCase !== val) {
                      e.currentTarget.style.background = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = textCase === val ? 'var(--bg-active)' : 'var(--bg-elevated)';
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
