import React, { useEffect, useState } from 'react';
import { useUIStore } from '@/store';

export function AboutDialog() {
  const { closeDialog } = useUIStore();
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationFrame(f => (f + 1) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('about')} />
      <div className="dialog-container" style={{ maxWidth: '500px' }}>
        <div className="dialog-header">
          <h2>About EtherX Word</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('about')}
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

        <div className="dialog-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          {/* EtherX Shield Logo */}
          <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '8px' }}>
            <svg viewBox="0 0 100 120" width="80" height="96" style={{ filter: 'drop-shadow(0 4px 12px rgba(212, 175, 55, 0.3))' }}>
              {/* Shield background */}
              <path
                d="M 50 10 L 20 30 L 20 60 Q 20 85 50 110 Q 80 85 80 60 L 80 30 Z"
                fill="none"
                stroke="#d4af37"
                strokeWidth="2"
              />
              {/* Animated border */}
              <path
                d="M 50 10 L 20 30 L 20 60 Q 20 85 50 110 Q 80 85 80 60 L 80 30 Z"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="250"
                strokeDashoffset={animationFrame}
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
              {/* Shield center circle */}
              <circle cx="50" cy="55" r="20" fill="none" stroke="#d4af37" strokeWidth="1.5" />
              {/* Shield center dot */}
              <circle cx="50" cy="55" r="4" fill="#d4af37" />
            </svg>
          </div>

          {/* App Name */}
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#d4af37', margin: '0 0 4px 0', letterSpacing: '1px' }}>
              EtherX Word
            </h1>
            <p style={{ fontSize: '12px', color: '#b0b0b0', margin: 0, fontStyle: 'italic' }}>
              A Modern Document Editor
            </p>
          </div>

          {/* Version */}
          <div style={{ padding: '8px 12px', background: '#2a2a2a', borderRadius: '4px', borderLeft: '3px solid #d4af37' }}>
            <span style={{ fontSize: '11px', color: '#e0e0e0', fontWeight: '600' }}>
              Version <span style={{ color: '#d4af37' }}>1.0.0</span>
            </span>
          </div>

          {/* Tagline */}
          <p style={{ fontSize: '12px', color: '#b0b0b0', lineHeight: '1.5', margin: '8px 0' }}>
            Professional document editing made simple. Create, format, and collaborate with ease.
          </p>

          {/* Divider */}
          <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', margin: '8px 0' }} />

          {/* Tech Stack */}
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '600', color: '#d4af37', marginTop: '12px', marginBottom: '8px' }}>
              Built With
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ padding: '8px', background: '#0a0a0a', borderRadius: '3px' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#e0e0e0' }}>React</div>
                <div style={{ fontSize: '9px', color: '#808080' }}>UI Framework</div>
              </div>
              <div style={{ padding: '8px', background: '#0a0a0a', borderRadius: '3px' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#e0e0e0' }}>Tiptap</div>
                <div style={{ fontSize: '9px', color: '#808080' }}>Editor Engine</div>
              </div>
              <div style={{ padding: '8px', background: '#0a0a0a', borderRadius: '3px' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#e0e0e0' }}>Zustand</div>
                <div style={{ fontSize: '9px', color: '#808080' }}>State Management</div>
              </div>
              <div style={{ padding: '8px', background: '#0a0a0a', borderRadius: '3px' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: '#e0e0e0' }}>Vite</div>
                <div style={{ fontSize: '9px', color: '#808080' }}>Build Tool</div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #404040', width: '100%' }}>
            <p style={{ fontSize: '10px', color: '#808080', margin: 0 }}>
              © 2026 EtherX. All rights reserved.
            </p>
            <p style={{ fontSize: '9px', color: '#666', margin: '4px 0 0 0' }}>
              Made with <span style={{ color: '#d4af37' }}>♡</span> for modern document editing
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => closeDialog('about')}
            style={{
              marginTop: '12px',
              padding: '8px 24px',
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
