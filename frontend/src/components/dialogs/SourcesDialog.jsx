import { useState } from 'react';
import { useUIStore } from '@/store';
import { Modal, Button, Stack, Label } from '@/components/ui';

export function SourcesDialog() {
  const { closeDialog, citations, removeCitation, updateCitation, toast } = useUIStore();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (id, citation) => {
    setEditingId(id);
    setEditData(citation);
  };

  const handleSaveEdit = (id) => {
    updateCitation(id, editData);
    setEditingId(null);
    toast('Citation updated', 'success');
  };

  const handleDelete = (id) => {
    removeCitation(id);
    toast('Citation removed', 'info');
  };

  const handleClose = () => {
    setEditingId(null);
    closeDialog('sources');
  };

  return (
    <Modal isOpen={true} onClose={handleClose} title="Manage Sources">
      <Stack gap={16} style={{ padding: '16px', maxWidth: '600px', maxHeight: '500px', overflowY: 'auto' }}>
        {citations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-ui)' }}>
            No citations added yet. Insert a citation to get started.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {citations.map((citation) => (
              <div
                key={citation.id}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 12,
                }}
              >
                {editingId === citation.id ? (
                  // Edit mode
                  <Stack gap={12}>
                    <div>
                      <Label>Author</Label>
                      <input
                        type="text"
                        value={editData.author || ''}
                        onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: 10,
                          fontFamily: 'var(--font-ui)',
                          marginTop: 4,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: 10,
                          fontFamily: 'var(--font-ui)',
                          marginTop: 4,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <input
                        type="text"
                        value={editData.year || ''}
                        onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          fontSize: 10,
                          fontFamily: 'var(--font-ui)',
                          marginTop: 4,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button variant="secondary" onClick={() => setEditingId(null)} style={{ flex: 1 }}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={() => handleSaveEdit(citation.id)} style={{ flex: 1 }}>
                        Save
                      </Button>
                    </div>
                  </Stack>
                ) : (
                  // View mode
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {citation.author} ({citation.year})
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: 10, color: 'var(--text-muted)' }}>
                        {citation.title}
                      </p>
                      {citation.publisher && (
                        <p style={{ margin: '2px 0 0 0', fontSize: 10, color: 'var(--text-muted)' }}>
                          {citation.publisher}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button
                        variant="secondary"
                        onClick={() => handleEdit(citation.id, citation)}
                        style={{ flex: 1, padding: '4px 8px', fontSize: 10 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDelete(citation.id)}
                        style={{ flex: 1, padding: '4px 8px', fontSize: 10 }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Close button */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
