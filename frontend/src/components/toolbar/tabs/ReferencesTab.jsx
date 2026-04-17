import { useEditorStore } from '@/store';
import { RibbonGroup } from '../RibbonGroup';
import { Button, Tooltip } from '@/components/ui';

export function ReferencesTab() {
  const { editor } = useEditorStore();

  if (!editor) return null;

  return (
    <>
      {/* Citations */}
      <RibbonGroup label="Citations & Bibliography" rows={3}>
        <Tooltip text="Insert Citation">
          <Button>🔗 Citation</Button>
        </Tooltip>
        <Tooltip text="Manage Sources">
          <Button>📚 Sources</Button>
        </Tooltip>
        <Tooltip text="Bibliography">
          <Button>📖 Bibliography</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Footnotes */}
      <RibbonGroup label="Footnotes & Endnotes" rows={3}>
        <Tooltip text="Insert Footnote">
          <Button>†† Footnote</Button>
        </Tooltip>
        <Tooltip text="Insert Endnote">
          <Button>‡‡ Endnote</Button>
        </Tooltip>
        <Tooltip text="References Settings">
          <Button>⚙️ Settings</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Table of Contents */}
      <RibbonGroup label="Table of Contents" rows={3}>
        <Tooltip text="Insert Table of Contents">
          <Button>📋 TOC</Button>
        </Tooltip>
        <Tooltip text="Update Table">
          <Button>🔄 Update</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Index */}
      <RibbonGroup label="Index" rows={3}>
        <Tooltip text="Mark Entry">
          <Button>✓ Mark</Button>
        </Tooltip>
        <Tooltip text="Insert Index">
          <Button>🔎 Index</Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
