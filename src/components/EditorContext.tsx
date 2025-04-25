import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define file types
export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

// Editor context type
interface EditorContextType {
  files: FileItem[];
  activeFile: string;
  fileContents: Record<string, string>;
  setActiveFile: (fileName: string) => void;
  updateFileContent: (fileName: string, content: string) => void;
  saveFile: (fileName?: string) => void;
  recentFiles: string[];
  isSidebarOpen: boolean;
  isPanelOpen: boolean;
  toggleSidebar: () => void;
  togglePanel: () => void;
}

// Create context with default values
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Sample initial file structure
const initialFiles: FileItem[] = [
  { name: 'index.js', type: 'file' },
  { name: 'styles.css', type: 'file' },
  { name: 'README.md', type: 'file' },
  { name: 'components', type: 'folder', children: [
    { name: 'Button.js', type: 'file' },
    { name: 'Header.js', type: 'file' },
    { name: 'Modal.tsx', type: 'file' },
  ]},
  { name: 'utils', type: 'folder', children: [
    { name: 'helpers.js', type: 'file' },
    { name: 'api.js', type: 'file' }
  ]},
  { name: 'context', type: 'folder', children: [
    { name: 'ThemeContext.js', type: 'file' },
    { name: 'AuthContext.js', type: 'file' }
  ]},
];

// Sample initial file contents
const initialFileContents: Record<string, string> = {
  'index.js': `// Main application file
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './styles.css';

function main() {
  ReactDOM.render(
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>,
    document.getElementById('root')
  );
}

main();`,
  'styles.css': `/* Main styles */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --text-color: #1f2937;
  --background-color: #ffffff;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --success-color: #10b981;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  color: var(--text-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}`,
  'README.md': `# Project Documentation

## Overview
This is a sample project demonstrating various React components and patterns.

## Getting Started
1. Clone the repository
2. Install dependencies with \`npm install\`
3. Start the development server with \`npm start\`

## Project Structure
- \`components/\`: UI components
- \`utils/\`: Helper functions
- \`context/\`: React context definitions`,
  'components/Button.js': `import React from 'react';
import PropTypes from 'prop-types';

// Button component with variants
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseStyle = 'px-4 py-2 rounded font-medium focus:outline-none transition-colors';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border border-current text-blue-600 bg-transparent hover:bg-blue-50'
  };
  
  const sizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base px-5 py-2.5'
  };

  return (
    <button
      className={\`\${baseStyle} \${variants[variant]} \${sizes[size]}\`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

export default Button;`,
  // Additional files can be added as needed
};

export const EditorProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<string>('index.js');
  const [fileContents, setFileContents] = useState<Record<string, string>>(initialFileContents);
  const [recentFiles, setRecentFiles] = useState<string[]>(['index.js']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const { toast } = useToast();

  // Update recent files when active file changes
  useEffect(() => {
    setRecentFiles(prev => {
      // Add current file to the top
      const newRecentFiles = [activeFile, ...prev.filter(file => file !== activeFile)];
      // Limit to 5 most recent
      return newRecentFiles.slice(0, 5);
    });
  }, [activeFile]);

  // Update file content
  const updateFileContent = (fileName: string, content: string) => {
    setFileContents(prev => ({
      ...prev,
      [fileName]: content
    }));
  };

  // Save the current file or a specific file
  const saveFile = (fileName?: string) => {
    const fileToSave = fileName || activeFile;
    
    // In a real app, this would save to a backend or localStorage
    toast({
      title: 'File saved',
      description: `${fileToSave} has been saved`,
      duration: 2000,
    });
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Toggle panel
  const togglePanel = () => {
    setIsPanelOpen(prev => !prev);
  };

  return (
    <EditorContext.Provider
      value={{
        files,
        activeFile,
        fileContents,
        setActiveFile,
        updateFileContent,
        saveFile,
        recentFiles,
        isSidebarOpen,
        isPanelOpen,
        toggleSidebar,
        togglePanel
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

// Hook to use the editor context
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};