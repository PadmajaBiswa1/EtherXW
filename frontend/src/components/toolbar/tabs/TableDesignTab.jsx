import { RibbonGroup } from '../RibbonGroup';
import { useUIStore } from '@/store';

const tableDesigns = [
  { name: 'Grid Table 1', preview: '╔═╗\n║ ║\n╚═╝' },
  { name: 'Grid Table 2', preview: '┌─┐\n│ │\n└─┘' },
  { name: 'Grid Table 3', preview: '┏━┓\n┃ ┃\n┗━┛' },
  { name: 'Grid Table 4', preview: '╭─╮\n│ │\n╰─╯' },
  { name: 'Grid Table 5', preview: '┎─┐\n┕━┘' },
  { name: 'Grid Table 6', preview: '╔═╦╗\n╠═╬╣\n╚═╩╝' },
];

export function TableDesignTab() {
  const { openDialog } = useUIStore();

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 8px', flexWrap: 'wrap' }}>
      {/* Table Styles */}
      <RibbonGroup label="Table Styles">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {tableDesigns.map((design, idx) => (
            <button
              key={idx}
              title={design.name}
              style={{
                width: 64,
                height: 48,
                background: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                fontFamily: 'monospace',
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
              <span style={{ fontSize: 10, whiteSpace: 'pre' }}>{design.preview}</span>
            </button>
          ))}
        </div>
      </RibbonGroup>

      {/* Table Options */}
      <RibbonGroup label="Table Options">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            title="Show header row"
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
            Header Row
          </button>
          <button
            title="Show total row"
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
            Total Row
          </button>
          <button
            title="Banded rows"
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
            Banded Rows
          </button>
        </div>
      </RibbonGroup>

      {/* Effects */}
      <RibbonGroup label="Effects">
        <div style={{ display: 'flex', gap: 6, flexDirection: 'column' }}>
          <button
            title="Shadow effect"
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
            Shadow
          </button>
          <button
            title="3D effect"
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
            3D Effect
          </button>
        </div>
      </RibbonGroup>
    </div>
  );
}
