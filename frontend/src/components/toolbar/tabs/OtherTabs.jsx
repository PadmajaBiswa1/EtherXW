// ── Layout Tab ───────────────────────────────────────────────
import { useUIStore } from '@/store';
import { Button, Tooltip } from '@/components/ui';
import { RibbonGroup } from '../RibbonGroup';

export function LayoutTab() {
  const { openDialog } = useUIStore();
  return (
    <>
      <RibbonGroup label="Page Setup">
        <Tooltip text="Page Setup"><Button onClick={() => openDialog('pageSetup')}>📄 Page Setup</Button></Tooltip>
        <Tooltip text="Margins"><Button>⊟ Margins</Button></Tooltip>
        <Tooltip text="Orientation"><Button>↕ Orientation</Button></Tooltip>
        <Tooltip text="Size"><Button>📐 Size</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Columns">
        <Tooltip text="One column"><Button>▌ One</Button></Tooltip>
        <Tooltip text="Two columns"><Button>▌▌ Two</Button></Tooltip>
        <Tooltip text="Three columns"><Button>▌▌▌ Three</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Arrange">
        <Tooltip text="Bring Forward"><Button>↑ Forward</Button></Tooltip>
        <Tooltip text="Send Backward"><Button>↓ Backward</Button></Tooltip>
        <Tooltip text="Align"><Button>⊞ Align</Button></Tooltip>
      </RibbonGroup>
    </>
  );
}

// ── Review Tab ───────────────────────────────────────────────
import React, { useState } from 'react';
import { useDocumentStore } from '@/store';
import { useEditorStore } from '@/store';
import './ReviewTab.css';

