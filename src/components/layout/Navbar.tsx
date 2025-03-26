
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, ShieldAlert, LogIn } from 'lucide-react';
import { ButtonGlow } from '../ui/button-glow';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { name: 'Home', path: '/' },
    { name: 'Scanner', path: '/scanner' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'History', path: '/history' },
    { name: 'About', path: '/about' },
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
              className="text-cyber-foreground hover:text-cyber-primary transition-colors relative group py-2"
            >
              {link.name}
              <span className="absolute inset-x-0 bottom-0 h-[1px] bg-cyber-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></span>
            </Link>
          ))}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <ButtonGlow variant="outline" size="sm">
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </ButtonGlow>
          <ButtonGlow animation="pulse">
            <Shield className="mr-2 h-4 w-4" />
            Scan Now
          </ButtonGlow>
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
                className="text-cyber-foreground hover:text-cyber-primary transition-colors py-2 border-b border-cyber-border/30"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 flex flex-col space-y-2">
              <ButtonGlow variant="outline" className="w-full justify-center">
                <LogIn className="mr-2 h-4 w-4" />
                Log In
              </ButtonGlow>
              <ButtonGlow className="w-full justify-center" animation="pulse">
                <Shield className="mr-2 h-4 w-4" />
                Scan Now
              </ButtonGlow>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
