
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuoteCardProps {
  className?: string;
}

// Array of motivational quotes
const quotes = [
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    quote: "Habits are the compound interest of self-improvement.",
    author: "James Clear"
  },
  {
    quote: "Small changes often appear to make no difference until you cross a critical threshold.",
    author: "James Clear"
  },
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear"
  },
  {
    quote: "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    author: "James Clear"
  },
  {
    quote: "The most effective way to change your habits is to focus not on what you want to achieve, but on who you want to become.",
    author: "James Clear"
  },
  {
    quote: "All big things come from small beginnings. The seed of every habit is a single, tiny decision.",
    author: "James Clear"
  },
  {
    quote: "Make it obvious. Make it attractive. Make it easy. Make it satisfying.",
    author: "James Clear"
  },
  {
    quote: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  },
  {
    quote: "The secret of your future is hidden in your daily routine.",
    author: "Mike Murdock"
  }
];

// Get a quote based on the current date
const getQuoteOfTheDay = () => {
  const date = new Date();
  const dayOfYear = Math.floor((date.valueOf() - new Date(date.getFullYear(), 0, 0).valueOf()) / (24 * 60 * 60 * 1000));
  const index = dayOfYear % quotes.length;
  return quotes[index];
};

const QuoteCard: React.FC<QuoteCardProps> = ({ className }) => {
  const { showDailyQuote } = useTheme();
  const { toast } = useToast();
  
  if (!showDailyQuote) return null;
  
  const { quote, author } = getQuoteOfTheDay();

  const handleShare = async () => {
    const shareText = `"${quote}" — ${author}\n\n#HabitVault #DailyMotivation`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Daily Quote from HabitVault',
          text: shareText,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Quote copied to clipboard!",
          description: "Share it with your friends for daily motivation.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className={cn(
      'bg-card rounded-lg border p-5',
      'border-secondary/40 bg-secondary/5 relative',
      className
    )}>
      <blockquote className="space-y-2">
        <p className="text-sm">"{quote}"</p>
        <footer className="text-xs text-muted-foreground text-right">— {author}</footer>
      </blockquote>
      
      <div className="absolute top-3 right-3">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 rounded-full hover:bg-secondary/20" 
          onClick={handleShare}
          title="Share this quote"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share quote</span>
        </Button>
      </div>
    </div>
  );
};

export default QuoteCard;
