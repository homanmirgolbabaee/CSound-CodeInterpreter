
import React, { useState } from 'react';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import CopilotPanel from './CopilotPanel';
import EditorHeader from './EditorHeader';

const EditorLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeFile, setActiveFile] = useState('index.js');
  
  // Sample files structure for the explorer
  const files = [
    { name: 'index.js', type: 'file' },
    { name: 'styles.css', type: 'file' },
    { name: 'components', type: 'folder', children: [
      { name: 'Button.js', type: 'file' },
      { name: 'Header.js', type: 'file' }
    ]},
    { name: 'utils', type: 'folder', children: [
      { name: 'helpers.js', type: 'file' }
    ]},
  ];

  // Sample code for different files
  const fileCodes: Record<string, string> = {
    'index.js': `// Main application file
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles.css';

function main() {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}

main();`,
    'styles.css': `/* Main styles */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}`,
    'components/Button.js': `import React from 'react';

// Button component with variants
const Button = ({ children, variant = 'primary', ...props }) => {
  const baseStyle = 'px-4 py-2 rounded font-medium focus:outline-none';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={\`\${baseStyle} \${variants[variant]}\`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;`,
    'components/Header.js': `import React from 'react';
import Button from './Button';

const Header = ({ title, onMenuClick }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-bold">{title}</h1>
      <div>
        <Button variant="secondary" onClick={onMenuClick}>
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;`,
    'utils/helpers.js': `/**
 * Utility functions for the application
 */

// Format date to readable string
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// Debounce function for performance optimization
export function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Generate a random ID
export function generateId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}`
  };

  const handleFileSelect = (fileName: string) => {
    setActiveFile(fileName);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-vscode-bg text-white overflow-hidden">
      <EditorHeader 
        toggleSidebar={toggleSidebar} 
        togglePanel={togglePanel}
        fileName={activeFile} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer Sidebar */}
        {isSidebarOpen && (
          <FileExplorer 
            files={files} 
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
          />
        )}
        
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          <CodeEditor code={fileCodes[activeFile] || ''} fileName={activeFile} />
          
          {/* Copilot Panel */}
          {isPanelOpen && <CopilotPanel fileName={activeFile} />}
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
