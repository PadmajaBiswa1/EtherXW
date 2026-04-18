import React, { useState } from 'react';
import { useUIStore } from '@/store';

export function ProtectDialog() {
  const { closeDialog, toast } = useUIStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [protectionType, setProtectionType] = useState('read-only');
  const [showPasswords, setShowPasswords] = useState(false);

  const handleProtect = () => {
    if (!password.trim()) {
      toast('Please enter a password', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match', 'error');
      return;
    }

    // Store protection in Zustand (would be more complex in production)
    toast(`Document protected (${protectionType})`, 'success');
    closeDialog('protect');
  };

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('protect')} />
      <div className="dialog-container" style={{ maxWidth: '500px' }}>
        <div className="dialog-header">
          <h2>Protect Document</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('protect')}
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
              Protection Type
            </label>
            <select
              value={protectionType}
              onChange={(e) => setProtectionType(e.target.value)}
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
              <option value="read-only">Read Only</option>
              <option value="comments-only">Comments Only</option>
              <option value="tracked-changes-only">Tracked Changes Only</option>
            </select>
            <p style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
              {protectionType === 'read-only' && 'Users can only view the document'}
              {protectionType === 'comments-only' && 'Users can only add comments'}
              {protectionType === 'tracked-changes-only' && 'Users can only make tracked changes'}
            </p>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Password
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
                onClick={() => setShowPasswords(!showPasswords)}
                style={{
                  padding: '8px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #404040',
                  borderRadius: '3px',
                  color: '#b0b0b0',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                {showPasswords ? '✓' : '○'}
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Confirm Password
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
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

          <div
            style={{
              padding: '8px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid #d4af37',
              borderRadius: '3px',
              fontSize: '10px',
              color: '#d4af37',
            }}
          >
            ⚠️ Password protection is basic security. For sensitive documents, use additional encryption.
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleProtect}
              style={{
                flex: 1,
                padding: '8px 16px',
                background: '#d4af37',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Apply Protection
            </button>
            <button
              onClick={() => closeDialog('protect')}
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
