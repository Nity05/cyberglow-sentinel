
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ShieldAlert, LogIn, History, FileSearch, Info, LogOut, User } from 'lucide-react';
import { ButtonGlow } from '../ui/button-glow';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Shield className="h-4 w-4" /> },
    { name: 'Scanner', path: '/scanner', icon: <FileSearch className="h-4 w-4" /> },
    { name: 'History', path: '/history', icon: <History className="h-4 w-4" /> },
    { name: 'About', path: '/about', icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'bg-cyber-background/80 backdrop-blur-md border-b border-cyber-border py-2' 
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-cyber-primary font-bold text-2xl transition-all hover:text-cyber-secondary"
        >
          <ShieldAlert className="h-6 w-6" />
          <span className="hidden sm:inline cyber-text-gradient">CyberGlow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-cyber-foreground hover:text-cyber-primary transition-colors relative group py-2 flex items-center",
                location.pathname === link.path && "text-cyber-primary"
              )}
            >
              {link.icon}
              <span className="ml-2">{link.name}</span>
              <span className={cn(
                "absolute inset-x-0 bottom-0 h-[1px] bg-cyber-primary transform scale-x-0 transition-transform origin-center",
                location.pathname === link.path ? "scale-x-100" : "group-hover:scale-x-100"
              )}></span>
            </Link>
          ))}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2 mr-2 text-cyber-foreground">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.name}</span>
              </div>
              <ButtonGlow variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </ButtonGlow>
            </>
          ) : (
            <Link to="/login">
              <ButtonGlow variant="outline" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </ButtonGlow>
            </Link>
          )}
          <Link to={user ? "/scanner" : "/login"}>
            <ButtonGlow animation="pulse">
              <Shield className="mr-2 h-4 w-4" />
              Scan Now
            </ButtonGlow>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-cyber-foreground hover:text-cyber-primary transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="container mx-auto px-4 py-4 bg-cyber-muted/95 backdrop-blur-md border-b border-cyber-border flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-cyber-foreground hover:text-cyber-primary transition-colors py-2 border-b border-cyber-border/30 flex items-center",
                  location.pathname === link.path && "text-cyber-primary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </Link>
            ))}
            <div className="pt-2 flex flex-col space-y-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-2 text-cyber-foreground">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <ButtonGlow variant="outline" className="w-full justify-center" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </ButtonGlow>
                </>
              ) : (
                <Link to="/login" className="w-full">
                  <ButtonGlow variant="outline" className="w-full justify-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </ButtonGlow>
                </Link>
              )}
              <Link to={user ? "/scanner" : "/login"} className="w-full">
                <ButtonGlow className="w-full justify-center" animation="pulse">
                  <Shield className="mr-2 h-4 w-4" />
                  Scan Now
                </ButtonGlow>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
