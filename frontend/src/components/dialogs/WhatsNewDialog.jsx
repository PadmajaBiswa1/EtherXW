import React from 'react';
import { useUIStore } from '@/store';

const FEATURES = [
  {
    version: '1.0.0',
    date: 'April 2026',
    features: [
      { title: 'Complete Document Editor', description: 'Create and edit rich documents with formatting, styles, and more' },
      { title: 'Ribbon Interface', description: 'Familiar ribbon-based UI for quick access to formatting tools' },
      { title: 'Multiple View Modes', description: 'Print, Web, Outline, and Draft views for different workflow needs' },
      { title: 'Drawing & Annotations', description: 'Add freehand drawings, shapes, and text art to documents' },
      { title: 'Tables & Charts', description: 'Create and format professional tables and insert charts' },
      { title: 'Collaboration Features', description: 'Real-time sharing, comments, and track changes support' },
      { title: 'Image & Media Support', description: 'Insert and format images, links, and multimedia' },
      { title: 'Page Setup & Layout', description: 'Custom margins, orientation, page size, and columns' },
    ],
  },
  {
    version: '0.9.0',
    date: 'March 2026',
    features: [
      { title: 'Beta Launch', description: 'Initial release with core editing capabilities' },
      { title: 'Basic Formatting', description: 'Font, size, color, alignment, and bullet list support' },
      { title: 'Document Management', description: 'Create, open, and save documents' },
      { title: 'Responsive Design', description: 'Works on desktop and tablet devices' },
    ],
  },
];

export function WhatsNewDialog() {
  const { closeDialog } = useUIStore();
  const goldColor = '#d4af37';

  const IconFeature = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={goldColor} opacity="0.8">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('whatsNew')} />
      <div className="dialog-container" style={{ maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
        <div className="dialog-header">
          <h2>What's New in EtherX Word</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('whatsNew')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#b0b0b0',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div className="dialog-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {FEATURES.map((release, releaseIdx) => (
            <div key={releaseIdx} style={{ borderLeft: '3px solid #d4af37', paddingLeft: '16px', position: 'relative' }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute',
                left: '-9px',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#d4af37',
                border: '2px solid #1a1a1a',
              }} />

              {/* Version Header */}
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#d4af37',
                  margin: '0 0 4px 0',
                }}>
                  Version {release.version}
                </h3>
                <p style={{
                  fontSize: '11px',
                  color: '#808080',
                  margin: 0,
                }}>
                  {release.date}
                </p>
              </div>

              {/* Features List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {release.features.map((feature, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>
                      <IconFeature />
                    </div>
                    <div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#e0e0e0',
                      }}>
                        {feature.title}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#b0b0b0',
                        marginTop: '2px',
                      }}>
                        {feature.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Closing section */}
          <div style={{ paddingTop: '12px', borderTop: '1px solid #404040' }}>
            <p style={{
              fontSize: '11px',
              color: '#b0b0b0',
              margin: 0,
              lineHeight: '1.5',
            }}>
              We're continuously improving EtherX Word. For the latest updates and to report issues, visit our <span style={{ color: '#d4af37' }}>Help</span> section or contact support.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => closeDialog('whatsNew')}
            style={{
              padding: '8px 16px',
              background: '#d4af37',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '11px',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
