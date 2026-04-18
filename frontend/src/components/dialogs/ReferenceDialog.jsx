import React, { useState } from 'react';
import { useUIStore } from '@/store';

export function ReferenceDialog() {
  const { closeDialog, toast } = useUIStore();
  const [referenceTitle, setReferenceTitle] = useState('');
  const [referenceType, setReferenceType] = useState('book'); // 'book', 'journal', 'website', 'report'
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [url, setUrl] = useState('');
  const [referenceList, setReferenceList] = useState([]);

  const handleAddReference = () => {
    if (!referenceTitle.trim() || !author.trim()) {
      toast('Please enter reference title and author', 'warning');
      return;
    }

    const reference = {
      id: Date.now(),
      title: referenceTitle,
      type: referenceType,
      author,
      year,
      url,
    };

    setReferenceList([...referenceList, reference]);
    toast('Reference added', 'success');
    setReferenceTitle('');
    setAuthor('');
    setUrl('');
  };

  const handleRemoveReference = (id) => {
    setReferenceList(referenceList.filter(ref => ref.id !== id));
  };

  const handleInsertReferences = () => {
    if (referenceList.length === 0) {
      toast('Please add at least one reference', 'warning');
      return;
    }

    // Insert references into document
    // In a real app, this would be handled by the editor
    toast('References inserted into document', 'success');
    closeDialog('reference');
  };

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('reference')} />
      <div className="dialog-container" style={{ maxWidth: '600px' }}>
        <div className="dialog-header">
          <h2>Manage References</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('reference')}
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
          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Reference Type
            </label>
            <select
              value={referenceType}
              onChange={(e) => setReferenceType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '3px',
                color: '#e0e0e0',
                fontSize: '11px',
              }}
            >
              <option value="book">Book</option>
              <option value="journal">Journal</option>
              <option value="website">Website</option>
              <option value="report">Report</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Title
            </label>
            <input
              type="text"
              value={referenceTitle}
              onChange={(e) => setReferenceTitle(e.target.value)}
              placeholder="Reference title or name"
              style={{
                width: '100%',
                padding: '8px',
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '3px',
                color: '#e0e0e0',
                fontSize: '11px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              style={{
                width: '100%',
                padding: '8px',
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '3px',
                color: '#e0e0e0',
                fontSize: '11px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #404040',
                  borderRadius: '3px',
                  color: '#e0e0e0',
                  fontSize: '11px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                URL (optional)
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1a1a1a',
                  border: '1px solid #404040',
                  borderRadius: '3px',
                  color: '#e0e0e0',
                  fontSize: '11px',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleAddReference}
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
            Add Reference
          </button>

          {referenceList.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <h3 style={{ fontSize: '12px', color: '#d4af37', marginBottom: '8px' }}>
                References ({referenceList.length})
              </h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #404040', borderRadius: '3px' }}>
                {referenceList.map(ref => (
                  <div
                    key={ref.id}
                    style={{
                      padding: '8px',
                      borderBottom: '1px solid #404040',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '10px',
                      color: '#b0b0b0',
                    }}
                  >
                    <div>
                      <strong>{ref.title}</strong> — {ref.author} ({ref.year})
                    </div>
                    <button
                      onClick={() => handleRemoveReference(ref.id)}
                      style={{
                        background: '#d4af37',
                        color: '#000',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleInsertReferences}
              disabled={referenceList.length === 0}
              style={{
                flex: 1,
                padding: '8px 16px',
                background: referenceList.length === 0 ? '#666' : '#d4af37',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: referenceList.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: referenceList.length === 0 ? 0.5 : 1,
              }}
            >
              Insert References
            </button>
            <button
              onClick={() => closeDialog('reference')}
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
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
