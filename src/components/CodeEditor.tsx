
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  fileName: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, fileName }) => {
  // Split code into lines for line numbering
  const codeLines = code.split('\n');
  
  // Simple syntax highlighting function
  const highlightSyntax = (line: string) => {
    // Replace with a proper syntax highlighter in a real app
    // This is a very basic implementation
    
    // Keywords
    let highlighted = line.replace(
      /(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|=>)/g, 
      '<span class="token keyword">$1</span>'
    );
    
    // Strings
    highlighted = highlighted.replace(
      /(['"`])(.*?)(['"`])/g,
      '<span class="token string">$1$2$3</span>'
    );
    
    // Comments
    highlighted = highlighted.replace(
      /(\/\/.*$|\/\*[\s\S]*?\*\/)/g,
      '<span class="token comment">$1</span>'
    );
    
    // Functions
    highlighted = highlighted.replace(
      /(\w+)(?=\s*\()/g,
      '<span class="token function">$1</span>'
    );
    
    return highlighted;
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-vscode-bg">
      <div className="flex-1 overflow-auto code-editor font-mono">
        <pre className="p-4 m-0 text-sm leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {codeLines.map((line, idx) => (
                <tr key={idx} className="leading-6">
                  <td className="line-numbers w-8 pr-4 text-right select-none">
                    {idx + 1}
                  </td>
                  <td 
                    className="text-vscode-text"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightSyntax(line) || '&nbsp;' 
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
        <span>JavaScript</span>
      </div>
    </div>
  );
};

export default CodeEditor;
