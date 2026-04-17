import { useEditorStore, useUIStore } from '@/store';
import { RibbonGroup } from '../RibbonGroup';
import { Button, Tooltip } from '@/components/ui';

export function MailingsTab() {
  const { editor } = useEditorStore();
  const { openDialog } = useUIStore();

  if (!editor) return null;

  return (
    <>
      {/* Create */}
      <RibbonGroup label="Create" rows={3}>
        <Tooltip text="Envelopes">
          <Button>✉️ Envelopes</Button>
        </Tooltip>
        <Tooltip text="Labels">
          <Button>📌 Labels</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Start Mail Merge */}
      <RibbonGroup label="Start Mail Merge" rows={3}>
        <Tooltip text="Select Recipients">
          <Button>👥 Recipients</Button>
        </Tooltip>
        <Tooltip text="Edit Recipient List">
          <Button>✎ Edit List</Button>
        </Tooltip>
        <Tooltip text="Finish & Merge">
          <Button>✓ Merge</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Write & Insert Fields */}
      <RibbonGroup label="Write & Insert Fields" rows={3}>
        <Tooltip text="Insert Greeting Line">
          <Button>👋 Greeting</Button>
        </Tooltip>
        <Tooltip text="Insert Field">
          <Button>§ Field</Button>
        </Tooltip>
        <Tooltip text="Rules">
          <Button>⚙️ Rules</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Preview */}
      <RibbonGroup label="Preview Results" rows={3}>
        <Tooltip text="Preview Results">
          <Button>👁️ Preview</Button>
        </Tooltip>
        <Tooltip text="Next Record">
          <Button>→ Next</Button>
        </Tooltip>
        <Tooltip text="Previous Record">
          <Button>← Previous</Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
