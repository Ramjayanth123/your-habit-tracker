
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    uiDensity, 
    setUIDensity,
    showDailyQuote,
    setShowDailyQuote
  } = useTheme();

  const handleDensityChange = (value: string) => {
    setUIDensity(value as 'compact' | 'comfortable');
    toast.success(`UI density set to ${value}`);
  };

  const handleQuoteChange = (checked: boolean) => {
    setShowDailyQuote(checked);
    if (checked) {
      toast.success('Daily quotes enabled');
    } else {
      toast.success('Daily quotes disabled');
    }
  };

  return (
    <div className="container py-8 max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Customize your HabitVault experience</p>

      <div className="space-y-10">
        {/* Appearance */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium">Appearance</h2>
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-toggle" className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-base">UI Density</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Choose how compact the user interface should be
              </p>
              <RadioGroup
                value={uiDensity}
                onValueChange={handleDensityChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="compact" />
                  <Label htmlFor="compact" className="cursor-pointer">Compact</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="comfortable" />
                  <Label htmlFor="comfortable" className="cursor-pointer">Comfortable</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium">Preferences</h2>
          <Separator />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-quotes" className="text-base">Daily Quotes</Label>
                <p className="text-sm text-muted-foreground">
                  Show motivational quotes on the dashboard
                </p>
              </div>
              <Switch
                id="show-quotes"
                checked={showDailyQuote}
                onCheckedChange={handleQuoteChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
