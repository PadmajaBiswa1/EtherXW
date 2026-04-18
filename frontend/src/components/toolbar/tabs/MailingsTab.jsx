import React, { useState } from 'react';
import { useUIStore } from '@/store';
import { RibbonGroup } from '../RibbonGroup';
import './MailingsTab.css';

// ═══════════════════════════════════════════════════════════════
//  Mailings Tab — Mail Merge & Document Distribution
// ═══════════════════════════════════════════════════════════════

const MailingsTab = () => {
  const {
    openDialog,
    mailMergeType,
    setMailMergeType,
    mailMergeRecipients,
    mailMergeMode,
    toggleMailMergeMode,
    previewRecipientIndex,
    setPreviewRecipientIndex,
  } = useUIStore();

  const [highlightMergeFields, setHighlightMergeFields] = useState(false);
  const [finishDropdown, setFinishDropdown] = useState(false);

  // Gold theme color
  const goldColor = '#d4af37';

  // SVG Icons
  const EnvelopeIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" />
      <path d="M22 6l-10 7-10-7" />
    </svg>
  );

  const LabelsIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={goldColor} strokeWidth="2">
      <rect x="3" y="5" width="8" height="6" rx="1" />
      <rect x="13" y="5" width="8" height="6" rx="1" />
      <rect x="3" y="13" width="8" height="6" rx="1" />
      <rect x="13" y="13" width="8" height="6" rx="1" />
    </svg>
  );

  const MergeIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M6 9l-4 4 4 4M18 9l4 4-4 4M9 6v12M15 6v12" />
      <circle cx="12" cy="12" r="1" fill={goldColor} />
    </svg>
  );

  const FieldIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M7 9v6M12 9v6M17 9v6" />
    </svg>
  );

  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={goldColor}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );

  const PrintIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );

  const EditIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2">
      <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" />
      <path d="M22 6l-10 7-10-7" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg viewBox="0 0 24 24" width="10" height="10" fill={goldColor}>
      <polyline points="6 9 12 15 18 9" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const DoubleChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
      <polyline points="9 18 3 12 9 6" />
    </svg>
  );

  const ChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  const DoubleChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
      <polyline points="15 18 21 12 15 6" />
    </svg>
  );

  // Handlers
  const handleEnvelopes = () => openDialog('envelope');
  const handleLabels = () => openDialog('labels');
  const handleSelectRecipients = () => openDialog('editRecipients');
  
  const handleAddressBlock = () => {
    document.execCommand('insertText', false, '<<FirstName>> <<LastName>>\n<<Address>>\n<<City>>, <<State>> <<ZIP>>');
  };
  
  const handleGreetingLine = () => {
    document.execCommand('insertText', false, 'Dear <<FirstName>> <<LastName>>,');
  };

  const handleNavigateFirst = () => {
    if (mailMergeRecipients.length > 0) setPreviewRecipientIndex(0);
  };
  
  const handleNavigatePrev = () => {
    if (previewRecipientIndex > 0) setPreviewRecipientIndex(previewRecipientIndex - 1);
  };
  
  const handleNavigateNext = () => {
    if (previewRecipientIndex < mailMergeRecipients.length - 1) setPreviewRecipientIndex(previewRecipientIndex + 1);
  };
  
  const handleNavigateLast = () => {
    if (mailMergeRecipients.length > 0) setPreviewRecipientIndex(mailMergeRecipients.length - 1);
  };

  const handleFinishMerge = (action) => {
    if (action === 'email') {
      alert('Email merge requires server-side integration');
    } else if (action === 'print') {
      window.print();
    }
    setFinishDropdown(false);
  };

  return (
    <div className="mailings-tab">
      {/* CREATE GROUP */}
      <RibbonGroup label="Create">
        <button
          className="ribbon-icon-button"
          onClick={handleEnvelopes}
          title="Create envelopes"
        >
          <EnvelopeIcon />
          <span>Envelopes</span>
        </button>
        <button
          className="ribbon-icon-button"
          onClick={handleLabels}
          title="Create labels"
        >
          <LabelsIcon />
          <span>Labels</span>
        </button>
      </RibbonGroup>

      {/* START MAIL MERGE GROUP */}
      <RibbonGroup label="Mail Merge">
        <select
          className="ribbon-dropdown-compact"
          value={mailMergeType || ''}
          onChange={(e) => setMailMergeType(e.target.value || null)}
          title="Select merge type"
        >
          <option value="">Type...</option>
          <option value="letters">Letters</option>
          <option value="emails">Emails</option>
          <option value="envelopes">Envelopes</option>
          <option value="labels">Labels</option>
          <option value="directory">Directory</option>
        </select>

        <button
          className="ribbon-icon-button"
          onClick={handleSelectRecipients}
          title="Select or edit recipients"
        >
          <MergeIcon />
          <span>{mailMergeRecipients.length > 0 ? mailMergeRecipients.length : '0'}</span>
        </button>
      </RibbonGroup>

      {/* WRITE & INSERT FIELDS GROUP */}
      <RibbonGroup label="Insert">
        <button
          className="ribbon-icon-button"
          onClick={handleAddressBlock}
          title="Insert address block"
        >
          <FieldIcon />
          <span>Address</span>
        </button>

        <button
          className="ribbon-icon-button"
          onClick={handleGreetingLine}
          title="Insert greeting line"
        >
          <FieldIcon />
          <span>Greeting</span>
        </button>

        <select
          className="ribbon-dropdown-compact"
          onChange={(e) => {
            if (e.target.value) {
              document.execCommand('insertText', false, `<<${e.target.value}>>`);
              e.target.value = '';
            }
          }}
          title="Insert merge field"
        >
          <option value="">Field...</option>
          <option value="FirstName">First Name</option>
          <option value="LastName">Last Name</option>
          <option value="Email">Email</option>
          <option value="Address">Address</option>
          <option value="City">City</option>
          <option value="State">State</option>
          <option value="ZIP">ZIP</option>
        </select>

        <label className="ribbon-checkbox-compact">
          <input
            type="checkbox"
            checked={highlightMergeFields}
            onChange={(e) => setHighlightMergeFields(e.target.checked)}
            title="Highlight merge fields"
          />
          <span>Highlight</span>
        </label>
      </RibbonGroup>

      {/* PREVIEW RESULTS GROUP */}
      <RibbonGroup label="Preview">
        <label className="ribbon-checkbox-compact">
          <input
            type="checkbox"
            checked={mailMergeMode}
            onChange={() => toggleMailMergeMode()}
            title="Toggle preview mode"
          />
          <span>Preview</span>
        </label>

        <div className="ribbon-nav-compact">
          <button
            className="ribbon-nav-button-sm"
            onClick={handleNavigateFirst}
            disabled={mailMergeRecipients.length === 0}
            title="First"
          >
            <DoubleChevronLeftIcon />
          </button>
          <button
            className="ribbon-nav-button-sm"
            onClick={handleNavigatePrev}
            disabled={previewRecipientIndex === 0 || mailMergeRecipients.length === 0}
            title="Previous"
          >
            <ChevronLeftIcon />
          </button>

          <input
            type="number"
            className="ribbon-nav-input-sm"
            min="1"
            max={mailMergeRecipients.length}
            value={mailMergeRecipients.length > 0 ? previewRecipientIndex + 1 : 0}
            onChange={(e) => {
              const idx = parseInt(e.target.value) - 1;
              if (idx >= 0 && idx < mailMergeRecipients.length) {
                setPreviewRecipientIndex(idx);
              }
            }}
            disabled={mailMergeRecipients.length === 0}
            title="Go to recipient"
          />

          <span className="ribbon-nav-label-sm">
            / {mailMergeRecipients.length}
          </span>

          <button
            className="ribbon-nav-button-sm"
            onClick={handleNavigateNext}
            disabled={
              previewRecipientIndex >= mailMergeRecipients.length - 1 ||
              mailMergeRecipients.length === 0
            }
            title="Next"
          >
            <ChevronRightIcon />
          </button>
          <button
            className="ribbon-nav-button-sm"
            onClick={handleNavigateLast}
            disabled={mailMergeRecipients.length === 0}
            title="Last"
          >
            <DoubleChevronRightIcon />
          </button>
        </div>
      </RibbonGroup>

      {/* FINISH GROUP */}
      <RibbonGroup label="Finish">
        <div style={{ position: 'relative' }}>
          <button
            className="ribbon-icon-button ribbon-dropdown-toggle"
            onClick={() => setFinishDropdown(!finishDropdown)}
            disabled={!mailMergeType || mailMergeRecipients.length === 0}
            title="Complete merge"
          >
            <PlayIcon />
            <span>Merge</span>
            <ChevronDownIcon />
          </button>

          {finishDropdown && (
            <div className="ribbon-dropdown-menu-compact">
              <button
                className="ribbon-dropdown-item-compact"
                onClick={() => handleFinishMerge('edit')}
              >
                <EditIcon />
                <span>Edit</span>
              </button>
              <button
                className="ribbon-dropdown-item-compact"
                onClick={() => handleFinishMerge('print')}
              >
                <PrintIcon />
                <span>Print</span>
              </button>
              <button
                className="ribbon-dropdown-item-compact"
                onClick={() => handleFinishMerge('email')}
              >
                <EmailIcon />
                <span>Email</span>
              </button>
            </div>
          )}
        </div>
      </RibbonGroup>
    </div>
  );
};

export { MailingsTab };

export default MailingsTab;
