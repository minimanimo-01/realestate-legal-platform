import { useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Undo,
  Redo,
  Type
} from 'lucide-react';
import { Button } from '../ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [editor, setEditor] = useState<any>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [EditorContent, setEditorContent] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      try {
        const { useEditor, EditorContent: Content } = await import('@tiptap/react');
        const StarterKit = (await import('@tiptap/starter-kit')).default;
        const Table = (await import('@tiptap/extension-table')).default;
        const TableRow = (await import('@tiptap/extension-table-row')).default;
        const TableCell = (await import('@tiptap/extension-table-cell')).default;
        const TableHeader = (await import('@tiptap/extension-table-header')).default;
        const TextAlign = (await import('@tiptap/extension-text-align')).default;
        const Underline = (await import('@tiptap/extension-underline')).default;
        const TextStyle = (await import('@tiptap/extension-text-style')).default;
        const Color = (await import('@tiptap/extension-color')).default;
        const Highlight = (await import('@tiptap/extension-highlight')).default;

        if (!isMounted) return;

        setEditorContent(() => Content);

        const editorInstance = useEditor({
          extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({
              types: ['heading', 'paragraph'],
            }),
            Table.configure({
              resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
          ],
          content: value || '',
          onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
          },
        });

        if (isMounted) {
          setEditor(editorInstance);
        }
      } catch (error) {
        console.error('Failed to load editor:', error);
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      if (editor) {
        editor.destroy();
      }
    };
  }, [onChange]);

  useEffect(() => {
    if (editor && value && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor || !EditorContent) {
    return <div className="p-4 border rounded-lg bg-slate-50 text-slate-600">에디터를 로딩 중...</div>;
  }

  const colors = [
    '#000000', '#4B5563', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
  ];

  return (
    <div className="rich-text-editor border rounded-lg overflow-hidden">
      <style>{`
        .tiptap {
          min-height: 300px;
          padding: 1rem;
          outline: none;
        }
        
        .tiptap table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1em 0;
          overflow: hidden;
        }
        
        .tiptap table td,
        .tiptap table th {
          min-width: 1em;
          border: 2px solid #cbd5e1;
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        
        .tiptap table th {
          background-color: #f1f5f9;
          font-weight: 600;
          text-align: left;
        }
        
        .tiptap table .selectedCell {
          background-color: #e0e7ff;
        }
        
        .tiptap table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: #4f46e5;
          pointer-events: none;
        }
        
        .tiptap p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        
        .tiptap h1 { font-size: 2em; font-weight: 600; margin: 0.5em 0; }
        .tiptap h2 { font-size: 1.5em; font-weight: 600; margin: 0.5em 0; }
        .tiptap h3 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0; }
        .tiptap p { margin: 0.5em 0; }
        .tiptap ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .tiptap ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .tiptap blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1em;
          margin: 1em 0;
          color: #64748b;
        }
        .tiptap code {
          background-color: #f1f5f9;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.9em;
          font-family: monospace;
        }
        .tiptap pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1em;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1em 0;
        }
        .tiptap pre code {
          background: none;
          color: inherit;
          padding: 0;
        }
      `}</style>

      {/* Toolbar */}
      <div className="border-b bg-slate-50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="size-8 p-0"
        >
          <Bold className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="size-8 p-0"
        >
          <Italic className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="size-8 p-0"
        >
          <Underline className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="size-8 p-0"
        >
          <Strikethrough className="size-4" />
        </Button>

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="size-8 p-0"
        >
          <Heading1 className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="size-8 p-0"
        >
          <Heading2 className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="size-8 p-0"
        >
          <Heading3 className="size-4" />
        </Button>

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="size-8 p-0"
        >
          <List className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="size-8 p-0"
        >
          <ListOrdered className="size-4" />
        </Button>

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className="size-8 p-0"
        >
          <AlignLeft className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className="size-8 p-0"
        >
          <AlignCenter className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className="size-8 p-0"
        >
          <AlignRight className="size-4" />
        </Button>

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Quote & Code */}
        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="size-8 p-0"
        >
          <Quote className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive('code') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="size-8 p-0"
        >
          <Code className="size-4" />
        </Button>

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Colors */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowBgColorPicker(false);
            }}
            className="size-8 p-0"
          >
            <Type className="size-4" />
          </Button>
          {showColorPicker && (
            <div className="absolute top-10 left-0 z-10 bg-white border rounded-lg shadow-lg p-2 flex gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  className="size-6 rounded border-2 border-slate-300 hover:border-slate-500"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowBgColorPicker(!showBgColorPicker);
              setShowColorPicker(false);
            }}
            className="size-8 p-0 bg-yellow-200"
          >
            <Type className="size-4" />
          </Button>
          {showBgColorPicker && (
            <div className="absolute top-10 left-0 z-10 bg-white border rounded-lg shadow-lg p-2 flex gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  className="size-6 rounded border-2 border-slate-300 hover:border-slate-500"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run();
                    setShowBgColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Table */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="size-8 p-0"
        >
          <TableIcon className="size-4" />
        </Button>

        {editor.isActive('table') && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="text-xs px-2 h-8"
            >
              열+
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="text-xs px-2 h-8"
            >
              행+
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="text-xs px-2 h-8"
            >
              열-
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="text-xs px-2 h-8"
            >
              행-
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="text-xs px-2 h-8"
            >
              표삭제
            </Button>
          </>
        )}

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          className="size-8 p-0"
        >
          <Undo className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          className="size-8 p-0"
        >
          <Redo className="size-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div 
        className="tiptap-wrapper"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}