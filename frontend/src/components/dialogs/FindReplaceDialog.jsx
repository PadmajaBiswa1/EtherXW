import { useState, useCallback } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Modal, Button, Input, Label, Stack } from '@/components/ui';

export function FindReplaceDialog() {
  const { closeDialog, toast } = useUIStore();
  const { editor } = useEditorStore();
  const [find,    setFind]    = useState('');
  const [replace, setReplace] = useState('');
  const [count,   setCount]   = useState(null);
  const [caseSensitive, setCase] = useState(false);

  // ProseMirror-based find (highlight all via browser API as placeholder)
  const countOccurrences = useCallback(() => {
    const text = editor?.state.doc.textContent || '';
    const needle = caseSensitive ? find : find.toLowerCase();
    const haystack = caseSensitive ? text : text.toLowerCase();
    let n = 0, pos = 0;
    while ((pos = haystack.indexOf(needle, pos)) !== -1) { n++; pos += needle.length; }
    setCount(n);
    return n;
  }, [editor, find, caseSensitive]);

  const doReplace = (all = false) => {
    if (!editor || !find) return;
    const html = editor.getHTML();
    const flags = caseSensitive ? 'g' : 'gi';
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const newHtml = all
      ? html.replace(new RegExp(escaped, flags), replace)
      : html.replace(new RegExp(escaped, flags.replace('g','')), replace);
    editor.commands.setContent(newHtml, true);
    const n = all ? countOccurrences() : 1;
    toast(`Replaced ${all ? n : 1} occurrence${all && n!==1?'s':''}`, 'success');
    if (all) setCount(0);
  };

  return (
    <Modal title="Find & Replace" onClose={() => closeDialog('findReplace')} width={420}>
      <Stack gap={14}>
        <div>
          <Label>Find</Label>
          <div style={{ display:'flex', gap:6 }}>
            <Input value={find} onChange={(v) => { setFind(v); setCount(null); }} placeholder="Search text…" autoFocus />
            <Button variant="outline" onClick={countOccurrences} disabled={!find}>Count</Button>
          </div>
          {count !== null && (
            <div style={{ fontSize:11, color: count > 0 ? 'var(--gold)' : 'var(--text-muted)', marginTop:4, fontFamily:'var(--font-ui)' }}>
              {count > 0 ? `${count} occurrence${count!==1?'s':''} found` : 'No matches found'}
            </div>
          )}
        </div>

        <div><Label>Replace With</Label><Input value={replace} onChange={setReplace} placeholder="Replacement text…" /></div>

        <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:'var(--font-ui)', fontSize:13, color:'var(--text-primary)' }}>
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCase(e.target.checked)} style={{ accentColor:'var(--gold)' }} />
          Case sensitive
        </label>

        <div style={{ display:'flex', gap:8, justifyContent:'flex-end', flexWrap:'wrap' }}>
          <Button variant="subtle" onClick={() => closeDialog('findReplace')}>Close</Button>
          <Button variant="outline" onClick={() => doReplace(false)} disabled={!find}>Replace</Button>
          <Button variant="primary" onClick={() => doReplace(true)} disabled={!find}>Replace All</Button>
        </div>
      </Stack>
    </Modal>
  );
}
