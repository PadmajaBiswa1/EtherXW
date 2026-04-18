import React, { useState } from 'react';
import { useUIStore } from '@/store';

export function CompareDialog() {
  const { closeDialog, toast } = useUIStore();
  const [originalText, setOriginalText] = useState('');
  const [differences, setDifferences] = useState([]);
  const [showDifferences, setShowDifferences] = useState(false);

  const compareTexts = () => {
    if (!originalText.trim()) {
      toast('Please paste original document', 'warning');
      return;
    }

    const currentText = document.body.innerText || '';
    const origLines = originalText.split('\n');
    const currLines = currentText.split('\n');

    const diffs = [];
    const maxLines = Math.max(origLines.length, currLines.length);

    for (let i = 0; i < maxLines; i++) {
      const origLine = origLines[i] || '';
      const currLine = currLines[i] || '';

      if (origLine !== currLine) {
        diffs.push({
          line: i + 1,
          original: origLine,
          current: currLine,
          type: origLine && !currLine ? 'deleted' : !origLine && currLine ? 'added' : 'changed',
        });
      }
    }

    setDifferences(diffs);
    setShowDifferences(true);
    toast(`Found ${diffs.length} differences`, 'info');
  };

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('compare')} />
      <div
        className="dialog-container"
        style={{
          maxWidth: '800px',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <div className="dialog-header">
          <h2>Compare Documents</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('compare')}
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
          <p style={{ fontSize: '11px', color: '#b0b0b0' }}>
            Paste the original document content to compare against the current document.
          </p>

          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Paste original document here..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '8px',
              background: '#1a1a1a',
              border: '1px solid #404040',
              borderRadius: '3px',
              color: '#e0e0e0',
              fontSize: '11px',
              fontFamily: 'monospace',
              resize: 'vertical',
            }}
          />

          <button
            onClick={compareTexts}
            style={{
              padding: '8px 16px',
              background: '#d4af37',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Compare Documents
          </button>

          {showDifferences && differences.length > 0 && (
            <div>
              <h3 style={{ fontSize: '12px', color: '#d4af37', margin: '8px 0' }}>
                {differences.length} Difference{differences.length !== 1 ? 's' : ''} Found:
              </h3>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {differences.map((diff, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px',
                      background: '#1f1f1f',
                      border: `1px solid ${diff.type === 'deleted' ? '#ff6b6b' : diff.type === 'added' ? '#51cf66' : '#ffd93d'}`,
                      borderRadius: '3px',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: '#b0b0b0', marginBottom: '4px' }}>
                      Line {diff.line} — <strong>{diff.type.toUpperCase()}</strong>
                    </div>
                    {diff.original && (
                      <div style={{ fontSize: '11px', color: '#ff6b6b', marginBottom: '4px' }}>
                        <strong>Original:</strong> {diff.original.substring(0, 100)}
                        {diff.original.length > 100 ? '...' : ''}
                      </div>
                    )}
                    {diff.current && (
                      <div style={{ fontSize: '11px', color: '#51cf66' }}>
                        <strong>Current:</strong> {diff.current.substring(0, 100)}
                        {diff.current.length > 100 ? '...' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {showDifferences && differences.length === 0 && (
            <div style={{ padding: '16px', textAlign: 'center', color: '#51cf66' }}>
              ✓ Documents are identical
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => closeDialog('compare')}
              style={{
                flex: 1,
                padding: '8px 16px',
                background: 'transparent',
                color: '#b0b0b0',
                border: '1px solid #404040',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
