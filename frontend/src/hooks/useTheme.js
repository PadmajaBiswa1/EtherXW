import { useEffect } from 'react';
import { useUIStore } from '@/store';
import { applyTheme } from '@/theme/tokens';

export function useTheme() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('etherx-theme', theme);
  }, [theme]);
  return { theme, toggleTheme };
}

export function initTheme(mode = 'dark') {
  applyTheme(mode);
}
