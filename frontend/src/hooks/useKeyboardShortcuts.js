import { useEffect } from 'react';
import { useUIStore } from '@/store';

export function useKeyboardShortcuts() {
  const openDialog = useUIStore((s) => s.openDialog);
  const setZoom = useUIStore((s) => s.setZoom);
  const zoom = useUIStore((s) => s.zoom);
  const toggleFullscreen = useUIStore((s) => s.toggleFullscreen);

  useEffect(() => {
    const h = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'h')           { e.preventDefault(); openDialog('findReplace'); }
      if (mod && e.key === '=')           { e.preventDefault(); setZoom(zoom + 10); }
      if (mod && e.key === '-')           { e.preventDefault(); setZoom(zoom - 10); }
      if (mod && e.key === '0')           { e.preventDefault(); setZoom(100); }
      if (e.key === 'F11')                { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [zoom, openDialog, setZoom, toggleFullscreen]);
}
