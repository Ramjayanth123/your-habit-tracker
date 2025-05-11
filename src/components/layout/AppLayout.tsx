
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Sun, Moon, Menu, X, Home, Calendar, BarChart, Settings,
  User, LogOut, ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo for larger screens */}
          <div className="hidden md:flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <span className="font-bold text-2xl text-primary">HabitVault</span>
          </div>
          
          {/* Mobile menu trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              <div className="flex flex-col h-full">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    <div className="font-bold text-xl text-primary">HabitVault</div>
                  </div>
                </div>
                <nav className="flex-1 overflow-auto py-4">
                  <ul className="space-y-1 px-2">
                    {navigationItems.map((item) => (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-colors",
                            isActive 
                              ? "bg-primary/10 text-primary font-medium" 
                              : "hover:bg-muted"
                          )}
                          onClick={closeMobileMenu}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="border-t p-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo for mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-primary" />
            <span className="font-bold text-xl text-primary">HabitVault</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 mx-6">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
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
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full"
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    <span className="text-xs font-medium">
                      {user?.name?.[0] || user?.email?.[0] || '?'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p>{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
