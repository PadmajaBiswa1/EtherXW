import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal component that renders children outside the DOM hierarchy
 * This prevents stacking context issues and overflow clipping
 */
export function Portal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
