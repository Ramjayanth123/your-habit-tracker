
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CompletionChartProps {
  data: number;
}

const CompletionChart: React.FC<CompletionChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Overall Completion Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 mb-4">
            {/* Circular progress indicator */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                className="stroke-muted-foreground/20"
                strokeWidth="8" 
              />
              
              {/* Progress circle with stroke-dasharray trick */}
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                className="stroke-primary dark:stroke-primary-400"
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={`${data * 2.51} 251`} 
                strokeDashoffset="0" 
                transform="rotate(-90 50 50)" 
              />
            </svg>
            
            {/* Percentage text in the center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{data}%</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            Based on your habit check-ins over the selected period
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionChart;
