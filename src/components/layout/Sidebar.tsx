
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Book, BookOpen, Calendar, LayoutDashboard, LogOut, Package, Users, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

type NavItemProps = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
};

const NavItem = ({ to, icon: Icon, label, isActive }: NavItemProps) => (
  <Link to={to}>
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start gap-2 my-1 font-normal',
        isActive ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  </Link>
);

export const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isRouteActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/books", icon: Book, label: "Books" },
    { to: "/users", icon: Users, label: "Users" },
    { to: "/categories", icon: FolderOpen, label: "Categories" },
    { to: "/stock", icon: Package, label: "Physical Stock" },
    { to: "/requests", icon: BookOpen, label: "Book Requests" },
    { to: "/loans", icon: Calendar, label: "Book Loans" }
  ];

  return (
    <div className="flex flex-col bg-sidebar dark:bg-sidebar h-full w-56 border-r border-border">
      <div className="p-4">
        <h1 className="text-xl font-serif font-bold text-foreground">
          <span className="text-goodreads-purple">Library</span> Admin
        </h1>
      </div>
      <div className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={isRouteActive(item.to)}
            />
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-red-500"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};