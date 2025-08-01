import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronDown, Menu, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  variant?: "marketing" | "app";
}

export function Header({ variant = "marketing" }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (variant === "marketing") {
    return (
      <header className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="font-bold text-brand-teal-500 text-2xl leading-none tracking-wide">
                  EDIS LAB
                </span>
                <span className="text-brand-blue-500 text-base leading-none tracking-wide mt-1">
                  Monitoring
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Solutions
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </Link>
              {isAuthenticated && (
                <Link
                  to="/plants"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Plant Monitoring
                </Link>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.firstName?.[0] || user?.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user?.firstName || user?.email}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Button asChild className="bg-brand-teal-500 hover:bg-brand-teal-600 text-white">
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  // App variant navigation
  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Roles", href: "/roles" },
    { label: "Admin", href: "/admin" },
    { label: "Dev Docs", href: "/docs" },
    { label: "Plants", href: "/plants" },
    { label: "Devices", href: "/devices" },
    { label: "Devices by Feed", href: "/devices-by-feed" },
    { label: "Backup", href: "/backup" },
    { label: "Customers", href: "/customers" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex flex-col">
              <span className="font-bold text-brand-teal-500 text-2xl leading-none tracking-wide">
                EDIS LAB
              </span>
              <span className="text-brand-blue-500 text-base leading-none tracking-wide mt-1">
                Monitoring
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm transition-colors border-b-2",
                  location.pathname === item.href
                    ? "text-gray-900 border-brand-teal-500"
                    : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Dropdown */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.firstName?.[0] || user?.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm hidden sm:inline">
                    {user?.firstName || user?.email}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
