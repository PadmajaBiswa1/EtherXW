import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { EditorContent } from '@tiptap/react';
import { useEditorSetup } from '@/hooks/useEditorSetup';
import { useThumbnailGenerator } from '@/hooks/useThumbnailGenerator';
import { useUIStore, useDocumentStore } from '@/store';
import { DrawingLayer } from './DrawingLayer';
import { HorizontalRuler } from './HorizontalRuler';

const PAGE_HEIGHT  = 1123; // A4 height in pixels (at 96 DPI)
const PAGE_WIDTH   = 794;  // A4 width in pixels (at 96 DPI)
const PAGE_PADDING = 96;   // Top and bottom padding (48px each side = 96px total)
const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2;

export function EditorCanvas() {
  const editor    = useEditorSetup();
  const { zoom, watermarkEnabled, watermarkText, watermarkOpacity, watermarkFontSize, viewMode, setViewMode, focusMode, setFocusMode, showRuler, setShowRuler, showGridlines, setShowGridlines } = useUIStore();
  const { setStats, pageOrder, pageCount: storePageCount, margins, orientation, pageSize } = useDocumentStore();
  const scale     = zoom / 100;
  const wrapRef   = useRef();
  const scrollRef = useRef();
  const [pageCount, setPageCount] = useState(1);
  const overflowTimer = useRef(null);

  // Generate and update thumbnails
  useThumbnailGenerator();
  
  // Calculate scaled dimensions for responsive sizing
  const scaledDimensions = useMemo(() => {
    const currentPageSize = pageSize || { width: PAGE_WIDTH, height: PAGE_HEIGHT };
    const scaledWidth = (currentPageSize.width || PAGE_WIDTH) * scale;
    const scaledHeight = (currentPageSize.height || PAGE_HEIGHT) * scale;
    const scaledMarginTop = (margins?.top || 48) * scale;
    const scaledMarginBottom = (margins?.bottom || 48) * scale;
    const scaledMarginLeft = (margins?.left || 48) * scale;
    const scaledMarginRight = (margins?.right || 48) * scale;
    const contentHeight = scaledHeight - (scaledMarginTop + scaledMarginBottom);
    
    return {
      pageHeight: scaledHeight,
      pageWidth: scaledWidth,
      marginTop: scaledMarginTop,
      marginBottom: scaledMarginBottom,
      marginLeft: scaledMarginLeft,
      marginRight: scaledMarginRight,
      contentHeight: contentHeight,
      scrollPaddingY: 40 * scale,
      scrollPaddingX: 20 * scale,
    };
  }, [scale, margins, pageSize]);

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

  // Handle Escape key to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && focusMode) {
        setFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, setFocusMode]);

  // Apply watermark if enabled
  useEffect(() => {
    if (!watermarkEnabled) return;

    const applyWatermarkToPages = () => {
      // Remove existing watermarks
      document.querySelectorAll('#watermark-layer').forEach(el => el.remove());

      // Get all page containers
      const pages = document.querySelectorAll('[id^="document-page"]');
      
      pages.forEach((pageWrapper) => {
        // Ensure position: relative for absolute positioning to work
        if (getComputedStyle(pageWrapper).position === 'static') {
          pageWrapper.style.position = 'relative';
        }

        // Create a watermark container that covers the entire page
        const watermarkLayer = document.createElement('div');
        watermarkLayer.id = 'watermark-layer';
        watermarkLayer.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
          overflow: hidden;
        `;

        // Create the SVG watermark
        const watermarkSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        watermarkSVG.setAttribute('width', '100%');
        watermarkSVG.setAttribute('height', '100%');
        watermarkSVG.setAttribute('viewBox', '0 0 1200 1400');
        watermarkSVG.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        watermarkSVG.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        `;

        // Create the text element
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '600');
        text.setAttribute('y', '700');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', watermarkFontSize);
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('fill-opacity', `${watermarkOpacity / 100}`);
        text.setAttribute('fill', 'rgba(192, 192, 192, 1)');
        text.setAttribute('transform', `rotate(-45 600 700)`);
        text.setAttribute('font-style', 'italic');
        text.textContent = watermarkText;

        watermarkSVG.appendChild(text);
        watermarkLayer.appendChild(watermarkSVG);

        // Insert at the beginning so it stays behind content
        pageWrapper.insertBefore(watermarkLayer, pageWrapper.firstChild);
      });
    };

    // Apply immediately and also after a small delay to ensure DOM is ready
    applyWatermarkToPages();
    const timer = setTimeout(applyWatermarkToPages, 300);
    
    return () => clearTimeout(timer);
  }, [watermarkEnabled, watermarkText, watermarkOpacity, watermarkFontSize]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      visibility: focusMode ? 'hidden' : 'visible',
    }}>
      {/* Horizontal Ruler */}
      {showRuler && viewMode === 'print' && <HorizontalRuler />}

      <div
        ref={scrollRef}
        id="editor-scroll-area"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: viewMode === 'web' ? 'hidden' : 'auto',
          background: viewMode === 'draft' ? '#0a0a0a' : 'var(--bg-app)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: viewMode === 'web' ? 'stretch' : 'center',
          padding: viewMode === 'draft' ? '16px' : `${scaledDimensions.scrollPaddingY}px ${scaledDimensions.scrollPaddingX}px`,
          scrollBehavior: 'smooth',
        }}
      >
        {/* A4 page container */}
        <div
          ref={wrapRef}
          id="document-page-0"
          style={{
            width: viewMode === 'web' ? '100%' : scaledDimensions.pageWidth,
            minHeight: scaledDimensions.pageHeight * pageCount,
            background: viewMode === 'web' ? '#ffffff' : viewMode === 'draft' ? '#1a1a1a' : 'var(--bg-page)',
            boxShadow: viewMode === 'draft' || viewMode === 'outline' ? 'none' : 'var(--shadow-page)',
            borderRadius: viewMode === 'draft' || viewMode === 'outline' ? 0 : 2,
            paddingTop: scaledDimensions.marginTop,
            paddingBottom: scaledDimensions.marginBottom,
            paddingLeft: viewMode === 'draft' ? '0px' : scaledDimensions.marginLeft,
            paddingRight: viewMode === 'draft' ? '0px' : scaledDimensions.marginRight,
            position: 'relative',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            overflowX: 'hidden',
            transition: 'all 0.15s ease-out',
            color: viewMode === 'draft' ? '#e0e0e0' : 'inherit',
            fontSize: viewMode === 'draft' ? '14px' : 'inherit',
            fontFamily: viewMode === 'draft' ? 'monospace' : 'inherit',
            lineHeight: viewMode === 'draft' ? '1.6' : 'inherit',

            // Gold dashed page break lines (only for non-draft modes)
            backgroundImage: viewMode === 'draft' || viewMode === 'outline' ? 'none' : `repeating-linear-gradient(
              to bottom,
              transparent,
              transparent ${scaledDimensions.pageHeight - 1}px,
              rgba(212,175,55,0.2) ${scaledDimensions.pageHeight - 1}px,
              rgba(212,175,55,0.2) ${scaledDimensions.pageHeight}px
            ),
            ${showGridlines && viewMode !== 'draft' ? `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 19px,
              rgba(212,175,55,0.05) 19px,
              rgba(212,175,55,0.05) 20px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 19px,
              rgba(212,175,55,0.05) 19px,
              rgba(212,175,55,0.05) 20px
            )` : 'none'}`,
            backgroundSize: viewMode === 'draft' || viewMode === 'outline' ? '100% 100%' : `100% ${scaledDimensions.pageHeight}px${showGridlines && viewMode !== 'draft' ? ', 100% 100%, 100% 100%' : ''}`,
          }}
        >
          <EditorContent editor={editor} />
          <DrawingLayer />

          {/* Page number labels (only in print mode) */}
          {viewMode === 'print' && Array.from({ length: pageCount }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: (i + 1) * scaledDimensions.pageHeight - (28 * scale),
                left: 0,
                right: 0,
                textAlign: 'center',
                fontSize: 10 * scale,
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-ui)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {i + 1}
            </div>
          ))}

          {/* Outline mode - hide body text, show only headings */}
          {viewMode === 'outline' && (
            <style>{`
              .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, 
              .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
                display: block;
              }
              .ProseMirror p, .ProseMirror ul, .ProseMirror ol,
              .ProseMirror blockquote, .ProseMirror pre {
                display: none;
              }
            `}</style>
          )}
        </div>
      </div>

      {/* Focus Mode Overlay */}
      {focusMode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          zIndex: 10000,
        }}>
          <div style={{
            position: 'relative',
            width: '95%',
            height: '95%',
            maxWidth: `${scaledDimensions.pageWidth}px`,
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}>
              <div
                ref={wrapRef}
                id="document-page-focus"
                style={{
                  width: '100%',
                  minHeight: '100%',
                  background: 'var(--bg-page)',
                  paddingTop: scaledDimensions.marginTop,
                  paddingBottom: scaledDimensions.marginBottom,
                  paddingLeft: scaledDimensions.marginLeft,
                  paddingRight: scaledDimensions.marginRight,
                  position: 'relative',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              // Exit focus mode on Esc key
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              color: '#999',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Press Esc to exit
          </div>
        </div>
      )}
    </div>
  );
}