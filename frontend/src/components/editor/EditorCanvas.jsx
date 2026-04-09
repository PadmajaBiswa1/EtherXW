import { useRef, useEffect, useState, useCallback } from 'react';
import { EditorContent } from '@tiptap/react';
import { useEditorSetup } from '@/hooks/useEditorSetup';
import { useUIStore, useDocumentStore } from '@/store';
import html2canvas from 'html2canvas';

export function EditorCanvas() {
  const editor     = useEditorSetup();
  const zoom       = useUIStore((s) => s.zoom);
  const setActivePage = useUIStore((s) => s.setActivePage);
  const contentRef = useRef(null);
  const wrapperRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);
  const setStats     = useDocumentStore((s) => s.setStats);
  const setThumbnail = useDocumentStore((s) => s.setThumbnail);

  const PAGE_W  = 794;
  const PAGE_H  = 1123;
  const MARGIN_Y = 96;
  const MARGIN_X = 96;
  const scale   = zoom / 100;

  // Capture each page as a snapshot of the real rendered DOM
  const captureThumbnails = useCallback(async (count) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    for (let i = 0; i < count; i++) {
      try {
        const canvas = await html2canvas(wrapper, {
          scale: 0.136,           // THUMB_W(108) / PAGE_W(794) ≈ 0.136
          useCORS: true,
          logging: false,
          scrollX: 0,
          scrollY: -(i * PAGE_H * scale), // shift to capture this page's slice
          x: 0,
          y: i * PAGE_H * scale,
          width: PAGE_W * scale,
          height: PAGE_H * scale,
          windowWidth: PAGE_W * scale,
          windowHeight: PAGE_H * scale,
        });
        setThumbnail(i, canvas.toDataURL('image/jpeg', 0.8));
      } catch {}
    }
  }, [setThumbnail, scale, PAGE_H, PAGE_W]);

  useEffect(() => {
    if (!editor) return;
    let debounce;

    const update = () => {
      const el = contentRef.current?.querySelector('.ProseMirror');
      if (!el) return;

      const contentAreaH = PAGE_H - MARGIN_Y * 2;
      const count = Math.max(1, Math.ceil(el.scrollHeight / contentAreaH));
      setPageCount(count);

      const text  = editor.state.doc.textContent;
      const words = text.trim().split(/\s+/).filter(Boolean);
      setStats({
        wordCount: words.length,
        charCount: editor.storage.characterCount?.characters?.() ?? text.length,
        pageCount: count,
      });

      clearTimeout(debounce);
      debounce = setTimeout(() => captureThumbnails(count), 600);
    };

    update();
    editor.on('update', update);
    return () => { editor.off('update', update); clearTimeout(debounce); };
  }, [editor, captureThumbnails, setStats, MARGIN_Y, PAGE_H]);

  // Sync activePage with scroll position
  useEffect(() => {
    const scrollEl = document.getElementById('editor-scroll-area');
    if (!scrollEl) return;
    const onScroll = () => {
      const scrollTop = scrollEl.scrollTop;
      const page = Math.floor(scrollTop / (PAGE_H * (zoom / 100)));
      setActivePage(Math.max(0, page));
    };
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [zoom, setActivePage]);

  const totalH = pageCount * PAGE_H * scale;

  return (
    <div
      id="editor-scroll-area"
      style={{
        flex: 1, overflowY: 'auto', overflowX: 'auto',
        background: 'var(--bg-app)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        padding: `${40 * scale}px ${20 * scale}px`,
      }}>

      <div ref={wrapperRef} data-editor-wrapper
        style={{ position: 'relative', width: PAGE_W * scale, height: totalH }}>

        {/* Page background sheets */}
        {Array.from({ length: pageCount }).map((_, i) => (
          <div key={i} id={`document-page-${i}`} style={{
            position: 'absolute',
            top: i * PAGE_H * scale, left: 0,
            width: PAGE_W * scale, height: PAGE_H * scale,
            background: 'var(--bg-page)',
            boxShadow: 'var(--shadow-page)',
            borderRadius: 2, pointerEvents: 'none',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)',
              opacity: 0.4,
            }} />
            <div style={{
              position: 'absolute', bottom: 24 * scale, left: 0, right: 0,
              textAlign: 'center', fontSize: 10 * scale,
              color: 'var(--text-muted)', fontFamily: 'var(--font-ui)',
            }}>{i + 1}</div>
          </div>
        ))}

        {/* Page-break gap dividers */}
        {Array.from({ length: pageCount - 1 }).map((_, i) => (
          <div key={`break-${i}`} style={{
            position: 'absolute',
            top: (i + 1) * PAGE_H * scale - 8 * scale,
            left: -20 * scale, right: -20 * scale,
            height: 16 * scale,
            background: 'var(--bg-app)',
            zIndex: 3, pointerEvents: 'none',
          }} />
        ))}

        {/* Single continuous editor — all pages are editable */}
        <div ref={contentRef} style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          zIndex: 1,
          padding: `${MARGIN_Y * scale}px ${MARGIN_X * scale}px`,
          minHeight: totalH,
        }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      <div style={{ height: 40 * scale }} />
    </div>
  );
}
