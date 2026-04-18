import React, { useState, useMemo } from 'react';
import { useUIStore } from '@/store';

const HELP_TOPICS = [
  {
    category: 'Getting Started',
    items: [
      { title: 'Welcome to EtherX Word', content: 'EtherX Word is a modern document editor inspired by Microsoft Word. Create, edit, and format documents with an intuitive ribbon interface.' },
      { title: 'Creating a New Document', content: 'Click File > New or use Ctrl+N to create a new document. Choose from blank document or templates.' },
      { title: 'Opening Documents', content: 'Use File > Open or Ctrl+O to open existing documents. Supported formats: DOCX, PDF, and more.' },
      { title: 'Saving Your Work', content: 'Save documents with Ctrl+S or File > Save. Choose between cloud storage and local files.' },
    ],
  },
  {
    category: 'Formatting',
    items: [
      { title: 'Text Formatting', content: 'Use the Home tab to apply bold, italic, underline. Use the Font Family picker to change fonts. Font size controls are in the ribbon.' },
      { title: 'Paragraph Formatting', content: 'Adjust alignment, indentation, and spacing in the Home tab under Paragraph group. Use the Paragraph dialog for advanced options.' },
      { title: 'Styles', content: 'Apply predefined styles like Heading 1, Heading 2, Normal, etc. from the Styles gallery to maintain consistent formatting.' },
      { title: 'Text Color & Highlighting', content: 'Use the text color picker or highlighting tool in the Home tab to change text appearance.' },
    ],
  },
  {
    category: 'Tables',
    items: [
      { title: 'Inserting Tables', content: 'Go to Insert > Table to create a table. Specify the number of rows and columns needed.' },
      { title: 'Table Design', content: 'Use the Table Design options to apply styles, borders, and shading to your table.' },
      { title: 'Adding/Removing Rows & Columns', content: 'Right-click in a table cell to insert or delete rows and columns with context menu options.' },
      { title: 'Table Formulas', content: 'Add formulas to table cells for calculations and data manipulation.' },
    ],
  },
  {
    category: 'Images',
    items: [
      { title: 'Inserting Images', content: 'Use Insert > Pictures to add images from your computer or online sources.' },
      { title: 'Image Formatting', content: 'Right-click images to adjust size, position, text wrapping, and apply effects.' },
      { title: 'Image Positioning', content: 'Use the Layout options to position images inline, behind text, or in front of text.' },
      { title: 'Picture Styles', content: 'Apply borders, shadows, and other effects to images from the ribbon menu.' },
    ],
  },
  {
    category: 'Collaboration',
    items: [
      { title: 'Sharing Documents', content: 'Click Share to invite colleagues. Set permissions for view, comment, or edit access.' },
      { title: 'Comments', content: 'Add comments to specific text selections. Resolve comments when addressed.' },
      { title: 'Track Changes', content: 'Enable Track Changes to see all document edits. Accept or reject changes in the Review tab.' },
      { title: 'Version History', content: 'Access previous document versions from File > Version History to see changes over time.' },
    ],
  },
  {
    category: 'Keyboard Shortcuts',
    items: [
      { title: 'Essential Shortcuts', content: 'Ctrl+N (New), Ctrl+O (Open), Ctrl+S (Save), Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+X (Cut), Ctrl+C (Copy), Ctrl+V (Paste)' },
      { title: 'Text Formatting', content: 'Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline), Ctrl+Shift+X (Strikethrough), Ctrl+= (Subscript), Ctrl+Shift++ (Superscript)' },
      { title: 'Document Navigation', content: 'Ctrl+Home (Start), Ctrl+End (End), Ctrl+F (Find), Ctrl+H (Replace), Page Up/Down, Ctrl+Page Up/Down (Previous/Next page)' },
      { title: 'View Options', content: 'Ctrl+W (Close), Ctrl+P (Print), Ctrl+Shift+O (Outline), Ctrl+Alt+P (Print Layout)' },
    ],
  },
  {
    category: 'Export',
    items: [
      { title: 'Exporting to PDF', content: 'Use File > Export > PDF to save your document as a PDF file with all formatting preserved.' },
      { title: 'Exporting to Word', content: 'Export to DOCX format to open documents in Microsoft Word or other compatible applications.' },
      { title: 'Printing', content: 'Use Ctrl+P to print your document. Preview before printing to ensure proper formatting.' },
      { title: 'Other Formats', content: 'Support for RTF, TXT, HTML, and other formats depending on your plan.' },
    ],
  },
];

export function HelpPanel() {
  const { closeDialog } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['Getting Started']));

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return HELP_TOPICS;

    const query = searchQuery.toLowerCase();
    return HELP_TOPICS.map(cat => ({
      ...cat,
      items: cat.items.filter(
        item => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
      ),
    })).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      bottom: 0,
      width: '380px',
      background: '#1a1a1a',
      borderLeft: '1px solid #404040',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 5000,
      boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.3)',
    }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #404040' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#e0e0e0', margin: 0 }}>
            Help
          </h2>
          <button
            onClick={() => closeDialog('helpPanel')}
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

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search help topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            background: '#2a2a2a',
            border: '1px solid #404040',
            borderRadius: '4px',
            color: '#e0e0e0',
            fontSize: '11px',
            fontFamily: 'var(--font-ui, "Segoe UI", sans-serif)',
          }}
        />
      </div>

      {/* Topics List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {filteredTopics.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#808080',
            fontSize: '12px',
          }}>
            No topics found. Try a different search.
          </div>
        ) : (
          filteredTopics.map(category => (
            <div key={category.category} style={{ borderBottom: '1px solid #404040' }}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.category)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#d4af37',
                  fontWeight: '600',
                  fontSize: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{category.category}</span>
                <span style={{ fontSize: '10px' }}>
                  {expandedCategories.has(category.category) ? '▼' : '▶'}
                </span>
              </button>

              {/* Category Items */}
              {expandedCategories.has(category.category) && (
                <div style={{ background: '#0a0a0a' }}>
                  {category.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 16px',
                        borderTop: idx === 0 ? 'none' : '1px solid #2a2a2a',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#e0e0e0',
                        marginBottom: '4px',
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#b0b0b0',
                        lineHeight: '1.4',
                      }}>
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
