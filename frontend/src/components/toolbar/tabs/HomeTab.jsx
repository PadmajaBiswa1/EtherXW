import { useState, useEffect, useRef } from 'react';
import { useEditorStore, useUIStore } from '@/store';
import { Button, Divider, Tooltip, Select, ColorSwatch } from '@/components/ui';
import { TextColorPicker } from '../TextColorPicker';
import { FontFamilyPicker } from '../FontFamilyPicker';
import { MoreFormattingDropdown } from '../MoreFormattingDropdown';
import { RibbonGroup } from '../RibbonGroup';

const FONTS = [
  'Crimson Pro','Times New Roman','Arial','Calibri','Garamond',
  'Georgia','Helvetica','Verdana','Courier New','Trebuchet MS',
].map((f) => ({ value: f, label: f }));

const SIZES = ['8','9','10','11','12','14','16','18','20','24','28','32','36','48','72']
  .map((s) => ({ value: s, label: s }));

const PARA_STYLES = [
  { value: 'p',  label: 'Normal'    },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
];

const TEXT_CASE_OPTIONS = [
  { value: 'none',      label: 'Normal'     },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize',label: 'Sentence case' },
  { value: 'toggle',    label: 'tOGGLE cASE' },
  { value: 'capitalize-words', label: 'Capitalize Each Word' },
];

const LINE_SPACING_OPTIONS = [
  { value: '1',    label: '1.0' },
  { value: '1.15', label: '1.15' },
  { value: '1.5',  label: '1.5' },
  { value: '2',    label: '2.0' },
  { value: '2.5',  label: '2.5' },
  { value: '3',    label: '3.0' },
];

const TEXT_COLORS = ['#d4af37','#e8d98a','#ffffff','#cccccc','#888888','#333333',
                     '#ff5555','#ff9800','#4caf50','#2196f3','#9c27b0','#000000'];

/* ── SVG Icon Components (Gold) ── */
const PasteIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" fill="var(--gold)" opacity="0.3" stroke="var(--gold)"/>
  </svg>
);

const CutIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/>
    <circle cx="6" cy="18" r="3"/>
    <path d="M20 4l-8.5 8.5M4 20l16-16"/>
  </svg>
);

const CopyIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="12" height="12" rx="2"/>
    <path d="M9 13v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2"/>
  </svg>
);

const BrushIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.4 14.4 L8 21 L3 16 L10.4 9.6 M14.4 14.4 L20 9 L15 4 L9.4 9.6"/>
    <circle cx="6.5" cy="17.5" r="1.5" fill="var(--gold)"/>
  </svg>
);

const BoldIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
  </svg>
);

const ItalicIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M10 4h8M6 20h8M17 4L7 20"/>
  </svg>
);

const UnderlineIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M3 21h18"/>
  </svg>
);

const StrikeIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 12h18M6 6h12a4 4 0 0 1 0 8H6M6 16h12a4 4 0 0 0 0-4"/>
  </svg>
);

const SubscriptIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <text x="3" y="10" fontSize="12" fontWeight="bold">A</text>
    <text x="12" y="16" fontSize="8">2</text>
  </svg>
);

const SuperscriptIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <text x="3" y="14" fontSize="12" fontWeight="bold">A</text>
    <text x="12" y="8" fontSize="8">2</text>
  </svg>
);

const HighlightIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 18h18M5 14l2-8h10l2 8M7 14h10"/>
    <rect x="6" y="2" width="12" height="2" fill="var(--gold)" opacity="0.4"/>
  </svg>
);

const ClearFormatIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 15l2-8h10l2 8M8 6h8M6 3h12"/>
    <path d="M9 3 L3 21"/>
  </svg>
);

const AlignLeftIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M3 6h18M3 12h10M3 18h18"/>
  </svg>
);

const AlignCenterIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M3 6h18M5 12h14M3 18h18"/>
  </svg>
);

const AlignRightIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M3 6h18M8 12h10M3 18h18"/>
  </svg>
);

const JustifyIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M3 6h18M3 12h18M3 18h18"/>
  </svg>
);

const BulletListIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <circle cx="5" cy="7" r="1.5" fill="var(--gold)"/>
    <path d="M9 7h10M9 12h10M9 17h10"/><circle cx="5" cy="12" r="1.5" fill="var(--gold)"/>
    <circle cx="5" cy="17" r="1.5" fill="var(--gold)"/>
  </svg>
);

const OrderedListIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <text x="2" y="10" fontSize="10" fontWeight="bold" fill="var(--gold)">1</text>
    <text x="2" y="15" fontSize="10" fontWeight="bold" fill="var(--gold)">2</text>
    <text x="2" y="20" fontSize="10" fontWeight="bold" fill="var(--gold)">3</text>
    <path d="M9 7h10M9 12h10M9 17h10"/>
  </svg>
);

const IndentIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M3 8h14M3 16h14M3 12h14"/>
  </svg>
);

const OutdentIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <path d="M3 8h14M3 16h14M3 12h14M3 6l3 3-3 3"/>
  </svg>
);

const LineSpacingIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M6 5h12M6 12h12M6 19h12"/>
  </svg>
);

const ColorIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="var(--gold)">
    <circle cx="12" cy="12" r="8"/>
  </svg>
);

const FindIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);

const SelectAllIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M7 11h10M7 17h10"/>
  </svg>
);

const DecreaseIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
    <text x="5" y="12" fontSize="10" fill="var(--gold)">A</text>
    <path d="M12 7v8M8 11h8"/>
  </svg>
);

const IncreaseIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
    <text x="5" y="14" fontSize="10" fill="var(--gold)">A</text>
    <path d="M12 5v10M8 10h8"/>
  </svg>
);

