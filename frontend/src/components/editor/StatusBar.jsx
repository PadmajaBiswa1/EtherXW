import { useDocumentStore, useUIStore, useEditorStore } from '@/store';

export function StatusBar() {
  const { wordCount, charCount, pageCount, readingTime, trackChanges } = useDocumentStore();
  const { zoom, setZoom } = useUIStore();
  const { spellCheck } = useEditorStore();

  return (
    <div style={{
      height: 26, flexShrink: 0,
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 14px', gap: 0,
      fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-muted)',
      userSelect: 'none',
    }}>
      <Stat label="Page" value="1" />
      <Sep />
      <Stat label="of" value={pageCount} />
      <Sep />
      <Stat label="Words" value={wordCount.toLocaleString()} />
      <Sep />
      <Stat label="Chars" value={charCount.toLocaleString()} />
      <Sep />
      <Stat label="Read" value={`~${readingTime} min`} />
      {trackChanges && <><Sep /><span style={{ color: 'var(--gold)', fontSize: 10 }}>● Track Changes ON</span></>}
      {!spellCheck   && <><Sep /><span style={{ color: '#e67e22', fontSize: 10 }}>⚠ Spell Check Off</span></>}

      {/* Right side */}
      <div style={{ flex: 1 }} />
      <span style={{ marginRight: 4 }}>A4 · Portrait</span>
      <Sep />
      {/* Zoom slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={() => setZoom(zoom - 10)} style={btnStyle}>−</button>
        <input type="range" min={25} max={200} value={zoom} onChange={(e) => setZoom(+e.target.value)}
          style={{ width: 80, accentColor: 'var(--gold)', cursor: 'pointer' }} />
        <button onClick={() => setZoom(zoom + 10)} style={btnStyle}>+</button>
        <button onClick={() => setZoom(100)} style={{ ...btnStyle, minWidth: 42, color: 'var(--gold)' }}>{zoom}%</button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <span>
      <span style={{ color: 'var(--text-muted)' }}>{label} </span>
      <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
    </span>
  );
}
function Sep() {
  return <span style={{ margin: '0 10px', color: 'var(--border-strong)' }}>|</span>;
}
const btnStyle = {
  background: 'none', border: 'none', color: 'var(--text-muted)',
  cursor: 'pointer', fontSize: 13, padding: '0 2px', lineHeight: 1,
};
