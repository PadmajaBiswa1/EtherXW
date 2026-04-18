import React, { useState } from 'react';
import { useUIStore } from '@/store';

export function CommentDialog() {
  const { closeDialog, toast } = useUIStore();
  const [commentText, setCommentText] = useState('');
  const [author, setAuthor] = useState('User');

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast('Please enter a comment', 'warning');
      return;
    }

    // In a real app, this would be stored in Zustand
    const comment = {
      id: Date.now(),
      text: commentText,
      author,
      timestamp: new Date().toLocaleString(),
      selection: window.getSelection().toString(),
    };

    // Add marker to document
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = 'comment-marker';
      span.style.backgroundColor = 'rgba(212, 175, 55, 0.3)';
      span.setAttribute('data-comment-id', comment.id);
      span.setAttribute('title', `${author}: ${commentText}`);

      try {
        range.surroundContents(span);
      } catch (e) {
        // Fallback if surroundContents fails
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      }
    }

    toast('Comment added successfully', 'success');
    closeDialog('comment');
  };

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('comment')} />
      <div className="dialog-container" style={{ maxWidth: '500px' }}>
        <div className="dialog-header">
          <h2>New Comment</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('comment')}
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
          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '8px',
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '3px',
                color: '#e0e0e0',
                fontSize: '11px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
              Comment
            </label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter your comment..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '8px',
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '3px',
                color: '#e0e0e0',
                fontSize: '11px',
                fontFamily: 'monospace',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ fontSize: '10px', color: '#888' }}>
            Select text in the document to link this comment to a specific location.
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddComment}
              style={{
                flex: 1,
                padding: '8px 16px',
                background: '#d4af37',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Add Comment
            </button>
            <button
              onClick={() => closeDialog('comment')}
              style={{
                flex: 1,
                padding: '8px 16px',
                background: 'transparent',
                color: '#b0b0b0',
                border: '1px solid #404040',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
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
