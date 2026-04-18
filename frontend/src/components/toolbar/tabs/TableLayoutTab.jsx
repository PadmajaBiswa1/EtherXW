import { RibbonGroup } from '../RibbonGroup';
import { useUIStore } from '@/store';

export function TableLayoutTab() {
  const { openDialog } = useUIStore();

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 8px', flexWrap: 'wrap' }}>
      {/* Rows & Columns */}
      <RibbonGroup label="Rows & Columns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button
            title="Insert 1 row above"
            style={{
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Insert Above
          </button>
          <button
            title="Insert 1 row below"
            style={{
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Insert Below
          </button>
          <button
            title="Delete row"
            style={{
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Delete Row
          </button>
        </div>
      </RibbonGroup>

      {/* Columns */}
      <RibbonGroup label="Columns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button
            title="Insert 1 column left"
            style={{
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Insert Left
          </button>
          <button
            title="Insert 1 column right"
            style={{
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Insert Right
          </button>
          <button
            title="Delete column"
            style={{
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Delete Column
          </button>
        </div>
      </RibbonGroup>

      {/* Merge & Split */}
      <RibbonGroup label="Merge & Split">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button
            title="Merge cells"
            style={{
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Merge Cells
          </button>
          <button
            title="Split cells"
            style={{
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            Split Cells
          </button>
        </div>
      </RibbonGroup>

      {/* Table Size */}
      <RibbonGroup label="Table Size">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', minWidth: 60 }}>Height:</label>
            <input
              type="number"
              defaultValue="20"
              min="5"
              max="1000"
              style={{
                width: 60,
                padding: '4px 6px',
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                fontSize: 11,
              }}
            />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>pt</span>
          </div>
          <button
            title="AutoFit table"
            style={{
              padding: '6px 12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.color = 'var(--gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            AutoFit
          </button>
        </div>
      </RibbonGroup>

      {/* Alignment */}
      <RibbonGroup label="Alignment">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {[
            { label: '↖', title: 'Align top-left' },
            { label: '↑', title: 'Align top-center' },
            { label: '↗', title: 'Align top-right' },
            { label: '←', title: 'Align middle-left' },
            { label: '•', title: 'Align center' },
            { label: '→', title: 'Align middle-right' },
            { label: '↙', title: 'Align bottom-left' },
            { label: '↓', title: 'Align bottom-center' },
            { label: '↘', title: 'Align bottom-right' },
          ].map((align, idx) => (
            <button
              key={idx}
              title={align.title}
              style={{
                width: 28,
                height: 28,
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 14,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.color = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {align.label}
            </button>
          ))}
        </div>
      </RibbonGroup>
    </div>
  );
}