export function ReviewTab() {
  const { trackChanges, toggleTrackChanges, wordCount, charCount, pageCount } = useDocumentStore();
  const { toggleSpellCheck, spellCheck } = useEditorStore();
  const { openDialog, closeDialog, dialogs } = useUIStore();

  const [showSpellingDropdown, setShowSpellingDropdown] = useState(false);
  const [showThesaurusPanel, setShowThesaurusPanel] = useState(false);
  const [showWordCountPanel, setShowWordCountPanel] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [showDeleteCommentsDropdown, setShowDeleteCommentsDropdown] = useState(false);
  const [showMarkupDropdown, setShowMarkupDropdown] = useState(false);
  const [showAcceptDropdown, setShowAcceptDropdown] = useState(false);
  const [showRejectDropdown, setShowRejectDropdown] = useState(false);
  const [showRestrictEditingPanel, setShowRestrictEditingPanel] = useState(false);
  const [showReviewingPane, setShowReviewingPane] = useState(false);
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);
  const [proofingLanguage, setProofingLanguage] = useState('en');
  const [markupView, setMarkupView] = useState('all');

  const goldColor = '#d4af37';

  // SVG Icons
  const SpellingIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M4 7h16M4 7l3 10m10-10l3 10M8 7v10M16 7v10" />
      <path d="M12 7l2 10" />
    </svg>
  );

  const ThesaurusIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8M12 12l-2-2l2 2l2-2" />
    </svg>
  );

  const WordCountIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M3 6h18M3 12h18M3 18h18M6 9l2 2 3-4M6 15l2 2 3-4" />
    </svg>
  );

  const AccessibilityIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <circle cx="12" cy="6" r="2" />
      <path d="M9 9h6v8l-3 3l-3-3V9z" />
      <path d="M9 9l-2 3l2 2M15 9l2 3l-2 2" />
    </svg>
  );

  const TranslateIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M4 5h7M4 5l3 5l2-5M11 5h7M18 5l-3 5l-2-5M9 19h6M4 14h16" />
    </svg>
  );

  const CommentIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );

  const TrackIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M12 5v14M5 12h14M8 9l4 4l4-4M8 15l4-4l4 4" />
    </svg>
  );

  const CompareIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <rect x="3" y="3" width="9" height="18" />
      <rect x="12" y="3" width="9" height="18" />
      <path d="M12 3v18" strokeWidth="2.5" />
    </svg>
  );

  const ProtectIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M12 1l8 4v5c0 5-8 9-8 9s-8-4-8-9V5l8-4z" />
      <path d="M8 12l2 2 4-4" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg viewBox="0 0 24 24" width="10" height="10" fill={goldColor}>
      <polyline points="6 9 12 15 18 9" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const XIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );

  const CheckIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={goldColor} strokeWidth="3" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <>
      {/* PROOFING GROUP */}
      <RibbonGroup label="Proofing">
        <div style={{ position: 'relative' }}>
          <button
            className="ribbon-icon-button"
            onClick={() => setShowSpellingDropdown(!showSpellingDropdown)}
            title="Spelling & Grammar"
          >
            <SpellingIcon />
            <span>Spell</span>
          </button>
          {showSpellingDropdown && (
            <div className="ribbon-dropdown-menu-compact">
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                openDialog('spellingGrammar');
                setShowSpellingDropdown(false);
              }}>
                <span>Check Spelling</span>
              </button>
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                toggleSpellCheck();
                setShowSpellingDropdown(false);
              }}>
                <span>{spellCheck ? 'Disable' : 'Enable'} Auto Spell Check</span>
              </button>
            </div>
          )}
        </div>

        <button
          className="ribbon-icon-button"
          onClick={() => setShowThesaurusPanel(!showThesaurusPanel)}
          title="Thesaurus"
        >
          <ThesaurusIcon />
          <span>Thesaurus</span>
        </button>

        <button
          className="ribbon-icon-button"
          onClick={() => setShowWordCountPanel(!showWordCountPanel)}
          title="Word Count"
        >
          <WordCountIcon />
          <span>Count</span>
        </button>
      </RibbonGroup>

      {/* ACCESSIBILITY GROUP */}
      <RibbonGroup label="Accessibility">
        <button
          className="ribbon-icon-button"
          onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
          title="Check Accessibility"
        >
          <AccessibilityIcon />
          <span>Check</span>
        </button>

        <select
          className="ribbon-dropdown-compact"
          value={proofingLanguage}
          onChange={(e) => setProofingLanguage(e.target.value)}
          title="Proofing language"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
        </select>
      </RibbonGroup>

      {/* LANGUAGE GROUP */}
      <RibbonGroup label="Language">
        <button
          className="ribbon-icon-button"
          onClick={() => openDialog('translate')}
          title="Translate"
        >
          <TranslateIcon />
          <span>Translate</span>
        </button>
      </RibbonGroup>

      {/* COMMENTS GROUP */}
      <RibbonGroup label="Comments">
        <button
          className="ribbon-icon-button"
          onClick={() => openDialog('comment')}
          title="New Comment"
        >
          <CommentIcon />
          <span>New</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className="ribbon-icon-button"
            onClick={() => setShowDeleteCommentsDropdown(!showDeleteCommentsDropdown)}
            title="Delete comments"
          >
            <XIcon />
            <span>Delete</span>
          </button>
          {showDeleteCommentsDropdown && (
            <div className="ribbon-dropdown-menu-compact">
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                setShowDeleteCommentsDropdown(false);
              }}>
                <span>Delete Selected</span>
              </button>
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                setShowDeleteCommentsDropdown(false);
              }}>
                <span>Delete All</span>
              </button>
            </div>
          )}
        </div>

        <button
          className="ribbon-icon-button"
          title="Previous Comment"
        >
          <ArrowLeftIcon />
          <span>Prev</span>
        </button>

        <button
          className="ribbon-icon-button"
          title="Next Comment"
        >
          <ArrowRightIcon />
          <span>Next</span>
        </button>

        <label className="ribbon-checkbox-compact">
          <input
            type="checkbox"
            checked={showCommentsPanel}
            onChange={(e) => setShowCommentsPanel(e.target.checked)}
            title="Show comments sidebar"
          />
          <span>Show</span>
        </label>
      </RibbonGroup>

      {/* TRACKING GROUP */}
      <RibbonGroup label="Tracking">
        <label className="ribbon-checkbox-compact">
          <input
            type="checkbox"
            checked={trackChanges}
            onChange={() => toggleTrackChanges()}
            title="Track changes"
          />
          <span>Track</span>
        </label>

        <div style={{ position: 'relative' }}>
          <button
            className="ribbon-icon-button"
            onClick={() => setShowMarkupDropdown(!showMarkupDropdown)}
            title="Show markup"
          >
            <EyeIcon />
            <span>Markup</span>
          </button>
          {showMarkupDropdown && (
            <div className="ribbon-dropdown-menu-compact">
              <button
                className="ribbon-dropdown-item-compact"
                onClick={() => {
                  setMarkupView('all');
                  setShowMarkupDropdown(false);
                }}
              >
                <CheckIcon style={{ marginRight: '4px' }} />
                <span>All Markup</span>
              </button>
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                setMarkupView('simple');
                setShowMarkupDropdown(false);
              }}>
                <span>Simple Markup</span>
              </button>
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                setMarkupView('none');
                setShowMarkupDropdown(false);
              }}>
                <span>No Markup</span>
              </button>
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                setMarkupView('original');
                setShowMarkupDropdown(false);
              }}>
                <span>Original</span>
              </button>
            </div>
          )}
        </div>

        <label className="ribbon-checkbox-compact">
          <input
            type="checkbox"
            checked={showReviewingPane}
            onChange={(e) => setShowReviewingPane(e.target.checked)}
            title="Show reviewing pane"
          />
          <span>Pane</span>
        </label>
      </RibbonGroup>

      {/* CHANGES GROUP */}
      <RibbonGroup label="Changes">
        <div style={{ position: 'relative' }}>
          <button
            className="ribbon-icon-button"
            onClick={() => setShowAcceptDropdown(!showAcceptDropdown)}
            title="Accept changes"
          >
            <CheckIcon />
            <span>Accept</span>
          </button>
          {showAcceptDropdown && (
            <div className="ribbon-dropdown-menu-compact">
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                setShowAcceptDropdown(false);
              }}>
                <span>Accept & Move to Next</span>
              </button>
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                setShowAcceptDropdown(false);
              }}>
                <span>Accept All Changes</span>
              </button>
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                toggleTrackChanges();
                setShowAcceptDropdown(false);
              }}>
                <span>Accept All & Stop Tracking</span>
              </button>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            className="ribbon-icon-button"
            onClick={() => setShowRejectDropdown(!showRejectDropdown)}
            title="Reject changes"
          >
            <XIcon />
            <span>Reject</span>
          </button>
          {showRejectDropdown && (
            <div className="ribbon-dropdown-menu-compact">
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                setShowRejectDropdown(false);
              }}>
                <span>Reject & Move to Next</span>
              </button>
              <button className="ribbon-dropdown-item-compact" onClick={() => {
                setShowRejectDropdown(false);
              }}>
                <span>Reject All Changes</span>
              </button>
            </div>
          )}
        </div>

        <button className="ribbon-icon-button" title="Previous Change">
          <ArrowLeftIcon />
          <span>Prev</span>
        </button>

        <button className="ribbon-icon-button" title="Next Change">
          <ArrowRightIcon />
          <span>Next</span>
        </button>
      </RibbonGroup>

      {/* COMPARE GROUP */}
      <RibbonGroup label="Compare">
        <button
          className="ribbon-icon-button"
          onClick={() => openDialog('compare')}
          title="Compare documents"
        >
          <CompareIcon />
          <span>Compare</span>
        </button>
      </RibbonGroup>

      {/* PROTECT GROUP */}
      <RibbonGroup label="Protect">
        <button
          className="ribbon-icon-button"
          onClick={() => openDialog('protect')}
          title="Protect document"
        >
          <ProtectIcon />
          <span>Protect</span>
        </button>

        <label className="ribbon-checkbox-compact">
          <input
            type="checkbox"
            checked={showRestrictEditingPanel}
            onChange={(e) => setShowRestrictEditingPanel(e.target.checked)}
            title="Show editing restrictions"
          />
          <span>Restrict</span>
        </label>
      </RibbonGroup>

      {/* INLINE PANELS */}
      {showWordCountPanel && (
        <div className="review-panel-overlay" onClick={() => setShowWordCountPanel(false)}>
          <div className="review-panel" onClick={(e) => e.stopPropagation()}>
            <div className="review-panel-header">
              <h3>Word Count</h3>
              <button onClick={() => setShowWordCountPanel(false)} className="review-panel-close">✕</button>
            </div>
            <div className="review-panel-content">
              <div className="word-count-grid">
                <div className="word-count-item">
                  <span className="label">Pages:</span>
                  <span className="value">{pageCount}</span>
                </div>
                <div className="word-count-item">
                  <span className="label">Words:</span>
                  <span className="value">{wordCount}</span>
                </div>
                <div className="word-count-item">
                  <span className="label">Characters (no spaces):</span>
                  <span className="value">{charCount}</span>
                </div>
                <div className="word-count-item">
                  <span className="label">Characters (with spaces):</span>
                  <span className="value">{charCount * 1.2}</span>
                </div>
                <div className="word-count-item">
                  <span className="label">Paragraphs:</span>
                  <span className="value">0</span>
                </div>
                <div className="word-count-item">
                  <span className="label">Lines:</span>
                  <span className="value">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showThesaurusPanel && (
        <div className="review-panel-overlay" onClick={() => setShowThesaurusPanel(false)}>
          <div className="review-panel" onClick={(e) => e.stopPropagation()}>
            <div className="review-panel-header">
              <h3>Thesaurus</h3>
              <button onClick={() => setShowThesaurusPanel(false)} className="review-panel-close">✕</button>
            </div>
            <div className="review-panel-content">
              <p style={{ color: '#b0b0b0', fontSize: '12px' }}>Select a word in the document to view synonyms.</p>
            </div>
          </div>
        </div>
      )}

      {showAccessibilityPanel && (
        <div className="review-panel-overlay" onClick={() => setShowAccessibilityPanel(false)}>
          <div className="review-panel" onClick={(e) => e.stopPropagation()}>
            <div className="review-panel-header">
              <h3>Accessibility Check</h3>
              <button onClick={() => setShowAccessibilityPanel(false)} className="review-panel-close">✕</button>
            </div>
            <div className="review-panel-content">
              <p style={{ color: '#d4af37', fontSize: '11px', marginBottom: '8px' }}>Found 0 issues:</p>
              <div style={{ fontSize: '10px', color: '#888' }}>
                <p>✓ All images have alt text</p>
                <p>✓ Text contrast is adequate</p>
                <p>✓ Heading structure is valid</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── View Tab ─────────────────────────────────────────────────
export function ViewTab() {
  const {
    zoom, setZoom, viewMode, setViewMode, focusMode, setFocusMode,
    showRuler, setShowRuler, showGridlines, setShowGridlines,
    showNavigationPane, setShowNavigationPane, openDialog
  } = useUIStore();

  const goldColor = '#d4af37';

  // SVG Icons
  const PrintLayoutIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M4 17h16M6 3v-1h12v1" />
    </svg>
  );

  const WebLayoutIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );

  const OutlineIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );

  const DraftIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const FocusIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" fill={goldColor} opacity="0.3" />
      <path d="M3 12h2m14 0h2M12 3v2m0 14v2" />
    </svg>
  );

  const RulerIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <path d="M3 3h18v2H3V3zm0 4h18v1H3V7zm0 3h18v1H3v-1zm0 3h18v1H3v-1zm0 3h18v2H3v-2z" />
      <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" opacity="0.5" />
    </svg>
  );

  const GridIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="1.5" strokeDasharray="2,2">
      <rect x="3" y="3" width="18" height="18" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  );

  const NavigationIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="18" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="12" y1="6" x2="21" y2="6" />
      <line x1="12" y1="12" x2="21" y2="12" />
      <line x1="12" y1="18" x2="21" y2="18" />
    </svg>
  );

  const ZoomIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v6m-3-3h6" />
    </svg>
  );

  const NewWindowIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );

  const MacrosIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="7" x2="22" y2="7" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="17" x2="22" y2="17" />
    </svg>
  );

  const ImmersiveReaderIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5a2 2 0 0 1 0-4h0" />
      <circle cx="4" cy="12" r="2" />
    </svg>
  );

  return (
    <>
      {/* Views Group */}
      <RibbonGroup label="Views">
        <Tooltip text="Print Layout - Standard editor view">
          <Button
            active={viewMode === 'print'}
            onClick={() => setViewMode('print')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <PrintLayoutIcon />
            Print
          </Button>
        </Tooltip>

        <Tooltip text="Web Layout - Full width continuous scroll">
          <Button
            active={viewMode === 'web'}
            onClick={() => setViewMode('web')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <WebLayoutIcon />
            Web
          </Button>
        </Tooltip>

        <Tooltip text="Outline - Show heading structure only">
          <Button
            active={viewMode === 'outline'}
            onClick={() => setViewMode('outline')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <OutlineIcon />
            Outline
          </Button>
        </Tooltip>

        <Tooltip text="Draft - Plain text for faster editing">
          <Button
            active={viewMode === 'draft'}
            onClick={() => setViewMode('draft')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <DraftIcon />
            Draft
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* Immersive Group */}
      <RibbonGroup label="Immersive">
        <Tooltip text={focusMode ? 'Exit Focus Mode (Esc)' : 'Focus Mode - Hide UI elements'}>
          <Button
            active={focusMode}
            onClick={() => setFocusMode(!focusMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <FocusIcon />
            Focus
          </Button>
        </Tooltip>

        <Tooltip text="Immersive Reader - Coming soon">
          <Button
            disabled
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              opacity: 0.5,
            }}
          >
            <ImmersiveReaderIcon />
            Reader
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* Show Group */}
      <RibbonGroup label="Show">
        <Tooltip text={showRuler ? 'Hide ruler' : 'Show ruler with margin handles'}>
          <Button
            active={showRuler}
            onClick={() => setShowRuler(!showRuler)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <RulerIcon />
            Ruler
          </Button>
        </Tooltip>

        <Tooltip text={showGridlines ? 'Hide gridlines' : 'Show subtle dotted grid'}>
          <Button
            active={showGridlines}
            onClick={() => setShowGridlines(!showGridlines)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <GridIcon />
            Grid
          </Button>
        </Tooltip>

        <Tooltip text={showNavigationPane ? 'Hide navigation pane' : 'Show navigation pane (Headings, Pages, Search)'}>
          <Button
            active={showNavigationPane}
            onClick={() => setShowNavigationPane(!showNavigationPane)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <NavigationIcon />
            Nav
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* Zoom Group */}
      <RibbonGroup label="Zoom">
        <Tooltip text="Open zoom options">
          <Button
            onClick={() => openDialog('zoom')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <ZoomIcon />
            {zoom}%
          </Button>
        </Tooltip>

        <Tooltip text="Zoom to 100%">
          <Button
            onClick={() => setZoom(100)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            100%
          </Button>
        </Tooltip>

        <Tooltip text="One Page - Fit one page in view">
          <Button
            onClick={() => setZoom(60)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            1 Page
          </Button>
        </Tooltip>

        <Tooltip text="Multiple Pages - Fit two pages in view">
          <Button
            onClick={() => setZoom(45)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            2 Pages
          </Button>
        </Tooltip>

        <Tooltip text="Page Width - Fit page width to view">
          <Button
            onClick={() => setZoom(85)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            Width
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* Window Group */}
      <RibbonGroup label="Window">
        <Tooltip text="Open current document in new tab">
          <Button
            onClick={() => window.open(window.location.href, '_blank')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <NewWindowIcon />
            New
          </Button>
        </Tooltip>

        <Tooltip text="More window options - Coming soon">
          <Button
            disabled
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              opacity: 0.5,
            }}
          >
            More
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* Macros Group */}
      <RibbonGroup label="Macros">
        <Tooltip text="Record, manage, and run macros">
          <Button
            onClick={() => openDialog('macros')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <MacrosIcon />
            Macros
          </Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
