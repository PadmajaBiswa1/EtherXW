import React, { useState } from 'react';
import { useUIStore } from '@/store';
import { Button, Tooltip } from '@/components/ui';
import { RibbonGroup } from '../RibbonGroup';

export function HelpTab() {
  const goldColor = '#d4af37';
  const { openDialog } = useUIStore();

  // SVG Icons
  const HelpIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );

  const TrainingIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    </svg>
  );

  const WhatsNewIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );

  const FeedbackIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M12 7v4M10 11l4 0" />
    </svg>
  );

  const SupportIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );

  const AboutIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={goldColor} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );

  return (
    <>
      {/* Help Group */}
      <RibbonGroup label="Help">
        <Tooltip text="Get help with EtherX Word">
          <Button
            onClick={() => openDialog('helpPanel')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <HelpIcon />
            Help
          </Button>
        </Tooltip>

        <Tooltip text="Interactive tutorials - Coming soon">
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
            <TrainingIcon />
            Training
          </Button>
        </Tooltip>

        <Tooltip text="See what's new in this version">
          <Button
            onClick={() => openDialog('whatsNew')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <WhatsNewIcon />
            What's New
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* Community Group */}
      <RibbonGroup label="Community">
        <Tooltip text="Send us your feedback">
          <Button
            onClick={() => openDialog('feedback')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <FeedbackIcon />
            Feedback
          </Button>
        </Tooltip>

        <Tooltip text="Contact our support team - Coming soon">
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
            <SupportIcon />
            Support
          </Button>
        </Tooltip>
      </RibbonGroup>

      {/* About Group */}
      <RibbonGroup label="About">
        <Tooltip text="Learn about EtherX Word">
          <Button
            onClick={() => openDialog('about')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              fontSize: '11px',
            }}
          >
            <AboutIcon />
            About
          </Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
