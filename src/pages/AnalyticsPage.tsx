import React, { useState, useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar, ChartLine, Star, Trophy, BarChart4 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CompletionChart from '@/components/analytics/CompletionChart';
import TrendChart from '@/components/analytics/TrendChart';
import HabitComparisonChart from '@/components/analytics/HabitComparisonChart';
import DayAnalysisChart from '@/components/analytics/DayAnalysisChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getItem, setItem } from '@/lib/local-storage';
import { useHabits } from '@/contexts/HabitContext';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

// Time range options for analytics
type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

const AnalyticsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { habits, loading } = useHabits();
  
  const [timeRange, setTimeRange] = useState<TimeRange>(
    getItem('analytics_range', 'week') as TimeRange
  );

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    setItem('analytics_range', range);
  };

  // Calculate date range based on selected time range
  const dateRange = useMemo(() => {
    const end = endOfDay(new Date());
    let start: Date;

    switch (timeRange) {
      case 'week':
        start = subDays(end, 7);
        break;
      case 'month':
        start = subDays(end, 30);
        break;
      case 'quarter':
        start = subDays(end, 90);
        break;
      case 'year':
        start = subDays(end, 365);
        break;
      case 'all':
      default:
        start = new Date(0);
    }

    return { start, end };
  }, [timeRange]);

  // Pre-calculate days array and date strings
  const { days, dateStrings } = useMemo(() => {
    const daysArray = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
    const dateStringsSet = new Set(daysArray.map(d => d.toISOString().split('T')[0]));
    return { days: daysArray, dateStrings: dateStringsSet };
  }, [dateRange]);

  // Calculate analytics data with optimized operations
  const analyticsData = useMemo(() => {
    if (loading || !habits.length) {
      return {
        completionRate: 0,
        streakData: [],
        habitComparison: [],
        bestDays: []
      };
    }

    // For 'all' time range, limit the data to last 2 years for better performance
    const effectiveDays = timeRange === 'all' 
      ? days.filter((_, index) => index % 7 === 0) // Sample weekly for all time
      : days;

    // Pre-calculate day names for the entire range
    const dayNames = effectiveDays.map(day => day.toLocaleDateString('en-US', { weekday: 'long' }));

    // Calculate completion data for each habit
    const habitCompletions = habits.map(habit => {
      const completedDates = new Set(habit.completedDates);
      let completions = 0;
      let possibleCompletions = 0;
      
      // Count completions and possible completions within the date range
      effectiveDays.forEach(day => {
        const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' });
        if (habit.targetDays.includes(dayOfWeek)) {
          possibleCompletions++;
          if (completedDates.has(day.toISOString().split('T')[0])) {
            completions++;
          }
        }
      });
      
      return {
        name: habit.name,
        completions,
        possibleCompletions,
        completionRate: possibleCompletions > 0 
          ? Math.round((completions / possibleCompletions) * 100)
          : 0
      };
    }).filter(habit => habit.possibleCompletions > 0); // Only include habits with possible completions

    // Calculate overall completion rate
    const totalCompletions = habitCompletions.reduce((sum, h) => sum + h.completions, 0);
    const totalPossible = habitCompletions.reduce((sum, h) => sum + h.possibleCompletions, 0);
    const completionRate = totalPossible > 0 
      ? Math.round((totalCompletions / totalPossible) * 100) 
      : 0;

    // For streak data, always use last 7 days regardless of time range
    const streakData = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i); // Show last 7 days in order
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const completions = habits.filter(habit => 
        habit.completedDates.includes(dateStr) &&
        habit.targetDays.includes(dayName)
      ).length;

      const total = habits.filter(habit =>
        habit.targetDays.includes(dayName)
      ).length;

      return total > 0 ? Math.round((completions / total) * 100) : 0;
    });

    // Sort habits by completion rate and limit to top 10 for performance
    const sortedHabits = [...habitCompletions]
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 10);

    const habitComparison = sortedHabits.map(({ name, completionRate }) => ({
      name,
      completion: completionRate
    }));

    // Calculate best days with proper completion rates
    const dayStats = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
      let totalPossible = 0;
      let totalCompleted = 0;

      habits.forEach(habit => {
        // Count how many times this day appears in the selected time range
        const dayOccurrences = dayNames.filter(d => d === day).length;
        totalPossible += dayOccurrences;
        
        // Count completions on this day
        const completionsOnDay = habit.completedDates.filter(date => {
          const dateObj = new Date(date);
          return dateObj.toLocaleDateString('en-US', { weekday: 'long' }) === day;
        }).length;
        
        totalCompleted += Math.min(completionsOnDay, dayOccurrences);
      });

      const completionRate = totalPossible > 0 
        ? Math.round((totalCompleted / totalPossible) * 100) 
        : 0;

      return {
        name: day.substring(0, 3),
        value: completionRate
      };
    });

    const bestDays = dayStats;

    return {
      completionRate,
      streakData,
      habitComparison,
      bestDays
    };
  }, [habits, loading, timeRange, days]);

  // Calculate best performer with accurate completion rate
  const bestPerformer = useMemo(() => {
    if (!habits.length) return null;
    
    const today = new Date();
    const daysInRange = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
    
    return habits.reduce((best, habit) => {
      // Count possible and actual completions within the selected time range
      let possibleCompletions = 0;
      let actualCompletions = 0;
      
      daysInRange.forEach(day => {
        const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
        if (habit.targetDays.includes(dayName)) {
          possibleCompletions++;
          const dateStr = day.toISOString().split('T')[0];
          if (habit.completedDates.includes(dateStr)) {
            actualCompletions++;
          }
        }
      });
      
      const completionRate = possibleCompletions > 0 
        ? (actualCompletions / possibleCompletions) * 100 
        : 0;
      
      if (!best || completionRate > best.rate) {
        return { 
          name: habit.name, 
          rate: completionRate,
          completions: actualCompletions,
          total: possibleCompletions
        };
      }
      return best;
    }, null as { 
      name: string; 
      rate: number;
      completions: number;
      total: number;
    } | null);
  }, [habits, dateRange]);

  return (
    <div className="container py-8 animate-fade-in">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-md flex items-center justify-center">
            <BarChart4 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>
        <p className="text-muted-foreground">
          Track your progress and identify patterns in your habits
        </p>
      </header>

      {/* Best Performer */}
      {/* Best Performer Card */}
      <div className="bg-card rounded-lg p-5 shadow-sm border border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-yellow-500/10 p-2 rounded-md flex items-center justify-center">
            <Trophy className="text-yellow-500 h-5 w-5" />
          </div>
          <h3 className="font-semibold text-base">Best Performer</h3>
        </div>
        {bestPerformer ? (
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-base">{bestPerformer.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Highest completion rate: <span className="font-semibold text-foreground">{bestPerformer.rate}%</span>
              </p>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>{bestPerformer.completions} completed</span>
                <span>{bestPerformer.total} possible</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${bestPerformer.rate}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
            No habit data available for the selected period
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTimeRangeChange('week')}
            className={timeRange === 'week' ? 'bg-secondary/30' : ''}
          >
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTimeRangeChange('month')}
            className={timeRange === 'month' ? 'bg-secondary/30' : ''}
          >
            Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTimeRangeChange('quarter')}
            className={timeRange === 'quarter' ? 'bg-secondary/30' : ''}
          >
            Quarter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTimeRangeChange('year')}
            className={timeRange === 'year' ? 'bg-secondary/30' : ''}
          >
            Year
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTimeRangeChange('all')}
            className={timeRange === 'all' ? 'bg-secondary/30' : ''}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Fallback for no data */}
      {(!loading && habits.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold mb-2">No analytics data available</h2>
          <p className="text-muted-foreground mb-4">You have no habits to analyze yet. Add some habits to start tracking your progress!</p>
          <Button onClick={() => window.location.href = '/tracker'}>Add Habit</Button>
        </div>
      ) : isMobile ? (
        // Mobile layout with tabs
        <Tabs defaultValue="summary">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="summary">
              <Star className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Summary</span>
            </TabsTrigger>
            <TabsTrigger value="trends">
              <ChartLine className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Breakdown</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <CompletionChart data={analyticsData.completionRate} />
            <HabitComparisonChart data={analyticsData.habitComparison} />
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6">
            <TrendChart data={analyticsData.streakData} timeRange={timeRange} />
          </TabsContent>
          
          <TabsContent value="breakdown" className="space-y-6">
            <DayAnalysisChart data={analyticsData.bestDays} />
          </TabsContent>
        </Tabs>
      ) : (
        // Desktop layout with grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompletionChart data={analyticsData.completionRate} />
          <HabitComparisonChart data={analyticsData.habitComparison} />
          <TrendChart data={analyticsData.streakData} timeRange={timeRange} />
          <DayAnalysisChart data={analyticsData.bestDays} />
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
