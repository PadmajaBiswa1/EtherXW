import React, { useState } from 'react';
import { useUIStore } from '@/store';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'ko', name: '한국어' },
];

export function TranslateDialog() {
  const { closeDialog, toast } = useUIStore();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast('Please enter text to translate', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // Try to use LibreTranslate API (free, no key required)
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        body: JSON.stringify({
          q: sourceText,
          source: sourceLang === 'auto' ? 'auto' : sourceLang,
          target: targetLang,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        setTranslatedText(result.translatedText);
        toast('Translation successful', 'success');
      } else {
        // Fallback: show placeholder
        setTranslatedText(sourceText + ' [Translation: API unavailable - placeholder]');
        toast('Using placeholder translation', 'info');
      }
    } catch (error) {
      setTranslatedText(sourceText + ' [Translation: API unavailable - placeholder]');
      toast('Translation service unavailable', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (!translatedText.trim()) {
      toast('No translation to insert', 'warning');
      return;
    }
    document.execCommand('insertText', false, translatedText);
    closeDialog('translate');
    toast('Translation inserted', 'success');
  };

  return (
    <div className="dialog-modal">
      <div className="dialog-overlay" onClick={() => closeDialog('translate')} />
      <div className="dialog-container" style={{ maxWidth: '600px' }}>
        <div className="dialog-header">
          <h2>Translate</h2>
          <button
            className="dialog-close"
            onClick={() => closeDialog('translate')}
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

        <div className="dialog-content" style={{ padding: '16px', gap: '12px', display: 'flex', flexDirection: 'column' }}>
          {/* Language Selection */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px' }}>
                Source Language
              </label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
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
                <option value="auto">Auto-detect</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px' }}>
                Target Language
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
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
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Source Text */}
          <div>
            <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px' }}>
              Text to Translate
            </label>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text here..."
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

          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              background: '#d4af37',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>

          {/* Translated Text */}
          {translatedText && (
            <div>
              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '4px' }}>
                Translation
              </label>
              <textarea
                value={translatedText}
                readOnly
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '8px',
                  background: '#1f1f1f',
                  border: '1px solid #404040',
                  borderRadius: '3px',
                  color: '#d4af37',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleInsert}
              disabled={!translatedText.trim()}
              style={{
                flex: 1,
                padding: '8px 16px',
                background: '#d4af37',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: !translatedText.trim() ? 0.5 : 1,
              }}
            >
              Insert Translation
            </button>
            <button
              onClick={() => closeDialog('translate')}
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
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
