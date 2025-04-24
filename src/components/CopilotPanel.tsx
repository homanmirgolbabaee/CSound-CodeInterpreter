import React, { useState, useEffect } from 'react';

interface CopilotPanelProps {
  fileName: string;
}

const CopilotPanel: React.FC<CopilotPanelProps> = ({ fileName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let newSuggestions: string[] = [];
      
      if (fileName.includes('Button.js')) {
        newSuggestions = [
          "Add accessibility attributes to your Button component",
          "Consider adding a 'disabled' state to the Button",
          "You could extract the variant styles to a separate object",
          "This component could benefit from TypeScript prop types"
        ];
      } else if (fileName.includes('helpers.js')) {
        newSuggestions = [
          "The debounce function could use TypeScript generics",
          "Consider adding tests for these utility functions",
          "Add JSDoc comments for better documentation",
          "The generateId function could be more cryptographically secure"
        ];
      } else if (fileName.includes('index.js')) {
        newSuggestions = [
          "Consider using React.StrictMode for better development experience",
          "You might want to add error boundaries",
          "Extract the main function logic to a separate file",
          "Add loading and error states to your application"
        ];
      } else if (fileName.includes('.css')) {
        newSuggestions = [
          "Consider using CSS variables for consistent theming",
          "Add responsive design breakpoints",
          "Extract common styles into utility classes",
          "Add dark mode support with a color scheme media query"
        ];
      } else {
        newSuggestions = [
          "I'm analyzing your code...",
          "Looking for potential improvements...",
          "Checking for best practices..."
        ];
      }
      
      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [fileName]);

  return (
    <div className="w-72 bg-vscode-panel border-l border-vscode-sidebar overflow-hidden flex flex-col">
      <div className="p-3 border-b border-vscode-sidebar flex justify-between items-center">
        <h3 className="text-sm font-medium text-vscode-text">Copilot Suggestions</h3>
        <div className="flex items-center">
          <img 
            src="/csc-logo.png" 
            alt="CSC Logo" 
            className="h-6 w-auto"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-3">
            <div className="h-4 bg-vscode-sidebar rounded w-3/4"></div>
            <div className="h-4 bg-vscode-sidebar rounded w-1/2"></div>
            <div className="h-4 bg-vscode-sidebar rounded w-5/6"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-vscode-comment">
              Analyzing {fileName}
            </p>
            
            {suggestions.map((suggestion, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-vscode-sidebar rounded text-sm text-vscode-text hover:bg-vscode-selection cursor-pointer"
              >
                {suggestion}
              </div>
            ))}
            
            <div className="pt-2">
              <p className="text-xs text-vscode-highlight">
                <span className="inline-block w-2 h-2 bg-vscode-highlight rounded-full mr-2"></span>
                Copilot is ready to assist
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-vscode-sidebar p-3">
        <div className="relative">
          <input 
            type="text"
            placeholder="Ask Copilot a question..."
            className="w-full bg-vscode-sidebar text-vscode-text rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-vscode-highlight"
          />
          <div className="absolute bottom-1 right-2 text-xs text-vscode-comment">
            Ctrl+I
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopilotPanel;