export function HomeTab() {
  const { editor, fontFamily, fontSize, setFontFamily, setFontSize } = useEditorStore();
  const { openDialog } = useUIStore();
  const [currentTextColor, setCurrentTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');
  const [pasteOpen, setPasteOpen] = useState(false);
  const [underlineOpen, setUnderlineOpen] = useState(false);
  const [lineSpacingOpen, setLineSpacingOpen] = useState(false);
  const [textCaseOpen, setTextCaseOpen] = useState(false);
  const [shadingOpen, setShadingOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [formatPainterActive, setFormatPainterActive] = useState(false);
  const [storedMarks, setStoredMarks] = useState(null);
  const pasteRef = useRef(null);
  const underlineRef = useRef(null);
  const lineSpacingRef = useRef(null);
  const textCaseRef = useRef(null);
  const selectRef = useRef(null);

  // Update current color when selection changes
  useEffect(() => {
    if (!editor) return;
    const updateColor = () => {
      const marks = editor.getAttributes('textStyle');
      if (marks && marks.color) {
        setCurrentTextColor(marks.color);
      } else {
        setCurrentTextColor('#000000');
      }
    };
    editor.on('update', updateColor);
    editor.on('selectionUpdate', updateColor);
    return () => {
      editor.off('update', updateColor);
      editor.off('selectionUpdate', updateColor);
    };
  }, [editor]);

  if (!editor) return null;

  const run = (fn) => { fn(); editor.view.focus(); };

  // Format Painter functionality
  const handleFormatPainter = () => {
    if (!formatPainterActive) {
      const marks = editor.getMarks();
      setStoredMarks(marks);
      setFormatPainterActive(true);
      document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2724%22 viewBox=%220 0 24 24%22><path fill=%22%23d4af37%22 d=%22M20 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 2v12l-4-4-6 6-4-4V4z%22/></svg>") 4 12, auto';
    } else {
      if (storedMarks && storedMarks.length > 0) {
        run(() => {
          let chain = editor.chain();
          storedMarks.forEach(mark => {
            const attrs = editor.getAttributes(mark.type);
            chain = chain.setMark(mark.type, attrs);
          });
          chain.run();
        });
      }
      setFormatPainterActive(false);
      document.body.style.cursor = 'auto';
    }
  };

  const applyLineSpacing = (spacing) => {
    run(() => editor.chain().setHardBreak().run());
  };

  return (
    <>
      {/* ──────────────────── CLIPBOARD GROUP ──────────────────── */}
      <RibbonGroup label="Clipboard">
        {/* Paste (Large) with dropdown */}
        <div style={{ position: 'relative' }} ref={pasteRef}>
          <button onClick={() => setPasteOpen(!pasteOpen)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '8px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)',
            fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--gold)',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
            <PasteIcon />
            <span>Paste</span>
            <span style={{ fontSize: 9, marginTop: 2 }}>▼</span>
          </button>
          {pasteOpen && (() => {
            const rect = pasteRef.current?.getBoundingClientRect?.();
            return (
              <div style={{
                position: 'fixed', 
                top: rect ? rect.bottom + 4 : 'auto', 
                left: rect ? rect.left : 0, 
                zIndex: 10000,
                background: 'var(--bg-surface)', 
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                minWidth: 160, 
                overflow: 'hidden',
              }}>
                {[
                  { label: 'Paste', action: () => document.execCommand('paste') },
                  { label: 'Paste Special', action: () => openDialog('pasteSpecial') },
                  { label: 'Paste as Plain Text', action: () => run(() => editor.chain().setTextSelection(editor.state.selection).run()) },
                ].map((item, i) => (
                  <button key={i} onClick={() => { item.action(); setPasteOpen(false); }} style={{
                    width: '100%', padding: '10px 14px', textAlign: 'left', background: 'none',
                    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
                    color: 'var(--text-primary)', borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.1s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    {item.label}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Cut, Copy, Format Painter (row 2) */}
        <Tooltip text="Cut" shortcut="Ctrl+X">
          <Button onClick={() => document.execCommand('cut')}><CutIcon /></Button>
        </Tooltip>
        <Tooltip text="Copy" shortcut="Ctrl+C">
          <Button onClick={() => document.execCommand('copy')}><CopyIcon /></Button>
        </Tooltip>
        <Tooltip text={formatPainterActive ? "Click on text to apply formatting" : "Copy Format"} shortcut="">
          <Button active={formatPainterActive} onClick={handleFormatPainter}><BrushIcon /></Button>
        </Tooltip>
      </RibbonGroup>

      {/* ──────────────────── FONT GROUP ──────────────────── */}
      <RibbonGroup label="Font">
        {/* Row 1: Font family + Font size */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <FontFamilyPicker 
            currentFont={fontFamily} 
            onSelect={(font) => { 
              setFontFamily(font); 
              run(() => editor.chain().setFontFamily(font).run()); 
            }} 
          />
          <Select value={fontSize} width={50} onChange={(v) => { setFontSize(v); run(() => editor.chain().setFontSize(parseInt(v)).run()); }} options={SIZES} title="Font Size" />
        </div>

        <Divider vertical />

        {/* Row 2: Bold, Italic, Underline, Strikethrough, Subscript, Superscript */}
        <div style={{ display: 'flex', gap: 3 }}>
          <Tooltip text="Bold" shortcut="Ctrl+B">
            <Button active={editor.isActive('bold')} onClick={() => run(() => editor.chain().toggleBold().run())} style={{ padding: '6px 8px' }}>
              <BoldIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Italic" shortcut="Ctrl+I">
            <Button active={editor.isActive('italic')} onClick={() => run(() => editor.chain().toggleItalic().run())} style={{ padding: '6px 8px' }}>
              <ItalicIcon />
            </Button>
          </Tooltip>

          {/* Underline with dropdown */}
          <div style={{ position: 'relative' }} ref={underlineRef}>
            <button onClick={() => setUnderlineOpen(!underlineOpen)} style={{
              display: 'flex', alignItems: 'center', gap: 3, padding: '6px 8px',
              background: editor.isActive('underline') ? 'var(--bg-active)' : 'var(--bg-surface)',
              border: `1px solid ${editor.isActive('underline') ? 'var(--border-gold)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)',
              title: 'Underline',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { if(!editor.isActive('underline')) e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <UnderlineIcon />
              <span style={{ fontSize: 8, color: 'var(--gold)' }}>▼</span>
            </button>
            {underlineOpen && (() => {
              const rect = underlineRef.current?.getBoundingClientRect?.();
              return (
              <div style={{
                position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000,
                background: 'var(--bg-surface)', border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                minWidth: 140,
              }}>
                {[
                  { label: 'Solid', style: 'solid' },
                  { label: 'Double', style: 'double' },
                  { label: 'Dotted', style: 'dotted' },
                  { label: 'Dashed', style: 'dashed' },
                ].map((item, i) => (
                  <button key={i} onClick={() => { 
                    run(() => editor.chain().setUnderline({ style: item.style }).run());
                    setUnderlineOpen(false);
                  }} style={{
                    width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none',
                    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
                    color: 'var(--text-primary)', borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                    textDecoration: `underline ${item.style}`,
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    {item.label}
                  </button>
                ))}
              </div>
            );
            })()}
          </div>

          <Tooltip text="Strikethrough">
            <Button active={editor.isActive('strike')} onClick={() => run(() => editor.chain().toggleStrike().run())} style={{ padding: '6px 8px' }}>
              <StrikeIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Subscript">
            <Button active={editor.isActive('subscript')} onClick={() => run(() => editor.chain().toggleSubscript().run())} style={{ padding: '6px 8px' }}>
              <SubscriptIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Superscript">
            <Button active={editor.isActive('superscript')} onClick={() => run(() => editor.chain().toggleSuperscript().run())} style={{ padding: '6px 8px' }}>
              <SuperscriptIcon />
            </Button>
          </Tooltip>
        </div>

        <Divider vertical />

        {/* Row 3: Text Color, Highlight, Clear Formatting, Font Size +/-, Case, Caps */}
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <TextColorPicker 
            currentColor={currentTextColor} 
            onSelect={(color) => {
              setCurrentTextColor(color);
              run(() => editor.chain().setColor(color).run());
            }}
            editor={editor}
          />
          <Tooltip text="Highlight">
            <Button active={editor.isActive('highlight')} onClick={() => run(() => editor.chain().toggleHighlight({ color: highlightColor }).run())} style={{ padding: '6px 8px' }}>
              <HighlightIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Clear Formatting">
            <Button onClick={() => run(() => editor.chain().clearNodes().unsetAllMarks().run())} style={{ padding: '6px 8px' }}>
              <ClearFormatIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Decrease Font Size">
            <Button onClick={() => {
              const current = parseInt(fontSize) || 12;
              const sizes = [8,9,10,11,12,14,16,18,20,24,28,32,36,48,72];
              const idx = sizes.indexOf(current);
              if (idx > 0) setFontSize(sizes[idx-1]);
            }} style={{ padding: '6px 8px' }}>
              <DecreaseIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Increase Font Size">
            <Button onClick={() => {
              const current = parseInt(fontSize) || 12;
              const sizes = [8,9,10,11,12,14,16,18,20,24,28,32,36,48,72];
              const idx = sizes.indexOf(current);
              if (idx < sizes.length - 1) setFontSize(sizes[idx+1]);
            }} style={{ padding: '6px 8px' }}>
              <IncreaseIcon />
            </Button>
          </Tooltip>

          {/* Text Case dropdown */}
          <div style={{ position: 'relative' }} ref={textCaseRef}>
            <button onClick={() => setTextCaseOpen(!textCaseOpen)} style={{
              padding: '6px 8px', background: 'var(--bg-surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', transition: 'var(--transition)',
              fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, color: 'var(--text-primary)',
              title: 'Text Case',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
              Aa▼
            </button>
            {textCaseOpen && (() => {
              const rect = textCaseRef.current?.getBoundingClientRect?.();
              return (
              <div style={{
                position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000,
                background: 'var(--bg-surface)', border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                minWidth: 160,
              }}>
                {TEXT_CASE_OPTIONS.map((item, i) => (
                  <button key={i} onClick={() => {
                    run(() => editor.chain().setMark('textStyle', { textTransform: item.value }).run());
                    setTextCaseOpen(false);
                  }} style={{
                    width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none',
                    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
                    color: 'var(--text-primary)', borderBottom: i < TEXT_CASE_OPTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    {item.label}
                  </button>
                ))}
              </div>
            );
            })()}
          </div>

          <Tooltip text="All Caps Toggle">
            <Button active={editor.getAttributes('textStyle')?.textTransform === 'uppercase'} onClick={() => {
              if (editor.getAttributes('textStyle')?.textTransform === 'uppercase') {
                run(() => editor.chain().unsetMark('textStyle', 'textTransform').run());
              } else {
                run(() => editor.chain().setMark('textStyle', { textTransform: 'uppercase' }).run());
              }
            }} style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700 }}>
              AB
            </Button>
          </Tooltip>
        </div>
      </RibbonGroup>

      {/* ──────────────────── PARAGRAPH GROUP ──────────────────── */}
      <RibbonGroup label="Paragraph">
        {/* Row 1: Lists and Indents */}
        <div style={{ display: 'flex', gap: 3 }}>
          <Tooltip text="Bullet List">
            <Button active={editor.isActive('bulletList')} onClick={() => run(() => editor.chain().toggleBulletList().run())} style={{ padding: '6px 8px' }}>
              <BulletListIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Ordered List">
            <Button active={editor.isActive('orderedList')} onClick={() => run(() => editor.chain().toggleOrderedList().run())} style={{ padding: '6px 8px' }}>
              <OrderedListIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Decrease Indent">
            <Button onClick={() => run(() => editor.chain().liftListItem('listItem').run())} style={{ padding: '6px 8px' }}>
              <OutdentIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Increase Indent">
            <Button onClick={() => run(() => editor.chain().sinkListItem('listItem').run())} style={{ padding: '6px 8px' }}>
              <IndentIcon />
            </Button>
          </Tooltip>
        </div>

        <Divider vertical />

        {/* Row 2: Alignment */}
        <div style={{ display: 'flex', gap: 3 }}>
          <Tooltip text="Align Left" shortcut="Ctrl+L">
            <Button active={editor.isActive({textAlign:'left'})} onClick={() => run(() => editor.chain().setTextAlign('left').run())} style={{ padding: '6px 8px' }}>
              <AlignLeftIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Center" shortcut="Ctrl+E">
            <Button active={editor.isActive({textAlign:'center'})} onClick={() => run(() => editor.chain().setTextAlign('center').run())} style={{ padding: '6px 8px' }}>
              <AlignCenterIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Align Right" shortcut="Ctrl+R">
            <Button active={editor.isActive({textAlign:'right'})} onClick={() => run(() => editor.chain().setTextAlign('right').run())} style={{ padding: '6px 8px' }}>
              <AlignRightIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Justify">
            <Button active={editor.isActive({textAlign:'justify'})} onClick={() => run(() => editor.chain().setTextAlign('justify').run())} style={{ padding: '6px 8px' }}>
              <JustifyIcon />
            </Button>
          </Tooltip>
        </div>

        <Divider vertical />

        {/* Row 3: Line Spacing and other paragraph options */}
        <div style={{ display: 'flex', gap: 3 }}>
          <div style={{ position: 'relative' }} ref={lineSpacingRef}>
            <button onClick={() => setLineSpacingOpen(!lineSpacingOpen)} style={{
              padding: '6px 8px', background: 'var(--bg-surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', transition: 'var(--transition)',
              fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
              title: 'Line Spacing',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <LineSpacingIcon style={{ display: 'inline', marginRight: 4 }} /><span style={{ fontSize: 8 }}>▼</span>
            </button>
            {lineSpacingOpen && (() => {
              const rect = lineSpacingRef.current?.getBoundingClientRect?.();
              return (
              <div style={{
                position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000,
                background: 'var(--bg-surface)', border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                minWidth: 120,
              }}>
                {LINE_SPACING_OPTIONS.map((item, i) => (
                  <button key={i} onClick={() => {
                    run(() => editor.chain().setMark('textStyle', { lineHeight: item.value }).run());
                    setLineSpacingOpen(false);
                  }} style={{
                    width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none',
                    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
                    color: 'var(--text-primary)', borderBottom: i < LINE_SPACING_OPTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    {item.label}
                  </button>
                ))}
              </div>
            );
            })()}
          </div>

          <Tooltip text="Shading (Highlight paragraph)">
            <Button style={{ padding: '6px 8px', background: `linear-gradient(135deg, var(--gold) 0%, var(--bg-surface) 100%)` }}>
              <div style={{ width: 14, height: 14, background: highlightColor, border: '1px solid var(--gold)', borderRadius: 2 }} />
            </Button>
          </Tooltip>

          <Tooltip text="Show Formatting Marks">
            <Button onClick={() => run(() => editor.chain().toggleHardBreak().run())} style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700 }}>
              ¶
            </Button>
          </Tooltip>
        </div>
      </RibbonGroup>

      {/* ──────────────────── STYLES GROUP ──────────────────── */}
      <RibbonGroup label="Styles">
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { value: 'p', label: 'Normal' },
            { value: 'h1', label: 'H1' },
            { value: 'h2', label: 'H2' },
            { value: 'h3', label: 'H3' },
            { value: 'blockquote', label: 'Quote' },
            { value: 'codeBlock', label: 'Code' },
          ].map((style) => (
            <button key={style.value} onClick={() => {
              if (style.value === 'p') {
                run(() => editor.chain().setParagraph().run());
              } else if (style.value.startsWith('h')) {
                run(() => editor.chain().toggleHeading({ level: parseInt(style.value[1]) }).run());
              } else {
                run(() => editor.chain().toggleNode(style.value, style.value).run());
              }
            }} style={{
              padding: '8px 12px', background: editor.isActive(style.value === 'p' ? { textAlign: 'left' } : style.value) ? 'var(--bg-active)' : 'var(--bg-surface)',
              border: `1px solid ${editor.isActive(style.value === 'p' ? { textAlign: 'left' } : style.value) ? 'var(--border-gold)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)',
              fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { if (!editor.isActive(style.value === 'p' ? { textAlign: 'left' } : style.value)) e.currentTarget.style.borderColor = 'var(--border)'; }}>
              {style.label}
            </button>
          ))}
        </div>
      </RibbonGroup>

      {/* ──────────────────── EDITING GROUP ──────────────────── */}
      <RibbonGroup label="Editing">
        <div style={{ display: 'flex', gap: 3 }}>
          <Tooltip text="Undo" shortcut="Ctrl+Z">
            <Button disabled={!editor.can().undo()} onClick={() => run(() => editor.chain().undo().run())} style={{ padding: '6px 8px' }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                <path d="M2.5 2v6h6M2 13c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 3 12 3c-4.25 0-7.9 2.675-9.375 6.437"/>
              </svg>
            </Button>
          </Tooltip>
          <Tooltip text="Redo" shortcut="Ctrl+Y">
            <Button disabled={!editor.can().redo()} onClick={() => run(() => editor.chain().redo().run())} style={{ padding: '6px 8px' }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                <path d="M21.5 2v6h-6M22 13c0 5.523-4.477 10-10 10S2 18.523 2 13 6.477 3 12 3c4.25 0 7.9 2.675 9.375 6.437"/>
              </svg>
            </Button>
          </Tooltip>

          <Divider vertical />

          <Tooltip text="Find" shortcut="Ctrl+F">
            <Button onClick={() => openDialog('find')} style={{ padding: '6px 8px' }}>
              <FindIcon />
            </Button>
          </Tooltip>
          <Tooltip text="Find & Replace" shortcut="Ctrl+H">
            <Button onClick={() => openDialog('findReplace')} style={{ padding: '6px 8px' }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                <circle cx="9" cy="9" r="6"/><path d="M21 21l-4.35-4.35M3 12h6M12 9v6"/>
              </svg>
            </Button>
          </Tooltip>
          <Tooltip text="Clear Formatting">
            <Button onClick={() => run(() => editor.chain().clearNodes().unsetAllMarks().run())} style={{ padding: '6px 8px' }}>
              <ClearFormatIcon />
            </Button>
          </Tooltip>

          {/* Select dropdown */}
          <div style={{ position: 'relative' }} ref={selectRef}>
            <button onClick={() => setSelectOpen(!selectOpen)} style={{
              padding: '6px 8px', background: 'var(--bg-surface)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', transition: 'var(--transition)',
              fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, color: 'var(--text-primary)',
              title: 'Select',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
              ⊟▼
            </button>
            {selectOpen && (() => {
              const rect = selectRef.current?.getBoundingClientRect?.();
              return (
              <div style={{
                position: 'fixed', top: rect ? rect.bottom + 4 : 'auto', left: rect ? rect.left : 0, zIndex: 10000,
                background: 'var(--bg-surface)', border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-md)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                minWidth: 160,
              }}>
                {[
                  { label: 'Select All', action: () => run(() => editor.chain().selectAll().run()) },
                  { label: 'Select Text', action: () => run(() => editor.chain().selectAll().run()) },
                ].map((item, i) => (
                  <button key={i} onClick={() => { item.action(); setSelectOpen(false); }} style={{
                    width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none',
                    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 12,
                    color: 'var(--text-primary)', borderBottom: i < 1 ? '1px solid var(--border)' : 'none',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                    {item.label}
                  </button>
                ))}
              </div>
            );
            })()}
          </div>
        </div>
      </RibbonGroup>
    </>
  );
}
