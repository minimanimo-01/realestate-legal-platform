import { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Type
} from 'lucide-react';
import { Button } from '../ui/button';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SimpleRichTextEditor({ value, onChange, placeholder }: SimpleRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertTable = () => {
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 1em 0;">';
    
    // Header row
    tableHTML += '<thead><tr>';
    for (let j = 0; j < tableCols; j++) {
      tableHTML += '<th style="border: 2px solid #cbd5e1; padding: 8px 12px; background-color: #f1f5f9; font-weight: 600;">헤더 ' + (j + 1) + '</th>';
    }
    tableHTML += '</tr></thead>';
    
    // Body rows
    tableHTML += '<tbody>';
    for (let i = 0; i < tableRows - 1; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        tableHTML += '<td style="border: 2px solid #cbd5e1; padding: 8px 12px;">내용</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table><p><br></p>';
    
    document.execCommand('insertHTML', false, tableHTML);
    setShowTableDialog(false);
    editorRef.current?.focus();
    handleInput();
  };

  const colors = [
    '#000000', '#4B5563', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <style>{`
        .editor-content {
          min-height: 300px;
          padding: 1rem;
          outline: none;
          background: white;
        }
        
        .editor-content:focus {
          outline: none;
        }
        
        .editor-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        .editor-content table td,
        .editor-content table th {
          border: 2px solid #cbd5e1;
          padding: 8px 12px;
          min-width: 50px;
        }
        
        .editor-content table th {
          background-color: #f1f5f9;
          font-weight: 600;
        }
        
        .editor-content h1 { font-size: 2em; font-weight: 600; margin: 0.5em 0; }
        .editor-content h2 { font-size: 1.5em; font-weight: 600; margin: 0.5em 0; }
        .editor-content h3 { font-size: 1.25em; font-weight: 600; margin: 0.5em 0; }
        .editor-content p { margin: 0.5em 0; }
        .editor-content ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .editor-content ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .editor-content blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1em;
          margin: 1em 0;
          color: #64748b;
        }
      `}</style>

      {/* Toolbar */}
      <div className="border-b bg-slate-50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          className="size-8 p-0"
        >
          <Bold className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          className="size-8 p-0"
        >
          <Italic className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          className="size-8 p-0"
        >
          <Underline className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('strikeThrough')}
          className="size-8 p-0"
        >
          <Strikethrough className="size-4" />
        </Button>

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<h1>')}
          className="size-8 p-0"
        >
          <Heading1 className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="size-8 p-0"
        >
          <Heading2 className="size-4" />
        </Button>

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          className="size-8 p-0"
        >
          <List className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          className="size-8 p-0"
        >
          <ListOrdered className="size-4" />
        </Button>

        <div className="w-px h-8 bg-slate-300 mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyLeft')}
          className="size-8 p-0"
        >
          <AlignLeft className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyCenter')}
          className="size-8 p-0"
        >
          <AlignCenter className="size-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyRight')}
          className="size-8 p-0"
        >
          <AlignRight className="size-4" />
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
              setShowBgPicker(false);
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
                    execCommand('foreColor', color);
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
              setShowBgPicker(!showBgPicker);
              setShowColorPicker(false);
            }}
            className="size-8 p-0 bg-yellow-200"
          >
            <Type className="size-4" />
          </Button>
          {showBgPicker && (
            <div className="absolute top-10 left-0 z-10 bg-white border rounded-lg shadow-lg p-2 flex gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  className="size-6 rounded border-2 border-slate-300 hover:border-slate-500"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    execCommand('backColor', color);
                    setShowBgPicker(false);
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
          onClick={() => setShowTableDialog(!showTableDialog)}
          className="size-8 p-0"
        >
          <TableIcon className="size-4" />
        </Button>
      </div>

      {/* Table Dialog */}
      {showTableDialog && (
        <div className="p-4 bg-slate-50 border-b">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">행 개수</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">열 개수</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={insertTable}
                className="flex-1"
              >
                표 삽입
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowTableDialog(false)}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
      />
    </div>
  );
}
