import { useState, useRef } from 'react';
import { useDocumentStore, useUIStore } from '@/store';
import { Button, Tooltip } from '@/components/ui';
import { EtherXLogo } from '@/components/ui/EtherXLogo';
import { format } from 'date-fns';

export function TitleBar({ onSave }) {
  const title = useDocumentStore((s) => s.title);
  const setTitle = useDocumentStore((s) => s.setTitle);
  const isDirty = useDocumentStore((s) => s.isDirty);
  const isSaving = useDocumentStore((s) => s.isSaving);
  const lastSaved = useDocumentStore((s) => s.lastSaved);
  const wordCount = useDocumentStore((s) => s.wordCount);
  const readingTime = useDocumentStore((s) => s.readingTime);

  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const openDialog = useUIStore((s) => s.openDialog);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const fullscreen = useUIStore((s) => s.fullscreen);
  const toggleFullscreen = useUIStore((s) => s.toggleFullscreen);

  const save = onSave;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState('');
  const inputRef = useRef();

  const startEdit = () => { setDraft(title); setEditing(true); setTimeout(() => inputRef.current?.select(), 50); };
  const commitEdit = () => { if (draft.trim()) setTitle(draft.trim()); setEditing(false); };

  return (
    <div style={{
      height: 42, display: 'flex', alignItems: 'center', gap: 0,
      background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
      padding: '0 12px', flexShrink: 0, userSelect: 'none',
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', marginRight:16 }}>
        <img
          src="/assets/etherxwordlogo.png"
          style={{ height: 60, objectFit: 'contain' }}
        />
      </div>

      {/* Document title */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {editing ? (
          <input ref={inputRef} value={draft} onChange={(e)=>setDraft(e.target.value)}
            onBlur={commitEdit} onKeyDown={(e)=>{ if(e.key==='Enter') commitEdit(); if(e.key==='Escape') setEditing(false); }}
            style={{
              background:'var(--bg-elevated)', color:'var(--text-primary)',
              border:'1px solid var(--gold)', borderRadius:'var(--radius-sm)',
              padding:'3px 10px', fontSize:13, fontFamily:'var(--font-ui)',
              textAlign:'center', width:280, outline:'none',
            }} />
        ) : (
          <button onClick={startEdit} title="Rename document"
            style={{
              background:'none', border:'none', color:'var(--text-primary)',
              fontFamily:'var(--font-ui)', fontSize:13, fontWeight:500,
              cursor:'text', padding:'3px 8px', borderRadius:'var(--radius-sm)',
              display:'flex', alignItems:'center', gap:6,
            }}
            onMouseEnter={(e)=>(e.currentTarget.style.background='var(--bg-hover)')}
            onMouseLeave={(e)=>(e.currentTarget.style.background='none')}>
            {title}
            {isDirty && <span style={{ color:'var(--text-muted)', fontSize:11 }}>●</span>}
          </button>
        )}

        {/* Save status */}
        <span style={{ color:'var(--text-muted)', fontSize:11, marginLeft:8, fontFamily:'var(--font-ui)' }}>
          {isSaving ? '⟳ Saving…' : lastSaved ? `Saved ${format(lastSaved, 'h:mm a')}` : ''}
        </span>
      </div>

      {/* Right controls */}
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        <span style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-ui)', marginRight:8 }}>
          {wordCount} words · {readingTime} min read
        </span>

        <Tooltip text="Toggle sidebar">
          <Button onClick={toggleSidebar} active={sidebarOpen} size="sm">⊞</Button>
        </Tooltip>
        <Tooltip text="Version history">
          <Button onClick={() => openDialog('versionHistory')} size="sm">⏱</Button>
        </Tooltip>
        <Tooltip text="Share">
          <Button onClick={() => openDialog('shareDoc')} size="sm">↗</Button>
        </Tooltip>
        <Tooltip text="Export">
          <Button onClick={() => openDialog('exportDoc')} variant="outline" size="sm">⬇ Export</Button>
        </Tooltip>
        <Tooltip text={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          <Button onClick={toggleTheme} size="sm">{theme === 'dark' ? '☀' : '🌙'}</Button>
        </Tooltip>
        <Tooltip text={fullscreen ? 'Exit fullscreen (F11)' : 'Fullscreen (F11)'}>
          <Button onClick={toggleFullscreen} size="sm">{fullscreen ? '⤡' : '⤢'}</Button>
        </Tooltip>
      </div>
    </div>
  );
}
