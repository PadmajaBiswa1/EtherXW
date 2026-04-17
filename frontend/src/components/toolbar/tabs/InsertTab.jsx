import { useState, useRef } from 'react';
import { useUIStore, useEditorStore } from '@/store';
import { Button, Tooltip } from '@/components/ui';
import { RibbonGroup } from '../RibbonGroup';

/* ── SVG ICON COMPONENTS ── */
const CoverPageIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 10h6M9 15h6M9 20h4"/>
  </svg>
);

const PageBreakIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M4 12h16M8 8v8M16 8v8"/>
  </svg>
);

const TableIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
  </svg>
);

const ImageIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="var(--gold)"/><path d="M21 15l-5-5-6 6-5-5"/>
  </svg>
);

const ShapeIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <circle cx="8" cy="8" r="4"/><rect x="14" y="4" width="8" height="8" rx="1"/>
  </svg>
);

const IconIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="9"/><path d="M8 12l2 2 4-4"/>
  </svg>
);

const ChartIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <rect x="3" y="14" width="3" height="7"/><rect x="10" y="7" width="3" height="14"/><rect x="17" y="3" width="3" height="18"/>
  </svg>
);

const DrawIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 19h18M7 4l10 10M7 4v6M7 4h6M17 14l-10-10"/>
  </svg>
);

const LinkIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M9 8a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const BookmarkIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

const RefIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 9l3-3v12M9 9l-3-3M9 9h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9"/>
  </svg>
);

const HeaderIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <path d="M3 5h18M3 10h18M5 15h14"/>
  </svg>
);

const TextBoxIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 9h10M7 14h10"/>
  </svg>
);

const WordArtIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 12h18M12 3v18M9 8l3-3 3 3M9 16l3 3 3-3"/>
  </svg>
);

const DropCapIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <text x="2" y="14" fontSize="14" fontWeight="bold" fill="var(--gold)">A</text>
    <path d="M8 5h12M8 10h12M8 15h12M8 20h8"/>
  </svg>
);

const DateTimeIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><text x="10" y="17" fontSize="4" fill="var(--gold)">D</text>
  </svg>
);

const EquationIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 8h4M8 6v4M13 8h4M9 3v10M9 13v8M15 12h6"/>
  </svg>
);

const SymbolIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <text x="6" y="14" fontSize="10" fontWeight="bold" fill="var(--gold)">Ω</text>
    <circle cx="17" cy="9" r="3" fill="none" stroke="var(--gold)" strokeWidth="1.8"/>
    <path d="M14 12l6 4"/>
  </svg>
);

const CommentIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

