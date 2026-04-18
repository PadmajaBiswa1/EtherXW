import React, { useState } from 'react';
import { useUIStore } from '@/store';

export function MacrosDialog() {
  const { closeDialog, toast } = useUIStore();
  const [macros, setMacros] = useState([]);
  const [selectedMacro, setSelectedMacro] = useState(null);

  const handleRecordMacro = () => {
    toast('Macro recording not yet implemented', 'info');
  };

  const handleRunMacro = () => {
    if (!selectedMacro) {
      toast('Please select a macro to run', 'warning');
      return;
    }
    toast(`Running macro: ${selectedMacro.name}`, 'success');
  };

  const handleEditMacro = () => {
    if (!selectedMacro) {
      toast('Please select a macro to edit', 'warning');
      return;
    }
    toast(`Editing macro: ${selectedMacro.name}`, 'info');
  };

  const handleDeleteMacro = () => {
    if (!selectedMacro) {
      toast('Please select a macro to delete', 'warning');
      return;
    }
    setMacros(macros.filter(m => m.id !== selectedMacro.id));
    setSelectedMacro(null);
    toast('Macro deleted', 'success');
  };

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('macros')} />
      <div className="dialog-container" style={{ maxWidth: '500px' }}>
        <div className="dialog-header">
          <h2>Macros</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('macros')}
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
          {/* Macros List */}
          <div style={{ minHeight: '200px', borderRadius: '4px', backgroundColor: '#1a1a1a', border: '1px solid #404040' }}>
            {macros.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#808080',
                fontSize: '12px',
                fontStyle: 'italic',
              }}>
                No macros recorded yet
              </div>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {macros.map(macro => (
                  <div
                    key={macro.id}
                    onClick={() => setSelectedMacro(macro)}
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #404040',
                      cursor: 'pointer',
                      backgroundColor: selectedMacro?.id === macro.id ? '#2a2a2a' : 'transparent',
                      color: selectedMacro?.id === macro.id ? '#d4af37' : '#b0b0b0',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: '600' }}>{macro.name}</div>
                    <div style={{ fontSize: '9px', color: '#808080', marginTop: '2px' }}>
                      {macro.steps} steps
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={handleRecordMacro}
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
              Record
            </button>
            <button
              onClick={handleRunMacro}
              disabled={!selectedMacro}
              style={{
                padding: '8px 16px',
                background: selectedMacro ? '#d4af37' : '#666',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: selectedMacro ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '11px',
              }}
            >
              Run
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={handleEditMacro}
              disabled={!selectedMacro}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: selectedMacro ? '#b0b0b0' : '#666',
                border: '1px solid #404040',
                borderRadius: '4px',
                cursor: selectedMacro ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '11px',
              }}
            >
              Edit
            </button>
            <button
              onClick={handleDeleteMacro}
              disabled={!selectedMacro}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: selectedMacro ? '#ff6b6b' : '#666',
                border: '1px solid #404040',
                borderRadius: '4px',
                cursor: selectedMacro ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '11px',
              }}
            >
              Delete
            </button>
          </div>

          <button
            onClick={() => closeDialog('macros')}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#b0b0b0',
              border: '1px solid #404040',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '11px',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
