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
    setStats: ({ wordCount = 0, charCount = 0, pageCount = 1 }) =>
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

    // Layout/Page Setup state
    margins: { top: 48, bottom: 48, left: 48, right: 48 }, // in pixels (2.54cm default = 48px @ 96dpi)
    orientation: 'portrait', // 'portrait' | 'landscape'
    pageSize: { width: 794, height: 1123 }, // A4 default
    columns: 1, // 1, 2, 3, or 'left'/'right'
    lineNumbers: 'none', // 'none', 'continuous', 'restart', 'restart-section', 'suppress'
    hyphenation: 'none', // 'none', 'automatic', 'manual'

    setMargins: (margins) => set({ margins, isDirty: true }),
    setOrientation: (orientation) => set({ orientation, isDirty: true }),
    setPageSize: (pageSize) => set({ pageSize, isDirty: true }),
    setColumns: (columns) => set({ columns, isDirty: true }),
    setLineNumbers: (lineNumbers) => set({ lineNumbers, isDirty: true }),
    setHyphenation: (hyphenation) => set({ hyphenation, isDirty: true }),
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
  fileMenuOpen: false,
  fileMenuSection: 'home',
  toggleSidebar:    () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleFullscreen: () => set((s) => ({ fullscreen: !s.fullscreen })),
  toggleRibbon:     () => set((s) => ({ ribbonCollapsed: !s.ribbonCollapsed })),
  setZoom:          (z) => set({ zoom: Math.min(200, Math.max(25, z)) }),
  setActiveTab:     (t) => set({ activeTab: t }),
  setActivePage:    (p) => set({ activePage: p }),
  setFileMenuOpen:  (v) => set({ fileMenuOpen: v }),
  setFileMenuSection: (s) => set({ fileMenuSection: s }),

  dialogs: {
    insertImage: false, insertTable: false, insertLink: false,
    insertChart: false, insertShape: false, insertSymbol: false,
    findReplace: false, versionHistory: false, exportDoc: false,
    shareDoc: false, drawing: false, templates: false,
    pageSetup: false, comments: false, watermark: false, pageBorders: false,
    citation: false, sources: false, caption: false, crossReference: false,
    envelope: false, labels: false, editRecipients: false, comment: false, reference: false,
    zoom: false, macros: false,
    helpPanel: false, whatsNew: false, feedback: false, about: false,
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

  // View Mode state
  viewMode: 'print', // 'print', 'web', 'outline', 'draft'
  setViewMode: (mode) => set({ viewMode: mode }),
  focusMode: false,
  setFocusMode: (enabled) => set({ focusMode: enabled }),
  showRuler: false,
  setShowRuler: (show) => set({ showRuler: show }),
  showGridlines: false,
  setShowGridlines: (show) => set({ showGridlines: show }),
  showNavigationPane: false,
  setShowNavigationPane: (show) => set({ showNavigationPane: show }),
  navigationPaneTab: 'headings', // 'headings', 'pages', 'search'
  setNavigationPaneTab: (tab) => set({ navigationPaneTab: tab }),
  navigationSearchQuery: '',
  setNavigationSearchQuery: (query) => set({ navigationSearchQuery: query }),

  // Drawing state
  drawingTool: null, // 'ballpoint', 'pencil', 'highlighter', 'eraser', 'lasso', 'select'
  drawingColor: '#d4af37', // Gold by default
  drawingSize: 2,
  drawingHistory: [], // Array of strokes
  setDrawingTool: (tool) => set({ drawingTool: tool }),
  setDrawingColor: (color) => set({ drawingColor: color }),
  setDrawingSize: (size) => set({ drawingSize: size }),
  setDrawingHistory: (history) => set({ drawingHistory: history }),

  // Design/Theme state
  currentTheme: 'default',
  accentColor: '#d4af37',
  paragraphSpacing: 'tight',
  pageBackground: '#ffffff',
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
  setAccentColor: (color) => set({ accentColor: color }),
  setParagraphSpacing: (spacing) => set({ paragraphSpacing: spacing }),
  setPageBackground: (bg) => set({ pageBackground: bg }),

  // Watermark state (for persistence across page creation)
  watermarkEnabled: false,
  watermarkText: 'DRAFT',
  watermarkOpacity: 50,
  watermarkFontSize: 120,
  setWatermarkEnabled: (enabled) => set({ watermarkEnabled: enabled }),
  setWatermarkText: (text) => set({ watermarkText: text }),
  setWatermarkOpacity: (opacity) => set({ watermarkOpacity: opacity }),
  setWatermarkFontSize: (size) => set({ watermarkFontSize: size }),

  // Citations & References state
  citations: [], // Array of citation objects
  footnotes: [], // Array of footnote objects
  endnotes: [], // Array of endnote objects
  captions: [], // Array of caption objects
  citationStyle: 'APA', // 'APA', 'MLA', 'Chicago', 'Harvard'
  bibliographyFormat: 'References', // 'Works Cited', 'References', 'Bibliography'
  
  addCitation: (citation) => set((s) => ({ citations: [...s.citations, { id: Date.now(), ...citation }] })),
  removeCitation: (id) => set((s) => ({ citations: s.citations.filter(c => c.id !== id) })),
  updateCitation: (id, citation) => set((s) => ({ citations: s.citations.map(c => c.id === id ? { ...c, ...citation } : c) })),
  
  addFootnote: (footnote) => set((s) => ({ footnotes: [...s.footnotes, { id: Date.now(), number: s.footnotes.length + 1, ...footnote }] })),
  removeFootnote: (id) => set((s) => ({ footnotes: s.footnotes.filter(f => f.id !== id) })),
  
  addEndnote: (endnote) => set((s) => ({ endnotes: [...s.endnotes, { id: Date.now(), number: s.endnotes.length + 1, ...endnote }] })),
  removeEndnote: (id) => set((s) => ({ endnotes: s.endnotes.filter(e => e.id !== id) })),
  
  addCaption: (caption) => set((s) => ({ captions: [...s.captions, { id: Date.now(), ...caption }] })),
  removeCaption: (id) => set((s) => ({ captions: s.captions.filter(c => c.id !== id) })),
  
  setCitationStyle: (style) => set({ citationStyle: style }),
  setBibliographyFormat: (format) => set({ bibliographyFormat: format }),

  // Mail Merge state
  mailMergeType: null, // 'letters' | 'emails' | 'envelopes' | 'labels' | 'directory'
  mailMergeRecipients: [], // Array of recipient objects { firstName, lastName, email, address, city, state, zip }
  mergeFieldMap: {}, // Maps field names to column indices
  previewRecipientIndex: 0,
  mailMergeMode: false, // Preview mode toggle

  setMailMergeType: (type) => set({ mailMergeType: type, mailMergeMode: false, previewRecipientIndex: 0 }),
  addMailMergeRecipient: (recipient) => set((s) => ({ mailMergeRecipients: [...s.mailMergeRecipients, { id: Date.now(), ...recipient }] })),
  updateMailMergeRecipient: (id, recipient) => set((s) => ({ mailMergeRecipients: s.mailMergeRecipients.map(r => r.id === id ? { ...r, ...recipient } : r) })),
  deleteMailMergeRecipient: (id) => set((s) => ({ mailMergeRecipients: s.mailMergeRecipients.filter(r => r.id !== id) })),
  setMergeFieldMap: (map) => set({ mergeFieldMap: map }),
  setPreviewRecipientIndex: (index) => set({ previewRecipientIndex: index }),
  toggleMailMergeMode: () => set((s) => ({ mailMergeMode: !s.mailMergeMode })),
  setMailMergeRecipients: (recipients) => set({ mailMergeRecipients: recipients }),
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
