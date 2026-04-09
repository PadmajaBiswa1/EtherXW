// ═══════════════════════════════════════════════════════════════
//  EtherX Word — Central State (Zustand)
// ═══════════════════════════════════════════════════════════════
import { create } from 'zustand';

/* ── Document Store ─────────────────────────────────────────── */
export const useDocumentStore = create((set) => ({
    id: null, title: 'Untitled Document', content: '',
    isDirty: false, isSaving: false, lastSaved: null,
    createdAt: new Date(), updatedAt: new Date(),
    versions: [], comments: [], trackChanges: false,
    wordCount: 0, charCount: 0, pageCount: 1, readingTime: 0, pageOrder: [0], pageThumbnails: {},

    setTitle:    (title)   => set({ title,   isDirty: true }),
    setContent:  (content) => set({ content, isDirty: true, updatedAt: new Date() }),
    setSaving:   (v)       => set({ isSaving: v }),
    setLastSaved:()        => set({ lastSaved: new Date(), isDirty: false }),
    setStats: ({ wordCount, charCount, pageCount }) =>
      set((s) => {
        if (s.pageCount === pageCount) {
          return { wordCount, charCount, pageCount, readingTime: Math.ceil(wordCount / 200) };
        }
        const prev = s.pageOrder;
        const newOrder = Array.from({ length: pageCount }, (_, i) => i);
        const kept = prev.filter((p) => p < pageCount);
        const added = newOrder.filter((p) => !kept.includes(p));
        return { wordCount, charCount, pageCount, readingTime: Math.ceil(wordCount / 200), pageOrder: [...kept, ...added] };
      }),
    setThumbnail: (index, dataUrl) =>
      set((s) => ({ pageThumbnails: { ...s.pageThumbnails, [index]: dataUrl } })),
    reorderPages: (from, to) =>
      set((s) => {
        const order = [...s.pageOrder];
        const [moved] = order.splice(from, 1);
        order.splice(to, 0, moved);
        return { pageOrder: order };
      }),
    addVersion: (snapshot) =>
      set((s) => ({ versions: [{ id: Date.now(), snapshot, savedAt: new Date(), label: `v${s.versions.length + 1}` }, ...s.versions] })),
    addComment: (c)  => set((s) => ({ comments: [...s.comments, { id: Date.now(), ...c, resolved: false }] })),
    resolveComment: (id) => set((s) => ({ comments: s.comments.map((c) => c.id === id ? { ...c, resolved: true } : c) })),
    toggleTrackChanges: () => set((s) => ({ trackChanges: !s.trackChanges })),
    reset: () => set({ id: null, title: 'Untitled Document', content: '', isDirty: false, isSaving: false, lastSaved: null, wordCount: 0, charCount: 0, pageCount: 1, pageOrder: [0], versions: [], comments: [], trackChanges: false }),
}));

/* ── UI Store ───────────────────────────────────────────────── */
export const useUIStore = create((set) => ({
  theme: 'dark',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  sidebarOpen: true,
  fullscreen: false,
  ribbonCollapsed: false,
  zoom: 100,
  activeTab: 'home',
  activePage: 0,
  toggleSidebar:    () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleFullscreen: () => set((s) => ({ fullscreen: !s.fullscreen })),
  toggleRibbon:     () => set((s) => ({ ribbonCollapsed: !s.ribbonCollapsed })),
  setZoom:          (z) => set({ zoom: Math.min(200, Math.max(25, z)) }),
  setActiveTab:     (t) => set({ activeTab: t }),
  setActivePage:    (p) => set({ activePage: p }),

  dialogs: {
    insertImage: false, insertTable: false, insertLink: false,
    insertChart: false, insertShape: false, insertSymbol: false,
    findReplace: false, versionHistory: false, exportDoc: false,
    shareDoc: false, drawing: false, templates: false,
    pageSetup: false, comments: false,
  },
  openDialog:  (name) => set((s) => ({ dialogs: { ...s.dialogs, [name]: true  } })),
  closeDialog: (name) => set((s) => ({ dialogs: { ...s.dialogs, [name]: false } })),
  closeAll:    ()     => set((s) => ({ dialogs: Object.fromEntries(Object.keys(s.dialogs).map((k) => [k, false])) })),

  toasts: [],
  toast: (message, type = 'info', duration = 3200) =>
    set((s) => ({ toasts: [...s.toasts, { id: Date.now(), message, type, duration }] })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  findQuery: '', replaceQuery: '',
  setFindQuery:    (v) => set({ findQuery: v }),
  setReplaceQuery: (v) => set({ replaceQuery: v }),
}));

/* ── Editor Store ───────────────────────────────────────────── */
export const useEditorStore = create((set) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
  fontFamily: 'Crimson Pro',
  fontSize: '12',
  setFontFamily: (v) => set({ fontFamily: v }),
  setFontSize:   (v) => set({ fontSize: v }),
  spellCheck: true,
  toggleSpellCheck: () => set((s) => ({ spellCheck: !s.spellCheck })),
}));
