
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  icon?: React.ReactNode;
  quote?: {
    text: string;
    author: string;
  };
  className?: string;
}

// Default motivational quotes for empty states
const emptyStateQuotes = [
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Small changes compound into remarkable results.", author: "James Clear" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
];

// Get a random quote from the array
const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * emptyStateQuotes.length);
  return emptyStateQuotes[randomIndex];
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  quote: providedQuote,
  className = "",
}) => {
  // Use provided quote or get a random one
  const quote = providedQuote || getRandomQuote();
  
  return (
    <div className={`flex flex-col items-center justify-center text-center py-12 px-4 animate-fade-in ${className}`}>
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon || <PlusCircle className="w-8 h-8 text-primary" />}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      
      {/* Motivational quote */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 mb-6 max-w-md">
        <p className="text-sm italic">"{quote.text}"</p>
        <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>
      </div>
      
      <Button 
        onClick={onAction}
        className="transition-transform hover:scale-105 active:scale-95"
      >
        {actionText}
      </Button>
    </div>
  );
};

export default EmptyState;
