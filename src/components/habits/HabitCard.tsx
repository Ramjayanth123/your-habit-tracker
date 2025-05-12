import React, { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO, isAfter, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Check, Calendar, Trophy, Trash2, X, Pencil, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useHabits } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import EditHabitForm from './EditHabitForm';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { toggleHabitCompletion, deleteHabit, getCompletionTimestamp } = useHabits();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Generate array of dates for current week view
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const previousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const handleToggleDay = (date: Date) => {
    if (isAfter(date, new Date())) return; // Prevent future date selection
    toggleHabitCompletion(habit.id, date.toISOString().split('T')[0]);
  };

  const isDateCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return habit.completedDates.includes(dateString);
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isTargetDay = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return habit.targetDays.includes(dayName);
  };

  const startDateObj = parseISO(habit.startDate);
  const isAfterStartDate = (date: Date) => {
    return date >= startDateObj;
  };

  const isFutureDate = (date: Date) => {
    return isAfter(date, new Date());
  };

  const getDateStatus = (date: Date) => {
    if (isFutureDate(date)) return 'future';
    if (isDateCompleted(date)) return 'completed';
    if (isTargetDay(date)) return 'missed';
    return 'inactive';
  };

  const getCompletionTime = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const timestamp = getCompletionTimestamp(habit.id, dateString);
    if (!timestamp) return null;
    return format(parseISO(timestamp), 'h:mm a');
  };

  // Calculate completion percentage for the current week
  const completionPercentage = useMemo(() => {
    const currentWeekDays = weekDates.filter(date => 
      habit.targetDays.includes(date.toLocaleDateString('en-US', { weekday: 'long' })) &&
      !isFutureDate(date) &&
      isAfterStartDate(date)
    );
    
    if (currentWeekDays.length === 0) return 0;
    
    const completedDays = currentWeekDays.filter(date => isDateCompleted(date)).length;
    return Math.round((completedDays / currentWeekDays.length) * 100);
  }, [weekDates, habit]);

  // Calculate days since habit started
  const daysSinceStart = differenceInDays(new Date(), parseISO(habit.startDate));

  return (
    <Card className="w-full mb-6 overflow-hidden transition-all hover:shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-semibold text-foreground">{habit.name}</CardTitle>
            {habit.streak > 2 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                {habit.streak} day{habit.streak !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {/* Habit ID badge */}
          <div className="mb-1">
            <span className="inline-block bg-[#23263a] text-[#b5b8e3] text-xs font-mono px-2 py-0.5 rounded-full">ID: {habit.id.slice(0, 6)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>Started {format(parseISO(habit.startDate), 'MMM d, yyyy')}</span>
            <span className="mx-2">•</span>
            <span>{daysSinceStart} day{daysSinceStart !== 1 ? 's' : ''} tracking</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>Created {format(new Date(habit.created_at || habit.startDate), 'MMM d, yyyy')}</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  Delete Habit
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <span className="font-medium text-foreground">"{habit.name}"</span>? 
                  This will permanently delete all your progress and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteHabit(habit.id)} 
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete Habit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        {/* Weekly Progress Bar */}
        <div className="mb-4 space-y-1.5">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-1">
            <span>Weekly Progress</span>
            <span>{completionPercentage > 0 ? `${completionPercentage}%` : '0%'}</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4 px-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={previousWeek}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous week</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToCurrentWeek}
            className="text-sm font-medium px-3 h-8"
          >
            {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextWeek}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next week</span>
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDates.map((date) => (
            <div key={date.toString()} className="text-center text-xs font-medium text-muted-foreground">
              {format(date, 'EEE')}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDates.map((date) => {
            const dayLabel = format(date, 'EEE');
            const dayNumber = format(date, 'd');
            const isActive = isAfterStartDate(date);
            const status = getDateStatus(date);
            const completionTime = getCompletionTime(date);
            const isTarget = isTargetDay(date);
            
            return (
              <TooltipProvider key={date.toString()}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Button
                        variant="ghost"
                        size="sm"
                        disabled={!isActive || isFutureDate(date) || !isTarget}
                        onClick={() => handleToggleDay(date)}
                        className={cn(
                          'relative h-10 w-10 p-0 rounded-full flex flex-col items-center justify-center transition-all',
                          'hover:bg-accent hover:text-accent-foreground',
                          status === 'completed' && 'bg-primary/30 hover:bg-primary/40 dark:bg-primary/40 dark:hover:bg-primary/50',
                          status === 'missed' && 'bg-destructive/20 hover:bg-destructive/30 dark:bg-destructive/30 dark:hover:bg-destructive/40',
                          isToday(date) && 'ring-2 ring-primary dark:ring-primary/80',
                          (!isActive || isFutureDate(date) || !isTarget) && 'opacity-50',
                          !isTarget && 'bg-transparent'
                        )}
                      >
                        <span className={cn(
                          'text-sm font-medium',
                          status === 'completed' && 'text-primary-700 dark:text-primary-300 font-semibold',
                          status === 'missed' && 'text-destructive-700 dark:text-destructive-300 font-semibold',
                          (!isActive || !isTarget) && 'text-muted-foreground',
                          'block text-center w-8 h-8 flex items-center justify-center rounded-full',
                          status === 'completed' && 'bg-primary/30 dark:bg-primary/20',
                          status === 'missed' && 'bg-destructive/20 dark:bg-destructive/10',
                          isToday(date) && 'ring-2 ring-primary dark:ring-primary/80'
                        )}>
                          {dayNumber}
                        </span>
                      </Button>
                      {completionTime && (
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                          <span className="text-[10px] text-primary whitespace-nowrap">
                            {completionTime}
                          </span>
                        </div>
                      )}
                    </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{format(date, 'EEEE, MMMM d, yyyy')}</p>
                    {status === 'completed' && completionTime && (
                      <p>Completed at {completionTime}</p>
                    )}
                    {status === 'missed' && (
                      <p>Missed target day</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/30 dark:bg-muted/10 py-2 px-4 border-t">
        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Best streak: {habit.highestStreak} days</span>
          </div>
          <div className="text-muted-foreground">
            {habit.completedDates.length} of {habit.targetDays.length * Math.ceil(daysSinceStart / 7)} targets
          </div>
        </div>
      </CardFooter>
      
      <EditHabitForm
        habit={habit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </Card>
  );
};

export default HabitCard;
