
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  animate?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  trendValue,
  className,
  animate = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay animation to create a staggered effect when there are multiple cards
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const numberValue = typeof value === 'number' ? value : parseFloat(value);
  const isNumber = !isNaN(numberValue);

  return (
    <motion.div 
      className={cn('bg-card rounded-lg border p-4', className)}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate && isVisible ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-1 flex items-baseline">
          {isNumber ? (
            <CountAnimation value={numberValue} />
          ) : (
            <div className="text-2xl font-semibold">{value}</div>
          )}
          
          {trend && trendValue && (
            <motion.span
              className={cn(
                'ml-2 text-xs',
                trend === 'up' ? 'text-accent' : trend === 'down' ? 'text-destructive' : ''
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.2 }}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </motion.span>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </motion.div>
  );
};

// Component for animating count
const CountAnimation = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Animate from 0 to the target value
    const duration = 1000; // 1 second
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const increment = value / totalFrames;
    
    let currentFrame = 0;
    
    const counter = setInterval(() => {
      currentFrame++;
      const currentCount = Math.min(currentFrame * increment, value);
      setCount(currentCount);
      
      if (currentFrame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [value]);
  
  // Format number based on its value
  const formattedValue = () => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    
    if (Number.isInteger(value)) {
      return Math.round(count).toString();
    }
    
    return count.toFixed(1);
  };
  
  return (
    <div className="text-2xl font-semibold">{formattedValue()}</div>
  );
};

export default StatsCard;
