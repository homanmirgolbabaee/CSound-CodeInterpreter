import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  PanelLeft,
  PanelRight,
  Save,
  Settings,
  Copy,
  Download,
  Share2,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface EditorHeaderProps {
  toggleSidebar: () => void;
  togglePanel: () => void;
  fileName: string;
  onSave?: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ 
  toggleSidebar, 
  togglePanel, 
  fileName,
  onSave
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!onSave) {
      // If no save handler is provided, just show a toast
      toast({
        title: 'File saved',
        description: `Changes to ${fileName} have been saved`,
        duration: 2000,
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate saving delay
    setTimeout(() => {
      onSave();
      setIsSaving(false);
    }, 500);
  };

  const handleCopyToClipboard = () => {
    // This is a simple example, in a real app you'd get the actual code content
    toast({
      title: 'Copied to clipboard',
      description: `${fileName} content copied to clipboard`,
      duration: 2000,
    });
  };

  const handleDownload = () => {
    toast({
      title: 'File downloaded',
      description: `${fileName} has been downloaded`,
      duration: 2000,
    });
  };

  const handleShare = () => {
    toast({
      title: 'Share link copied',
      description: `Share link for ${fileName} copied to clipboard`,
      duration: 2000,
    });
  };

  // Get file type for display
  const getFileType = () => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js': return 'JavaScript';
      case 'jsx': return 'React JSX';
      case 'ts': return 'TypeScript';
      case 'tsx': return 'React TSX';
      case 'css': return 'CSS';
      case 'html': return 'HTML';
      case 'json': return 'JSON';
      case 'md': return 'Markdown';
      default: return extension?.toUpperCase() || 'Text';
    }
  };

  return (
    <div className="flex items-center p-2 border-b border-vscode-sidebar bg-vscode-sidebar">
      <div className="flex items-center space-x-1">
        <Button 
          onClick={toggleSidebar} 
          variant="ghost" 
          size="icon" 
          className="text-vscode-text hover:bg-vscode-panel"
          title="Toggle Explorer"
        >
          <PanelLeft size={18} />
        </Button>
        
        <Button 
          onClick={handleSave}
          variant="ghost" 
          size="icon" 
          className="text-vscode-text hover:bg-vscode-panel"
          disabled={isSaving}
          title="Save File (Ctrl+S)"
        >
          <Save size={18} className={cn(isSaving && "animate-pulse")} />
        </Button>
      </div>
      
      <div className="flex-1 mx-2 px-2 py-1 flex items-center">
        <span className="text-sm text-vscode-text truncate">{fileName}</span>
        <span className="ml-2 text-xs text-vscode-comment bg-vscode-panel px-1.5 py-0.5 rounded">
          {getFileType()}
        </span>
      </div>
      
      <div className="flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-vscode-text hover:bg-vscode-panel"
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-vscode-sidebar border-vscode-panel text-vscode-text">
            <DropdownMenuItem onClick={handleCopyToClipboard} className="cursor-pointer hover:bg-vscode-panel">
              <Copy size={16} className="mr-2" />
              <span>Copy to Clipboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload} className="cursor-pointer hover:bg-vscode-panel">
              <Download size={16} className="mr-2" />
              <span>Download File</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-vscode-panel" />
            <DropdownMenuItem onClick={handleShare} className="cursor-pointer hover:bg-vscode-panel">
              <Share2 size={16} className="mr-2" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-vscode-panel">
              <Settings size={16} className="mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          onClick={togglePanel} 
          variant="ghost" 
          size="icon" 
          className="text-vscode-text hover:bg-vscode-panel"
          title="Toggle CodeBuddy Panel"
        >
          <PanelRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;