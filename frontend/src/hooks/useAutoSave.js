import { useEffect, useRef, useCallback } from 'react';
import { useDocumentStore, useUIStore } from '@/store';
import { documentApi } from '@/services/api';

const DELAY = 3000;

export function useAutoSave() {
  const storeRef = useRef(null);

  const toast    = useUIStore((s) => s.toast);
  const isDirty  = useDocumentStore((s) => s.isDirty);
  const content  = useDocumentStore((s) => s.content);
  const timer    = useRef(null);
  const vTimer   = useRef(null);

  useEffect(() => {
    storeRef.current = useDocumentStore.getState();
  }, []);

  const save = useCallback(async () => {
    const store = storeRef.current;
    if (!store) return;
    const { id, title, content: c, isDirty: dirty, setSaving, setLastSaved } = store;
    if (!dirty) return;
    setSaving(true);
    try {
      if (id) await documentApi.save(id, { title, content: c });
      setLastSaved();
    } catch {
      toast('Auto-save failed', 'error');
    } finally {
      setSaving(false);
    }
  }, [toast]);

  // Debounce on content changes
  useEffect(() => {
    if (!isDirty) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(save, DELAY);
    return () => clearTimeout(timer.current);
  }, [isDirty, content]); // eslint-disable-line react-hooks/exhaustive-deps

  // Version snapshot every 5 min
  useEffect(() => {
    vTimer.current = setInterval(() => {
      const { content: c, addVersion } = storeRef.current;
      if (c) addVersion(c);
    }, 5 * 60_000);
    return () => clearInterval(vTimer.current);
  }, []);

  // Ctrl/Cmd+S
  useEffect(() => {
    const h = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [save]);

  return { save };
}
