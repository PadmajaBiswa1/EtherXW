import { useEffect } from 'react';
import { useEditor as useTiptap } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Focus from '@tiptap/extension-focus';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import FontFamily from '@tiptap/extension-font-family';
import { PageBreak } from '@/components/editor/PageBreak';
import { useEditorStore, useDocumentStore } from '@/store';

export function useEditorSetup() {
  const { setEditor, fontFamily, fontSize, spellCheck } = useEditorStore();
  const { setContent, setStats } = useDocumentStore();

  const editor = useTiptap({
    extensions: [
      StarterKit.configure({ history: { depth: 100 }, heading: { levels: [1,2,3,4,5,6] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
      Placeholder.configure({ placeholder: 'Begin your document…' }),
      Typography,
      Focus.configure({ className: 'has-focus', mode: 'all' }),
      Subscript,
      Superscript,
      FontFamily,
      PageBreak,
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        spellcheck: String(spellCheck),
        style: `font-family: "${fontFamily}", serif; font-size: ${fontSize}pt;`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  useEffect(() => {
    if (editor) setEditor(editor);
    return () => { if (editor) setEditor(null); };
  }, [editor, setEditor]);

  return editor;
}
