// ═══════════════════════════════════════════════════════════════
//  DialogManager — mounts all dialogs conditionally
// ═══════════════════════════════════════════════════════════════
import { useUIStore } from '@/store';
import { InsertImageDialog }   from './InsertImageDialog';
import { InsertTableDialog }   from './InsertTableDialog';
import { InsertLinkDialog }    from './InsertLinkDialog';
import { InsertChartDialog }   from './InsertChartDialog';
import { InsertShapeDialog }   from './InsertShapeDialog';
import { InsertSymbolDialog }  from './InsertSymbolDialog';
import { FindReplaceDialog }   from './FindReplaceDialog';
import { ExportDialog }        from './ExportDialog';
import { ShareDialog }         from './ShareDialog';
import { VersionHistoryDialog} from './VersionHistoryDialog';
import { DrawingDialog }       from './DrawingDialog';

export function DialogManager() {
  const { dialogs } = useUIStore();
  return (
    <>
      {dialogs.insertImage    && <InsertImageDialog />}
      {dialogs.insertTable    && <InsertTableDialog />}
      {dialogs.insertLink     && <InsertLinkDialog />}
      {dialogs.insertChart    && <InsertChartDialog />}
      {dialogs.insertShape    && <InsertShapeDialog />}
      {dialogs.insertSymbol   && <InsertSymbolDialog />}
      {dialogs.findReplace    && <FindReplaceDialog />}
      {dialogs.exportDoc      && <ExportDialog />}
      {dialogs.shareDoc       && <ShareDialog />}
      {dialogs.versionHistory && <VersionHistoryDialog />}
      {dialogs.drawing        && <DrawingDialog />}
    </>
  );
}
