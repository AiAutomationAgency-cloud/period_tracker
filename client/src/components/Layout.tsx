import * as React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { 
  LayoutDashboard, 
  Heart, 
  Baby, 
  Activity, 
  MessageCircle,
  Sun,
  Moon,
  Plus,
  Menu,
  X
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Cycle", href: "/cycle", icon: Heart },
    { name: "Pregnancy", href: "/pregnancy", icon: Baby },
    { name: "Wellness", href: "/wellness", icon: Activity },
    { name: "AI Insights", href: "/ai", icon: MessageCircle },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Header */}
      <header className="gradient-bg sticky top-0 z-40 border-b border-white/20 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-sage-400 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">LifeCycle AI</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">Your health companion</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`${
                      isActive(item.href)
                        ? "text-primary-600 dark:text-primary-400 font-medium"
                        : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    } transition-colors`}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button className="hidden md:flex items-center space-x-2 bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Log Entry</span>
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-coral-300 to-primary-300 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-white font-semibold">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="floating-nav md:hidden">
        <div className="flex bg-white dark:bg-gray-800 rounded-full shadow-2xl px-6 py-3 space-x-6">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className={`${
                  isActive(item.href)
                    ? "text-primary-500"
                    : "text-gray-400 hover:text-primary-500"
                } transition-colors`}
              >
                <item.icon className="w-6 h-6" />
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
