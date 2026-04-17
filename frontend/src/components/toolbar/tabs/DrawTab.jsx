import { useEditorStore, useUIStore } from '@/store';
import { RibbonGroup } from '../RibbonGroup';
import { Button, Tooltip } from '@/components/ui';

export function DrawTab() {
  const { editor } = useEditorStore();
  const { openDialog } = useUIStore();

  if (!editor) return null;

  return (
    <>
      {/* Drawing Tools Group */}
      <RibbonGroup label="Tools" rows={3}>
        <Tooltip text="Pen" shortcut="Ctrl+P">
          <Button onClick={() => openDialog('drawing')}>✏️ Pen</Button>
        </Tooltip>
        <Tooltip text="Highlighter" shortcut="Ctrl+H">
          <Button>🖍️ Highlighter</Button>
        </Tooltip>
        <Tooltip text="Eraser">
          <Button>🧹 Eraser</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Drawing Styles */}
      <RibbonGroup label="Shapes" rows={3}>
        <Tooltip text="Shapes">
          <Button onClick={() => openDialog('insertShape')}>▭ Shapes</Button>
        </Tooltip>
        <Tooltip text="Connectors">
          <Button>↗ Connectors</Button>
        </Tooltip>
        <Tooltip text="Freeform">
          <Button>✍️ Freeform</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Drawing Options */}
      <RibbonGroup label="Edit" rows={3}>
        <Tooltip text="Select Drawing Object">
          <Button>📍 Select</Button>
        </Tooltip>
        <Tooltip text="Convert To Shapes">
          <Button>◆ Convert</Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
