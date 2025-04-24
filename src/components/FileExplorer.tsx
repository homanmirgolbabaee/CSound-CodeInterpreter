
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

interface FileExplorerProps {
  files: FileItem[];
  activeFile: string;
  onFileSelect: (fileName: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  activeFile, 
  onFileSelect 
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'components': true,
    'utils': true
  });

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  // File icon map based on extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'js':
        return <span className="text-yellow-400 mr-2">JS</span>;
      case 'css':
        return <span className="text-blue-400 mr-2">CSS</span>;
      case 'html':
        return <span className="text-orange-400 mr-2">HTML</span>;
      case 'json':
        return <span className="text-yellow-200 mr-2">{ }</span>;
      default:
        return <span className="text-gray-400 mr-2">📄</span>;
    }
  };

  // Recursive function to render files and folders
  const renderItems = (items: FileItem[], path = '') => {
    return items.map(item => {
      const fullPath = path ? `${path}/${item.name}` : item.name;
      
      if (item.type === 'folder') {
        const isExpanded = expandedFolders[item.name] || false;
        
        return (
          <div key={fullPath}>
            <div 
              className="flex items-center px-2 py-1 cursor-pointer hover:bg-vscode-panel"
              onClick={() => toggleFolder(item.name)}
            >
              {isExpanded ? (
                <ChevronLeft size={14} className="mr-1 text-vscode-text" />
              ) : (
                <ChevronRight size={14} className="mr-1 text-vscode-text" />
              )}
              <span className="text-vscode-text">📁 {item.name}</span>
            </div>
            
            {isExpanded && item.children && (
              <div className="pl-4">
                {renderItems(item.children, fullPath)}
              </div>
            )}
          </div>
        );
      } else {
        // It's a file
        const isActive = fullPath === activeFile;
        
        return (
          <div 
            key={fullPath}
            className={cn(
              "flex items-center px-2 py-1 cursor-pointer",
              isActive ? "bg-vscode-selection" : "hover:bg-vscode-panel"
            )}
            onClick={() => onFileSelect(fullPath)}
          >
            <div className="ml-4 flex items-center">
              {getFileIcon(item.name)}
              <span className="text-vscode-text">{item.name}</span>
            </div>
          </div>
        );
      }
    });
  };

  return (
    <div className="w-64 bg-vscode-sidebar border-r border-vscode-panel overflow-y-auto">
      <div className="p-2 text-sm font-semibold text-vscode-text uppercase">Explorer</div>
      {renderItems(files)}
    </div>
  );
};

export default FileExplorer;
