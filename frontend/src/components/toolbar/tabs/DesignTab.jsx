import { useState, useRef } from 'react';
import { useUIStore } from '@/store';
import { RibbonGroup } from '../RibbonGroup';
import { Button, Tooltip } from '@/components/ui';

/* ── SVG ICON COMPONENTS ── */
const ThemesIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/>
  </svg>
);

const ColorsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6" fill="var(--gold)" opacity="0.8"/>
  </svg>
);

const FontsIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M6 4h12M8 8l4 12 4-12M6 20h12"/>
  </svg>
);

const StyleIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h12"/>
  </svg>
);

const WatermarkIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 12a9 9 0 0 1 18 0M12 3v18M3 12a9 9 0 0 0 18 0"/>
  </svg>
);

const ColorPickerIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="var(--gold)" opacity="0.2"/>
  </svg>
);

const BorderIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18"/>
  </svg>
);

const THEME_DEFINITIONS = {
  default: {
    label: 'Default',
    fontUI: "'Segoe UI', sans-serif",
    fontBody: "'Calibri', sans-serif",
    accent: '#d4af37',
    accentDark: '#271f00',
    preview: 'linear-gradient(135deg, #d4af37 0%, #111 100%)',
  },
  professional: {
    label: 'Professional',
    fontUI: "'Georgia', serif",
    fontBody: "'Times New Roman', serif",
    accent: '#1e3a5f',
    accentDark: '#0d1b2a',
    preview: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
  },
  classic: {
    label: 'Classic',
    fontUI: "'Garamond', serif",
    fontBody: "'Book Antiqua', serif",
    accent: '#8b3a3a',
    accentDark: '#5a2626',
    preview: 'linear-gradient(135deg, #8b3a3a 0%, #5a2626 100%)',
  },
  modern: {
    label: 'Modern',
    fontUI: "'Helvetica', sans-serif",
    fontBody: "'Arial', sans-serif",
    accent: '#2a2a2a',
    accentDark: '#0d0d0d',
    preview: 'linear-gradient(135deg, #2a2a2a 0%, #0d0d0d 100%)',
  },
  elegant: {
    label: 'Elegant',
    fontUI: "'Cinzel', serif",
    fontBody: "'Crimson Pro', serif",
    accent: '#d4af37',
    accentDark: '#271f00',
    preview: 'linear-gradient(135deg, #d4af37 0%, #271f00 100%)',
  },
  minimal: {
    label: 'Minimal',
    fontUI: "'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    accent: '#555555',
    accentDark: '#2a2a2a',
    preview: 'linear-gradient(135deg, #555 0%, #2a2a2a 100%)',
  },
};

const COLOR_SCHEMES = [
  { name: 'Gold', accent: '#d4af37', hover: '#e8c84a', rgb: '212, 175, 55' },
  { name: 'Blue', accent: '#3498db', hover: '#5dade2', rgb: '52, 152, 219' },
  { name: 'Emerald', accent: '#1abc9c', hover: '#48c9b0', rgb: '26, 188, 156' },
  { name: 'Purple', accent: '#9b59b6', hover: '#af7ac5', rgb: '155, 89, 182' },
  { name: 'Rose', accent: '#e74c3c', hover: '#ec7063', rgb: '231, 76, 60' },
  { name: 'Teal', accent: '#16a085', hover: '#1abc9c', rgb: '22, 160, 133' },
  { name: 'Slate', accent: '#34495e', hover: '#5d6d7b', rgb: '52, 73, 94' },
  { name: 'Amber', accent: '#f39c12', hover: '#f5b041', rgb: '243, 156, 18' },
];

const FONT_SETS = [
  { name: 'Serif Elegant', ui: "'Georgia', serif", body: "'Crimson Pro', serif" },
  { name: 'Sans Professional', ui: "'Helvetica', sans-serif", body: "'Inter', sans-serif" },
  { name: 'Modern Minimal', ui: "'Segoe UI', sans-serif", body: "'Calibri', sans-serif" },
  { name: 'Manuscript', ui: "'Garamond', serif", body: "'Cambria', serif" },
  { name: 'Editorial', ui: "'Cinzel', serif", body: "'Crimson Text', serif" },
  { name: 'Technical', ui: "'Consolas', monospace", body: "'Courier New', monospace" },
];

const STYLE_SETS = [
  { name: 'Default', h1: 26, h2: 20, p: 12, spacing: 6 },
  { name: 'Spacious', h1: 28, h2: 22, p: 13, spacing: 12 },
  { name: 'Compact', h1: 24, h2: 18, p: 11, spacing: 3 },
  { name: 'Formal', h1: 30, h2: 24, p: 12, spacing: 8 },
  { name: 'Article', h1: 32, h2: 22, p: 14, spacing: 10 },
  { name: 'Minimal', h1: 22, h2: 16, p: 10, spacing: 4 },
];

