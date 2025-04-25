import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Send, Sparkles } from 'lucide-react';

interface CopilotPanelProps {
  fileName: string;
}

// Define suggestion types for better organization
type SuggestionType = 'optimization' | 'bug' | 'improvement' | 'documentation';

interface Suggestion {
  id: string;
  type: SuggestionType;
  text: string;
  details?: string;
  code?: string;
}

const CopilotPanel: React.FC<CopilotPanelProps> = ({ fileName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Generate a random set of suggestions based on the filename
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let newSuggestions: Suggestion[] = [];
      
      if (fileName.includes('.js') || fileName.includes('.jsx') || fileName.includes('.ts') || fileName.includes('.tsx')) {
        newSuggestions = [
          {
            id: '1',
            type: 'optimization',
            text: "Extract repetitive logic into a custom hook",
            details: "I notice similar data fetching patterns across multiple components. Consider extracting this logic into a custom hook to improve reusability.",
            code: "// Example custom hook\nfunction useDataFetching(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        const response = await fetch(url);\n        const data = await response.json();\n        setData(data);\n      } catch (err) {\n        setError(err);\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchData();\n  }, [url]);\n\n  return { data, loading, error };\n}"
          },
          {
            id: '2',
            type: 'bug',
            text: "Potential memory leak in useEffect",
            details: "There appears to be a missing cleanup function in your useEffect hook when setting up event listeners or subscriptions.",
            code: "useEffect(() => {\n  const subscription = someAPI.subscribe();\n  \n  // Return a cleanup function\n  return () => {\n    subscription.unsubscribe();\n  };\n}, []);"
          },
          {
            id: '3',
            type: 'improvement',
            text: "Add accessibility attributes to component",
            details: "This component could be improved with proper ARIA attributes to ensure better screen reader support.",
            code: "// Before\n<div onClick={handleClick}>\n  {isOpen ? 'Close' : 'Open'}\n</div>\n\n// After\n<button\n  onClick={handleClick}\n  aria-expanded={isOpen}\n  aria-controls=\"content-id\"\n>\n  {isOpen ? 'Close' : 'Open'}\n</button>"
          }
        ];
      } else if (fileName.includes('.css') || fileName.includes('.scss')) {
        newSuggestions = [
          {
            id: '1',
            type: 'optimization',
            text: "Convert px units to rem for better accessibility",
            details: "Using rem units instead of px makes your design more accessible as it respects the user's browser font size settings.",
            code: "/* Before */\n.element {\n  font-size: 16px;\n  margin: 24px;\n  padding: 8px 16px;\n}\n\n/* After */\n.element {\n  font-size: 1rem;\n  margin: 1.5rem;\n  padding: 0.5rem 1rem;\n}"
          },
          {
            id: '2',
            type: 'improvement',
            text: "Use CSS variables for consistent theming",
            details: "Implementing CSS variables can make theme updates easier to manage across your application.",
            code: ":root {\n  --primary-color: #3b82f6;\n  --secondary-color: #10b981;\n  --text-color: #1f2937;\n  --background-color: #ffffff;\n}\n\n.button {\n  background-color: var(--primary-color);\n  color: white;\n}"
          },
          {
            id: '3',
            type: 'improvement',
            text: "Add responsive breakpoints",
            details: "I notice this file lacks responsive design adjustments. Consider adding media queries for better mobile support.",
            code: "@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n    padding: 1rem;\n  }\n  \n  .sidebar {\n    width: 100%;\n    margin-bottom: 1rem;\n  }\n}"
          }
        ];
      } else if (fileName.includes('index')) {
        newSuggestions = [
          {
            id: '1',
            type: 'improvement',
            text: "Add error boundaries for better error handling",
            details: "Implementing React Error Boundaries can prevent the entire app from crashing when a component throws an error.",
            code: "import { Component } from 'react';\n\nclass ErrorBoundary extends Component {\n  state = { hasError: false };\n  \n  static getDerivedStateFromError(error) {\n    return { hasError: true };\n  }\n  \n  componentDidCatch(error, errorInfo) {\n    console.error(error, errorInfo);\n    // You could also log to an error reporting service\n  }\n  \n  render() {\n    if (this.state.hasError) {\n      return <h1>Something went wrong.</h1>;\n    }\n    \n    return this.props.children;\n  }\n}"
          },
          {
            id: '2',
            type: 'documentation',
            text: "Add JSDoc comments to main functions",
            details: "Adding JSDoc comments to your main functions and components will improve code understanding for other developers.",
            code: "/**\n * Renders the main application component\n * @param {Object} props - Component props\n * @param {boolean} props.isAuthenticated - Whether the user is authenticated\n * @returns {JSX.Element} - The rendered component\n */\nfunction App({ isAuthenticated }) {\n  // Component logic\n}"
          }
        ];
      } else {
        newSuggestions = [
          {
            id: '1',
            type: 'documentation',
            text: "Document the purpose of this file",
            details: "Adding a header comment explaining the purpose and usage of this file would improve maintainability."
          },
          {
            id: '2',
            type: 'improvement',
            text: "Looking for ways to improve this file...",
            details: "I'm analyzing the structure and content of this file type to provide targeted suggestions."
          }
        ];
      }
      
      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [fileName]);

  const handleSuggestionClick = (id: string) => {
    if (activeSuggestion === id) {
      setActiveSuggestion(null);
    } else {
      setActiveSuggestion(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Simulate receiving a response to the user's question
      setIsLoading(true);
      setTimeout(() => {
        const newSuggestion: Suggestion = {
          id: Date.now().toString(),
          type: 'improvement',
          text: `Response to: "${inputValue}"`,
          details: `I've analyzed your question about "${inputValue}". Let me suggest a possible approach...`,
          code: `// Example based on your query\n// "${inputValue}"\n\n// Here's one way to implement this:\nfunction example() {\n  // Implementation would depend on specifics\n  console.log("This is a response to your query");\n}`
        };
        
        setSuggestions(prev => [newSuggestion, ...prev]);
        setActiveSuggestion(newSuggestion.id);
        setInputValue('');
        setIsLoading(false);
      }, 1500);
    }
  };

  // Helper function to get color based on suggestion type
  const getSuggestionTypeStyles = (type: SuggestionType) => {
    switch (type) {
      case 'optimization':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'bug':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'improvement':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'documentation':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="w-72 bg-vscode-panel border-l border-vscode-sidebar overflow-hidden flex flex-col">
      <div className="p-3 border-b border-vscode-sidebar flex justify-between items-center">
        <h3 className="text-sm font-medium text-vscode-text">CodeBuddy Suggestions</h3>
        <div className="flex items-center bg-vscode-sidebar/20 rounded-lg p-2">
          <img 
            src="/csc-logo.png" 
            alt="CSC Logo" 
            className="h-6 w-auto object-contain" 
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-3">
            <div className="h-4 bg-vscode-sidebar rounded w-3/4"></div>
            <div className="h-4 bg-vscode-sidebar rounded w-1/2"></div>
            <div className="h-4 bg-vscode-sidebar rounded w-5/6"></div>
            <div className="h-20 bg-vscode-sidebar rounded w-full mt-3"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-vscode-comment">
              Analyzing {fileName}
            </p>
            
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="space-y-2">
                <div 
                  className={cn(
                    "p-3 rounded-md text-sm text-vscode-text hover:bg-vscode-selection cursor-pointer",
                    activeSuggestion === suggestion.id ? 'bg-vscode-selection' : 'bg-vscode-sidebar'
                  )}
                  onClick={() => handleSuggestionClick(suggestion.id)}
                >
                  <div className="flex items-start gap-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", getSuggestionTypeStyles(suggestion.type))}>
                      {suggestion.type}
                    </span>
                    <span className="flex-1">{suggestion.text}</span>
                  </div>
                </div>
                
                {activeSuggestion === suggestion.id && suggestion.details && (
                  <div className="px-3 py-2 bg-vscode-bg text-vscode-text text-xs rounded-md border border-vscode-sidebar">
                    <p className="mb-2">{suggestion.details}</p>
                    {suggestion.code && (
                      <pre className="p-2 bg-vscode-sidebar rounded-md overflow-x-auto text-xs">
                        <code>{suggestion.code}</code>
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-2">
              <p className="text-xs text-vscode-highlight flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                CodeBuddy is ready to assist
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-vscode-sidebar p-3">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask CodeBuddy a question..."
            className="w-full bg-vscode-sidebar text-vscode-text rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-vscode-highlight pr-8"
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1 h-6 w-6 p-0 text-vscode-text hover:text-vscode-highlight"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
          <div className="absolute bottom-1 right-8 text-xs text-vscode-comment">
            Ctrl+I
          </div>
        </form>
      </div>
    </div>
  );
};

export default CopilotPanel;