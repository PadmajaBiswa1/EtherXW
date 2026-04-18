import { useState, useRef } from 'react';
import { useDocumentStore } from '@/store';
import { useEditorStore } from '@/store';
import { RibbonGroup } from '../RibbonGroup';
import { Button, Tooltip } from '@/components/ui';

/* ── SVG ICON COMPONENTS ── */
const MarginsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <rect x="4" y="4" width="16" height="16"/><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/>
  </svg>
);

const OrientationIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <rect x="5" y="3" width="14" height="18" rx="1"/><line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
);

const PageSizeIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <rect x="4" y="2" width="16" height="20" rx="1"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="16" x2="14" y2="16"/>
  </svg>
);

const ColumnsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <line x1="5" y1="4" x2="5" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="19" y1="4" x2="19" y2="20"/>
  </svg>
);

const BreakIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeDasharray="3,3">
    <line x1="4" y1="12" x2="20" y2="12"/>
  </svg>
);

const LineNumbersIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <text x="3" y="12" fontSize="10" fill="var(--gold)">1</text><line x1="8" y1="4" x2="20" y2="4"/><line x1="8" y1="11" x2="20" y2="11"/><line x1="8" y1="18" x2="20" y2="18"/>
  </svg>
);

const HyphenationIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <line x1="4" y1="12" x2="20" y2="12"/><circle cx="6" cy="12" r="1" fill="var(--gold)"/><circle cx="18" cy="12" r="1" fill="var(--gold)"/>
  </svg>
);

const IndentIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <line x1="8" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="8" y1="18" x2="20" y2="18"/><path d="M4 6l3 3-3 3M4 12l3 3-3 3"/>
  </svg>
);

const SpacingIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <line x1="6" y1="4" x2="18" y2="4"/><line x1="6" y1="56" x2="18" y2="20"/><path d="M4 8l2-2m-2 2l-2-2M4 16l2 2m-2-2l-2 2"/>
  </svg>
);

const AlignIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/>
  </svg>
);

const WrapIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <rect x="4" y="4" width="12" height="12" rx="1"/><path d="M18 8l2-2 2 2m0 4l-2 2-2-2"/>
  </svg>
);

const ArrangeIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8">
    <rect x="4" y="4" width="8" height="8"/><rect x="12" y="8" width="8" height="8"/>
  </svg>
);

/* ── MARGIN PRESETS ── */
const MARGIN_PRESETS = {
  normal: { label: 'Normal', top: 48, bottom: 48, left: 48, right: 48 },
  narrow: { label: 'Narrow', top: 24, bottom: 24, left: 24, right: 24 },
  moderate: { label: 'Moderate', top: 36, bottom: 36, left: 48, right: 48 },
  wide: { label: 'Wide', top: 48, bottom: 48, left: 96, right: 96 },
};

const PAGE_SIZES = {
  a4: { label: 'A4', width: 794, height: 1123 },
  a3: { label: 'A3', width: 1123, height: 1587 },
  a5: { label: 'A5', width: 559, height: 794 },
  letter: { label: 'Letter', width: 816, height: 1056 },
  legal: { label: 'Legal', width: 816, height: 1344 },
};

const COLUMN_OPTIONS = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

const BREAK_OPTIONS = [
  { value: 'pagebreak', label: 'Page Break', shortcut: 'Ctrl+Return' },
  { value: 'columnbreak', label: 'Column Break' },
  { value: 'wrap', label: 'Text Wrapping Break' },
  { value: 'sectionbreaknext', label: 'Next Page Section Break' },
  { value: 'sectionbreakcontinuous', label: 'Continuous Section Break' },
  { value: 'sectionbreakeven', label: 'Even Page Section Break' },
  { value: 'sectionbreakodd', label: 'Odd Page Section Break' },
];