export function InsertTab() {
  const { openDialog } = useUIStore();
  const { editor } = useEditorStore();
  const [coverPageOpen, setCoverPageOpen] = useState(false);
  const [headerOpen, setHeaderOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const [pageNumOpen, setPageNumOpen] = useState(false);
  const coverPageRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const pageNumRef = useRef(null);

  const run = (fn) => { fn?.(); editor?.view?.focus(); };

  const COVER_PAGES = [
    { id: 'modern', label: 'Modern', color: 'var(--gold)' },
    { id: 'classic', label: 'Classic', color: '#333' },
    { id: 'bold', label: 'Bold', color: 'var(--gold)' },
    { id: 'minimal', label: 'Minimal', color: '#888' },
  ];

  const HEADERS = [
    { id: 'none', label: 'None' },
    { id: 'basic', label: 'Basic - Title' },
    { id: 'pagenum', label: 'Page Number' },
    { id: 'date-title', label: 'Date & Title' },
  ];

  const FOOTERS = [
    { id: 'none', label: 'None' },
    { id: 'pagenum', label: 'Page Number (Centered)' },
    { id: 'date-pagenum', label: 'Date & Page Number' },
  ];

  const PAGE_NUM_POS = [
    { id: 'top-right', label: 'Top of page - Right' },
    { id: 'top-center', label: 'Top of page - Center' },
    { id: 'top-left', label: 'Top of page - Left' },
    { id: 'bottom-center', label: 'Bottom of page - Center' },
    { id: 'margins', label: 'Page margins' },
  ];

  const insertCoverPage = (type) => {
    const coverPages = {
      modern: `<div style="text-align: center; padding: 100px 40px; border-top: 3px solid var(--gold); background: linear-gradient(135deg, rgba(212,175,55,0.05) 0%, transparent 100%); margin-bottom: 100px;"><h1 style="font-size: 48px; color: var(--gold); margin: 0 0 20px 0; font-weight: 700;">Document Title</h1><p style="font-size: 18px; color: var(--text-secondary); margin: 0 0 40px 0;">Subtitle goes here</p><p style="font-size: 14px; color: var(--text-muted);">Your Name</p><p style="font-size: 14px; color: var(--text-muted);">Date</p></div>`,
      classic: `<div style="text-align: center; padding: 120px 40px; border: 2px solid #333; margin-bottom: 100px;"><h1 style="font-size: 44px; color: #333; margin: 0 0 30px 0; font-weight: 700; letter-spacing: 2px;">DOCUMENT TITLE</h1><hr style="width: 100px; border: none; border-top: 1px solid #333; margin: 20px auto;"/><p style="font-size: 16px; color: #333; margin: 30px 0 0 0;">Subtitle</p></div>`,
      bold: `<div style="text-align: center; padding: 80px 40px; background: #1a1a1a; color: white; margin-bottom: 100px;"><h1 style="font-size: 52px; color: var(--gold); margin: 0 0 20px 0; font-weight: 900;">BOLD TITLE</h1><p style="font-size: 20px; color: white; margin: 0;">Your Content Starts Here</p></div>`,
      minimal: `<div style="text-align: center; padding: 100px 40px; margin-bottom: 100px;"><h1 style="font-size: 40px; color: #333; margin: 0 0 20px 0; font-weight: 300; letter-spacing: 1px;">title</h1><p style="font-size: 14px; color: #888; margin: 0; font-weight: 300;">subtitle</p></div>`,
    };

    run(() => editor?.chain().insertContentAt(0, coverPages[type] || coverPages.modern).run());
    setCoverPageOpen(false);
  };

  const insertHeader = (type) => {
    const headers = {
      basic: `<div style="border-bottom: 1px solid var(--border); padding: 10px; text-align: center; font-size: 12px; color: var(--text-muted); margin-bottom: 40px;">Document Title</div>`,
      pagenum: `<div style="border-bottom: 1px solid var(--border); padding: 10px; text-align: right; font-size: 12px; color: var(--text-muted); margin-bottom: 40px;"><span style="text-decoration: underline;">1</span></div>`,
      'date-title': `<div style="border-bottom: 1px solid var(--border); padding: 10px 0; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted); margin-bottom: 40px;"><span>${new Date().toLocaleDateString()}</span><span>Document Title</span></div>`,
    };
    if (type !== 'none' && headers[type]) {
      run(() => editor?.chain().insertContentAt(0, headers[type]).run());
    }
    setHeaderOpen(false);
  };

  const insertFooter = (type) => {
    const footers = {
      pagenum: `<div style="border-top: 1px solid var(--border); padding: 10px; text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 40px;"><span style="text-decoration: underline;">1</span></div>`,
      'date-pagenum': `<div style="border-top: 1px solid var(--border); padding: 10px; text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 40px;">${new Date().toLocaleDateString()} | <span style="text-decoration: underline;">1</span></div>`,
    };
    if (type !== 'none' && footers[type]) {
      run(() => editor?.chain().insertContentAt('replace', footers[type]).run());
    }
    setFooterOpen(false);
  };

  const insertPageNumber = (pos) => {
    const positions = {
      'top-right': `<div style="text-align: right; font-size: 12px; color: var(--text-muted); margin-bottom: 40px;"><span style="text-decoration: underline;">1</span></div>`,
      'top-center': `<div style="text-align: center; font-size: 12px; color: var(--text-muted); margin-bottom: 40px;"><span style="text-decoration: underline;">1</span></div>`,
      'top-left': `<div style="text-align: left; font-size: 12px; color: var(--text-muted); margin-bottom: 40px;"><span style="text-decoration: underline;">1</span></div>`,
      'bottom-center': `<div style="text-align: center; font-size: 12px; color: var(--text-muted); margin-top: 80px;"><span style="text-decoration: underline;">1</span></div>`,
    };
    if (positions[pos]) {
      run(() => editor?.chain().insertContentAt('replace', positions[pos]).run());
    }
    setPageNumOpen(false);
  };

  return (
    <>
      {/* ──────────────────── PAGES GROUP ──────────────────── */}
      <RibbonGroup label="Pages">
        {/* Cover Page Dropdown */}
        <div style={{ position: 'relative' }} ref={coverPageRef}>
          <button onClick={() => setCoverPageOpen(!coverPageOpen)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)',
            fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
            <CoverPageIcon />
            <span>Cover</span>
            <span style={{ fontSize: 9 }}>▼</span>
          </button>
          {coverPageOpen && (() => {
            const rect = coverPageRef.current?.getBoundingClientRect?.();
            return (
              <div style={{
                position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000,
                background: 'var(--bg-surface)', border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                minWidth: 160, overflow: 'hidden', padding: '8px',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
              }}>
                {COVER_PAGES.map((page) => (
                  <button key={page.id} onClick={() => insertCoverPage(page.id)} style={{
                    padding: '12px 8px', textAlign: 'center', background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
                    color: 'var(--text-primary)', transition: 'all 0.1s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}>
                    {page.label}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        <Tooltip text="Blank Page">
          <Button onClick={() => run(() => {
            editor?.chain().insertContent('<br><br>').run();
          })} style={{ padding: '6px 8px' }}>
            <PageBreakIcon />
          </Button>
        </Tooltip>

        <Tooltip text="Page Break">
          <Button onClick={() => run(() => editor?.chain().setHorizontalRule().run())} style={{ padding: '6px 8px' }}>
            <PageBreakIcon />
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* ──────────────────── TABLES GROUP ──────────────────── */}
      <RibbonGroup label="Tables">
        <Tooltip text="Insert Table">
          <Button onClick={() => openDialog('insertTable')} style={{ padding: '6px 8px' }}>
            <TableIcon />
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* ──────────────────── ILLUSTRATIONS GROUP ──────────────────── */}
      <RibbonGroup label="Illustrations">
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Tooltip text="Picture">
            <Button onClick={() => openDialog('insertImage')} style={{ padding: '6px 8px' }}>
              <ImageIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Shapes">
            <Button onClick={() => openDialog('insertShape')} style={{ padding: '6px 8px' }}>
              <ShapeIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Icons">
            <Button onClick={() => openDialog('insertIcons')} style={{ padding: '6px 8px' }}>
              <IconIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Chart">
            <Button onClick={() => openDialog('insertChart')} style={{ padding: '6px 8px' }}>
              <ChartIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Drawing">
            <Button onClick={() => openDialog('drawing')} style={{ padding: '6px 8px' }}>
              <DrawIcon />
            </Button>
          </Tooltip>
        </div>
      </RibbonGroup>

      {/* ──────────────────── LINKS GROUP ──────────────────── */}
      <RibbonGroup label="Links">
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Tooltip text="Link" shortcut="Ctrl+K">
            <Button onClick={() => openDialog('insertLink')} style={{ padding: '6px 8px' }}>
              <LinkIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Bookmark">
            <Button onClick={() => openDialog('bookmark')} style={{ padding: '6px 8px' }}>
              <BookmarkIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Cross-Reference">
            <Button onClick={() => openDialog('crossReference')} style={{ padding: '6px 8px' }}>
              <RefIcon />
            </Button>
          </Tooltip>
        </div>
      </RibbonGroup>

      {/* ──────────────────── HEADER & FOOTER GROUP ──────────────────── */}
      <RibbonGroup label="Header & Footer">
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Header Dropdown */}
          <div style={{ position: 'relative' }} ref={headerRef}>
            <button onClick={() => setHeaderOpen(!headerOpen)} style={{
              padding: '6px 8px', background: 'var(--bg-surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', transition: 'var(--transition)',
              fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, color: 'var(--text-primary)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
              Header▼
            </button>
            {headerOpen && (() => {
              const rect = headerRef.current?.getBoundingClientRect?.();
              return (
                <div style={{
                  position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000,
                  background: 'var(--bg-surface)', border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  minWidth: 140, overflow: 'hidden',
                }}>
                  {HEADERS.map((header, i) => (
                    <button key={i} onClick={() => insertHeader(header.id)} style={{
                      width: '100%', padding: '10px 12px', textAlign: 'left', background: 'none',
                      border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
                      color: 'var(--text-primary)', borderBottom: i < HEADERS.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                      {header.label}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Footer Dropdown */}
          <div style={{ position: 'relative' }} ref={footerRef}>
            <button onClick={() => setFooterOpen(!footerOpen)} style={{
              padding: '6px 8px', background: 'var(--bg-surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', transition: 'var(--transition)',
              fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, color: 'var(--text-primary)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
              Footer▼
            </button>
            {footerOpen && (() => {
              const rect = footerRef.current?.getBoundingClientRect?.();
              return (
                <div style={{
                  position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000,
                  background: 'var(--bg-surface)', border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  minWidth: 140, overflow: 'hidden',
                }}>
                  {FOOTERS.map((footer, i) => (
                    <button key={i} onClick={() => insertFooter(footer.id)} style={{
                      width: '100%', padding: '10px 12px', textAlign: 'left', background: 'none',
                      border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
                      color: 'var(--text-primary)', borderBottom: i < FOOTERS.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                      {footer.label}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Page Number Dropdown */}
          <div style={{ position: 'relative' }} ref={pageNumRef}>
            <button onClick={() => setPageNumOpen(!pageNumOpen)} style={{
              padding: '6px 8px', background: 'var(--bg-surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', transition: 'var(--transition)',
              fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, color: 'var(--text-primary)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
              # Page▼
            </button>
            {pageNumOpen && (() => {
              const rect = pageNumRef.current?.getBoundingClientRect?.();
              return (
                <div style={{
                  position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000,
                  background: 'var(--bg-surface)', border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  minWidth: 160, overflow: 'hidden',
                }}>
                  {PAGE_NUM_POS.map((pos, i) => (
                    <button key={i} onClick={() => insertPageNumber(pos.id)} style={{
                      width: '100%', padding: '10px 12px', textAlign: 'left', background: 'none',
                      border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
                      color: 'var(--text-primary)', borderBottom: i < PAGE_NUM_POS.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                      {pos.label}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </RibbonGroup>

      {/* ──────────────────── TEXT GROUP ──────────────────── */}
      <RibbonGroup label="Text">
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Tooltip text="Text Box">
            <Button onClick={() => run(() => {
              const textBoxHtml = '<div style="border: 1px solid var(--gold); padding: 12px; border-radius: var(--radius-md); background: var(--bg-surface); width: 200px; cursor: move;"><p>Text box content</p></div>';
              editor?.chain().insertContent(textBoxHtml).run();
            })} style={{ padding: '6px 8px' }}>
              <TextBoxIcon />
            </Button>
          </Tooltip>

          <Tooltip text="WordArt">
            <Button onClick={() => openDialog('wordArt')} style={{ padding: '6px 8px' }}>
              <WordArtIcon />
            </Button>
          </Tooltip>

          <Tooltip text="Drop Cap">
            <Button onClick={() => openDialog('dropCap')} style={{ padding: '6px 8px' }}>
              <DropCapIcon />
            </Button>
          </Tooltip>

          <Tooltip text="Date & Time">
            <Button onClick={() => openDialog('dateTime')} style={{ padding: '6px 8px' }}>
              <DateTimeIcon />
            </Button>
          </Tooltip>
        </div>
      </RibbonGroup>

      {/* ──────────────────── SYMBOLS GROUP ──────────────────── */}
      <RibbonGroup label="Symbols">
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Tooltip text="Equation">
            <Button onClick={() => openDialog('equation')} style={{ padding: '6px 8px' }}>
              <EquationIcon />
            </Button>
          </Tooltip>

          <Tooltip text="Symbol">
            <Button onClick={() => openDialog('insertSymbol')} style={{ padding: '6px 8px' }}>
              <SymbolIcon />
            </Button>
          </Tooltip>
        </div>
      </RibbonGroup>

      {/* ──────────────────── COMMENTS GROUP ──────────────────── */}
      <RibbonGroup label="Comments">
        <Tooltip text="Insert Comment">
          <Button onClick={() => openDialog('comments')} style={{ padding: '6px 8px' }}>
            <CommentIcon />
          </Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
