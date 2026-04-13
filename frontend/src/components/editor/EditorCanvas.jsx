import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { EditorContent } from '@tiptap/react';
import { useEditorSetup } from '@/hooks/useEditorSetup';
import { useThumbnailGenerator } from '@/hooks/useThumbnailGenerator';
import { useUIStore, useDocumentStore } from '@/store';

const PAGE_HEIGHT  = 1123; // A4 height in pixels (at 96 DPI)
const PAGE_WIDTH   = 794;  // A4 width in pixels (at 96 DPI)
const PAGE_PADDING = 96;   // Top and bottom padding (48px each side = 96px total)
const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2;

export function EditorCanvas() {
  const editor    = useEditorSetup();
  const { zoom }  = useUIStore();
  const { setStats, pageOrder, pageCount: storePageCount } = useDocumentStore();
  const scale     = zoom / 100;
  const wrapRef   = useRef();
  const scrollRef = useRef();
  const [pageCount, setPageCount] = useState(1);
  const overflowTimer = useRef(null);

  // Generate and update thumbnails
  useThumbnailGenerator();
  
  // Calculate scaled dimensions for responsive sizing
  const scaledDimensions = useMemo(() => ({
    pageHeight: PAGE_HEIGHT * scale,
    pageWidth: PAGE_WIDTH * scale,
    padding: PAGE_PADDING * scale,
    contentHeight: CONTENT_HEIGHT * scale,
    scrollPaddingY: 40 * scale,
    scrollPaddingX: 20 * scale,
  }), [scale]);

  // Debounced page count — reads height only, never touches Tiptap DOM
  const recalcPages = useCallback(() => {
  clearTimeout(overflowTimer.current);
  overflowTimer.current = setTimeout(() => {
    const el = wrapRef.current?.querySelector('.ProseMirror');
    if (!el) return;
    const pages = Math.max(1, Math.ceil(el.scrollHeight / scaledDimensions.contentHeight));
    const text  = el.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setPageCount(pages);
    setStats({ wordCount: words, charCount: text.length, pageCount: pages });
  }, 120);
}, [setStats, scaledDimensions]);

  useEffect(() => {
    if (!editor) return;
    editor.on('update', recalcPages);
    return () => editor.off('update', recalcPages);
  }, [editor, recalcPages]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(overflowTimer.current);
  }, []);

  return (
    <div
      ref={scrollRef}
      id="editor-scroll-area"
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'auto',
        background: 'var(--bg-app)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${scaledDimensions.scrollPaddingY}px ${scaledDimensions.scrollPaddingX}px`,
        scrollBehavior: 'smooth',
      }}
    >
      {/* A4 page container */}
      <div
        ref={wrapRef}
        id="document-page-0"
        style={{
          width:     scaledDimensions.pageWidth,
          minHeight: scaledDimensions.pageHeight * pageCount,
          background: 'var(--bg-page)',
          boxShadow: 'var(--shadow-page)',
          borderRadius: 2,
          padding: `${scaledDimensions.padding}px`,
          position: 'relative',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          overflowX: 'hidden',
          transition: 'all 0.15s ease-out',

          // Gold dashed page break lines drawn via CSS background
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent,
            transparent ${scaledDimensions.pageHeight - 1}px,
            rgba(212,175,55,0.2) ${scaledDimensions.pageHeight - 1}px,
            rgba(212,175,55,0.2) ${scaledDimensions.pageHeight}px
          )`,
          backgroundSize: `100% ${scaledDimensions.pageHeight}px`,
        }}
      >
        <EditorContent editor={editor} />

        {/* Page number labels */}
        {Array.from({ length: pageCount }).map((_, i) => (
          <div
            key={i}
            style={{
              position:      'absolute',
              top:           (i + 1) * scaledDimensions.pageHeight - (28 * scale),
              left:          0,
              right:         0,
              textAlign:     'center',
              fontSize:      10 * scale,
              color:         'var(--text-muted)',
              fontFamily:    'var(--font-ui)',
              pointerEvents: 'none',
              userSelect:    'none',
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}