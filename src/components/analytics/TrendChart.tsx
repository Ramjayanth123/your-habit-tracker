
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendChartProps {
  data: number[];
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
}

const TrendChart: React.FC<TrendChartProps> = ({ data, timeRange }) => {
  // Generate appropriate labels based on time range
  const getLabels = () => {
    const now = new Date();
    const labels: string[] = [];
    
    switch(timeRange) {
      case 'week':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        break;
        
      case 'month':
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - (i * 7));
          const startDate = new Date(date);
          startDate.setDate(date.getDate() - 6);
          labels.push(`${startDate.getDate()}-${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`);
        }
        break;
        
      case 'quarter':
        // Last 3 months
        for (let i = 2; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        }
        break;
        
      case 'year':
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        }
        break;
        
      default:
        // All time - show years
        const currentYear = now.getFullYear();
        const startYear = currentYear - 4; // Show last 5 years
        for (let year = startYear; year <= currentYear; year++) {
          labels.push(year.toString());
        }
    }
    
    return labels;
  };

  // Format data for the chart
  const formatData = () => {
    const labels = getLabels();
    
    // If we have more data points than labels, we'll group them
    if (data.length > labels.length) {
      const groupSize = Math.ceil(data.length / labels.length);
      const groupedData = [];
      
      for (let i = 0; i < labels.length; i++) {
        const start = i * groupSize;
        const end = Math.min(start + groupSize, data.length);
        const group = data.slice(start, end);
        const avgValue = group.reduce((sum, val) => sum + val, 0) / group.length;
        
        groupedData.push({
          label: labels[i],
          value: Math.round(avgValue * 100) / 100 // Round to 2 decimal places
        });
      }
      
      return groupedData;
    }
    
    // Otherwise, just map the data to the labels
    return data.map((value, index) => ({
      label: labels[index % labels.length],
      value
    }));
  };
  
  const chartData = formatData();
  
  // Get appropriate title based on time range
  const getTitle = () => {
    switch(timeRange) {
      case 'week': return '7-Day Trend';
      case 'month': return '4-Week Trend';
      case 'quarter': return '3-Month Trend';
      case 'year': return '12-Month Trend';
      default: return 'All Time Trend';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ChartContainer
            config={{
              value: {
                label: "Completions",
                theme: {
                  light: "hsla(var(--primary), 0.8)",
                  dark: "hsla(var(--primary), 0.8)",
                },
              },
            }}
          >
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="label" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                interval={timeRange === 'all' ? 0 : 'preserveStartEnd'}
                minTickGap={timeRange === 'all' ? 0 : 5}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <Tooltip 
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
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))"
                fill="url(#colorValue)" 
                strokeWidth={2}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
