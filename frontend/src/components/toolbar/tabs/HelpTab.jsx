import { Tooltip, Button } from '@/components/ui';
import { RibbonGroup } from '../RibbonGroup';

export function HelpTab() {
  return (
    <>
      {/* Help Resources */}
      <RibbonGroup label="Help" rows={3}>
        <Tooltip text="Help & Support">
          <Button onClick={() => window.open('https://help.etherxw.app', '_blank')}>
            ❓ Help
          </Button>
        </Tooltip>
        <Tooltip text="Getting Started">
          <Button onClick={() => window.open('https://etherxw.app/docs', '_blank')}>
            🚀 Getting Started
          </Button>
        </Tooltip>
        <Tooltip text="Keyboard Shortcuts">
          <Button>⌨️ Shortcuts</Button>
        </Tooltip>
      </RibbonGroup>

      {/* About */}
      <RibbonGroup label="About" rows={3}>
        <Tooltip text="About EtherX Word">
          <Button>ℹ️ About</Button>
        </Tooltip>
        <Tooltip text="Check for Updates">
          <Button>🔄 Updates</Button>
        </Tooltip>
        <Tooltip text="Feedback">
          <Button>💬 Feedback</Button>
        </Tooltip>
      </RibbonGroup>

      {/* Support */}
      <RibbonGroup label="Support" rows={3}>
        <Tooltip text="Contact Support">
          <Button>📧 Contact</Button>
        </Tooltip>
        <Tooltip text="Report an Issue">
          <Button>🐛 Report Issue</Button>
        </Tooltip>
      </RibbonGroup>
    </>
  );
}
