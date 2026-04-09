// ── Layout Tab ───────────────────────────────────────────────
import { useUIStore } from '@/store';
import { Button, Tooltip } from '@/components/ui';
import { RibbonGroup } from '../RibbonGroup';

export function LayoutTab() {
  const { openDialog } = useUIStore();
  return (
    <>
      <RibbonGroup label="Page Setup">
        <Tooltip text="Page Setup"><Button onClick={() => openDialog('pageSetup')}>📄 Page Setup</Button></Tooltip>
        <Tooltip text="Margins"><Button>⊟ Margins</Button></Tooltip>
        <Tooltip text="Orientation"><Button>↕ Orientation</Button></Tooltip>
        <Tooltip text="Size"><Button>📐 Size</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Columns">
        <Tooltip text="One column"><Button>▌ One</Button></Tooltip>
        <Tooltip text="Two columns"><Button>▌▌ Two</Button></Tooltip>
        <Tooltip text="Three columns"><Button>▌▌▌ Three</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Arrange">
        <Tooltip text="Bring Forward"><Button>↑ Forward</Button></Tooltip>
        <Tooltip text="Send Backward"><Button>↓ Backward</Button></Tooltip>
        <Tooltip text="Align"><Button>⊞ Align</Button></Tooltip>
      </RibbonGroup>
    </>
  );
}

// ── Review Tab ───────────────────────────────────────────────
import { useDocumentStore, useUIStore as useUI } from '@/store';
import { useEditorStore } from '@/store';

export function ReviewTab() {
  const { toggleTrackChanges, trackChanges, toggleSpellCheck, spellCheck } = { ...useDocumentStore(), ...useEditorStore() };
  const { openDialog, toast } = useUI();

  return (
    <>
      <RibbonGroup label="Proofing">
        <Tooltip text="Spell Check"><Button active={spellCheck} onClick={toggleSpellCheck}>ABC✓ Spelling</Button></Tooltip>
        <Tooltip text="Word Count"><Button onClick={() => openDialog('wordCount')}>123 Count</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Comments">
        <Tooltip text="New Comment"><Button onClick={() => openDialog('comments')}>💬 New</Button></Tooltip>
        <Tooltip text="Show All Comments"><Button>👁 Show All</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Tracking">
        <Tooltip text="Track Changes"><Button active={trackChanges} onClick={toggleTrackChanges}>⊕ Track</Button></Tooltip>
        <Tooltip text="Accept All"><Button onClick={() => toast('All changes accepted', 'success')}>✓ Accept</Button></Tooltip>
        <Tooltip text="Reject All"><Button onClick={() => toast('All changes rejected', 'info')}>✕ Reject</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Compare">
        <Tooltip text="Version History"><Button onClick={() => openDialog('versionHistory')}>⏱ History</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Voice">
        <Tooltip text="Voice Typing (coming soon)"><Button onClick={() => toast('Voice typing coming soon!', 'info')}>🎤 Dictate</Button></Tooltip>
      </RibbonGroup>
    </>
  );
}

// ── View Tab ─────────────────────────────────────────────────
export function ViewTab() {
  const { zoom, setZoom, toggleFullscreen, fullscreen, sidebarOpen, toggleSidebar } = useUI();
  return (
    <>
      <RibbonGroup label="Views">
        <Tooltip text="Print Layout"><Button active>📄 Print</Button></Tooltip>
        <Tooltip text="Web Layout"><Button>🌐 Web</Button></Tooltip>
        <Tooltip text="Outline"><Button>≡ Outline</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Show">
        <Tooltip text="Toggle Sidebar"><Button active={sidebarOpen} onClick={toggleSidebar}>⊞ Sidebar</Button></Tooltip>
        <Tooltip text="Ruler"><Button>📏 Ruler</Button></Tooltip>
        <Tooltip text="Gridlines"><Button>⊞ Grid</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Zoom">
        <Tooltip text="Zoom Out"><Button onClick={() => setZoom(zoom - 10)}>−</Button></Tooltip>
        <span style={{ fontSize:12, color:'var(--text-primary)', fontFamily:'var(--font-ui)', minWidth:40, textAlign:'center' }}>{zoom}%</span>
        <Tooltip text="Zoom In"><Button onClick={() => setZoom(zoom + 10)}>+</Button></Tooltip>
        <Tooltip text="Reset Zoom"><Button onClick={() => setZoom(100)}>100%</Button></Tooltip>
        <Tooltip text="Fit Page"><Button onClick={() => setZoom(85)}>⊡ Fit</Button></Tooltip>
      </RibbonGroup>
      <RibbonGroup label="Window">
        <Tooltip text={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
          <Button onClick={toggleFullscreen}>{fullscreen ? '⤡ Exit' : '⤢ Full'}</Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
