import { useEditorStore, useUIStore } from '@/store';
import { RibbonGroup } from '../RibbonGroup';
import { Button, Tooltip } from '@/components/ui';

export function DesignTab() {
  const { editor } = useEditorStore();
  const { openDialog } = useUIStore();

  if (!editor) return null;

  return (
    <>
      {/* Document Themes */}
      <RibbonGroup label="Themes" rows={3}>
        <Tooltip text="Themes" shortcut="">
          <Button>🎨 Themes</Button>
        </Tooltip>
        <Tooltip text="Colors">
          <Button>🌈 Colors</Button>
        </Tooltip>
        <Tooltip text="Fonts">
          <Button>A Fonts</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Document Formatting */}
      <RibbonGroup label="Format" rows={3}>
        <Tooltip text="Page Color">
          <Button>📄 Page Color</Button>
        </Tooltip>
        <Tooltip text="Watermark">
          <Button>💧 Watermark</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Page Setup */}
      <RibbonGroup label="Page Setup" rows={3}>
        <Tooltip text="Page Setup">
          <Button onClick={() => openDialog('pageSetup')}>⚙️ Setup</Button>
        </Tooltip>
        <Tooltip text="Margins">
          <Button>→← Margins</Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
