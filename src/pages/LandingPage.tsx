
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container flex items-center justify-between">
          <div className="font-bold text-2xl text-primary">HabitVault</div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-16 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Build better habits,<br />one day at a time.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            HabitVault helps you create and maintain positive habits with a simple, 
            distraction-free interface designed for daily use.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Get started for free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign in to your account</Link>
            </Button>
          </div>

          <div className="mt-12 bg-card border rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">1</span>
              </div>
              <h3 className="text-lg font-medium">Track Daily Habits</h3>
              <p className="text-muted-foreground">
                Create custom habits and track your daily progress with simple check-ins.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="text-secondary font-medium">2</span>
              </div>
              <h3 className="text-lg font-medium">Build Streaks</h3>
              <p className="text-muted-foreground">
                Maintain consistency and watch your streaks grow day by day.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-medium">3</span>
              </div>
              <h3 className="text-lg font-medium">Analyze Progress</h3>
              <p className="text-muted-foreground">
                Gain insights with visual analytics and track your improvement over time.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HabitVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
