export function RibbonGroup({ label, children }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      borderRight: '1px solid var(--border)', paddingRight: 8, marginRight: 4,
      height: '100%', minWidth: 'fit-content',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, flexWrap: 'nowrap' }}>
        {children}
      </div>
      <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', fontFamily: 'var(--font-ui)', lineHeight: 1, paddingBottom: 1 }}>
        {label}
      </span>
    </div>
  );
}
