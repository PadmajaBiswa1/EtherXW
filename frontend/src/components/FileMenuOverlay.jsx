import { HomePage } from '@/pages/HomePage';

export function FileMenuOverlay({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: 'var(--bg-app)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'anim-fade-in 200ms ease both',
    }}>
      <HomePage isOverlay={true} onClose={onClose} />
    </div>
  );
}
