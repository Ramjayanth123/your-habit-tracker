
import React from 'react';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface StreakCardProps {
  value: number;
  label: string;
  isHighest?: boolean;
  className?: string;
}

const StreakCard: React.FC<StreakCardProps> = ({
  value,
  label,
  isHighest = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-card rounded-lg border p-4 flex flex-col items-center justify-center text-center',
        isHighest && 'border-primary/30 bg-primary/5',
        className
      )}
    >
      <div className="flex items-center gap-1 text-2xl font-bold">
        {isHighest && <Flame className="h-5 w-5 text-primary" />}
        <span>{value}</span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

export default StreakCard;
