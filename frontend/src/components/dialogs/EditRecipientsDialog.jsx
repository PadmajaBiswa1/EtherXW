import { useState } from 'react';
import { useUIStore } from '@/store';
import { useDocumentStore } from '@/store';
import { Modal, Button, Stack, Label } from '@/components/ui';

export function EditRecipientsDialog() {
  const { closeDialog, toast } = useUIStore();
  const { mailMergeRecipients = [], setMailMergeRecipients } = useDocumentStore();

  const [recipients, setRecipients] = useState(mailMergeRecipients.length > 0 ? mailMergeRecipients : [
    { id: 1, firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: '' },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});

  const handleAddRow = () => {
    const newId = Math.max(...recipients.map(r => r.id), 0) + 1;
    setRecipients([...recipients, { id: newId, firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: '' }]);
  };

  const handleDeleteRow = (id) => {
    if (recipients.length === 1) {
      toast('Must have at least one recipient', 'warning');
      return;
    }
    setRecipients(recipients.filter(r => r.id !== id));
    toast('Recipient deleted', 'info');
  };

  const handleEditStart = (recipient) => {
    setEditingId(recipient.id);
    setEditRow({ ...recipient });
  };

  const handleEditSave = (id) => {
    setRecipients(recipients.map(r => r.id === id ? editRow : r));
    setEditingId(null);
    toast('Recipient updated', 'success');
  };

  const handleFieldChange = (field, value) => {
    setEditRow({ ...editRow, [field]: value });
  };

  const handleSave = () => {
    if (recipients.some(r => !r.firstName.trim() || !r.email.trim())) {
      toast('First name and email are required for all recipients', 'warning');
      return;
    }

    setMailMergeRecipients(recipients);
    toast(`${recipients.length} recipient(s) saved`, 'success');
    handleClose();
  };

  const handleClose = () => {
    closeDialog('editRecipients');
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Mail Merge Recipients">
      <Stack gap={16} style={{ padding: '16px', maxWidth: '900px', maxHeight: '600px', overflowY: 'auto' }}>
        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 10,
            fontFamily: 'var(--font-ui)',
          }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: 8, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)' }}>First Name</th>
                <th style={{ padding: 8, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)' }}>Last Name</th>
                <th style={{ padding: 8, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)' }}>Email</th>
                <th style={{ padding: 8, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)' }}>Address</th>
                <th style={{ padding: 8, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)' }}>City</th>
                <th style={{ padding: 8, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)' }}>State</th>
                <th style={{ padding: 8, textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)' }}>ZIP</th>
                <th style={{ padding: 8, textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map((recipient, index) => (
                <tr key={recipient.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  {editingId === recipient.id ? (
                    <>
                      <td style={{ padding: 6 }}>
                        <input
                          type="text"
                          value={editRow.firstName}
                          onChange={(e) => handleFieldChange('firstName', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 9,
                            fontFamily: 'var(--font-ui)',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          type="text"
                          value={editRow.lastName}
                          onChange={(e) => handleFieldChange('lastName', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 9,
                            fontFamily: 'var(--font-ui)',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          type="email"
                          value={editRow.email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 9,
                            fontFamily: 'var(--font-ui)',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          type="text"
                          value={editRow.address}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 9,
                            fontFamily: 'var(--font-ui)',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          type="text"
                          value={editRow.city}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 9,
                            fontFamily: 'var(--font-ui)',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          type="text"
                          value={editRow.state}
                          onChange={(e) => handleFieldChange('state', e.target.value.toUpperCase())}
                          maxLength="2"
                          style={{
                            width: '100%',
                            padding: '4px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 9,
                            fontFamily: 'var(--font-ui)',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>
                      <td style={{ padding: 6 }}>
                        <input
                          type="text"
                          value={editRow.zip}
                          onChange={(e) => handleFieldChange('zip', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '4px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: 9,
                            fontFamily: 'var(--font-ui)',
                            boxSizing: 'border-box',
                          }}
                        />
                      </td>
                      <td style={{ padding: 6, textAlign: 'center' }}>
                        <button
                          onClick={() => handleEditSave(recipient.id)}
                          style={{
                            background: 'var(--gold)',
                            color: '#000',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 9,
                            fontWeight: 600,
                            marginRight: 4,
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 9,
                          }}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: 8, color: 'var(--text-primary)' }}>{recipient.firstName}</td>
                      <td style={{ padding: 8, color: 'var(--text-primary)' }}>{recipient.lastName}</td>
                      <td style={{ padding: 8, color: 'var(--text-primary)' }}>{recipient.email}</td>
                      <td style={{ padding: 8, color: 'var(--text-primary)' }}>{recipient.address}</td>
                      <td style={{ padding: 8, color: 'var(--text-primary)' }}>{recipient.city}</td>
                      <td style={{ padding: 8, color: 'var(--text-primary)' }}>{recipient.state}</td>
                      <td style={{ padding: 8, color: 'var(--text-primary)' }}>{recipient.zip}</td>
                      <td style={{ padding: 8, textAlign: 'center' }}>
                        <button
                          onClick={() => handleEditStart(recipient)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 9,
                            color: 'var(--text-primary)',
                            marginRight: 4,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRow(recipient.id)}
                          style={{
                            background: 'none',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 9,
                            color: 'var(--text-primary)',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info Text */}
        <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-ui)' }}>
          {recipients.length} recipient(s) • Fields: First Name, Last Name, Email, Address, City, State, ZIP
        </p>

        {/* Add Row Button */}
        <button
          onClick={handleAddRow}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--gold)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--gold)',
            fontFamily: 'var(--font-ui)',
            transition: 'all 0.1s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--gold)'; }}
        >
          + Add Recipient
        </button>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Recipients
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
