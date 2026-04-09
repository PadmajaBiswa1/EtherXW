import { useState } from 'react';
import { useUIStore, useDocumentStore } from '@/store';
import { Modal, Button, Input, Label, Stack } from '@/components/ui';

export function ShareDialog() {
  const { closeDialog, toast } = useUIStore();
  const { id, title }   = useDocumentStore();
  const [copied, setCopied] = useState(false);
  const [email,  setEmail]  = useState('');
  const [role,   setRole]   = useState('viewer');

  const shareUrl = `${window.location.origin}/doc/${id || 'demo'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast('Link copied!', 'success');
    });
  };

  const inviteUser = () => {
    if (!email.trim()) return;
    toast(`Invite sent to ${email}`, 'success');
    setEmail('');
  };

  return (
    <Modal title="Share Document" onClose={() => closeDialog('shareDoc')} width={440}>
      <Stack gap={20}>
        {/* Link share */}
        <div>
          <Label>Share Link</Label>
          <div style={{ display:'flex', gap:6 }}>
            <div style={{
              flex:1, padding:'6px 10px', background:'var(--bg-elevated)',
              border:'1px solid var(--border)', borderRadius:'var(--radius-sm)',
              fontFamily:'var(--font-ui)', fontSize:12, color:'var(--text-secondary)',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>{shareUrl}</div>
            <Button variant={copied ? 'primary' : 'outline'} onClick={copyLink}>
              {copied ? '✓ Copied' : '⎘ Copy'}
            </Button>
          </div>
        </div>

        {/* Invite */}
        <div>
          <Label>Invite by Email</Label>
          <div style={{ display:'flex', gap:6 }}>
            <Input value={email} onChange={setEmail} placeholder="colleague@company.com" style={{ flex:1 }} />
            <select value={role} onChange={(e) => setRole(e.target.value)}
              style={{ background:'var(--bg-elevated)', color:'var(--text-primary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'6px 8px', fontSize:12, fontFamily:'var(--font-ui)', outline:'none' }}>
              <option value="viewer">Viewer</option>
              <option value="commenter">Commenter</option>
              <option value="editor">Editor</option>
            </select>
            <Button variant="primary" onClick={inviteUser} disabled={!email.trim()}>Invite</Button>
          </div>
        </div>

        {/* Access settings */}
        <div style={{ padding:'12px 14px', background:'var(--bg-elevated)', borderRadius:'var(--radius-md)', border:'1px solid var(--border)' }}>
          <div style={{ fontFamily:'var(--font-ui)', fontSize:12, fontWeight:600, color:'var(--text-primary)', marginBottom:6 }}>🔒 Access Settings</div>
          <div style={{ fontFamily:'var(--font-ui)', fontSize:12, color:'var(--text-secondary)' }}>
            Anyone with the link can view. Change sharing settings to restrict access.
          </div>
        </div>

        <Button variant="subtle" onClick={() => closeDialog('shareDoc')}>Done</Button>
      </Stack>
    </Modal>
  );
}
