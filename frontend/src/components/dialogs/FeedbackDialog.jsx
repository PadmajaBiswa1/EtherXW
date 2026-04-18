import React, { useState } from 'react';
import { useUIStore } from '@/store';

export function FeedbackDialog() {
  const { closeDialog, toast } = useUIStore();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('General');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      toast('Please provide a rating', 'warning');
      return;
    }

    if (!message.trim()) {
      toast('Please enter your feedback', 'warning');
      return;
    }

    // Log feedback
    console.log({
      rating,
      category,
      message,
      timestamp: new Date().toISOString(),
    });

    // Show thank you message
    setSubmitted(true);
    toast('Thank you for your feedback!', 'success');

    // Auto-close after 2 seconds
    setTimeout(() => {
      closeDialog('feedback');
    }, 2000);
  };

  const StarIcon = ({ filled, onClick, index }) => (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        fontSize: '24px',
        color: filled ? '#d4af37' : '#404040',
        transition: 'color 0.2s',
      }}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill={filled ? '#d4af37' : 'none'} stroke={filled ? '#d4af37' : '#404040'} strokeWidth="1.5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </button>
  );

  if (submitted) {
    return (
      <div className="dialog-modal">
        <div className="dialog-overlay" onClick={() => closeDialog('feedback')} />
        <div className="dialog-container" style={{ maxWidth: '400px' }}>
          <div className="dialog-content" style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
          }}>
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#d4af37" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e0e0e0', margin: '0 0 8px 0' }}>
                Thank You!
              </h2>
              <p style={{ fontSize: '12px', color: '#b0b0b0', margin: 0 }}>
                Your feedback helps us improve EtherX Word
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('feedback')} />
      <div className="dialog-container" style={{ maxWidth: '500px' }}>
        <div className="dialog-header">
          <h2>Send Feedback</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('feedback')}
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

        <div className="dialog-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Rating */}
          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              How would you rate EtherX Word? *
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled={star <= rating}
                  onClick={() => setRating(star)}
                  index={star}
                />
              ))}
            </div>
            {rating > 0 && (
              <div style={{ fontSize: '10px', color: '#d4af37', marginTop: '4px' }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]} - Thank you!
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '3px',
                color: '#e0e0e0',
                fontSize: '11px',
              }}
            >
              <option value="Bug">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="General">General Feedback</option>
              <option value="Performance">Performance Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Your Feedback *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '8px',
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '3px',
                color: '#e0e0e0',
                fontSize: '11px',
                fontFamily: 'var(--font-ui, "Segoe UI", sans-serif)',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Disclaimer */}
          <div style={{ fontSize: '9px', color: '#808080', padding: '8px', background: '#0a0a0a', borderRadius: '3px', borderLeft: '3px solid #d4af37' }}>
            Your feedback is valuable to us and helps improve the product. All submissions are anonymous unless you choose to provide contact information.
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSubmit}
              style={{
                flex: 1,
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
              Submit Feedback
            </button>
            <button
              onClick={() => closeDialog('feedback')}
              style={{
                flex: 1,
                padding: '8px 16px',
                background: 'transparent',
                color: '#b0b0b0',
                border: '1px solid #404040',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '11px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
