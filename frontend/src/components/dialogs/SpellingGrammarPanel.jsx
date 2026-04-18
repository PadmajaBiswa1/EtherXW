import React, { useState } from 'react';
import { useUIStore } from '@/store';

// Basic dictionary for spell checking
const BASIC_DICTIONARY = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'hello',
  'word', 'document', 'text', 'spell', 'check', 'grammar', 'language', 'edit',
  'review', 'comment', 'track', 'change', 'accept', 'reject', 'merge', 'field',
]);

export function SpellingGrammarPanel() {
  const { closeDialog } = useUIStore();
  const [suggestions, setSuggestions] = useState([]);
  const [currentWord, setCurrentWord] = useState('');

  const generateSuggestions = (word) => {
    // Simple phonetic suggestions
    const phonetic = [
      word.substring(0, word.length - 1),
      word + 'e',
      word.replace(/([aeiou])\1/g, '$1'),
    ].filter((w) => w !== word);

    const common = ['the', 'that', 'this', 'these', 'those'];
    return phonetic.slice(0, 5).concat(common.slice(0, 2));
  };

  const handleCheck = () => {
    const editorText = document.body.innerText || '';
    const words = editorText.match(/\b\w+\b/g) || [];
    const errors = words.filter((w) => !BASIC_DICTIONARY.has(w.toLowerCase()));
    setSuggestions(errors.slice(0, 10));
  };

  const handleReplace = (original, replacement) => {
    document.execCommand('findAndReplace', false, { find: original, replace: replacement });
    setCurrentWord('');
  };

  return (
    <div className="spelling-panel">
      <div className="spelling-panel-header">
        <h3>Spelling & Grammar</h3>
        <button onClick={() => closeDialog('spellingGrammar')} className="close-btn">
          ✕
        </button>
      </div>
      <div className="spelling-panel-content">
        <button
          className="primary-button"
          onClick={handleCheck}
          style={{
            padding: '8px 16px',
            background: '#d4af37',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            marginBottom: '12px',
            width: '100%',
          }}
        >
          Check Spelling & Grammar
        </button>

        {suggestions.length > 0 ? (
          <div className="suggestions-list">
            <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '8px' }}>
              Found {suggestions.length} potential errors:
            </p>
            {suggestions.map((word, idx) => (
              <div
                key={idx}
                className="suggestion-item"
                style={{
                  padding: '8px',
                  background: '#1f1f1f',
                  border: '1px solid #404040',
                  borderRadius: '3px',
                  marginBottom: '6px',
                }}
              >
                <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#e0e0e0' }}>
                  <strong>"{word}"</strong> - Did you mean:
                </p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {generateSuggestions(word).map((suggestion, sidx) => (
                    <button
                      key={sidx}
                      onClick={() => handleReplace(word, suggestion)}
                      style={{
                        padding: '4px 8px',
                        background: '#d4af37',
                        color: '#000',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: '500',
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: '#b0b0b0', textAlign: 'center', padding: '16px' }}>
            ✓ No spelling issues found
          </p>
        )}
      </div>
    </div>
  );
}
