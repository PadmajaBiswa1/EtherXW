import { useState, useEffect } from 'react';
import { useEditorStore, useUIStore } from '@/store';
import { Button, Divider, Tooltip, Select, ColorSwatch } from '@/components/ui';
import { TextColorPicker } from '../TextColorPicker';
import { FontFamilyPicker } from '../FontFamilyPicker';
import { MoreFormattingDropdown } from '../MoreFormattingDropdown';
import { RibbonGroup } from '../RibbonGroup';

const FONTS = [
  'Crimson Pro','Times New Roman','Arial','Calibri','Garamond',
  'Georgia','Helvetica','Verdana','Courier New','Trebuchet MS',
].map((f) => ({ value: f, label: f }));

const SIZES = ['8','9','10','11','12','14','16','18','20','24','28','32','36','48','72']
  .map((s) => ({ value: s, label: s }));

const PARA_STYLES = [
  { value: 'p',  label: 'Normal'    },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
];

const TEXT_CASE_OPTIONS = [
  { value: 'none',      label: 'Normal'     },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize',label: 'Capitalize' },
];

const CHAR_SPACING_OPTIONS = [
  { value: '0',     label: 'Normal'    },
  { value: '0.05em',label: 'Tight'     },
  { value: '0.1em', label: 'Condensed' },
  { value: '0.15em',label: 'Normal +'  },
  { value: '0.3em', label: 'Loose'     },
  { value: '0.5em', label: 'Very Loose'},
];

const LINE_SPACING_OPTIONS = [
  { value: '1',    label: 'Single'      },
  { value: '1.15', label: '1.15 Lines'  },
  { value: '1.5',  label: '1.5 Lines'   },
  { value: '2',    label: 'Double'      },
  { value: '2.5',  label: '2.5 Lines'   },
  { value: '3',    label: 'Triple'      },
];

const TEXT_COLORS = ['#d4af37','#e8d98a','#ffffff','#cccccc','#888888','#333333',
                     '#ff5555','#ff9800','#4caf50','#2196f3','#9c27b0','#000000'];

