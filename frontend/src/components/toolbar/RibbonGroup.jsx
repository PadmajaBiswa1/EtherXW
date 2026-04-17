import { useState } from 'react';
import { useUIStore } from '@/store';

export function RibbonGroup({ label, children }) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useUIStore();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 2,
        padding: '2px 6px',
        borderRight: '1px solid var(--border)',
        marginRight: 2,
        minWidth: 'max-content',
        transition: 'background-color 0.2s ease',
        background: isHovered
          ? theme === 'dark'
            ? 'rgba(212, 175, 55, 0.08)'
            : 'rgba(212, 175, 55, 0.05)'
          : 'transparent',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {/* Buttons container */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '2px 0',
        }}
      >
        {children}
      </div>

      {/* Group label */}
      <label
        style={{
          fontSize: '9px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: isHovered ? 'var(--gold)' : 'var(--text-muted)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          transition: 'color 0.2s ease',
          marginTop: 1,
          height: 11,
          lineHeight: '11px',
        }}
      >
        {label}
      </label>
    </div>
  );
}

