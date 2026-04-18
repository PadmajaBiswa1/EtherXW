import { useState, useRef } from 'react';
import { useEditorStore, useUIStore } from '@/store';
import { RibbonGroup } from '../RibbonGroup';

export function ReferencesTab() {
  const { editor } = useEditorStore();
  const { openDialog } = useUIStore();
  const goldColor = '#d4af37';
  const [tocOpen, setTocOpen] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [bibOpen, setBibOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const tocRef = useRef(null);
  const styleRef = useRef(null);
  const bibRef = useRef(null);

  if (!editor) return null;

  const TOC_STYLES = ['Automatic 1', 'Automatic 2', 'Manual'];
  const CITATION_STYLES = ['APA', 'MLA', 'Chicago', 'Harvard'];
  const BIB_FORMATS = ['Works Cited', 'References', 'Bibliography'];

  const insertTOC = (style) => { const headings = []; const walker = document.createTreeWalker(editor.view.dom, NodeFilter.SHOW_ELEMENT, null); let node; while (node = walker.nextNode()) { if (/^H[1-3]$/.test(node.tagName)) headings.push({ level: parseInt(node.tagName[1]), text: node.textContent }); } const tocHtml = headings.map(h => `<div style="margin-left: ${(h.level - 1) * 20}px">${h.text} ............... 0</div>`).join(''); editor.commands.insertContent(`<div style="padding: 16px; margin: 16px 0; border: 1px solid rgba(212, 175, 55, 0.2); background: rgba(212, 175, 55, 0.05);">${tocHtml}</div>`); setTocOpen(false); };

  const insertFootnote = () => { editor.commands.insertContent('<sup>1</sup>'); };
  const insertEndnote = () => { editor.commands.insertContent('[1]'); };
  const updateTOC = () => { const tocElement = editor.view.dom.querySelector('[data-toc]'); if (tocElement) insertTOC('Automatic 1'); };
  const nextNote = () => { const notes = editor.view.dom.querySelectorAll('sup'); if (notes.length > 0) notes[0].scrollIntoView(); };

  const TocIcon = () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={goldColor} strokeWidth="2"><path d="M4 4h16M4 8h12M4 12h16M4 16h12M4 20h8"/></svg>);
  const FootnoteIcon = () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={goldColor} strokeWidth="2"><path d="M12 3h8M12 12h10M6 16l2 2 4-8"/></svg>);
  const EndnoteIcon = () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={goldColor} strokeWidth="2"><path d="M3 12h8M3 18h8M16 3l3 6m0 0l3-6m-3 6v12"/></svg>);
  const CitationIcon = () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={goldColor} strokeWidth="2"><path d="M5 3v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-9"/></svg>);
  const BibIcon = () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={goldColor} strokeWidth="2"><path d="M4 3h16v1H4zM4 8h16M4 13h16M4 18h16"/></svg>);
  const CaptionIcon = () => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={goldColor} strokeWidth="2"><rect x="3" y="3" width="18" height="12" rx="1"/><path d="M3 18h18"/></svg>);

  return (
    <div style={{ display: 'flex', gap: 8, padding: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* Table of Contents */}
      <RibbonGroup label="TOC">
        <div style={{ position: 'relative' }} ref={tocRef}>
          <button onClick={() => setTocOpen(!tocOpen)} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}><TocIcon /></button>
          {tocOpen && (() => { const rect = tocRef.current?.getBoundingClientRect?.(); return (<div style={{ position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000, background: 'var(--bg-surface)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '4px', minWidth: 120 }}>{TOC_STYLES.map((style, i) => (<button key={i} onClick={() => insertTOC(style)} style={{ display: 'block', width: '100%', padding: '8px 10px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-secondary)', borderBottom: i < TOC_STYLES.length - 1 ? '1px solid rgba(212, 175, 55, 0.1)' : 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>{style}</button>))}</div>); })()}
        </div>
        <button title="Update TOC" onClick={updateTOC} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', fontSize: 10, color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}>Update</button>
      </RibbonGroup>

      {/* Footnotes & Endnotes */}
      <RibbonGroup label="Notes">
        <button title="Footnote" onClick={insertFootnote} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}><FootnoteIcon /></button>
        <button title="Endnote" onClick={insertEndnote} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}><EndnoteIcon /></button>
        <button title="Next Note" onClick={nextNote} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', fontSize: 10, color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}>Next</button>
        <button title={showNotes ? 'Hide Notes' : 'Show Notes'} onClick={() => setShowNotes(!showNotes)} style={{ padding: '6px 8px', background: showNotes ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', fontSize: 9, color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = showNotes ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.05)'; }}>Show</button>
      </RibbonGroup>

      {/* Citations & Bibliography */}
      <RibbonGroup label="Citations">
        <button title="Citation" onClick={() => openDialog('citation')} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}><CitationIcon /></button>
        <button title="Sources" onClick={() => openDialog('sources')} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', fontSize: 10, color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}>Sources</button>
        <div style={{ position: 'relative' }} ref={styleRef}>
          <button onClick={() => setStyleOpen(!styleOpen)} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', fontSize: 10, color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}>Style ▼</button>
          {styleOpen && (() => { const rect = styleRef.current?.getBoundingClientRect?.(); return (<div style={{ position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000, background: 'var(--bg-surface)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '4px', minWidth: 100 }}>{CITATION_STYLES.map((style, i) => (<button key={i} onClick={() => setStyleOpen(false)} style={{ display: 'block', width: '100%', padding: '8px 10px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-secondary)', borderBottom: i < CITATION_STYLES.length - 1 ? '1px solid rgba(212, 175, 55, 0.1)' : 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>{style}</button>))}</div>); })()}
        </div>
      </RibbonGroup>

      {/* Bibliography */}
      <RibbonGroup label="Bibliography">
        <div style={{ position: 'relative' }} ref={bibRef}>
          <button onClick={() => setBibOpen(!bibOpen)} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}><BibIcon /></button>
          {bibOpen && (() => { const rect = bibRef.current?.getBoundingClientRect?.(); return (<div style={{ position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000, background: 'var(--bg-surface)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '4px', minWidth: 120 }}>{BIB_FORMATS.map((format, i) => (<button key={i} onClick={() => setBibOpen(false)} style={{ display: 'block', width: '100%', padding: '8px 10px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-secondary)', borderBottom: i < BIB_FORMATS.length - 1 ? '1px solid rgba(212, 175, 55, 0.1)' : 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>{format}</button>))}</div>); })()}
        </div>
      </RibbonGroup>

      {/* Captions */}
      <RibbonGroup label="Captions">
        <button title="Caption" onClick={() => openDialog('caption')} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}><CaptionIcon /></button>
        <button title="Cross-Reference" onClick={() => openDialog('crossReference')} style={{ padding: '6px 8px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '4px', cursor: 'pointer', fontSize: 10, color: 'var(--text-secondary)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}>Cross-Ref</button>
      </RibbonGroup>
    </div>
  );
}
