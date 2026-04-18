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
import { WatermarkDialog }            from './WatermarkDialog';
import { PageBordersDialog }          from './PageBordersDialog';
import { CitationDialog }             from './CitationDialog';
import { SourcesDialog }              from './SourcesDialog';
import { CaptionDialog }              from './CaptionDialog';
import { CrossReferenceDialog }       from './CrossReferenceDialog';
import { EnvelopeDialog }             from './EnvelopeDialog';
import { LabelsDialog }               from './LabelsDialog';
import { EditRecipientsDialog }       from './EditRecipientsDialog';
import { CommentDialog }              from './CommentDialog';
import { ReferenceDialog }            from './ReferenceDialog';
import { ZoomDialog }                 from './ZoomDialog';
import { MacrosDialog }               from './MacrosDialog';
import { HelpPanel }                  from './HelpPanel';
import { WhatsNewDialog }             from './WhatsNewDialog';
import { FeedbackDialog }             from './FeedbackDialog';
import { AboutDialog }                from './AboutDialog';

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
      {dialogs.watermark         && <WatermarkDialog />}
      {dialogs.pageBorders       && <PageBordersDialog />}
      {dialogs.citation          && <CitationDialog />}
      {dialogs.sources           && <SourcesDialog />}
      {dialogs.caption           && <CaptionDialog />}
      {dialogs.crossReference    && <CrossReferenceDialog />}
      {dialogs.envelope          && <EnvelopeDialog />}
      {dialogs.labels            && <LabelsDialog />}
      {dialogs.editRecipients    && <EditRecipientsDialog />}
      {dialogs.comment           && <CommentDialog />}
      {dialogs.reference         && <ReferenceDialog />}
      {dialogs.zoom              && <ZoomDialog />}
      {dialogs.macros            && <MacrosDialog />}
      {dialogs.helpPanel         && <HelpPanel />}
      {dialogs.whatsNew          && <WhatsNewDialog />}
      {dialogs.feedback          && <FeedbackDialog />}
      {dialogs.about             && <AboutDialog />}
    </>
  );
}
