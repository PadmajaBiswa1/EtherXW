import { useState } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Button, Select, Modal } from '@/components/ui';

export function InsertDateTimeDialog() {
  const { closeDialog } = useUIStore();
  const { editor } = useEditorStore();
  const [dateFormat, setDateFormat] = useState('long');
  const [includeTime, setIncludeTime] = useState(false);
  const [updateAutomatic, setUpdateAutomatic] = useState(false);

  const dateFormats = [
    { value: 'short', label: '1/15/2024' },
    { value: 'medium', label: 'Jan 15, 2024' },
    { value: 'long', label: 'January 15, 2024' },
    { value: 'iso', label: '2024-01-15' },
    { value: 'text', label: 'Monday, January 15, 2024' },
  ];

  const now = new Date();
  const formatDate = (format) => {
    switch (format) {
      case 'short':
        return (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();
      case 'medium':
        return now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      case 'long':
        return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      case 'iso':
        return now.toISOString().split('T')[0];
      case 'text':
        return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      default:
        return now.toLocaleDateString();
    }
  };

  const formatTime = () => {
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleInsert = () => {
    let display = formatDate(dateFormat);
    if (includeTime) {
      display += ' ' + formatTime();
    }

    const dateTimeHtml = `<span style="color: ${updateAutomatic ? 'var(--gold)' : 'var(--text-primary)'}; ${updateAutomatic ? 'text-decoration: underline dashed;' : ''}" data-date="${now.toISOString()}" data-auto-update="${updateAutomatic}">${display}</span>`;
    
    editor?.chain().insertContent(dateTimeHtml).run();
    closeDialog('dateTime');
  };

  return (
    <Modal title="Insert Date and Time" onClose={() => closeDialog('dateTime')}>
      <div style={{ minWidth: 380, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>
            Date Format
          </label>
          <Select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            {dateFormats.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </Select>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
            Preview: {formatDate(dateFormat)}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            id="includeTime"
            checked={includeTime}
            onChange={(e) => setIncludeTime(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <label htmlFor="includeTime" style={{ cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
            Include time
          </label>
        </div>

        {includeTime && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: -8 }}>
            Preview: {formatDate(dateFormat)} {formatTime()}
          </p>
        )}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              id="updateAutomatic"
              checked={updateAutomatic}
              onChange={(e) => setUpdateAutomatic(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="updateAutomatic" style={{ cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
              Update automatically
            </label>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '6px 0 0 24px' }}>
            Updates the date and time each time the document is opened
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => closeDialog('dateTime')}>Cancel</Button>
          <Button variant="primary" onClick={handleInsert}>Insert Date and Time</Button>
        </div>
      </div>
    </Modal>
  );
}
