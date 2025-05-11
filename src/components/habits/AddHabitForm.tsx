import React from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHabits } from '@/contexts/HabitContext';
import { Calendar } from '@/components/ui/calendar';
import { Check, Calendar as CalendarIcon } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const daysOfWeek = [
  { id: 'Monday', label: 'Mon' },
  { id: 'Tuesday', label: 'Tue' },
  { id: 'Wednesday', label: 'Wed' },
  { id: 'Thursday', label: 'Thu' },
  { id: 'Friday', label: 'Fri' },
  { id: 'Saturday', label: 'Sat' },
  { id: 'Sunday', label: 'Sun' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Habit name is required'),
  targetDays: z.array(z.string()).min(1, 'Select at least one day'),
  startDate: z.date({
    required_error: 'Please select a start date',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AddHabitForm = () => {
  const { addHabit } = useHabits();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      targetDays: [],
      startDate: new Date(),
    },
  });

  const handleSelectAllDays = () => {
    const allDays = daysOfWeek.map(day => day.id);
    form.setValue('targetDays', allDays);
  };

  const onSubmit = (data: FormValues) => {
    addHabit({
      name: data.name,
      targetDays: data.targetDays,
      startDate: data.startDate.toISOString(),
    });
    
    toast({
      title: 'Habit created',
      description: `${data.name} has been added to your habits`,
    });
    
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          Add New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new habit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Meditation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetDays"
              render={() => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel>Target Days</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllDays}
                    >
                      Select All Days
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <FormField
                        key={day.id}
                        control={form.control}
                        name="targetDays"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day.id}
                              className="flex flex-row items-center space-x-1 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, day.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== day.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Create Habit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitForm;
