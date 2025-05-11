
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface HabitComparisonData {
  name: string;
  completion: number;
}

interface HabitComparisonChartProps {
  data: HabitComparisonData[];
}

const HabitComparisonChart: React.FC<HabitComparisonChartProps> = ({ data: rawData }) => {
  // Process data to handle long habit names and ensure we have valid data
  const processData = () => {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return [
        { name: 'No data', completion: 0, id: 'no-data' }
      ];
    }

    // Sort by completion rate (descending)
    const sortedData = [...rawData]
      .filter(item => item && typeof item.completion === 'number' && item.name)
      .sort((a, b) => b.completion - a.completion);
    
    // Limit to top 10 habits if there are many
    const limitedData = sortedData.slice(0, 10);
    
    if (limitedData.length === 0) {
      return [
        { name: 'No data', completion: 0, id: 'no-data' }
      ];
    }
    
    // Truncate long habit names and add unique IDs
    return limitedData.map((item, index) => ({
      ...item,
      // Truncate long names and add ellipsis
      name: item.name.length > 15 ? `${item.name.substring(0, 12)}...` : item.name,
      // Ensure completion is a number between 0 and 100
      completion: Math.min(100, Math.max(0, Number(item.completion) || 0)),
      // Add unique ID for each item
      id: `habit-${index}`
    }));
  };
  
  const data = processData();
  const hasData = data.length > 0 && data[0].name !== 'No data';
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Habit Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ 
                  top: 5, 
                  right: 10, 
                  left: 0, 
                  bottom: 20 
                }}
                layout="vertical"
                barCategoryGap={8}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                  width={100}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Completion Rate']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                  labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
                />
                <Bar 
                  dataKey="completion" 
                  fill="url(#barGradient)"
                  radius={[4, 0, 0, 4]}
                  animationDuration={1000}
                  name="Completion Rate"
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No habit data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitComparisonChart;
