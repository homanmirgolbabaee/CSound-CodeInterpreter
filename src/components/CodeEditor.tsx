import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  fileName: string;
  onCodeChange?: (newCode: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  fileName, 
  onCodeChange,
  readOnly = false 
}) => {
  const [content, setContent] = useState(code);
  const [language, setLanguage] = useState('javascript');
  const [cursorLine, setCursorLine] = useState<number | null>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  
  // Determine language from file extension
  useEffect(() => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    let lang = 'javascript';
    
    switch (extension) {
      case 'js':
        lang = 'javascript';
        break;
      case 'jsx':
        lang = 'jsx';
        break;
      case 'ts':
        lang = 'typescript';
        break;
      case 'tsx':
        lang = 'tsx';
        break;
      case 'css':
        lang = 'css';
        break;
      case 'html':
        lang = 'html';
        break;
      case 'json':
        lang = 'json';
        break;
      case 'md':
        lang = 'markdown';
        break;
      default:
        lang = 'javascript';
    }
    
    setLanguage(lang);
  }, [fileName]);
  
  // Update code when prop changes
  useEffect(() => {
    setContent(code);
  }, [code]);
  
  // Split code into lines for line numbering
  const codeLines = content.split('\n');
  
  // Enable keyboard navigation support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (readOnly) return;
      
      // This is a simplified keyboard handler - in a real implementation,
      // you would need to track cursor position and handle text insertion/deletion
      if (e.key === 'Tab' && codeRef.current && document.activeElement === codeRef.current) {
        e.preventDefault();
        // Insert a tab (two spaces) at cursor position
        // Note: This is simplified - would need proper cursor tracking
        const newContent = content + '  ';
        setContent(newContent);
        if (onCodeChange) onCodeChange(newContent);
      }
    }
    
    const codeElement = codeRef.current;
    if (codeElement) {
      codeElement.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (codeElement) {
        codeElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [content, readOnly, onCodeChange]);
  
  // Syntax highlighting function with improved patterns
  const highlightSyntax = (line: string) => {
    // This is a simplified version - a real implementation would use a proper tokenizer
    
    // Comments
    let highlighted = line.replace(
      /(\/\/.*$|\/\*[\s\S]*?\*\/)/g,
      '<span class="token comment">$1</span>'
    );
    
    // Strings
    highlighted = highlighted.replace(
      /(['"`])((?:\\\1|(?!\1).)*?)(\1)/g,
      '<span class="token string">$1$2$3</span>'
    );
    
    // Keywords
    const keywords = [
      'import', 'export', 'from', 'default', 'function', 'class', 'extends', 'implements',
      'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
      'break', 'continue', 'new', 'try', 'catch', 'finally', 'throw', 'async', 'await',
      'static', 'public', 'private', 'protected', 'interface', 'type', 'enum', '=>'
    ];
    
    const keywordPattern = new RegExp(
      `\\b(${keywords.join('|')})\\b`, 'g'
    );
    highlighted = highlighted.replace(
      keywordPattern,
      '<span class="token keyword">$1</span>'
    );
    
    // Functions
    highlighted = highlighted.replace(
      /(\w+)(?=\s*\()/g,
      '<span class="token function">$1</span>'
    );
    
    // Types and annotations (for TypeScript)
    highlighted = highlighted.replace(
      /(:\s*)([\w<>\[\]]+)/g,
      '$1<span class="token variable">$2</span>'
    );
    
    return highlighted || '&nbsp;'; // Ensure empty lines still take up space
  };
  
  // Handle click on a line to set cursor
  const handleLineClick = (lineNumber: number) => {
    if (readOnly) return;
    setCursorLine(lineNumber);
    // In a real implementation, this would set the actual cursor position
  };
  
  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-vscode-bg">
      <div 
        className="flex-1 overflow-auto code-editor font-mono"
        ref={codeRef}
        tabIndex={readOnly ? undefined : 0}
      >
        <pre className="p-4 m-0 text-sm leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {codeLines.map((line, idx) => (
                <tr 
                  key={idx} 
                  className={cn(
                    "leading-6 hover:bg-vscode-selection/30",
                    cursorLine === idx && "bg-vscode-selection/50"
                  )}
                  onClick={() => handleLineClick(idx)}
                >
                  <td className="line-numbers w-8 pr-4 text-right select-none">
                    {idx + 1}
                  </td>
                  <td 
                    className="text-vscode-text"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightSyntax(line)
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </pre>
      </div>
      <div className="h-6 bg-vscode-sidebar text-vscode-comment text-xs px-4 flex items-center justify-between">
        <span>{fileName}</span>
        <div className="flex items-center space-x-4">
          <span>Line {cursorLine !== null ? cursorLine + 1 : 1}</span>
          <span>{language}</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;