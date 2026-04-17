// ═══════════════════════════════════════════════════════════════
//  DialogManager — mounts all dialogs conditionally
// ═══════════════════════════════════════════════════════════════
import { useUIStore } from '@/store';
import { InsertImageDialog }          from './InsertImageDialog';
import { InsertTableDialog }          from './InsertTableDialog';
import { InsertLinkDialog }           from './InsertLinkDialog';
import { InsertChartDialog }          from './InsertChartDialog';
import { InsertShapeDialog }          from './InsertShapeDialog';
import { InsertSymbolDialog }         from './InsertSymbolDialog';
import { FindReplaceDialog }          from './FindReplaceDialog';
import { ExportDialog }               from './ExportDialog';
import { ShareDialog }                from './ShareDialog';
import { VersionHistoryDialog }       from './VersionHistoryDialog';
import { DrawingDialog }              from './DrawingDialog';
import { InsertBookmarkDialog }       from './InsertBookmarkDialog';
import { InsertCrossReferenceDialog } from './InsertCrossReferenceDialog';
import { InsertWordArtDialog }        from './InsertWordArtDialog';
import { InsertEquationDialog }       from './InsertEquationDialog';
import { InsertDropCapDialog }        from './InsertDropCapDialog';
import { InsertDateTimeDialog }       from './InsertDateTimeDialog';
import { InsertIconsDialog }          from './InsertIconsDialog';

export function DialogManager() {
  const { dialogs } = useUIStore();
  return (
    <>
      {dialogs.insertImage       && <InsertImageDialog />}
      {dialogs.insertTable       && <InsertTableDialog />}
      {dialogs.insertLink        && <InsertLinkDialog />}
      {dialogs.insertChart       && <InsertChartDialog />}
      {dialogs.insertShape       && <InsertShapeDialog />}
      {dialogs.insertSymbol      && <InsertSymbolDialog />}
      {dialogs.findReplace       && <FindReplaceDialog />}
      {dialogs.exportDoc         && <ExportDialog />}
      {dialogs.shareDoc          && <ShareDialog />}
      {dialogs.versionHistory    && <VersionHistoryDialog />}
      {dialogs.drawing           && <DrawingDialog />}
      {dialogs.bookmark          && <InsertBookmarkDialog />}
      {dialogs.crossReference    && <InsertCrossReferenceDialog />}
      {dialogs.wordArt           && <InsertWordArtDialog />}
      {dialogs.equation          && <InsertEquationDialog />}
      {dialogs.dropCap           && <InsertDropCapDialog />}
      {dialogs.dateTime          && <InsertDateTimeDialog />}
      {dialogs.insertIcons       && <InsertIconsDialog />}
    </>
  );
}
