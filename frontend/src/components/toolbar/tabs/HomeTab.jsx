import { useEditorStore, useUIStore } from '@/store';
import { Button, Divider, Tooltip, Select, ColorSwatch } from '@/components/ui';
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

const TEXT_COLORS = ['#d4af37','#e8d98a','#ffffff','#cccccc','#888888','#333333',
                     '#ff5555','#ff9800','#4caf50','#2196f3','#9c27b0','#000000'];

export function HomeTab() {
  const { editor, fontFamily, fontSize, setFontFamily, setFontSize } = useEditorStore();
  const { openDialog } = useUIStore();
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
        <Select value={fontFamily} width={130} onChange={(v) => { setFontFamily(v); run(() => editor.chain().setFontFamily(v).run()); }} options={FONTS} title="Font Family" />
        <Select value={fontSize} width={50} onChange={(v) => { setFontSize(v); }} options={SIZES} title="Font Size" />
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
        <div style={{ display:'flex', flexWrap:'wrap', width:46, gap:2, alignContent:'center' }}>
          {TEXT_COLORS.map((c) => <ColorSwatch key={c} color={c} size={16} onSelect={(v) => run(() => editor.chain().setColor(v).run())} />)}
        </div>
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
        <Tooltip text="Task List">   <Button active={editor.isActive('taskList')}    onClick={() => run(() => editor.chain().toggleTaskList().run())}>    ☑</Button></Tooltip>
        <Tooltip text="Blockquote">  <Button active={editor.isActive('blockquote')}  onClick={() => run(() => editor.chain().toggleBlockquote().run())}>" "</Button></Tooltip>
        <Tooltip text="Code Block">  <Button active={editor.isActive('codeBlock')}   onClick={() => run(() => editor.chain().toggleCodeBlock().run())}>  &lt;/&gt;</Button></Tooltip>
        <Tooltip text="Increase indent">  <Button onClick={() => run(() => editor.chain().sinkListItem('listItem').run())}>→</Button></Tooltip>
        <Tooltip text="Decrease indent">  <Button onClick={() => run(() => editor.chain().liftListItem('listItem').run())}>←</Button></Tooltip>
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
