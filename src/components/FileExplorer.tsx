import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Search, File, Folder, FileText, Code, Coffee, FileJson, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

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
    'utils': true,
    'context': true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>(files);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);

  // Update filtered files when search changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFiles(files);
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Helper function to search recursively
    const searchFiles = (items: FileItem[], path: string = ''): FileItem[] => {
      const result: FileItem[] = [];
      
      items.forEach(item => {
        const fullPath = path ? `${path}/${item.name}` : item.name;
        const match = item.name.toLowerCase().includes(query);
        
        if (item.type === 'folder') {
          const matchedChildren = item.children ? searchFiles(item.children, fullPath) : [];
          
          if (match || matchedChildren.length > 0) {
            result.push({
              ...item,
              children: matchedChildren
            });
            
            // Auto-expand folders with matches
            if (matchedChildren.length > 0) {
              setExpandedFolders(prev => ({
                ...prev,
                [item.name]: true
              }));
            }
          }
        } else if (match) {
          result.push(item);
        }
      });
      
      return result;
    };
    
    setFilteredFiles(searchFiles(files));
  }, [searchQuery, files]);

  // Keep track of recently opened files
  useEffect(() => {
    setRecentFiles(prev => {
      // Add current file to the top
      const newRecentFiles = [activeFile, ...prev.filter(file => file !== activeFile)];
      // Limit to 5 most recent
      return newRecentFiles.slice(0, 5);
    });
  }, [activeFile]);

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
        return <Coffee className="text-yellow-400 w-4 h-4" />;
      case 'jsx':
        return <Code className="text-blue-400 w-4 h-4" />;
      case 'ts':
        return <FileCode className="text-blue-600 w-4 h-4" />;
      case 'tsx':
        return <FileCode className="text-blue-500 w-4 h-4" />;
      case 'css':
        return <FileText className="text-blue-400 w-4 h-4" />;
      case 'html':
        return <Code className="text-orange-400 w-4 h-4" />;
      case 'json':
        return <FileJson className="text-yellow-200 w-4 h-4" />;
      case 'md':
        return <FileText className="text-gray-400 w-4 h-4" />;
      default:
        return <File className="text-gray-400 w-4 h-4" />;
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
              className="flex items-center px-2 py-1 cursor-pointer hover:bg-vscode-panel group"
              onClick={() => toggleFolder(item.name)}
            >
              {isExpanded ? (
                <ChevronDown size={14} className="mr-1 text-vscode-text" />
              ) : (
                <ChevronRight size={14} className="mr-1 text-vscode-text" />
              )}
              <Folder size={16} className="mr-1 text-blue-400" />
              <span className="text-vscode-text text-sm truncate">{item.name}</span>
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
              "flex items-center px-2 py-1 cursor-pointer text-sm",
              isActive ? "bg-vscode-selection" : "hover:bg-vscode-panel"
            )}
            onClick={() => onFileSelect(fullPath)}
          >
            <div className="ml-4 flex items-center truncate">
              {getFileIcon(item.name)}
              <span className="ml-1 text-vscode-text truncate">{item.name}</span>
            </div>
          </div>
        );
      }
    });
  };

  return (
    <div className="w-64 bg-vscode-sidebar border-r border-vscode-panel overflow-y-auto flex flex-col">
      <div className="p-2 text-sm font-semibold text-vscode-text uppercase flex justify-between items-center">
        <span>Explorer</span>
      </div>
      
      {/* Search input */}
      <div className="px-2 pb-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-2.5 text-vscode-comment" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 bg-vscode-panel text-vscode-text text-sm"
          />
        </div>
      </div>
      
      {searchQuery.trim() === '' && recentFiles.length > 0 && (
        <div className="mb-2">
          <div className="px-2 py-1 text-xs text-vscode-comment">RECENTLY OPENED</div>
          {recentFiles.map(file => (
            <div 
              key={file}
              className={cn(
                "flex items-center px-2 py-1 cursor-pointer text-sm",
                file === activeFile ? "bg-vscode-selection" : "hover:bg-vscode-panel"
              )}
              onClick={() => onFileSelect(file)}
            >
              <div className="flex items-center truncate">
                {getFileIcon(file)}
                <span className="ml-1 text-vscode-text truncate">{file}</span>
              </div>
            </div>
          ))}
          <div className="mx-2 my-2 border-b border-vscode-panel"></div>
        </div>
      )}
      
      {renderItems(filteredFiles)}
      
      {filteredFiles.length === 0 && (
        <div className="p-2 text-vscode-comment text-xs italic">
          No files match your search
        </div>
      )}
    </div>
  );
};

export default FileExplorer;