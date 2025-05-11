import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DayAnalysisData {
  name: string;
  value: number;
}

interface DayAnalysisChartProps {
  data: DayAnalysisData[];
}

const DayAnalysisChart: React.FC<DayAnalysisChartProps> = ({ data: rawData }) => {
  // Process data to ensure we have all days and handle ties
  const processData = () => {
    if (!rawData || rawData.length === 0) {
      // Return default data with all days at 0%
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        name: day,
        value: 0,
        isBest: false
      }));
    }

    // Find the maximum value to determine best days
    const maxValue = Math.max(...rawData.map(item => item.value));
    
    // Ensure we have all days of the week
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const processedData = daysOfWeek.map(day => {
      const existingData = rawData.find(item => item.name === day);
      const value = existingData ? existingData.value : 0;
      
      return {
        name: day,
        value,
        isBest: value === maxValue && value > 0 // Only mark as best if value > 0
      };
    });
    
    return processedData;
  };
  
  const data = processData();
  const bestDays = data.filter(day => day.isBest);
  const hasData = data.some(day => day.value > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-md flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          Best Days Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ChartContainer
            config={{
              value: {
                label: "Completion Rate",
                theme: {
                  light: "hsla(var(--secondary), 0.6)",
                  dark: "hsla(var(--secondary), 0.6)",
                },
              },
              bestDay: {
                label: "Best Day",
                theme: {
                  light: "hsla(var(--primary), 0.8)",
                  dark: "hsla(var(--primary), 0.8)",
                },
              },
            }}
          >
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsla(var(--border), 0.3)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
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
                dataKey="value"
                radius={[4, 4, 0, 0]}
                name="Completion Rate"
                className="transition-all duration-200 hover:opacity-90"
                fill="hsl(var(--primary))"
                fillOpacity={0.9}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.isBest ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                    fillOpacity={entry.isBest ? 0.9 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
        {hasData ? (
          <div className="mt-4 text-center">
            <p className="text-sm">
              {bestDays.length === 1 ? (
                <>
                  <span className="font-medium">{bestDays[0].name}</span> is your most productive day at <span className="font-medium">{bestDays[0].value}%</span> completion
                </>
              ) : bestDays.length > 1 ? (
                <>
                  Multiple days tied at <span className="font-medium">{bestDays[0].value}%</span> completion
                  <div className="flex justify-center gap-2 mt-1">
                    {bestDays.map(day => (
                      <span key={day.name} className="px-2 py-1 bg-primary/10 rounded-md text-xs">
                        {day.name}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                'No completion data available'
              )}
            </p>
          </div>
        ) : (
          <div className="mt-4 text-center text-muted-foreground text-sm">
            No completion data available for the selected period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DayAnalysisChart;
