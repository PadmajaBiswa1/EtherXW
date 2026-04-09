import { useUIStore, useEditorStore } from '@/store';
import { Button, Tooltip } from '@/components/ui';
import { RibbonGroup } from '../RibbonGroup';

export function InsertTab() {
  const { openDialog } = useUIStore();
  const { editor } = useEditorStore();
  const run = (fn) => { fn?.(); editor?.view?.focus(); };

  return (
    <>
      <RibbonGroup label="Pages">
        <Tooltip text="Page Break"><Button onClick={() => run(() => editor?.chain().setHardBreak().run())}>⊞ Break</Button></Tooltip>
      </RibbonGroup>

      <RibbonGroup label="Tables">
        <Tooltip text="Insert Table"><Button onClick={() => openDialog('insertTable')}>⊞ Table</Button></Tooltip>
      </RibbonGroup>

      <RibbonGroup label="Illustrations">
        <Tooltip text="Picture / Image"><Button onClick={() => openDialog('insertImage')}>🖼 Image</Button></Tooltip>
        <Tooltip text="Shapes"><Button onClick={() => openDialog('insertShape')}>◆ Shapes</Button></Tooltip>
        <Tooltip text="Freehand Drawing"><Button onClick={() => openDialog('drawing')}>✏ Draw</Button></Tooltip>
        <Tooltip text="Insert Chart"><Button onClick={() => openDialog('insertChart')}>📊 Chart</Button></Tooltip>
      </RibbonGroup>

      <RibbonGroup label="Links">
        <Tooltip text="Hyperlink" shortcut="Ctrl+K"><Button onClick={() => openDialog('insertLink')}>🔗 Link</Button></Tooltip>
      </RibbonGroup>

      <RibbonGroup label="Text">
        <Tooltip text="Text Box"><Button onClick={() => openDialog('insertTextBox')}>☐ Text Box</Button></Tooltip>
        <Tooltip text="Horizontal Rule"><Button onClick={() => run(() => editor?.chain().setHorizontalRule().run())}>― Line</Button></Tooltip>
        <Tooltip text="Symbols"><Button onClick={() => openDialog('insertSymbol')}>Ω Symbol</Button></Tooltip>
      </RibbonGroup>

      <RibbonGroup label="Comments">
        <Tooltip text="Add Comment"><Button onClick={() => openDialog('comments')}>💬 Comment</Button></Tooltip>
      </RibbonGroup>
    </>
  );
}
