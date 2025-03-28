
import React, { useState, useEffect } from 'react';
import { Shield, Zap, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { ButtonGlow } from '../ui/button-glow';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Real-Time AI Malware Detection – Secure Your System Now!';
  const typingSpeed = 50; // milliseconds per character

  useEffect(() => {
    setIsVisible(true);
    
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.substring(0, index));
      index++;
      
      if (index > fullText.length) {
        clearInterval(typingInterval);
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, []);

  // Create precomputed grid cells for better performance
  const gridCells = React.useMemo(() => {
    return Array.from({ length: 144 }).map((_, i) => {
      const delay = i * 0.01;
      const duration = (i % 5) + 2;
      const opacity = (Math.random() * 0.5 + 0.1).toFixed(2);
      return { delay, duration, opacity, key: i };
    });
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 cyber-grid overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 cyber-dots z-0"></div>
      <div className="absolute inset-0 bg-gradient-radial from-cyber-blue/10 to-transparent z-0"></div>
      
      {/* Animated circles with improved blur and animation */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-cyber-blue/10 filter blur-3xl animate-float z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-cyber-green/10 filter blur-3xl animate-pulse z-0"></div>
      
      {/* Enhanced scanning line with better glow effect */}
      <div className="scanning-line z-0"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content with improved transitions */}
          <div className={`space-y-6 transform transition-all duration-700 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="inline-block bg-cyber-blue/10 border border-cyber-blue px-4 py-2 rounded-full backdrop-blur-sm animate-fade-in">
              <span className="text-cyber-blue text-sm font-medium flex items-center">
                <Zap className="h-4 w-4 mr-2 animate-pulse" /> AI-Powered Cybersecurity
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent animate-hue-rotate">CyberGlow</span> <br />
              <span className="text-foreground">Sentinel</span>
            </h1>
            
            <div className="h-16">
              <p className="text-lg text-foreground/80 font-['Fira_Code']">
                {typedText}<span className="animate-blink text-cyber-blue">|</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <ButtonGlow animation="pulse" size="lg" className="group neon-button">
                <Shield className="mr-2 h-5 w-5" />
                Scan Now
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </ButtonGlow>
              <ButtonGlow variant="outline" size="lg" className="neon-button">
                <Lock className="mr-2 h-5 w-5" />
                Learn More
              </ButtonGlow>
            </div>
            
            <div className="flex items-center space-x-4 pt-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple p-0.5">
                    <div className="w-full h-full rounded-full bg-cyber-dark-blue"></div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                <span className="text-cyber-blue font-medium">4,500+</span> users protected
              </p>
            </div>
          </div>
          
          {/* Right Content - Dashboard Preview with optimized grid rendering */}
          <div className={`relative transform transition-all duration-700 ease-out delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative glass-card rounded-xl overflow-hidden shadow-lg">
              {/* Optimized scan visualization using CSS grid instead of many divs */}
              <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="grid-visualization"></div>
              </div>
              
              {/* Dashboard content with improved styling */}
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-cyber-blue font-medium">System Security</h3>
                  <span className="bg-cyber-blue/10 text-cyber-blue text-xs px-2 py-1 rounded flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> PROTECTED
                  </span>
                </div>
                
                {/* Security Radar with improved animation */}
                <div className="w-48 h-48 mx-auto mb-6 radar-container">
                  <div className="radar-beam"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-cyber-blue bg-cyber-blue/5 flex items-center justify-center animate-pulse-neon">
                      <Shield className="h-6 w-6 text-cyber-blue" />
                    </div>
                  </div>
                </div>
                
                {/* Stats with enhanced visual effects */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: 'Threats', value: '0', color: 'cyber-blue' },
                    { label: 'Scanned', value: '142', color: 'cyber-green' },
                    { label: 'Uptime', value: '99.9%', color: 'cyber-blue' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-cyber-dark/50 p-3 rounded border border-cyber-blue/20 backdrop-blur-sm hover:border-cyber-blue/40 transition-all duration-300">
                      <p className={`text-${stat.color} text-xl font-bold`}>{stat.value}</p>
                      <p className="text-xs text-foreground/70">{stat.label}</p>
                    </div>
                  ))}
                </div>
                
                {/* Progress bars with improved styling and animations */}
                <div className="space-y-3">
                  {[
                    { label: 'System Integrity', value: 98 },
                    { label: 'AI Protection', value: 100 },
                    { label: 'Vulnerability Shield', value: 92 }
                  ].map((progress, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground/70">{progress.label}</span>
                        <span className="text-cyber-blue">{progress.value}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${progress.value}%`, animationDelay: `${i * 0.2}s` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Enhanced glow effect with animation */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-blue/0 via-cyber-blue/30 to-cyber-purple/0 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 animate-pulse-neon"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
