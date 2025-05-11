
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 sm:px-6 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">HabitVault</h1>
            <p className="text-muted-foreground">Track your habits, build your future</p>
          </div>
          
          <div className="bg-card shadow-lg rounded-xl p-6 sm:p-8">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} HabitVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
