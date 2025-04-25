import React, { useState, useEffect } from 'react';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import CopilotPanel from './CopilotPanel';
import EditorHeader from './EditorHeader';
import { useToast } from '@/hooks/use-toast';

// Define the FileItem type to match the expected structure
interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

const EditorLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeFile, setActiveFile] = useState('index.js');
  const [codeCache, setCodeCache] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  // Sample files structure for the explorer with proper typing
  const files: FileItem[] = [
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

  // Sample code for different files
  const fileCodes: Record<string, string> = {
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
}

.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.button:hover {
  opacity: 0.9;
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
- \`context/\`: React context definitions
`,
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
    'components/Header.js': `import React from 'react';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        <Button 
          variant="secondary" 
          size="small"
          onClick={toggleTheme}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Button>
        
        {user ? (
          <div className="flex items-center space-x-2">
            <span>Welcome, {user.name}</span>
            <Button 
              variant="outline" 
              size="small"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="primary" size="small">
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;`,
    'components/Modal.tsx': `import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4 overflow-auto flex-1">
          {children}
        </div>
        {footer && (
          <div className="border-t p-4 flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;`,
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
}`,
    'utils/api.js': `/**
 * API utility functions
 */

const API_BASE_URL = 'https://api.example.com';

// Fetch wrapper with error handling
async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Get data from API
export async function getData(endpoint) {
  return fetchWithErrorHandling(\`\${API_BASE_URL}/\${endpoint}\`);
}

// Post data to API
export async function postData(endpoint, data) {
  return fetchWithErrorHandling(\`\${API_BASE_URL}/\${endpoint}\`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}`,
  };

  // Initialize code cache with defaults
  useEffect(() => {
    setCodeCache(fileCodes);
  }, []);

  const handleFileSelect = (fileName: string) => {
    setActiveFile(fileName);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // Handle code changes with caching
  const handleCodeChange = (newCode: string) => {
    setCodeCache(prev => ({
      ...prev,
      [activeFile]: newCode
    }));
    
    // Display toast for file save
    toast({
      title: 'File saved',
      description: `Changes to ${activeFile} have been saved`,
      duration: 2000,
    });
  };

  // Get the current file's code from cache or default
  const getCurrentCode = () => {
    return codeCache[activeFile] || fileCodes[activeFile] || '';
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
          <CodeEditor 
            code={getCurrentCode()} 
            fileName={activeFile} 
          />
          
          {/* Copilot Panel */}
          {isPanelOpen && <CopilotPanel fileName={activeFile} />}
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;