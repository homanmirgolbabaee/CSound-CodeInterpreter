import React from 'react';
import EditorLayout from '@/components/EditorLayout';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <div className="min-h-screen bg-vscode-bg text-vscode-text">
      <EditorLayout />
      <Toaster />
    </div>
  );
};

export default Index;