const LINE_NUMBER_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'continuous', label: 'Continuous' },
  { value: 'restart', label: 'Restart Each Page' },
  { value: 'restart-section', label: 'Restart Each Section' },
  { value: 'suppress', label: 'Suppress for Current Paragraph' },
];

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Align Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Align Right' },
  { value: 'top', label: 'Align Top' },
  { value: 'middle', label: 'Align Middle' },
  { value: 'bottom', label: 'Align Bottom' },
  { value: 'distribute-h', label: 'Distribute Horizontally' },
  { value: 'distribute-v', label: 'Distribute Vertically' },
];

const WRAP_OPTIONS = [
  { value: 'inline', label: 'In Line with Text' },
  { value: 'square', label: 'Square' },
  { value: 'tight', label: 'Tight' },
  { value: 'through', label: 'Through' },
  { value: 'topbottom', label: 'Top and Bottom' },
  { value: 'behind', label: 'Behind Text' },
  { value: 'front', label: 'In Front of Text' },
];

export function LayoutTab() {
  const { margins, setMargins, orientation, setOrientation, pageSize, setPageSize, columns, setColumns, lineNumbers, setLineNumbers, hyphenation, setHyphenation } = useDocumentStore();
  const { editor } = useEditorStore();
  
  const [marginsOpen, setMarginsOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [breaksOpen, setBreaksOpen] = useState(false);
  const [lineNumbersOpen, setLineNumbersOpen] = useState(false);
  const [alignOpen, setAlignOpen] = useState(false);
  const [wrapOpen, setWrapOpen] = useState(false);
  const [rotateOpen, setRotateOpen] = useState(false);

  const marginsRef = useRef(null);
  const sizeRef = useRef(null);
  const columnsRef = useRef(null);
  const breaksRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const alignRef = useRef(null);
  const wrapRef = useRef(null);
  const rotateRef = useRef(null);

  const applyMarginPreset = (preset) => {
    setMargins(preset);
    setMarginsOpen(false);
  };

  const applyPageSize = (size) => {
    setPageSize(size);
    setSizeOpen(false);
  };

  const toggleOrientation = () => {
    const newOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
    if (newOrientation === 'landscape') {
      setPageSize({ width: pageSize.height, height: pageSize.width });
    } else {
      setPageSize({ width: pageSize.height, height: pageSize.width });
    }
  };

  const applyColumns = (value) => {
    setColumns(value);
    setColumnsOpen(false);
  };

  const insertBreak = (breakType) => {
    if (!editor) return;

    switch (breakType) {
      case 'pagebreak':
        editor.chain().focus().insertContent('<br class="page-break">').run();
        break;
      case 'columnbreak':
        editor.chain().focus().insertContent('<br class="column-break">').run();
        break;
      default:
        editor.chain().focus().insertContent(`<br class="${breakType}">`).run();
    }

    setBreaksOpen(false);
  };

  const applyParagraphIndent = (side, value) => {
    if (!editor) return;
    const attr = side === 'left' ? 'marginLeft' : 'marginRight';
    editor.chain().focus().updateAttributes('paragraph', { [attr]: `${value}cm` }).run();
  };

  const applyParagraphSpacing = (position, value) => {
    if (!editor) return;
    const attr = position === 'before' ? 'marginTop' : 'marginBottom';
    editor.chain().focus().updateAttributes('paragraph', { [attr]: `${value}pt` }).run();
  };

  return (
    <>
      {/* ──────────────────── PAGE SETUP GROUP ──────────────────── */}
      <RibbonGroup label="Page Setup">
        {/* Margins Dropdown */}
        <div style={{ position: 'relative' }} ref={marginsRef}>
          <button
            onClick={() => setMarginsOpen(!marginsOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <MarginsIcon />
            <span>Margins</span>
          </button>

          {marginsOpen && (() => {
            const rect = marginsRef.current?.getBoundingClientRect?.();
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
                minWidth: 180,
                overflow: 'hidden',
              }}>
                {Object.entries(MARGIN_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyMarginPreset(preset)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border)',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 11,
                    color: 'var(--text-primary)',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >
                  Custom...
                </button>
              </div>
            );
          })()}
        </div>

        {/* Orientation - Portrait/Landscape Toggle */}
        <button
          onClick={toggleOrientation}
          title={`Orientation: ${orientation}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '8px 10px',
            background: 'var(--bg-surface)',
            border: '2px solid var(--gold)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-primary)',
            transition: 'all 0.1s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          <OrientationIcon />
          <span>{orientation === 'portrait' ? 'Portrait' : 'Land'}</span>
        </button>

        {/* Size Dropdown */}
        <div style={{ position: 'relative' }} ref={sizeRef}>
          <button
            onClick={() => setSizeOpen(!sizeOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <PageSizeIcon />
            <span>Size</span>
          </button>

          {sizeOpen && (() => {
            const rect = sizeRef.current?.getBoundingClientRect?.();
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
                minWidth: 140,
                overflow: 'hidden',
              }}>
                {Object.entries(PAGE_SIZES).map(([key, size]) => (
                  <button
                    key={key}
                    onClick={() => applyPageSize(size)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border)',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    {size.label}
                  </button>
                ))}
                <button
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 11,
                    color: 'var(--text-primary)',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >
                  Custom...
                </button>
              </div>
            );
          })()}
        </div>

        {/* Columns Dropdown */}
        <div style={{ position: 'relative' }} ref={columnsRef}>
          <button
            onClick={() => setColumnsOpen(!columnsOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <ColumnsIcon />
            <span>Columns</span>
          </button>

          {columnsOpen && (() => {
            const rect = columnsRef.current?.getBoundingClientRect?.();
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
                minWidth: 140,
                overflow: 'hidden',
              }}>
                {COLUMN_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => applyColumns(opt.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      textAlign: 'left',
                      background: columns === opt.value ? 'var(--bg-elevated)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border)',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = columns === opt.value ? 'var(--bg-elevated)' : 'none'; }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Breaks Dropdown */}
        <div style={{ position: 'relative' }} ref={breaksRef}>
          <button
            onClick={() => setBreaksOpen(!breaksOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <BreakIcon />
            <span>Breaks</span>
          </button>

          {breaksOpen && (() => {
            const rect = breaksRef.current?.getBoundingClientRect?.();
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
                minWidth: 200,
                maxHeight: 300,
                overflow: 'auto',
              }}>
                {BREAK_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => insertBreak(opt.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: 'var(--text-primary)',
                      borderBottom: i < BREAK_OPTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'all 0.1s',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    <span>{opt.label}</span>
                    {opt.shortcut && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{opt.shortcut}</span>}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Line Numbers */}
        <div style={{ position: 'relative' }} ref={lineNumbersRef}>
          <button
            onClick={() => setLineNumbersOpen(!lineNumbersOpen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <LineNumbersIcon />
            <span>Line Num</span>
          </button>

          {lineNumbersOpen && (() => {
            const rect = lineNumbersRef.current?.getBoundingClientRect?.();
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
                minWidth: 180,
                overflow: 'hidden',
              }}>
                {LINE_NUMBER_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => { setLineNumbers(opt.value); setLineNumbersOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      textAlign: 'left',
                      background: lineNumbers === opt.value ? 'var(--bg-elevated)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: 'var(--text-primary)',
                      borderBottom: i < LINE_NUMBER_OPTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = lineNumbers === opt.value ? 'var(--bg-elevated)' : 'none'; }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Hyphenation Toggle */}
        <button
          onClick={() => setHyphenation(hyphenation === 'none' ? 'automatic' : 'none')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '8px 10px',
            background: hyphenation !== 'none' ? 'var(--gold)' : 'var(--bg-surface)',
            border: hyphenation !== 'none' ? '2px solid var(--gold)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontSize: 10,
            fontWeight: 600,
            color: hyphenation !== 'none' ? '#000' : 'var(--text-primary)',
            transition: 'all 0.1s',
          }}
          title="Toggle hyphenation"
        >
          <HyphenationIcon />
          <span>Hyphen</span>
        </button>
      </RibbonGroup>

      {/* ──────────────────── PARAGRAPH GROUP ──────────────────── */}
      <RibbonGroup label="Paragraph">
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {/* Indent Left */}
          <div>
            <label style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Indent Left (cm)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              defaultValue="0"
              onChange={(e) => applyParagraphIndent('left', e.target.value)}
              style={{
                width: 50,
                padding: '6px 4px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 10,
                fontFamily: 'var(--font-ui)',
              }}
            />
          </div>

          {/* Indent Right */}
          <div>
            <label style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Indent Right (cm)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              defaultValue="0"
              onChange={(e) => applyParagraphIndent('right', e.target.value)}
              style={{
                width: 50,
                padding: '6px 4px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 10,
                fontFamily: 'var(--font-ui)',
              }}
            />
          </div>

          {/* Spacing Before */}
          <div>
            <label style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Before (pt)</label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              defaultValue="0"
              onChange={(e) => applyParagraphSpacing('before', e.target.value)}
              style={{
                width: 50,
                padding: '6px 4px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 10,
                fontFamily: 'var(--font-ui)',
              }}
            />
          </div>

          {/* Spacing After */}
          <div>
            <label style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>After (pt)</label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              defaultValue="0"
              onChange={(e) => applyParagraphSpacing('after', e.target.value)}
              style={{
                width: 50,
                padding: '6px 4px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: 10,
                fontFamily: 'var(--font-ui)',
              }}
            />
          </div>
        </div>
      </RibbonGroup>

      {/* ──────────────────── ARRANGE GROUP ──────────────────── */}
      <RibbonGroup label="Arrange">
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {/* Wrap Text Dropdown */}
          <div style={{ position: 'relative' }} ref={wrapRef}>
            <button
              onClick={() => setWrapOpen(!wrapOpen)}
              style={{
                padding: '6px 10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-primary)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              Wrap Text▼
            </button>

            {wrapOpen && (() => {
              const rect = wrapRef.current?.getBoundingClientRect?.();
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
                  {WRAP_OPTIONS.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { setWrapOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 11,
                        color: 'var(--text-primary)',
                        borderBottom: i < WRAP_OPTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: 'all 0.1s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Bring Forward / Send Backward */}
          <Tooltip text="Bring object forward">
            <Button style={{ padding: '6px 8px' }}>↑ Forward</Button>
          </Tooltip>

          <Tooltip text="Send object backward">
            <Button style={{ padding: '6px 8px' }}>↓ Backward</Button>
          </Tooltip>

          {/* Align Dropdown */}
          <div style={{ position: 'relative' }} ref={alignRef}>
            <button
              onClick={() => setAlignOpen(!alignOpen)}
              style={{
                padding: '6px 10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-primary)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              Align▼
            </button>

            {alignOpen && (() => {
              const rect = alignRef.current?.getBoundingClientRect?.();
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
                  {ALIGN_OPTIONS.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { setAlignOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 11,
                        color: 'var(--text-primary)',
                        borderBottom: i < ALIGN_OPTIONS.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: 'all 0.1s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Group / Ungroup */}
          <Tooltip text="Group selected objects">
            <Button style={{ padding: '6px 8px' }}>Group</Button>
          </Tooltip>

          <Tooltip text="Ungroup selected objects">
            <Button style={{ padding: '6px 8px' }}>Ungroup</Button>
          </Tooltip>

          {/* Rotate Dropdown */}
          <div style={{ position: 'relative' }} ref={rotateRef}>
            <button
              onClick={() => setRotateOpen(!rotateOpen)}
              style={{
                padding: '6px 10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-primary)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              Rotate▼
            </button>

            {rotateOpen && (() => {
              const rect = rotateRef.current?.getBoundingClientRect?.();
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
                    { label: 'Rotate Right 90°', value: 'right' },
                    { label: 'Rotate Left 90°', value: 'left' },
                    { label: 'Flip Vertical', value: 'flip-v' },
                    { label: 'Flip Horizontal', value: 'flip-h' },
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => { setRotateOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 11,
                        color: 'var(--text-primary)',
                        borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                        transition: 'all 0.1s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                    >
                      {opt.label}
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
