
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PanelLeft,
  PanelRight
} from 'lucide-react';

interface EditorHeaderProps {
  toggleSidebar: () => void;
  togglePanel: () => void;
  fileName: string;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ toggleSidebar, togglePanel, fileName }) => {
  return (
    <div className="flex items-center p-2 border-b border-vscode-sidebar bg-vscode-sidebar">
      <Button 
        onClick={toggleSidebar} 
        variant="ghost" 
        size="icon" 
        className="text-vscode-text hover:bg-vscode-panel"
      >
        <PanelLeft size={18} />
      </Button>
      
      <div className="flex-1 mx-2 px-2 py-1">
        <span className="text-sm text-vscode-text">{fileName}</span>
      </div>
      
      <Button 
        onClick={togglePanel} 
        variant="ghost" 
        size="icon" 
        className="text-vscode-text hover:bg-vscode-panel"
      >
        <PanelRight size={18} />
      </Button>
    </div>
  );
};

export default EditorHeader;