// Inline SVG Icons (gold)
const SvgIcon = ({ path, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
    <path d={path} />
  </svg>
);

export function HomeTab() {
  const { editor, fontFamily, fontSize, setFontFamily, setFontSize } = useEditorStore();
  const { openDialog } = useUIStore();
  const [currentTextColor, setCurrentTextColor] = useState('#000000');
  const [textCase, setTextCase] = useState('none');
  const [charSpacing, setCharSpacing] = useState('0');
  const [lineSpacing, setLineSpacing] = useState('1');

  // Update current color when selection changes
  useEffect(() => {
    if (!editor) return;
    const updateColor = () => {
      const marks = editor.getAttributes('textStyle');
      if (marks && marks.color) {
        setCurrentTextColor(marks.color);
      } else {
        setCurrentTextColor('#000000');
      }
    };
    editor.on('update', updateColor);
    editor.on('selectionUpdate', updateColor);
    return () => {
      editor.off('update', updateColor);
      editor.off('selectionUpdate', updateColor);
    };
  }, [editor]);

  if (!editor) return null;

  const run = (fn) => { fn(); editor.view.focus(); };

  const activeStyle = () => {
    for (let l = 1; l <= 4; l++) if (editor.isActive('heading', { level: l })) return `h${l}`;
    return 'p';
  };

  const applyStyle = (val) => {
    if (val === 'p') run(() => editor.chain().setParagraph().run());
    else run(() => editor.chain().toggleHeading({ level: parseInt(val[1]) }).run());
  };

  const applyTextCase = (caseVal) => {
    setTextCase(caseVal);
    if (caseVal === 'none') {
      run(() => editor.chain().unsetMark('textTransform').run());
    } else {
      run(() => editor.chain().setMark('textStyle', { textTransform: caseVal }).run());
    }
  };

  const applyCharSpacing = (spacing) => {
    setCharSpacing(spacing);
    if (spacing === '0') {
      run(() => editor.chain().unsetMark('textStyle', { letterSpacing: undefined }).run());
    } else {
      run(() => editor.chain().setMark('textStyle', { letterSpacing: spacing }).run());
    }
  };

  const applyLineSpacing = (spacing) => {
    setLineSpacing(spacing);
    run(() => editor.chain().setMark('textStyle', { lineHeight: spacing }).run());
  };

  return (
    <>
      {/* Clipboard */}
      <RibbonGroup label="Clipboard">
        <Tooltip text="Cut" shortcut="Ctrl+X"><Button onClick={() => document.execCommand('cut')}>✂</Button></Tooltip>
        <Tooltip text="Copy" shortcut="Ctrl+C"><Button onClick={() => document.execCommand('copy')}>⎘</Button></Tooltip>
        <Tooltip text="Paste" shortcut="Ctrl+V"><Button onClick={() => document.execCommand('paste')}>📋</Button></Tooltip>
      </RibbonGroup>

      {/* Font */}
      <RibbonGroup label="Font">
        <FontFamilyPicker 
          currentFont={fontFamily} 
          onSelect={(font) => { 
            setFontFamily(font); 
            run(() => editor.chain().setFontFamily(font).run()); 
          }} 
        />
        <Select value={fontSize} width={45} onChange={(v) => { setFontSize(v); }} options={SIZES} title="Font Size" />
        <Divider vertical />
        <Tooltip text="Bold" shortcut="Ctrl+B">
          <Button active={editor.isActive('bold')} onClick={() => run(() => editor.chain().toggleBold().run())}><b style={{ fontFamily:'serif' }}>B</b></Button>
        </Tooltip>
        <Tooltip text="Italic" shortcut="Ctrl+I">
          <Button active={editor.isActive('italic')} onClick={() => run(() => editor.chain().toggleItalic().run())}><i style={{ fontFamily:'serif' }}>I</i></Button>
        </Tooltip>
        <Tooltip text="Underline" shortcut="Ctrl+U">
          <Button active={editor.isActive('underline')} onClick={() => run(() => editor.chain().toggleUnderline().run())}><u>U</u></Button>
        </Tooltip>
        <Tooltip text="Strikethrough">
          <Button active={editor.isActive('strike')} onClick={() => run(() => editor.chain().toggleStrike().run())}><s>S</s></Button>
        </Tooltip>
        <Tooltip text="Subscript"><Button active={editor.isActive('subscript')} onClick={() => run(() => editor.chain().toggleSubscript().run())}>x₂</Button></Tooltip>
        <Tooltip text="Superscript"><Button active={editor.isActive('superscript')} onClick={() => run(() => editor.chain().toggleSuperscript().run())}>x²</Button></Tooltip>
        <Divider vertical />
        <Tooltip text="Highlight"><Button active={editor.isActive('highlight')} onClick={() => run(() => editor.chain().toggleHighlight().run())}>🖍</Button></Tooltip>
        <TextColorPicker 
          currentColor={currentTextColor} 
          onSelect={(color) => {
            setCurrentTextColor(color);
            run(() => editor.chain().setColor(color).run());
          }}
          editor={editor}
        />
        <MoreFormattingDropdown 
          editor={editor}
          activeStyle={activeStyle()}
          textCase={textCase}
          charSpacing={charSpacing}
          lineSpacing={lineSpacing}
          onTextCaseChange={applyTextCase}
          onCharSpacingChange={applyCharSpacing}
          onLineSpacingChange={applyLineSpacing}
        />
      </RibbonGroup>

      {/* Paragraph */}
      <RibbonGroup label="Paragraph">
        <Tooltip text="Align Left"   shortcut="Ctrl+L"><Button active={editor.isActive({textAlign:'left'})}    onClick={() => run(() => editor.chain().setTextAlign('left').run())}>   ≡</Button></Tooltip>
        <Tooltip text="Center"       shortcut="Ctrl+E"><Button active={editor.isActive({textAlign:'center'})}  onClick={() => run(() => editor.chain().setTextAlign('center').run())}> ≡</Button></Tooltip>
        <Tooltip text="Align Right"  shortcut="Ctrl+R"><Button active={editor.isActive({textAlign:'right'})}   onClick={() => run(() => editor.chain().setTextAlign('right').run())}>  ≡</Button></Tooltip>
        <Tooltip text="Justify">     <Button active={editor.isActive({textAlign:'justify'})} onClick={() => run(() => editor.chain().setTextAlign('justify').run())}>≡</Button></Tooltip>
        <Divider vertical />
        <Tooltip text="Bullet List"> <Button active={editor.isActive('bulletList')}  onClick={() => run(() => editor.chain().toggleBulletList().run())}>  •≡</Button></Tooltip>
        <Tooltip text="Ordered List"><Button active={editor.isActive('orderedList')} onClick={() => run(() => editor.chain().toggleOrderedList().run())}>1≡</Button></Tooltip>
        <Tooltip text="Blockquote">  <Button active={editor.isActive('blockquote')}  onClick={() => run(() => editor.chain().toggleBlockquote().run())}>" "</Button></Tooltip>
        <Tooltip text="Code Block">  <Button active={editor.isActive('codeBlock')}   onClick={() => run(() => editor.chain().toggleCodeBlock().run())}>  &lt;/&gt;</Button></Tooltip>
      </RibbonGroup>

      {/* Styles */}
      <RibbonGroup label="Styles">
        <Select value={activeStyle()} width={105} onChange={applyStyle} options={PARA_STYLES} title="Paragraph Style" />
      </RibbonGroup>

      {/* Editing */}
      <RibbonGroup label="Editing">
        <Tooltip text="Undo" shortcut="Ctrl+Z"><Button disabled={!editor.can().undo()} onClick={() => run(() => editor.chain().undo().run())}>↩</Button></Tooltip>
        <Tooltip text="Redo" shortcut="Ctrl+Y"><Button disabled={!editor.can().redo()} onClick={() => run(() => editor.chain().redo().run())}>↪</Button></Tooltip>
        <Divider vertical />
        <Tooltip text="Find & Replace" shortcut="Ctrl+H"><Button onClick={() => openDialog('findReplace')}>🔍</Button></Tooltip>
        <Tooltip text="Clear Formatting"><Button onClick={() => run(() => editor.chain().clearNodes().unsetAllMarks().run())}>Tx</Button></Tooltip>
        <Tooltip text="Select All" shortcut="Ctrl+A"><Button onClick={() => run(() => editor.chain().selectAll().run())}>⊞</Button></Tooltip>
      </RibbonGroup>
    </>
  );
}