const PARAGRAPH_SPACINGS = [
  { value: 'none', label: 'No Paragraph Space', margin: '0px' },
  { value: 'compact', label: 'Compact', margin: '3px' },
  { value: 'tight', label: 'Tight', margin: '6px' },
  { value: 'open', label: 'Open', margin: '12px' },
  { value: 'relaxed', label: 'Relaxed', margin: '18px' },
  { value: 'double', label: 'Double', margin: '24px' },
];

export function DesignTab() {
  const { currentTheme, setCurrentTheme, accentColor, setAccentColor, paragraphSpacing, setParagraphSpacing, openDialog } = useUIStore();
  const [themesOpen, setThemesOpen] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);
  const [fontsOpen, setFontsOpen] = useState(false);
  const [stylesOpen, setStylesOpen] = useState(false);
  const [spacingOpen, setSpacingOpen] = useState(false);
  const [pageColorOpen, setPageColorOpen] = useState(false);

  const themesRef = useRef(null);
  const colorsRef = useRef(null);
  const fontsRef = useRef(null);
  const stylesRef = useRef(null);
  const spacingRef = useRef(null);
  const pageColorRef = useRef(null);

  const applyTheme = (themeKey) => {
    const theme = THEME_DEFINITIONS[themeKey];
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--font-ui', theme.fontUI);
    root.style.setProperty('--font-body', theme.fontBody);
    root.style.setProperty('--gold', theme.accent);
    root.style.setProperty('--gold-hover', theme.accentDark);

    setCurrentTheme(themeKey);
    setThemesOpen(false);
  };

  const applyColorScheme = (scheme) => {
    const root = document.documentElement;
    root.style.setProperty('--gold', scheme.accent);
    root.style.setProperty('--gold-hover', scheme.hover);
    root.style.setProperty('--gold-dim', `rgba(${scheme.rgb}, 0.12)`);
    root.style.setProperty('--gold-glow', `0 0 16px rgba(${scheme.rgb}, 0.25)`);
    root.style.setProperty('--gold-border', `rgba(${scheme.rgb}, 0.35)`);

    setAccentColor(scheme.accent);
    setColorsOpen(false);
  };

  const applyFontSet = (fontSet) => {
    const root = document.documentElement;
    root.style.setProperty('--font-ui', fontSet.ui);
    root.style.setProperty('--font-body', fontSet.body);
    setFontsOpen(false);
  };

  const applyStyleSet = (style) => {
    const editor = document.querySelector('.ProseMirror');
    if (!editor) return;

    const styleTag = document.createElement('style');
    styleTag.id = 'design-tab-styles';
    const existing = document.getElementById('design-tab-styles');
    if (existing) existing.remove();

    styleTag.innerHTML = `
      .ProseMirror h1 { font-size: ${style.h1}px !important; }
      .ProseMirror h2 { font-size: ${style.h2}px !important; }
      .ProseMirror p { font-size: ${style.p}px !important; }
      .ProseMirror p { margin-bottom: ${style.spacing}px !important; }
    `;
    document.head.appendChild(styleTag);
    setStylesOpen(false);
  };

  const applyParagraphSpacing = (value) => {
    const spacing = PARAGRAPH_SPACINGS.find(s => s.value === value);
    if (!spacing) return;

    const styleTag = document.createElement('style');
    styleTag.id = 'paragraph-spacing-styles';
    const existing = document.getElementById('paragraph-spacing-styles');
    if (existing) existing.remove();

    styleTag.innerHTML = `.ProseMirror p { margin-bottom: ${spacing.margin} !important; }`;
    document.head.appendChild(styleTag);

    setParagraphSpacing(value);
    setSpacingOpen(false);
  };

  const applyPageColor = (color) => {
    const root = document.documentElement;
    root.style.setProperty('--bg-page', color);
    setPageColorOpen(false);
  };

  return (
    <>
      {/* ──────────────────── THEMES GROUP ──────────────────── */}
      <RibbonGroup label="Themes">
        <div style={{ position: 'relative' }} ref={themesRef}>
          <button
            onClick={() => setThemesOpen(!themesOpen)}
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
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <ThemesIcon />
            <span>Themes</span>
          </button>

          {themesOpen && (() => {
            const rect = themesRef.current?.getBoundingClientRect?.();
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
                padding: 12,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                width: 280,
              }}>
                {Object.entries(THEME_DEFINITIONS).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => applyTheme(key)}
                    style={{
                      padding: 12,
                      background: 'var(--bg-elevated)',
                      border: currentTheme === key ? '2px solid var(--gold)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (currentTheme !== key) {
                        e.currentTarget.style.borderColor = 'var(--gold)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentTheme !== key) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: 40,
                        borderRadius: 'var(--radius-sm)',
                        background: theme.preview,
                      }}
                    />
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        <Tooltip text="Save current theme as default for new documents">
          <Button style={{ padding: '6px 8px' }}>Set as Default</Button>
        </Tooltip>
      </RibbonGroup>

      {/* ──────────────────── COLORS GROUP ──────────────────── */}
      <RibbonGroup label="Colors">
        <div style={{ position: 'relative' }} ref={colorsRef}>
          <button
            onClick={() => setColorsOpen(!colorsOpen)}
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
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <ColorsIcon />
            <span>Colors</span>
          </button>

          {colorsOpen && (() => {
            const rect = colorsRef.current?.getBoundingClientRect?.();
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
                padding: 8,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 6,
              }}>
                {COLOR_SCHEMES.map((scheme, i) => (
                  <button
                    key={i}
                    onClick={() => applyColorScheme(scheme)}
                    style={{
                      width: 50,
                      height: 50,
                      background: scheme.accent,
                      border: accentColor === scheme.accent ? '3px solid white' : '1px solid rgba(0,0,0,0.2)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    title={scheme.name}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      </RibbonGroup>

      {/* ──────────────────── FONTS GROUP ──────────────────── */}
      <RibbonGroup label="Fonts">
        <div style={{ position: 'relative' }} ref={fontsRef}>
          <button
            onClick={() => setFontsOpen(!fontsOpen)}
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
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <FontsIcon />
            <span>Fonts</span>
          </button>

          {fontsOpen && (() => {
            const rect = fontsRef.current?.getBoundingClientRect?.();
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
                {FONT_SETS.map((font, i) => (
                  <button
                    key={i}
                    onClick={() => applyFontSet(font)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: font.ui,
                      fontSize: 12,
                      color: 'var(--text-primary)',
                      borderBottom: i < FONT_SETS.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            );
          })()}
        </div>
      </RibbonGroup>

      {/* ──────────────────── DOCUMENT FORMATTING GROUP ──────────────────── */}
      <RibbonGroup label="Document Formatting">
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Style Set Gallery */}
          <div style={{ position: 'relative' }} ref={stylesRef}>
            <button
              onClick={() => setStylesOpen(!stylesOpen)}
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
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-primary)',
                transition: 'all 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <StyleIcon />
              <span>Styles</span>
            </button>

            {stylesOpen && (() => {
              const rect = stylesRef.current?.getBoundingClientRect?.();
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
                  padding: 8,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 8,
                  width: 220,
                }}>
                  {STYLE_SETS.map((style, i) => (
                    <button
                      key={i}
                      onClick={() => applyStyleSet(style)}
                      style={{
                        padding: 12,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.1s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                        {style.name}
                      </div>
                      <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>
                        H1: {style.h1}px, P: {style.p}px
                      </div>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Paragraph Spacing */}
          <div style={{ position: 'relative' }} ref={spacingRef}>
            <button
              onClick={() => setSpacingOpen(!spacingOpen)}
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
              Spacing▼
            </button>

            {spacingOpen && (() => {
              const rect = spacingRef.current?.getBoundingClientRect?.();
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
                  {PARAGRAPH_SPACINGS.map((spacing, i) => (
                    <button
                      key={i}
                      onClick={() => applyParagraphSpacing(spacing.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        textAlign: 'left',
                        background: paragraphSpacing === spacing.value ? 'var(--bg-elevated)' : 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                        color: 'var(--text-primary)',
                        borderBottom: i < PARAGRAPH_SPACINGS.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: 'all 0.1s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = paragraphSpacing === spacing.value ? 'var(--bg-elevated)' : 'none'; }}
                    >
                      {spacing.label}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>

          <Tooltip text="Save current formatting as default">
            <Button style={{ padding: '6px 8px' }}>Set as Default</Button>
          </Tooltip>
        </div>
      </RibbonGroup>

      {/* ──────────────────── PAGE BACKGROUND GROUP ──────────────────── */}
      <RibbonGroup label="Page Background">
        <Tooltip text="Add watermark">
          <Button onClick={() => openDialog('watermark')} style={{ padding: '6px 8px' }}>
            <WatermarkIcon />
          </Button>
        </Tooltip>

        <div style={{ position: 'relative' }} ref={pageColorRef}>
          <button
            onClick={() => setPageColorOpen(!pageColorOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
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
            <ColorPickerIcon />
            <span>Page Color</span>
          </button>

          {pageColorOpen && (() => {
            const rect = pageColorRef.current?.getBoundingClientRect?.();
            const pageColors = ['#ffffff', '#f5f5f5', '#fffef0', '#e8f4f8', '#f0f8e8', '#fef5f0', '#f5e8f8', '#e8eff8'];
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
                padding: 8,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 6,
              }}>
                {pageColors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => applyPageColor(color)}
                    style={{
                      width: 40,
                      height: 40,
                      background: color,
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  />
                ))}
              </div>
            );
          })()}
        </div>

        <Tooltip text="Page borders and design">
          <Button onClick={() => openDialog('pageBorders')} style={{ padding: '6px 8px' }}>
            <BorderIcon />
          </Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
